"use client"

import { useState, useEffect, createContext, useContext, useReducer } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

// ==================== CONTEXT & STATE MANAGEMENT ====================

const BookingContext = createContext()

const bookingReducer = (state, action) => {
  switch (action.type) {
    case "CREATE_BOOKING":
      const newBooking = {
        ...action.payload,
        id: Date.now().toString(),
        status: "pending",
        priority: action.payload.priority || "normal",
        approvals: {
          gd: { status: "pending", note: "Awaiting Group Director review", timestamp: null },
          ds: { status: "pending", note: "Awaiting Director Secretary review", timestamp: null },
          admin: { status: "N/A", note: "Awaiting final Admin confirmation", timestamp: null },
        },
        createdAt: new Date().toISOString(),
      }
      return {
        ...state,
        currentBooking: newBooking,
        upcomingBookings: [...state.upcomingBookings, newBooking],
        bookingHistory: [...state.bookingHistory, newBooking],
      }

    case "UPDATE_APPROVAL":
      if (!state.currentBooking) return state

      const updatedBooking = {
        ...state.currentBooking,
        approvals: {
          ...state.currentBooking.approvals,
          [action.payload.role]: {
            status: action.payload.status,
            note: action.payload.note,
            timestamp: new Date().toISOString(),
          },
        },
      }

      const { gd, ds, admin } = updatedBooking.approvals
      if (gd.status === "approved" && ds.status === "approved" && admin.status === "approved") {
        updatedBooking.status = "approved"
      } else if (gd.status === "rejected" || ds.status === "rejected" || admin.status === "rejected") {
        updatedBooking.status = "rejected"
      }

      return {
        ...state,
        currentBooking: updatedBooking,
        upcomingBookings: state.upcomingBookings.map((booking) =>
          booking.id === updatedBooking.id ? updatedBooking : booking,
        ),
        bookingHistory: state.bookingHistory.map((booking) =>
          booking.id === updatedBooking.id ? updatedBooking : booking,
        ),
      }

    case "CANCEL_BOOKING":
      return {
        ...state,
        currentBooking: null,
        upcomingBookings: state.upcomingBookings.filter((booking) => booking.id !== state.currentBooking?.id),
      }

    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    default:
      return state
  }
}

const BookingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, {
    currentBooking: null,
    upcomingBookings: [],
    bookingHistory: [],
    isLoading: false,
  })

  const [notifications, setNotifications] = useState([])

  const addNotification = (message, type = "info", duration = 5000) => {
    const id = Date.now()
    setNotifications((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, duration)
  }

  const createBooking = (bookingData) => {
    if (state.currentBooking) {
      addNotification("❌ You already have an active booking. Please cancel it first.", "error")
      return
    }

    dispatch({ type: "CREATE_BOOKING", payload: bookingData })
    dispatch({ type: "SET_LOADING", payload: true })

    addNotification("🚀 Booking submitted successfully! Processing approval...", "success")

    const approvalTimes = bookingData.priority === "urgent" ? [1000, 2000, 3000] : [2000, 4000, 6000]

    setTimeout(() => {
      dispatch({
        type: "UPDATE_APPROVAL",
        payload: { role: "gd", status: "approved", note: "✅ Equipment setup confirmed by Group Director" },
      })
      addNotification("👨‍💼 Group Director approved your booking!", "success")
    }, approvalTimes[0])

    setTimeout(() => {
      dispatch({
        type: "UPDATE_APPROVAL",
        payload: { role: "ds", status: "approved", note: "✅ Meeting agenda distributed by Director Secretary" },
      })
      addNotification("👩‍💼 Director Secretary approved your booking!", "success")
    }, approvalTimes[1])

    setTimeout(() => {
      dispatch({
        type: "UPDATE_APPROVAL",
        payload: { role: "admin", status: "approved", note: "🎉 Final confirmation completed by Administration" },
      })
      dispatch({ type: "SET_LOADING", payload: false })
      addNotification("🎉 Booking fully approved! You're all set!", "success", 7000)
    }, approvalTimes[2])
  }

  const cancelBooking = () => {
    dispatch({ type: "CANCEL_BOOKING" })
    addNotification("🗑️ Booking cancelled successfully", "info")
  }

  return (
    <BookingContext.Provider
      value={{
        state,
        dispatch,
        createBooking,
        cancelBooking,
        notifications,
        addNotification,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

const useBooking = () => {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider")
  }
  return context
}

// ==================== DATA & SCHEMAS ====================

const bookingSchema = z
  .object({
    meetingType: z.enum(["Physical", "Virtual", "Hybrid"], {
      required_error: "Please select a meeting type",
    }),
    venue: z.string().min(1, "Venue is required"),
    customVenue: z.string().optional(),
    dateTime: z.date({
      required_error: "Please select date and time",
    }),
    endTime: z.date({
      required_error: "Please select end time",
    }),
    purpose: z
      .string()
      .min(10, "Purpose must be at least 10 characters")
      .max(500, "Purpose cannot exceed 500 characters"),
    capacity: z.number().min(1, "Capacity must be at least 1").max(500, "Capacity cannot exceed 500"),
    resources: z
      .string()
      .min(2, "Please specify required resources")
      .max(200, "Resources cannot exceed 200 characters"),
    priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
    department: z.string().min(1, "Department is required"),
    contactEmail: z.string().email("Valid email is required"),
    specialRequests: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.venue === "Other" && (!data.customVenue || data.customVenue.trim().length === 0)) {
        return false
      }
      return true
    },
    {
      message: 'Custom venue name is required when "Other" is selected',
      path: ["customVenue"],
    },
  )
  .refine(
    (data) => {
      return data.endTime > data.dateTime
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    },
  )

const VENUES = [
  {
    id: "main-auditorium",
    name: "Main Auditorium",
    capacity: 250,
    features: ["Stage", "Sound System", "4K Projector", "Professional Lighting", "Air Conditioning", "Live Streaming"],
    description: "Our largest venue with professional audio-visual equipment and stage setup",
    image: "/placeholder.svg?height=120&width=200",
    available: true,
    price: "$500/day",
    rating: 4.8,
    bookings: 45,
    category: "Large Hall",
  },
  {
    id: "conference-room-a",
    name: "Conference Room A",
    capacity: 20,
    features: ["Video Conferencing", "Smart Whiteboard", "4K Display", "Coffee Machine", "High-speed WiFi"],
    description: "Medium-sized room ideal for team meetings and presentations",
    image: "/placeholder.svg?height=120&width=200",
    available: true,
    price: "$150/day",
    rating: 4.6,
    bookings: 32,
    category: "Meeting Room",
  },
  {
    id: "conference-room-b",
    name: "Conference Room B",
    capacity: 15,
    features: ["Projector", "Whiteboard", "Conference Phone", "Ergonomic Chairs"],
    description: "Smaller meeting space for focused discussions and team collaboration",
    image: "/placeholder.svg?height=120&width=200",
    available: false,
    price: "$120/day",
    rating: 4.4,
    bookings: 28,
    category: "Meeting Room",
  },
  {
    id: "training-room",
    name: "Training Room",
    capacity: 30,
    features: ["Interactive Projector", "Multiple Whiteboards", "Flip Charts", "Breakout Areas", "Movable Furniture"],
    description: "Designed for workshops, training sessions, and interactive learning",
    image: "/placeholder.svg?height=120&width=200",
    available: true,
    price: "$200/day",
    rating: 4.7,
    bookings: 38,
    category: "Training Space",
  },
  {
    id: "meeting-pod-1",
    name: "Meeting Pod 1",
    capacity: 6,
    features: ["4K Monitor", "HDMI Connection", "Comfortable Seating", "Privacy Glass", "Wireless Charging"],
    description: "Quick meeting space for small groups and one-on-one discussions",
    image: "/placeholder.svg?height=120&width=200",
    available: true,
    price: "$80/day",
    rating: 4.5,
    bookings: 22,
    category: "Small Space",
  },
  {
    id: "executive-boardroom",
    name: "Executive Boardroom",
    capacity: 12,
    features: ["Premium Furniture", "Video Wall", "Executive Catering", "Soundproofing", "Climate Control"],
    description: "Premium boardroom for executive meetings and important presentations",
    image: "/placeholder.svg?height=120&width=200",
    available: true,
    price: "$300/day",
    rating: 4.9,
    bookings: 18,
    category: "Executive",
  },
]

const RESOURCE_OPTIONS = [
  "4K Projector",
  "Video Conferencing Setup",
  "Smart Whiteboard",
  "Wireless Microphone",
  "Premium Sound System",
  "Coffee & Tea Service",
  "Full Catering Service",
  "Flip Chart & Markers",
  "High-speed WiFi",
  "Laptop & Accessories",
  "Extension Cords & Adapters",
  "Presentation Clicker",
  "Notebooks & Stationery",
  "Water & Refreshments",
  "Parking Passes",
  "Security Access Cards",
  "Live Streaming Setup",
  "Recording Equipment",
  "Translation Services",
  "Technical Support",
]

const DEPARTMENTS = [
  "Human Resources",
  "Information Technology",
  "Marketing & Sales",
  "Finance & Accounting",
  "Operations",
  "Research & Development",
  "Customer Service",
  "Legal & Compliance",
  "Executive Management",
  "Training & Development",
]

const RECENT_BOOKINGS = [
  {
    id: "1",
    venue: "Conference Room A",
    user: "John Smith",
    department: "Marketing & Sales",
    date: "2024-01-15",
    time: "10:00 AM",
    status: "approved",
    purpose: "Q1 Marketing Strategy Meeting",
  },
  {
    id: "2",
    venue: "Training Room",
    user: "Sarah Johnson",
    department: "Human Resources",
    date: "2024-01-14",
    time: "2:00 PM",
    status: "approved",
    purpose: "Employee Onboarding Session",
  },
  {
    id: "3",
    venue: "Executive Boardroom",
    user: "Michael Chen",
    department: "Executive Management",
    date: "2024-01-13",
    time: "9:00 AM",
    status: "approved",
    purpose: "Board Meeting - Strategic Planning",
  },
  {
    id: "4",
    venue: "Meeting Pod 1",
    user: "Emily Davis",
    department: "Information Technology",
    date: "2024-01-12",
    time: "3:30 PM",
    status: "approved",
    purpose: "Code Review Session",
  },
]

// ==================== UTILITY COMPONENTS ====================

const NotificationContainer = () => {
  const { notifications } = useBooking()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            transform transition-all duration-300 ease-in-out
            p-4 rounded-xl shadow-lg backdrop-blur-sm border
            animate-in slide-in-from-right-full
            ${
              notification.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : notification.type === "error"
                  ? "bg-red-50 border-red-200 text-red-800"
                  : "bg-blue-50 border-blue-200 text-blue-800"
            }
          `}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {notification.type === "success" ? (
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              ) : notification.type === "error" ? (
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 text-sm font-medium">{notification.message}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

const DateTimePicker = ({ value, endValue, onChange, onEndChange, error, endError }) => {
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedTime, setSelectedTime] = useState("09:00")
  const [selectedEndTime, setSelectedEndTime] = useState("10:00")

  const timeSlots = []
  for (let hour = 8; hour <= 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
      timeSlots.push(timeString)
    }
  }

  const handleDateSelect = (dateStr) => {
    const [hours, minutes] = selectedTime.split(":").map(Number)
    const [endHours, endMinutes] = selectedEndTime.split(":").map(Number)

    const newDate = new Date(dateStr)
    newDate.setHours(hours, minutes, 0, 0)

    const newEndDate = new Date(dateStr)
    newEndDate.setHours(endHours, endMinutes, 0, 0)

    onChange(newDate)
    onEndChange(newEndDate)
    setShowCalendar(false)
  }

  const handleTimeChange = (time, isEnd = false) => {
    if (isEnd) {
      setSelectedEndTime(time)
      if (endValue) {
        const [hours, minutes] = time.split(":").map(Number)
        const newDate = new Date(endValue)
        newDate.setHours(hours, minutes, 0, 0)
        onEndChange(newDate)
      }
    } else {
      setSelectedTime(time)
      if (value) {
        const [hours, minutes] = time.split(":").map(Number)
        const newDate = new Date(value)
        newDate.setHours(hours, minutes, 0, 0)
        onChange(newDate)
      }
    }
  }

  const formatDate = (date) => {
    return date
      ? date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Select date"
  }

  const generateCalendarDays = () => {
    const today = new Date()
    const days = []

    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      if (date.getDay() !== 0 && date.getDay() !== 6) {
        days.push(date)
      }
    }

    return days
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">📅 Meeting Date</label>
          <button
            type="button"
            className={`
              w-full p-3 text-left border-2 rounded-xl transition-all duration-200
              bg-white hover:border-blue-300
              ${error ? "border-red-300" : "border-gray-200"}
              ${showCalendar ? "border-blue-500 ring-2 ring-blue-100" : ""}
            `}
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className={value ? "text-gray-900" : "text-gray-500"}>{formatDate(value)}</span>
            </div>
          </button>

          {showCalendar && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
              <div className="p-4">
                <div className="grid grid-cols-7 gap-1">
                  {generateCalendarDays().map((date, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`
                        p-2 text-center rounded-lg transition-all duration-200 hover:bg-blue-50
                        ${
                          value && date.toDateString() === value.toDateString()
                            ? "bg-blue-500 text-white shadow-lg"
                            : "text-gray-700"
                        }
                      `}
                      onClick={() => handleDateSelect(date.toISOString().split("T")[0])}
                    >
                      <div className="text-sm font-medium">{date.getDate()}</div>
                      <div className="text-xs opacity-75">{date.toLocaleDateString("en-US", { weekday: "short" })}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">🕐 Start Time</label>
            <select
              value={selectedTime}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
            >
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">🕐 End Time</label>
            <select
              value={selectedEndTime}
              onChange={(e) => handleTimeChange(e.target.value, true)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
            >
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {endError && <p className="mt-1 text-sm text-red-600">{endError}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

const ResourceSelector = ({ value, onChange, error }) => {
  const [inputValue, setInputValue] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const selectedResources = value ? value.split(", ").filter(Boolean) : []

  useEffect(() => {
    if (inputValue.length > 1) {
      const filtered = RESOURCE_OPTIONS.filter(
        (option) => option.toLowerCase().includes(inputValue.toLowerCase()) && !selectedResources.includes(option),
      )
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }, [inputValue, selectedResources])

  const addResource = (resource) => {
    if (!selectedResources.includes(resource)) {
      const newResources = [...selectedResources, resource]
      onChange(newResources.join(", "))
    }
    setInputValue("")
    setShowSuggestions(false)
  }

  const removeResource = (resourceToRemove) => {
    const newResources = selectedResources.filter((resource) => resource !== resourceToRemove)
    onChange(newResources.join(", "))
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      addResource(inputValue.trim())
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Type to search resources..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
            className={`
              w-full p-3 pl-10 border-2 rounded-xl transition-all duration-200
              bg-white text-gray-900
              focus:ring-2 focus:ring-blue-100
              ${error ? "border-red-300" : "border-gray-200 focus:border-blue-500"}
            `}
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
            {suggestions.map((resource, index) => (
              <button
                key={index}
                type="button"
                className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center justify-between group transition-colors duration-200"
                onClick={() => addResource(resource)}
              >
                <span className="text-gray-700">{resource}</span>
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedResources.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedResources.map((resource, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-full shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {resource}
              <button
                type="button"
                onClick={() => removeResource(resource)}
                className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors duration-200"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>💡 Press Enter to add custom resources</span>
        {error && <span className="text-red-600 font-medium">{error}</span>}
      </div>
    </div>
  )
}

const VenueSelector = ({ value, onChange, error }) => {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const selectedVenue = VENUES.find((venue) => venue.name === value)

  const categories = ["all", ...new Set(VENUES.map((venue) => venue.category))]
  const filteredVenues =
    selectedCategory === "all" ? VENUES : VENUES.filter((venue) => venue.category === selectedCategory)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className={`
              px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200
              ${
                selectedCategory === category
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            {category === "all" ? "All Categories" : category}
          </button>
        ))}
      </div>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full p-3 border-2 rounded-xl transition-all duration-200
          bg-white text-gray-900
          focus:ring-2 focus:ring-blue-100
          ${error ? "border-red-300" : "border-gray-200 focus:border-blue-500"}
        `}
      >
        <option value="">🏢 Select a venue</option>
        {filteredVenues.map((venue) => (
          <option key={venue.id} value={venue.name} disabled={!venue.available}>
            {venue.name} - {venue.capacity} seats {!venue.available ? "(Unavailable)" : ""} - {venue.price}
          </option>
        ))}
        <option value="Other">🏗️ Other (Specify Below)</option>
      </select>

      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

      {selectedVenue && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-xl p-4 animate-in slide-in-from-top-2 duration-300">
          <div className="flex gap-4">
            <img
              src={selectedVenue.image || "/placeholder.svg"}
              alt={selectedVenue.name}
              className="w-24 h-20 object-cover rounded-lg shadow-md"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-lg text-blue-900">{selectedVenue.name}</h4>
                <div className="flex items-center gap-1 text-yellow-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">{selectedVenue.rating}</span>
                </div>
              </div>

              <p className="text-sm text-blue-700 mb-3">{selectedVenue.description}</p>

              <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                <div className="flex items-center gap-1 text-blue-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span>{selectedVenue.capacity} people</span>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                  <span>{selectedVenue.price}</span>
                </div>
                <div className="flex items-center gap-1 text-purple-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{selectedVenue.bookings} bookings</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {selectedVenue.features.map((feature, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-md">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ==================== MAIN COMPONENTS ====================

const BookingForm = () => {
  const { state, createBooking } = useBooking()
  const [showCustomVenue, setShowCustomVenue] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      meetingType: "Physical",
      venue: "",
      customVenue: "",
      purpose: "",
      capacity: 1,
      resources: "",
      priority: "normal",
      department: "",
      contactEmail: "",
      specialRequests: "",
    },
  })

  const watchVenue = watch("venue")
  const watchMeetingType = watch("meetingType")
  const watchPurpose = watch("purpose")
  const watchPriority = watch("priority")

  useEffect(() => {
    setShowCustomVenue(watchVenue === "Other")
  }, [watchVenue])

  const onSubmit = (data) => {
    const finalVenue = data.venue === "Other" ? data.customVenue : data.venue
    createBooking({
      ...data,
      venue: finalVenue,
      dateTime: data.dateTime.toISOString(),
      endTime: data.endTime.toISOString(),
    })
    reset()
  }

  const meetingTypes = [
    { value: "Physical", icon: "🏢", color: "blue", description: "In-person meeting" },
    { value: "Virtual", icon: "💻", color: "green", description: "Online meeting" },
    { value: "Hybrid", icon: "🔄", color: "purple", description: "Mixed format" },
  ]

  const priorities = [
    { value: "low", label: "Low Priority", color: "gray", icon: "⬇️" },
    { value: "normal", label: "Normal", color: "blue", icon: "➡️" },
    { value: "high", label: "High Priority", color: "orange", icon: "⬆️" },
    { value: "urgent", label: "Urgent", color: "red", icon: "🚨" },
  ]

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">📅 Book Your Venue</h2>
        <p className="text-gray-600">Reserve the perfect space for your meeting</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Meeting Type Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">Meeting Type *</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {meetingTypes.map(({ value, icon, color, description }) => (
              <button
                key={value}
                type="button"
                onClick={() => setValue("meetingType", value)}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-200 text-center
                  ${
                    watch("meetingType") === value
                      ? `border-${color}-500 bg-gradient-to-br from-${color}-50 to-${color}-100 shadow-lg transform scale-105`
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                  }
                `}
              >
                <div className="text-2xl mb-2">{icon}</div>
                <div className="font-medium text-gray-900">{value}</div>
                <div className="text-xs text-gray-500 mt-1">{description}</div>
              </button>
            ))}
          </div>
          <input type="hidden" {...register("meetingType")} />
          {errors.meetingType && <p className="text-sm text-red-600 font-medium">{errors.meetingType.message}</p>}
        </div>

        {/* Venue Selection */}
        {(watchMeetingType === "Physical" || watchMeetingType === "Hybrid") && (
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">Venue *</label>
            <VenueSelector
              value={watch("venue")}
              onChange={(value) => setValue("venue", value)}
              error={errors.venue?.message}
            />
            {showCustomVenue && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <input
                  {...register("customVenue")}
                  placeholder="🏗️ Enter custom venue name"
                  className={`
                    w-full p-3 border-2 rounded-xl transition-all duration-200
                    bg-white text-gray-900
                    focus:ring-2 focus:ring-blue-100
                    ${errors.customVenue ? "border-red-300" : "border-gray-200 focus:border-blue-500"}
                  `}
                />
                {errors.customVenue && (
                  <p className="mt-1 text-sm text-red-600 font-medium">{errors.customVenue.message}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Date, Time and Capacity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <DateTimePicker
              value={watch("dateTime")}
              endValue={watch("endTime")}
              onChange={(date) => setValue("dateTime", date)}
              onEndChange={(date) => setValue("endTime", date)}
              error={errors.dateTime?.message}
              endError={errors.endTime?.message}
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">👥 Expected Capacity *</label>
              <input
                type="number"
                {...register("capacity", { valueAsNumber: true })}
                min="1"
                max="500"
                placeholder="Number of attendees"
                className={`
                  w-full p-3 border-2 rounded-xl text-center font-semibold transition-all duration-200
                  bg-white text-gray-900
                  focus:ring-2 focus:ring-blue-100
                  ${errors.capacity ? "border-red-300" : "border-gray-200 focus:border-blue-500"}
                `}
              />
              {errors.capacity && <p className="mt-1 text-sm text-red-600 font-medium">{errors.capacity.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">⚡ Priority Level</label>
              <select
                {...register("priority")}
                className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
              >
                {priorities.map(({ value, label, icon }) => (
                  <option key={value} value={value}>
                    {icon} {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Department and Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">🏢 Department *</label>
            <select
              {...register("department")}
              className={`
                w-full p-3 border-2 rounded-xl transition-all duration-200
                bg-white text-gray-900
                focus:ring-2 focus:ring-blue-100
                ${errors.department ? "border-red-300" : "border-gray-200 focus:border-blue-500"}
              `}
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.department && <p className="mt-1 text-sm text-red-600 font-medium">{errors.department.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">📧 Contact Email *</label>
            <input
              type="email"
              {...register("contactEmail")}
              placeholder="your.email@company.com"
              className={`
                w-full p-3 border-2 rounded-xl transition-all duration-200
                bg-white text-gray-900
                focus:ring-2 focus:ring-blue-100
                ${errors.contactEmail ? "border-red-300" : "border-gray-200 focus:border-blue-500"}
              `}
            />
            {errors.contactEmail && (
              <p className="mt-1 text-sm text-red-600 font-medium">{errors.contactEmail.message}</p>
            )}
          </div>
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">📝 Meeting Purpose *</label>
          <textarea
            {...register("purpose")}
            placeholder="Describe the purpose of your meeting..."
            rows="4"
            className={`
              w-full p-3 border-2 rounded-xl resize-none transition-all duration-200
              bg-white text-gray-900
              focus:ring-2 focus:ring-blue-100
              ${errors.purpose ? "border-red-300" : "border-gray-200 focus:border-blue-500"}
            `}
          />
          <div className="flex justify-between items-center mt-2 text-xs">
            <span className="text-gray-500">{watchPurpose?.length || 0}/500 characters</span>
            {errors.purpose && <span className="text-red-600 font-medium">{errors.purpose.message}</span>}
          </div>
        </div>

        {/* Resources */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">🛠️ Resource Requirements *</label>
          <ResourceSelector
            value={watch("resources") || ""}
            onChange={(value) => setValue("resources", value)}
            error={errors.resources?.message}
          />
        </div>

        {/* Special Requests */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">✨ Special Requests</label>
          <textarea
            {...register("specialRequests")}
            placeholder="Any special arrangements or requirements..."
            rows="3"
            className="w-full p-3 border-2 border-gray-200 rounded-xl resize-none bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
          />
        </div>

        {/* Priority Indicator */}
        {watchPriority && watchPriority !== "normal" && (
          <div
            className={`
            p-3 rounded-xl border-l-4 
            ${
              watchPriority === "urgent"
                ? "bg-red-50 border-red-500 text-red-800"
                : watchPriority === "high"
                  ? "bg-orange-50 border-orange-500 text-orange-800"
                  : "bg-gray-50 border-gray-500 text-gray-800"
            }
          `}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {watchPriority === "urgent" ? "🚨" : watchPriority === "high" ? "⬆️" : "⬇️"}
              </span>
              <span className="font-medium">
                {watchPriority === "urgent"
                  ? "Urgent Request - Will be processed immediately"
                  : watchPriority === "high"
                    ? "High Priority - Faster approval process"
                    : "Low Priority - Standard processing time"}
              </span>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Reset Form
          </button>
          <button
            type="submit"
            disabled={state.currentBooking !== null || state.isLoading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {state.isLoading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                Submit Booking
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

const BookingStatus = () => {
  const { state, cancelBooking } = useBooking()
  const [activeTab, setActiveTab] = useState("current")
  const [showCancelModal, setShowCancelModal] = useState(false)

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return "✅"
      case "rejected":
        return "❌"
      case "pending":
        return "⏳"
      default:
        return "⚪"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleCancelBooking = () => {
    cancelBooking()
    setShowCancelModal(false)
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl h-fit">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">📊 Booking Status</h2>
      </div>

      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        <button
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === "current" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab("current")}
        >
          Current
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === "upcoming" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming ({state.upcomingBookings.length})
        </button>
      </div>

      <div className="min-h-96">
        {activeTab === "current" ? (
          state.currentBooking ? (
            <div className="space-y-6">
              {/* Booking Details */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-blue-900 flex items-center gap-2">
                      🏢 {state.currentBooking.venue}
                    </h3>
                    <p className="text-sm text-blue-700 flex items-center gap-2 mt-1">
                      🕐 {formatDate(state.currentBooking.dateTime)}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(state.currentBooking.status)}`}
                  >
                    {getStatusIcon(state.currentBooking.status)} {state.currentBooking.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2 text-blue-600">
                    👥 <span>Capacity: {state.currentBooking.capacity}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    📅 <span>Type: {state.currentBooking.meetingType}</span>
                  </div>
                </div>

                <div className="bg-white/50 rounded-lg p-3">
                  <strong className="text-blue-900 text-sm">📝 Purpose:</strong>
                  <p className="text-blue-800 text-sm mt-1 leading-relaxed">{state.currentBooking.purpose}</p>
                </div>
              </div>

              {/* Approval Process */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">✅ Approval Process</h4>

                {Object.entries(state.currentBooking.approvals).map(([role, approval]) => {
                  const roleNames = {
                    gd: "Group Director",
                    ds: "Director Secretary",
                    admin: "Administration",
                  }

                  const roleIcons = {
                    gd: "👨‍💼",
                    ds: "👩‍💼",
                    admin: "🏛️",
                  }

                  const roleColors = {
                    gd: "bg-blue-100 text-blue-800",
                    ds: "bg-purple-100 text-purple-800",
                    admin: "bg-green-100 text-green-800",
                  }

                  return (
                    <div key={role} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${roleColors[role]}`}
                      >
                        {roleIcons[role]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">{roleNames[role]}</span>
                          <span className="text-lg">{getStatusIcon(approval.status)}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{approval.note}</p>
                        {approval.timestamp && (
                          <p className="text-xs text-gray-500">🕐 {new Date(approval.timestamp).toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Cancel Button */}
              <button
                onClick={() => setShowCancelModal(true)}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                🗑️ Cancel Booking
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">📅</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Booking</h3>
              <p className="text-gray-500">Submit a booking request to track its status here.</p>
            </div>
          )
        ) : (
          <div className="space-y-4">
            {state.upcomingBookings.length > 0 ? (
              state.upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-blue-50 transition-colors duration-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{booking.venue}</h4>
                      <p className="text-sm text-gray-600 mt-1">{formatDate(booking.dateTime)}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}
                    >
                      {getStatusIcon(booking.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{booking.purpose}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  📅
                </div>
                <p className="text-gray-500">No upcoming bookings found.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">⚠️</div>
                <h3 className="text-lg font-bold text-gray-900">Confirm Cancellation</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel your current booking? This action cannot be undone and you'll need to
                submit a new request.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancelBooking}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const StatsSection = () => {
  const stats = [
    { title: "Available Rooms", value: "12", icon: "🏢", color: "blue", trend: "+2" },
    { title: "Utilization Rate", value: "86%", icon: "📈", color: "green", trend: "+5%" },
    { title: "Bookings Today", value: "24", icon: "📅", color: "purple", trend: "+8" },
    { title: "Avg Response Time", value: "2.5h", icon: "⏱️", color: "orange", trend: "-0.5h" },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">{stat.icon}</div>
            <div
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                stat.trend.startsWith("+")
                  ? "bg-green-100 text-green-800"
                  : stat.trend.startsWith("-")
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
              }`}
            >
              {stat.trend}
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
          <div className="text-sm text-gray-600">{stat.title}</div>
        </div>
      ))}
    </div>
  )
}

const PopularVenuesSection = () => {
  const popularVenues = VENUES.slice(0, 3)

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl mb-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">🔥 Popular Venues</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {popularVenues.map((venue) => (
          <div key={venue.id} className="bg-gray-50 rounded-xl p-4 hover:bg-blue-50 transition-colors duration-200">
            <img
              src={venue.image || "/placeholder.svg"}
              alt={venue.name}
              className="w-full h-32 object-cover rounded-lg mb-3"
            />
            <h4 className="font-semibold text-gray-900 mb-1">{venue.name}</h4>
            <p className="text-sm text-gray-600 mb-2">{venue.description}</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-blue-600">👥 {venue.capacity} seats</span>
              <span className="text-green-600">⭐ {venue.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const RecentBookingsSection = () => {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl mb-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">📋 Recent Bookings</h3>
      <div className="space-y-3">
        {RECENT_BOOKINGS.map((booking) => (
          <div
            key={booking.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">🏢</div>
                <div>
                  <h4 className="font-medium text-gray-900">{booking.venue}</h4>
                  <p className="text-sm text-gray-600">
                    {booking.user} • {booking.department}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{booking.date}</p>
              <p className="text-xs text-gray-500">{booking.time}</p>
            </div>
            <div className="ml-4">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                ✅ {booking.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const QuickActionsSection = () => {
  const quickActions = [
    { title: "Quick Book", description: "Book a meeting room instantly", icon: "⚡", color: "blue" },
    { title: "Check Availability", description: "View real-time room availability", icon: "👀", color: "green" },
    { title: "My Bookings", description: "Manage your current bookings", icon: "📋", color: "purple" },
    { title: "Help & Support", description: "Get assistance with booking", icon: "❓", color: "orange" },
  ]

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl mb-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">🚀 Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <button
            key={index}
            className="p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-all duration-200 hover:scale-105 text-center"
          >
            <div className="text-3xl mb-2">{action.icon}</div>
            <h4 className="font-semibold text-gray-900 mb-1">{action.title}</h4>
            <p className="text-xs text-gray-600">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

const FeaturesSection = () => {
  const features = [
    {
      title: "Lightning Fast",
      description: "Book your meeting space in under 2 minutes with our streamlined process.",
      icon: "⚡",
      color: "yellow",
    },
    {
      title: "Real-time Tracking",
      description: "Monitor your booking status in real-time as it moves through approval.",
      icon: "🔍",
      color: "green",
    },
    {
      title: "Smart Scheduling",
      description: "AI-powered suggestions for optimal meeting times and room selection.",
      icon: "🧠",
      color: "blue",
    },
    {
      title: "Mobile Ready",
      description: "Access and manage your bookings from any device, anywhere.",
      icon: "📱",
      color: "purple",
    },
    {
      title: "Priority Support",
      description: "Urgent bookings get fast-tracked through our approval system.",
      icon: "🚨",
      color: "red",
    },
    {
      title: "Analytics Dashboard",
      description: "Track usage patterns and optimize your meeting space utilization.",
      icon: "📊",
      color: "indigo",
    },
  ]

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl mb-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">✨ Why Choose Our Booking System?</h2>
        <p className="text-gray-600">Discover the features that make venue booking effortless</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const FAQSection = () => {
  const faqs = [
    {
      question: "How far in advance can I book a venue?",
      answer:
        "You can book venues up to 3 months in advance. For urgent bookings, same-day requests are also accepted.",
    },
    {
      question: "What happens if my booking is rejected?",
      answer:
        "If your booking is rejected, you'll receive a notification with the reason. You can then modify your request and resubmit.",
    },
    {
      question: "Can I modify my booking after submission?",
      answer:
        "Yes, you can modify your booking before it's approved. Once approved, please contact the admin for changes.",
    },
    {
      question: "Are there any booking fees?",
      answer:
        "Basic room bookings are free for employees. Premium venues and catering services may have additional charges.",
    },
  ]

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl mb-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">❓ Frequently Asked Questions</h3>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
            <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==================== MAIN APP COMPONENT ====================

function Booking() {
  return (
    <BookingProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <NotificationContainer />

        {/* Hero Section */}
        <div className="text-center py-12 px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6">
            🏢
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 mb-4">
            Smart Venue Booking
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Streamline your meeting space reservations with our intelligent booking system
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 pb-8">
          {/* Booking Form and Status */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            <div className="xl:col-span-2">
              <BookingForm />
            </div>
            <div>
              <BookingStatus />
            </div>
          </div>

          {/* Stats Section */}
          <StatsSection />

          {/* Popular Venues */}
          <PopularVenuesSection />

          {/* Quick Actions */}
          <QuickActionsSection />

          {/* Recent Bookings */}
          <RecentBookingsSection />

          {/* Features Section */}
          <FeaturesSection />

          {/* FAQ Section */}
          <FAQSection />
        </div>

        {/* Footer */}
        <footer className="bg-white/80 backdrop-blur-sm border-t border-white/20 py-6">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-600">
              © 2024 Smart Venue Booking System. Built with React + Vite + Tailwind CSS ⚡
            </p>
          </div>
        </footer>
      </div>
    </BookingProvider>
  )
}

export default Booking
