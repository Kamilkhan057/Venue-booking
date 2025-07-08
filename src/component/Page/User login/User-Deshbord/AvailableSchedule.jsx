import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const STATUS = {
  NONE: "none",
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected"
};

const APPROVAL_STAGES = {
  GD: "gdStatus",
  DS: "dsStatus",
  ADMIN: "adminStatus"
};

const StatusAvailability = () => {
  const navigate = useNavigate();

  // Initial booking state
  const initialBookingState = {
    booked: false,
    status: STATUS.NONE,
    approvalStatuses: {
      [APPROVAL_STAGES.GD]: "N/A",
      [APPROVAL_STAGES.DS]: "N/A",
      [APPROVAL_STAGES.ADMIN]: "N/A"
    },
    venueName: null,
    additionalInfo: {
      gdNotes: "",
      dsNotes: "",
      adminMessage: ""
    },
    rejectionReason: null,
    bookingDetails: null,
    timestamp: null,
    bookingId: null
  };

  const [booking, setBooking] = useState(() => {
    const savedBooking = localStorage.getItem("currentBooking");
    return savedBooking ? JSON.parse(savedBooking) : initialBookingState;
  });

  const [bookingHistory, setBookingHistory] = useState(() => {
    const saved = localStorage.getItem("bookingHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const [bookingMessage, setBookingMessage] = useState({ text: "", type: "" });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("venues"); // New tab state
  const [searchQuery, setSearchQuery] = useState(""); // New search functionality

  // Enhanced venue data with images and more details
  const [availableVenues] = useState([
    { 
      id: 1,
      name: "Grand Auditorium", 
      capacity: 200, 
      equipment: ["4K Projector", "Dolby Sound", "WiFi", "Microphones"],
      restrictions: ["No food/drinks", "Max 4 hours"],
      image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1075&q=80",
      location: "Main Building, Floor 3",
      features: ["Wheelchair Access", "Air Conditioned", "Recording Booth"],
      rating: 4.8,
      reviews: 124
    },
    { 
      id: 2,
      name: "Executive Boardroom", 
      capacity: 20, 
      equipment: ["85\" 4K TV", "Digital Whiteboard", "Video Conferencing"],
      restrictions: ["Executive team priority"],
      image: "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      location: "Executive Wing, Floor 5",
      features: ["Soundproof", "Smart Glass", "Coffee Station"],
      rating: 4.9,
      reviews: 87
    },
    { 
      id: 3,
      name: "Innovation Lab", 
      capacity: 30, 
      equipment: ["Interactive Displays", "VR Setup", "3D Printer"],
      restrictions: ["Tech teams priority", "No children"],
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
      location: "R&D Building, Floor 2",
      features: ["Prototyping Tools", "High-Speed Network", "Flexible Layout"],
      rating: 4.7,
      reviews: 56
    },
    { 
      id: 4,
      name: "Sky Lounge", 
      capacity: 15, 
      equipment: ["Sound System", "Mini Fridge"],
      restrictions: ["After-hours only"],
      image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      location: "Roof Terrace",
      features: ["Outdoor Space", "City Views", "Relaxation Area"],
      rating: 4.6,
      reviews: 92
    }
  ]);

  // New meeting rooms data
  const [meetingRooms] = useState([
    {
      id: 101,
      name: "Collaboration Hub",
      capacity: 12,
      image: "https://images.unsplash.com/photo-1564069114553-7215e1ff1890?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1132&q=80",
      features: ["Flexible Seating", "Whiteboard Walls", "Video Conferencing"]
    },
    {
      id: 102,
      name: "Focus Room",
      capacity: 6,
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      features: ["Soundproof", "Monitor", "Task Lighting"]
    }
  ]);

  // Filter venues based on search query
  const filteredVenues = availableVenues.filter(venue =>
    venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    venue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    venue.equipment.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Display booking message with type
  const showMessage = useCallback((text, type = "info") => {
    setBookingMessage({ text, type });
    setTimeout(() => setBookingMessage({ text: "", type: "" }), 5000);
  }, []);

  // Generate unique booking ID
  const generateBookingId = useCallback(() => {
    return `BK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }, []);

  // Save booking to history
  const saveToHistory = useCallback((bookingData) => {
    if (!bookingData.bookingId) return;

    const newHistoryEntry = {
      id: bookingData.bookingId,
      date: new Date(bookingData.timestamp).toLocaleDateString(),
      time: new Date(bookingData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      venue: bookingData.venueName,
      status: bookingData.status,
      details: bookingData.bookingDetails
    };

    setBookingHistory(prev => {
      const updatedHistory = [newHistoryEntry, ...prev.slice(0, 4)]; // Keep only 5 most recent
      localStorage.setItem("bookingHistory", JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  }, []);

  // Simulate approval process
  useEffect(() => {
    let timeouts = [];
    
    localStorage.setItem("currentBooking", JSON.stringify(booking));

    if (booking.booked && booking.status === STATUS.PENDING) {
      timeouts.push(setTimeout(() => {
        setBooking(prev => ({
          ...prev,
          approvalStatuses: {
            ...prev.approvalStatuses,
            [APPROVAL_STAGES.GD]: STATUS.APPROVED
          },
          additionalInfo: {
            ...prev.additionalInfo,
            gdNotes: "GD: Venue availability confirmed."
          }
        }));
      }, 2000));

      timeouts.push(setTimeout(() => {
        setBooking(prev => ({
          ...prev,
          approvalStatuses: {
            ...prev.approvalStatuses,
            [APPROVAL_STAGES.DS]: STATUS.APPROVED
          },
          additionalInfo: {
            ...prev.additionalInfo,
            dsNotes: "DS: Resources allocated."
          }
        }));
      }, 4000));
    }

    if (booking.approvalStatuses[APPROVAL_STAGES.GD] === STATUS.APPROVED && 
        booking.approvalStatuses[APPROVAL_STAGES.DS] === STATUS.APPROVED && 
        booking.approvalStatuses[APPROVAL_STAGES.ADMIN] === "N/A") {
      timeouts.push(setTimeout(() => {
        const updatedBooking = {
          ...booking,
          approvalStatuses: {
            ...booking.approvalStatuses,
            [APPROVAL_STAGES.ADMIN]: STATUS.APPROVED
          },
          status: STATUS.APPROVED,
          additionalInfo: {
            ...booking.additionalInfo,
            adminMessage: `Admin: Booking for ${booking.venueName} confirmed!`
          }
        };
        
        setBooking(updatedBooking);
        saveToHistory(updatedBooking);
        showMessage(`🎉 Your booking for ${booking.venueName} is confirmed!`, "success");
      }, 2000));
    }

    return () => timeouts.forEach(clearTimeout);
  }, [booking, showMessage, saveToHistory]);

  const handleBookVenue = (venueId, venueType = "venue") => {
    if (booking.booked) {
      showMessage("You already have an active booking", "warning");
      return;
    }

    const venue = (venueType === "venue" ? availableVenues : meetingRooms).find(v => v.id === venueId);
    if (!venue) {
      showMessage("Selected space not found", "error");
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      const newBooking = {
        booked: true,
        status: STATUS.PENDING,
        approvalStatuses: {
          [APPROVAL_STAGES.GD]: STATUS.PENDING,
          [APPROVAL_STAGES.DS]: STATUS.PENDING,
          [APPROVAL_STAGES.ADMIN]: "N/A"
        },
        venueName: venue.name,
        additionalInfo: {
          gdNotes: "Awaiting Group Director's review.",
          dsNotes: "Awaiting Director Secretary's review.",
          adminMessage: "Awaiting final confirmation."
        },
        rejectionReason: null,
        bookingDetails: {
          type: venueType === "venue" ? "Event" : "Meeting",
          dateTime: new Date().toISOString(),
          purpose: `Team ${venueType === "venue" ? "event" : "meeting"} in ${venue.name}`,
          attendees: Math.min(10, venue.capacity),
          resources: venue.equipment?.join(", ") || "Standard setup",
          specialRequests: ""
        },
        timestamp: new Date().toISOString(),
        bookingId: generateBookingId()
      };
      
      setBooking(newBooking);
      showMessage(`⏳ Your booking request for ${venue.name} has been submitted`, "info");
      setIsLoading(false);
    }, 1000);
  };

  const cancelBooking = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setBooking(initialBookingState);
      showMessage("Booking cancelled successfully", "success");
      setIsLoading(false);
    }, 800);
  }, [showMessage]);

  const handleModalAction = useCallback((action) => {
    if (action === 'cancel') {
      cancelBooking();
    }
    setShowConfirmModal(false);
    setModalAction(null);
  }, [cancelBooking]);

  const getStatusClass = (status) => {
    const baseClasses = "p-6 rounded-xl border transition-all duration-300 shadow-sm";
    const statusClasses = {
      [STATUS.APPROVED]: "bg-emerald-50/80 text-emerald-800 border-emerald-200",
      [STATUS.REJECTED]: "bg-rose-50/80 text-rose-800 border-rose-200",
      [STATUS.PENDING]: "bg-amber-50/80 text-amber-800 border-amber-200",
      [STATUS.NONE]: "bg-slate-50/80 text-slate-800 border-slate-200"
    };
    return `${baseClasses} ${statusClasses[status] || ""}`;
  };

  const viewHistory = () => {
    navigate("/history");
  };

  const renderBookingStatus = () => {
    if (!booking.booked) {
      return (
        <div className={getStatusClass(STATUS.NONE)}>
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-slate-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-2xl font-bold">No Active Booking</h4>
          </div>
          <p className="text-slate-600 mb-4">You currently don't have any active bookings.</p>
          <p className="text-slate-500">Browse our spaces below to make a new booking.</p>
        </div>
      );
    }

    return (
      <div className={getStatusClass(booking.status)}>
        {booking.status === STATUS.APPROVED && (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold">Booking Confirmed</h4>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-emerald-100 mb-6">
              <h5 className="font-bold text-lg text-emerald-700 mb-2">{booking.venueName}</h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Booking ID</p>
                  <p className="font-mono font-medium">{booking.bookingId}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Date</p>
                  <p>{new Date(booking.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h5 className="font-bold text-slate-700 mb-3">Approval Status</h5>
              <div className="space-y-3">
                {Object.entries(booking.approvalStatuses).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-slate-600">{key.replace("Status", "")}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      value === STATUS.APPROVED ? "bg-emerald-100 text-emerald-800" :
                      value === STATUS.PENDING ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-800"
                    }`}>
                      {value === STATUS.APPROVED ? "Approved" : 
                       value === STATUS.PENDING ? "Pending" : "N/A"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h5 className="font-bold text-slate-700 mb-3">Booking Details</h5>
              <div className="bg-white p-4 rounded-lg border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Type</p>
                    <p>{booking.bookingDetails?.type || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Time</p>
                    <p>{new Date(booking.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Attendees</p>
                    <p>{booking.bookingDetails?.attendees || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Resources</p>
                    <p>{booking.bookingDetails?.resources || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setModalAction('cancel') || setShowConfirmModal(true)}
              className="mt-6 w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Cancel Booking
                </>
              )}
            </button>
          </>
        )}

        {booking.status === STATUS.REJECTED && (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-rose-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold">Booking Rejected</h4>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-rose-100 mb-6">
              <h5 className="font-bold text-lg text-rose-700 mb-2">{booking.venueName}</h5>
              <div>
                <p className="text-sm text-slate-500 mb-1">Reason</p>
                <p className="font-medium">{booking.rejectionReason || "No reason provided"}</p>
              </div>
            </div>

            <p className="mb-6 text-slate-600">Please update your booking details and try again.</p>

            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => setBooking(initialBookingState)}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Booking
              </button>
              <button
                onClick={() => setModalAction('cancel') || setShowConfirmModal(true)}
                className="flex-1 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Cancel
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {booking.status === STATUS.PENDING && (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold">Approval Pending</h4>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-amber-100 mb-6">
              <h5 className="font-bold text-lg text-amber-700 mb-2">{booking.venueName}</h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Booking ID</p>
                  <p className="font-mono font-medium">{booking.bookingId}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Submitted</p>
                  <p>{new Date(booking.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h5 className="font-bold text-slate-700 mb-3">Approval Progress</h5>
              <div className="space-y-3">
                {Object.entries(booking.approvalStatuses).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-slate-600">{key.replace("Status", "")}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      value === STATUS.APPROVED ? "bg-emerald-100 text-emerald-800" :
                      value === STATUS.PENDING ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-800"
                    }`}>
                      {value === STATUS.APPROVED ? "Approved" : 
                       value === STATUS.PENDING ? "Pending" : "N/A"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-blue-700">Your booking is currently being reviewed. We will notify you once all approvals are complete.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setModalAction('cancel') || setShowConfirmModal(true)}
              className="mt-6 w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Cancel Booking
                </>
              )}
            </button>
          </>
        )}
      </div>
    );
  };

  const renderVenueCards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVenues.map((venue) => (
          <div key={venue.id} className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={venue.image} 
                alt={venue.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4">
                <h4 className="text-xl font-bold text-white">{venue.name}</h4>
                <p className="text-white/90">{venue.capacity} people • {venue.location}</p>
              </div>
              <div className="absolute top-3 right-3 bg-white/90 text-slate-800 px-2 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                </svg>
                {venue.rating} ({venue.reviews})
              </div>
            </div>
            
            <div className="p-5">
              <div className="mb-4">
                <h5 className="text-sm font-semibold text-slate-500 mb-2">EQUIPMENT</h5>
                <div className="flex flex-wrap gap-2">
                  {venue.equipment.map((item) => (
                    <span key={item} className="bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <h5 className="text-sm font-semibold text-slate-500 mb-2">FEATURES</h5>
                <div className="flex flex-wrap gap-2">
                  {venue.features.map((feature) => (
                    <span key={feature} className="bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full">
                      ✓ {feature}
                    </span>
                  ))}
                </div>
              </div>
              
              {venue.restrictions.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-slate-500 mb-2">NOTES</h5>
                  <div className="flex flex-wrap gap-2">
                    {venue.restrictions.map((restriction) => (
                      <span key={restriction} className="bg-rose-50 text-rose-700 text-xs font-medium px-3 py-1 rounded-full">
                        ⚠ {restriction}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <button
                onClick={() => handleBookVenue(venue.id, "venue")}
                disabled={booking.booked || isLoading}
                className={`mt-4 w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                  booking.booked || isLoading 
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'
                } flex items-center justify-center gap-2`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : booking.booked ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Booking in Progress
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Book This Venue
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMeetingRooms = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {meetingRooms.map((room) => (
          <div key={room.id} className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={room.image} 
                alt={room.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4">
                <h4 className="text-xl font-bold text-white">{room.name}</h4>
                <p className="text-white/90">Capacity: {room.capacity} people</p>
              </div>
            </div>
            
            <div className="p-5">
              <div className="mb-4">
                <h5 className="text-sm font-semibold text-slate-500 mb-2">FEATURES</h5>
                <div className="flex flex-wrap gap-2">
                  {room.features.map((feature) => (
                    <span key={feature} className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                      ✓ {feature}
                    </span>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => handleBookVenue(room.id, "meeting")}
                disabled={booking.booked || isLoading}
                className={`mt-4 w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                  booking.booked || isLoading 
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'
                } flex items-center justify-center gap-2`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : booking.booked ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Booking in Progress
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Reserve This Room
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderRecentBookings = () => {
    if (bookingHistory.length === 0) return null;
    
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recent Bookings
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Venue</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {bookingHistory.map((booking, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{booking.venue}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{booking.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{booking.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      booking.status === STATUS.APPROVED ? "bg-emerald-100 text-emerald-800" :
                      booking.status === STATUS.REJECTED ? "bg-rose-100 text-rose-800" :
                      "bg-amber-100 text-amber-800"
                    }`}>
                      {booking.status === STATUS.APPROVED ? "Approved" : 
                       booking.status === STATUS.REJECTED ? "Rejected" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-4 md:p-8">
      {/* Main Card */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-white/30 relative">
        {/* Header */}
        <div className="p-6 md:p-8 text-center relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 flex items-center justify-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Venue Booking System
          </h1>
          <button 
            onClick={viewHistory}
            className="absolute top-6 right-6 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-medium py-2 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            View Full History
          </button>
        </div>

        {/* Booking Message */}
        {bookingMessage.text && (
          <div className={`p-4 rounded-lg mx-6 mt-4 text-center font-medium border ${
            bookingMessage.type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
            bookingMessage.type === "error" ? "bg-rose-50 text-rose-800 border-rose-200" :
            bookingMessage.type === "warning" ? "bg-amber-50 text-amber-800 border-amber-200" :
            "bg-blue-50 text-blue-800 border-blue-200"
          } animate-fadeIn`}>
            {bookingMessage.text}
          </div>
        )}

        {/* Booking Status Section */}
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Booking Status
          </h2>
          {renderBookingStatus()}
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 md:px-8 border-b border-slate-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("venues")}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === "venues" 
                  ? "border-indigo-500 text-indigo-600" 
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Event Venues
            </button>
            <button
              onClick={() => setActiveTab("meeting")}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === "meeting" 
                  ? "border-indigo-500 text-indigo-600" 
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Meeting Rooms
            </button>
          </nav>
        </div>

        {/* Search and Filter Section */}
        <div className="p-6 md:p-8 bg-slate-50 border-b border-slate-200">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8 bg-slate-50">
          {activeTab === "venues" ? renderVenueCards() : renderMeetingRooms()}
        </div>

        {/* Recent Bookings Section */}
        <div className="p-6 md:p-8">
          {renderRecentBookings()}
        </div>

        {/* Help Section */}
        <div className="p-6 md:p-8 bg-indigo-50 border-t border-indigo-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Need Help?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Contact Support
              </h3>
              <p className="text-slate-600 mb-4">Having trouble with your booking? Our team is here to help.</p>
              <button className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                Get in touch →
              </button>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Booking Policies
              </h3>
              <p className="text-slate-600 mb-4">Learn about our cancellation policy, fees, and other important information.</p>
              <button className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                View policies →
              </button>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                FAQs
              </h3>
              <p className="text-slate-600 mb-4">Find answers to common questions about venue bookings and reservations.</p>
              <button className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                Browse FAQs →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4 shadow-2xl animate-popIn">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-rose-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-slate-800">Confirm Cancellation</h4>
            </div>
            <p className="text-slate-600 mb-6">Are you sure you want to cancel your current booking? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowConfirmModal(false)}
                disabled={isLoading}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium py-2 px-5 rounded-lg transition duration-200 shadow hover:shadow-md"
              >
                No, Keep Booking
              </button>
              <button 
                onClick={() => handleModalAction(modalAction)}
                disabled={isLoading}
                className={`bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-medium py-2 px-5 rounded-lg transition duration-200 shadow hover:shadow-md flex items-center gap-2 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Yes, Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusAvailability;