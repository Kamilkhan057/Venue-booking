import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Zod schema for form validation
const schema = z.object({
  meetingType: z.enum(["Physical", "Virtual", "Hybrid"], {
    required_error: "Please select a meeting type"
  }),
  venue: z.string().min(1, "Venue is required"),
  customVenue: z.string().optional(),
  dateTime: z.date({
    required_error: "Please select date and time"
  }),
  purpose: z.string().min(10, "Purpose must be at least 10 characters").max(500, "Purpose cannot exceed 500 characters"),
  capacity: z.number().min(1, "Capacity must be at least 1").max(500, "Capacity cannot exceed 500"),
  resources: z.string().min(2, "Please specify required resources").max(200, "Resources cannot exceed 200 characters"),
}).refine(data => {
  if (data.venue === "Other (Specify Below)" && (!data.customVenue || data.customVenue.trim().length === 0)) {
    return false;
  }
  return true;
}, {
  message: "Custom venue name is required when 'Other' is selected",
  path: ["customVenue"],
});

// Predefined venue options
const VENUE_OPTIONS = [
  "Main Auditorium",
  "Conference Room A",
  "Conference Room B",
  "Training Room",
  "Meeting Pod 1",
  "Other (Specify Below)"
];

// Predefined resources for autocomplete
const RESOURCE_OPTIONS = [
  "Projector",
  "Video Conferencing",
  "Whiteboard",
  "Microphone",
  "Speaker System",
  "Coffee Service",
  "Catering",
  "Flip Chart",
  "WiFi Access",
  "Laptop"
];

export default function Booking() {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showCustomVenue, setShowCustomVenue] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [bookingStatus, setBookingStatus] = useState("none");
  const [gdApprovalStatus, setGdApprovalStatus] = useState("N/A");
  const [dsApprovalStatus, setDsApprovalStatus] = useState("N/A");
  const [adminApprovalStatus, setAdminApprovalStatus] = useState("N/A");
  const [rejectionReason, setRejectionReason] = useState(null);
  const [approvalNotes, setApprovalNotes] = useState({ gd: "", ds: "", admin: "" });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [resourceSuggestions, setResourceSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      meetingType: "",
      venue: "",
      customVenue: "",
      purpose: "",
      capacity: 1,
      resources: "",
    },
  });

  const watchVenue = watch("venue");
  const watchResources = watch("resources");

  // Effect to toggle custom venue input visibility
  useEffect(() => {
    setShowCustomVenue(watchVenue === "Other (Specify Below)");
  }, [watchVenue]);

  // Effect for resource suggestions
  useEffect(() => {
    if (watchResources && watchResources.length > 1) {
      const filtered = RESOURCE_OPTIONS.filter(option => 
        option.toLowerCase().includes(watchResources.toLowerCase())
      );
      setResourceSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [watchResources]);

  // Handle resource suggestion click
  const handleResourceSuggestionClick = (resource) => {
    const currentResources = watchResources ? watchResources.split(', ') : [];
    if (!currentResources.includes(resource)) {
      const newResources = [...currentResources, resource].join(', ');
      setValue("resources", newResources);
    }
    setShowSuggestions(false);
  };

  // Simulate the approval process locally
  useEffect(() => {
    let gdApprovalTimeout;
    let dsApprovalTimeout;
    let adminApprovalTimeout;

    if (currentBooking && bookingStatus === "pending") {
      setIsLoading(true);
      
      // Simulate Group Director approval after 2 seconds
      gdApprovalTimeout = setTimeout(() => {
        setGdApprovalStatus("approved");
        setApprovalNotes(prev => ({ ...prev, gd: "GD: Equipment setup confirmed." }));
      }, 2000);

      // Simulate Director Secretary approval after 4 seconds
      dsApprovalTimeout = setTimeout(() => {
        setDsApprovalStatus("approved");
        setApprovalNotes(prev => ({ ...prev, ds: "DS: Meeting agenda distributed." }));
      }, 4000);
    }

    // Check if both GD and DS have approved, then simulate Admin approval
    if (gdApprovalStatus === "approved" && dsApprovalStatus === "approved" && adminApprovalStatus === "N/A") {
      adminApprovalTimeout = setTimeout(() => {
        setAdminApprovalStatus("approved");
        setBookingStatus("approved");
        setIsLoading(false);
        setApprovalNotes(prev => ({ ...prev, admin: `Admin: All set for ${currentBooking?.venue}!` }));
      }, 2000);
    }

    return () => {
      clearTimeout(gdApprovalTimeout);
      clearTimeout(dsApprovalTimeout);
      clearTimeout(adminApprovalTimeout);
    };
  }, [currentBooking, bookingStatus, gdApprovalStatus, dsApprovalStatus, adminApprovalStatus]);

  // Function to determine status display class
  const getStatusClass = (status) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "none": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Handle form submission
  const onSubmit = (data) => {
    setErrorMessage("");
    setSuccessMessage("");

    if (currentBooking) {
      setErrorMessage("❌ You already have an active booking. Please cancel it before booking a new venue.");
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }

    const finalVenue = data.venue === "Other (Specify Below)"
      ? data.customVenue
      : data.venue;

    const bookingData = {
      ...data,
      venue: finalVenue,
      dateTime: data.dateTime.toISOString(),
    };

    console.log("Booking submitted:", bookingData);

    // Set initial booking state
    setCurrentBooking(bookingData);
    setBookingStatus("pending");
    setGdApprovalStatus("pending");
    setDsApprovalStatus("pending");
    setAdminApprovalStatus("N/A");
    setRejectionReason(null);
    setApprovalNotes({
      gd: "Awaiting Group Director's review.",
      ds: "Awaiting Director Secretary's review.",
      admin: "Awaiting final Admin confirmation."
    });

    setSuccessMessage("🎉 Venue booked successfully! Your request is being processed.");

    setTimeout(() => {
      reset();
      setSuccessMessage("");
      setShowCustomVenue(false);
    }, 5000);
  };

  // Handle errors from react-hook-form
  const onError = (errors) => {
    console.error("Form errors:", errors);
    let firstErrorMsg = "Please correct the errors in the form.";
    if (errors.meetingType) firstErrorMsg = errors.meetingType.message;
    else if (errors.venue) firstErrorMsg = errors.venue.message;
    else if (errors.customVenue) firstErrorMsg = errors.customVenue.message;
    else if (errors.dateTime) firstErrorMsg = errors.dateTime.message;
    else if (errors.purpose) firstErrorMsg = errors.purpose.message;
    else if (errors.capacity) firstErrorMsg = errors.capacity.message;
    else if (errors.resources) firstErrorMsg = errors.resources.message;

    setErrorMessage(`❌ ${firstErrorMsg}`);
    setTimeout(() => setErrorMessage(""), 5000);
  };

  // Function to reset the booking (cancel)
  const resetBooking = () => {
    setCurrentBooking(null);
    setBookingStatus("none");
    setGdApprovalStatus("N/A");
    setDsApprovalStatus("N/A");
    setAdminApprovalStatus("N/A");
    setRejectionReason(null);
    setApprovalNotes({ gd: "", ds: "", admin: "" });
  };

  // Handle cancel button click (opens modal)
  const handleCancelClick = () => {
    setModalAction('cancel');
    setShowConfirmModal(true);
  };

  // Handle confirmation from modal
  const handleConfirmAction = () => {
    if (modalAction === 'cancel') {
      resetBooking();
      setSuccessMessage("Your booking has been successfully cancelled.");
      setTimeout(() => setSuccessMessage(""), 5000);
    }
    setShowConfirmModal(false);
    setModalAction(null);
  };

  // Handle cancellation from modal
  const handleCancelAction = () => {
    setShowConfirmModal(false);
    setModalAction(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative border border-white/30">
          {/* Glowing top border */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
          
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Meeting Venue Booking System
                </h1>
                <p className="text-gray-600 mt-2">Book conference rooms, auditoriums, and meeting spaces</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="text-gray-500 text-sm">Today</div>
                <div className="font-semibold">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">Booking Details</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Meeting Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Type *</label>
                        <div className="flex flex-wrap gap-2">
                          {["Physical", "Virtual", "Hybrid"].map(type => (
                            <button
                              type="button"
                              key={type}
                              onClick={() => {
                                setValue("meetingType", type, { shouldValidate: true });
                                if (type !== "Physical") {
                                  setValue("venue", "");
                                  setValue("customVenue", "");
                                }
                              }}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                watch("meetingType") === type 
                                  ? "bg-blue-600 text-white shadow-md"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                        <input type="hidden" {...register("meetingType")} />
                        {errors.meetingType && (
                          <p className="mt-1 text-sm text-red-600">{errors.meetingType.message}</p>
                        )}
                      </div>

                      {/* Venue Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Venue *</label>
                        <div className="relative">
                          <select
                            {...register("venue")}
                            onChange={(e) => {
                              setValue("venue", e.target.value, { shouldValidate: true });
                              if (e.target.value !== "Other (Specify Below)") {
                                setValue("customVenue", "");
                              }
                            }}
                            className={`w-full px-4 py-2.5 rounded-lg border ${
                              errors.venue ? "border-red-300" : "border-gray-300"
                            } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                          >
                            <option value="">Select a venue</option>
                            {VENUE_OPTIONS.map(venue => (
                              <option key={venue} value={venue}>{venue}</option>
                            ))}
                          </select>
                        </div>

                        {showCustomVenue && (
                          <div className="mt-4 animate-fadeIn">
                            <input
                              {...register("customVenue")}
                              placeholder="Enter your venue name"
                              className={`w-full px-4 py-2.5 rounded-lg border ${
                                errors.customVenue ? "border-red-300" : "border-gray-300"
                              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            />
                            {errors.customVenue && (
                              <p className="mt-1 text-sm text-red-600">{errors.customVenue.message}</p>
                            )}
                          </div>
                        )}
                        {errors.venue && !showCustomVenue && (
                          <p className="mt-1 text-sm text-red-600">{errors.venue.message}</p>
                        )}
                      </div>

                      {/* Date & Time */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time *</label>
                        <DatePicker
                          selected={watch("dateTime")}
                          onChange={(date) => setValue("dateTime", date, { shouldValidate: true })}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat="MMMM d, yyyy h:mm aa"
                          minDate={new Date()}
                          placeholderText="Select date and time"
                          className={`w-full px-4 py-2.5 rounded-lg border ${
                            errors.dateTime ? "border-red-300" : "border-gray-300"
                          } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {errors.dateTime && (
                          <p className="mt-1 text-sm text-red-600">{errors.dateTime.message}</p>
                        )}
                      </div>

                      {/* Capacity */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expected Capacity *</label>
                        <input
                          type="number"
                          {...register("capacity", { valueAsNumber: true })}
                          min="1"
                          placeholder="Number of attendees"
                          className={`w-full px-4 py-2.5 rounded-lg border ${
                            errors.capacity ? "border-red-300" : "border-gray-300"
                          } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {errors.capacity && (
                          <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
                        )}
                      </div>

                      {/* Purpose */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Purpose *</label>
                        <textarea
                          {...register("purpose")}
                          placeholder="Briefly describe the meeting purpose"
                          rows="3"
                          className={`w-full px-4 py-2.5 rounded-lg border ${
                            errors.purpose ? "border-red-300" : "border-gray-300"
                          } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        ></textarea>
                        {errors.purpose && (
                          <p className="mt-1 text-sm text-red-600">{errors.purpose.message}</p>
                        )}
                      </div>

                      {/* Resources */}
                      <div className="md:col-span-2 relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Resource Requirements *</label>
                        <input
                          {...register("resources")}
                          placeholder="Projector, Microphone, Whiteboard, etc."
                          className={`w-full px-4 py-2.5 rounded-lg border ${
                            errors.resources ? "border-red-300" : "border-gray-300"
                          } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                          onFocus={() => setShowSuggestions(true)}
                        />
                        <p className="mt-1 text-xs text-gray-500">Separate multiple items with commas</p>
                        {errors.resources && (
                          <p className="mt-1 text-sm text-red-600">{errors.resources.message}</p>
                        )}

                        {showSuggestions && resourceSuggestions.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
                            <div className="py-2">
                              {resourceSuggestions.map((resource, index) => (
                                <div
                                  key={index}
                                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center"
                                  onClick={() => handleResourceSuggestionClick(resource)}
                                >
                                  <span className="text-gray-700">{resource}</span>
                                  <span className="ml-auto text-xs text-gray-500">Click to add</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Form Buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          reset();
                          setErrorMessage("");
                          setSuccessMessage("");
                        }}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                      >
                        Reset Form
                      </button>
                      <button
                        type="submit"
                        className={`px-6 py-3 rounded-lg font-medium transition-colors flex-1 ${
                          currentBooking || isLoading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md"
                        }`}
                        disabled={currentBooking || isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                            Processing...
                          </div>
                        ) : currentBooking ? (
                          "Booking in Progress"
                        ) : (
                          "Submit Booking"
                        )}
                      </button>
                    </div>

                    {/* Messages */}
                    {successMessage && (
                      <div className="mt-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
                        {successMessage}
                      </div>
                    )}
                    {errorMessage && (
                      <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                        {errorMessage}
                      </div>
                    )}
                  </div>
                </form>
              </div>

              {/* Status Section */}
              <div>
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-full">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">Booking Status</h2>
                  
                  {currentBooking ? (
                    <div className="space-y-6">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg text-blue-800">{currentBooking.venue}</h3>
                            <p className="text-sm text-blue-600 mt-1">
                              {new Date(currentBooking.dateTime).toLocaleString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(bookingStatus)}`}>
                            {bookingStatus.charAt(0).toUpperCase() + bookingStatus.slice(1)}
                          </span>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Capacity:</span>
                            <span className="font-medium ml-1">{currentBooking.capacity}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Type:</span>
                            <span className="font-medium ml-1">{currentBooking.meetingType}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-700 mb-3">Approval Process</h4>
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-600 font-bold">GD</span>
                              </div>
                            </div>
                            <div className="ml-3">
                              <div className="font-medium text-gray-900">Group Director</div>
                              <div className={`mt-1 text-sm px-2 py-1 rounded inline-block ${getStatusClass(gdApprovalStatus)}`}>
                                {gdApprovalStatus.charAt(0).toUpperCase() + gdApprovalStatus.slice(1)}
                              </div>
                              <p className="mt-1 text-sm text-gray-600">{approvalNotes.gd}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <span className="text-purple-600 font-bold">DS</span>
                              </div>
                            </div>
                            <div className="ml-3">
                              <div className="font-medium text-gray-900">Director Secretary</div>
                              <div className={`mt-1 text-sm px-2 py-1 rounded inline-block ${getStatusClass(dsApprovalStatus)}`}>
                                {dsApprovalStatus.charAt(0).toUpperCase() + dsApprovalStatus.slice(1)}
                              </div>
                              <p className="mt-1 text-sm text-gray-600">{approvalNotes.ds}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-green-600 font-bold">A</span>
                              </div>
                            </div>
                            <div className="ml-3">
                              <div className="font-medium text-gray-900">Administration</div>
                              <div className={`mt-1 text-sm px-2 py-1 rounded inline-block ${getStatusClass(adminApprovalStatus)}`}>
                                {adminApprovalStatus.charAt(0).toUpperCase() + adminApprovalStatus.slice(1)}
                              </div>
                              <p className="mt-1 text-sm text-gray-600">{approvalNotes.admin}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={handleCancelClick}
                        className="w-full py-3 bg-red-50 text-red-700 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Cancel Booking
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Booking</h3>
                      <p className="text-gray-500">Submit a booking request to track its status here.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-blue-600">12</div>
            <div className="text-gray-500 text-sm mt-1">Rooms Available</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-purple-600">86%</div>
            <div className="text-gray-500 text-sm mt-1">Utilization Rate</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-green-600">24</div>
            <div className="text-gray-500 text-sm mt-1">Bookings Today</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-yellow-600">3</div>
            <div className="text-gray-500 text-sm mt-1">Pending Approval</div>
          </div>
        </div>
      </div>

      {/* Custom Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 animate-scaleIn">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Confirm Cancellation</h4>
              <p className="text-gray-600 mb-6">Are you sure you want to cancel your current booking? This action cannot be undone.</p>
              
              <div className="flex justify-center gap-3">
                <button 
                  onClick={handleCancelAction}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  No, Keep Booking
                </button>
                <button 
                  onClick={handleConfirmAction}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}