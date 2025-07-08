import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Constants for better maintainability
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

  // Initial booking state with comprehensive structure
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

  // Memoized venue data
  const [availableVenues] = useState([
    { 
      id: 1,
      name: "Main Auditorium", 
      capacity: 150, 
      equipment: ["Projector", "PA System", "WiFi"],
      restrictions: ["No food/drinks", "Max 3 hours"]
    },
    { 
      id: 2,
      name: "Conference Room A", 
      capacity: 30, 
      equipment: ["TV", "Whiteboard"],
      restrictions: []
    },
    { 
      id: 3,
      name: "Training Room", 
      capacity: 25, 
      equipment: ["Projector", "Whiteboard"],
      restrictions: ["Priority for training sessions"]
    },
    { 
      id: 4,
      name: "Meeting Pod 1", 
      capacity: 8, 
      equipment: [],
      restrictions: ["Max 1 hour"]
    }
  ]);

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
      date: new Date(bookingData.timestamp).toISOString().split('T')[0],
      time: new Date(bookingData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: bookingData.bookingDetails?.meetingType || "Physical",
      venue: bookingData.venueName,
      status: bookingData.status,
      rejectionReason: bookingData.rejectionReason
    };

    setBookingHistory(prev => {
      const updatedHistory = [newHistoryEntry, ...prev];
      localStorage.setItem("bookingHistory", JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  }, []);

  // Simulate approval process
  useEffect(() => {
    let timeouts = [];
    
    // Save current booking to localStorage whenever it changes
    localStorage.setItem("currentBooking", JSON.stringify(booking));

    if (booking.booked && booking.status === STATUS.PENDING) {
      // GD approval
      timeouts.push(setTimeout(() => {
        setBooking(prev => ({
          ...prev,
          approvalStatuses: {
            ...prev.approvalStatuses,
            [APPROVAL_STAGES.GD]: STATUS.APPROVED
          },
          additionalInfo: {
            ...prev.additionalInfo,
            gdNotes: "GD: Equipment setup confirmed."
          }
        }));
      }, 2000));

      // DS approval
      timeouts.push(setTimeout(() => {
        setBooking(prev => ({
          ...prev,
          approvalStatuses: {
            ...prev.approvalStatuses,
            [APPROVAL_STAGES.DS]: STATUS.APPROVED
          },
          additionalInfo: {
            ...prev.additionalInfo,
            dsNotes: "DS: Meeting agenda distributed."
          }
        }));
      }, 4000));
    }

    // Admin approval when GD and DS are approved
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
            adminMessage: `Admin: All set for ${booking.venueName}!`
          }
        };
        
        setBooking(updatedBooking);
        saveToHistory(updatedBooking);
        showMessage(`🎉 Your booking for ${booking.venueName} is now fully Approved!`, "success");
      }, 2000));
    }

    return () => timeouts.forEach(clearTimeout);
  }, [booking, showMessage, saveToHistory]);

  const handleBookVenue = (venueId) => {
    if (booking.booked) {
      showMessage("⚠️ You already have an active booking. Only one booking is allowed.", "warning");
      return;
    }

    const venue = availableVenues.find(v => v.id === venueId);
    if (!venue) {
      showMessage("Selected venue not found", "error");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
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
          adminMessage: "Awaiting final Admin confirmation."
        },
        rejectionReason: null,
        bookingDetails: {
          meetingType: "Physical",
          dateTime: new Date().toISOString(),
          purpose: `Team meeting in ${venue.name}`,
          capacity: Math.min(10, venue.capacity),
          resources: "Projector, Whiteboard",
          restrictions: venue.restrictions.join(", ") || "None"
        },
        timestamp: new Date().toISOString(),
        bookingId: generateBookingId()
      };
      
      setBooking(newBooking);
      showMessage(`⏳ Your booking for ${venue.name} has been submitted for approval.`, "info");
      setIsLoading(false);
    }, 1000);
  };

  const cancelBooking = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setBooking(initialBookingState);
      showMessage("Your booking has been successfully cancelled.", "success");
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
    const baseClasses = "p-6 rounded-lg border transition-all duration-300";
    const statusClasses = {
      [STATUS.APPROVED]: "bg-green-50 text-green-800 border-green-200",
      [STATUS.REJECTED]: "bg-red-50 text-red-800 border-red-200",
      [STATUS.PENDING]: "bg-yellow-50 text-yellow-800 border-yellow-200",
      [STATUS.NONE]: "bg-gray-50 text-gray-800 border-gray-200"
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
          <h4 className="text-xl font-semibold mb-2">ℹ️ No Active Booking</h4>
          <p className="mb-2">You currently don't have any venue bookings in progress.</p>
          <p>Explore available venues below to make a new booking.</p>
        </div>
      );
    }

    return (
      <div className={getStatusClass(booking.status)}>
        {booking.status === STATUS.APPROVED && (
          <>
            <h4 className="text-xl font-semibold mb-4">✅ Meeting Confirmed for {booking.venueName}</h4>
            <div className="mb-4">
              <p className="font-medium">Booking ID: <span className="font-mono">{booking.bookingId}</span></p>
              <p className="text-sm text-gray-600">Created: {new Date(booking.timestamp).toLocaleString()}</p>
            </div>
            <p className="mb-2">Approved by:</p>
            <ul className="space-y-1 mb-4">
              {Object.entries(booking.approvalStatuses).map(([key, value]) => (
                <li key={key}>
                  {key.replace("Status", "")}: <strong>
                    {value === STATUS.APPROVED ? "Approved ✅" : 
                     value === STATUS.PENDING ? "Pending ⏳" : "N/A"}
                  </strong>
                </li>
              ))}
            </ul>
            <p className="mt-4 font-semibold">Additional Notes:</p>
            <ul className="space-y-1 mb-4">
              <li>Group Director: {booking.additionalInfo.gdNotes || 'N/A'}</li>
              <li>Director Secretary: {booking.additionalInfo.dsNotes || 'N/A'}</li>
              <li>Admin: {booking.additionalInfo.adminMessage || 'N/A'}</li>
            </ul>
            {renderBookingDetails()}
            <button
              onClick={() => setModalAction('cancel') || setShowConfirmModal(true)}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out transform hover:-translate-y-1 shadow-md hover:shadow-lg disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Cancel Booking"}
            </button>
          </>
        )}

        {booking.status === STATUS.REJECTED && (
          <>
            <h4 className="text-xl font-semibold mb-4">❌ Booking Rejected for {booking.venueName}</h4>
            <p className="mb-2">Reason: <strong>{booking.rejectionReason || "No reason provided"}</strong></p>
            <p className="mb-4">👉 Please update your booking and try again.</p>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setBooking(initialBookingState)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out transform hover:-translate-y-1 shadow-md hover:shadow-lg disabled:opacity-50"
                disabled={isLoading}
              >
                Make New Booking
              </button>
              <button
                onClick={() => setModalAction('cancel') || setShowConfirmModal(true)}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out transform hover:-translate-y-1 shadow-md hover:shadow-lg disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Cancel Booking"}
              </button>
            </div>
          </>
        )}

        {booking.status === STATUS.PENDING && (
          <>
            <h4 className="text-xl font-semibold mb-4">⏳ Approval in Progress for {booking.venueName}</h4>
            <div className="mb-4">
              <p className="font-medium">Booking ID: <span className="font-mono">{booking.bookingId}</span></p>
              <p className="text-sm text-gray-600">Submitted: {new Date(booking.timestamp).toLocaleString()}</p>
            </div>
            <p className="mb-2">Waiting for approvals from:</p>
            <ul className="space-y-1 mb-4">
              {Object.entries(booking.approvalStatuses).map(([key, value]) => (
                <li key={key}>
                  {key.replace("Status", "")}: <strong>
                    {value === STATUS.APPROVED ? "Approved ✅" : 
                     value === STATUS.PENDING ? "Pending ⏳" : "N/A"}
                  </strong>
                </li>
              ))}
            </ul>
            <p className="mt-4 mb-4">
              Your booking is currently being reviewed. We will notify you once all approvals are complete.
            </p>
            {renderBookingDetails()}
            <button
              onClick={() => setModalAction('cancel') || setShowConfirmModal(true)}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out transform hover:-translate-y-1 shadow-md hover:shadow-lg disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Cancel Booking"}
            </button>
          </>
        )}
      </div>
    );
  };

  const renderBookingDetails = () => {
    if (!booking.bookingDetails) return null;
    
    return (
      <>
        <p className="mt-4 font-bold">Booking Details:</p>
        <ul className="list-disc pl-5 space-y-1 mb-4">
          <li>Type: {booking.bookingDetails.meetingType}</li>
          <li>Date/Time: {new Date(booking.bookingDetails.dateTime).toLocaleString()}</li>
          <li>Purpose: {booking.bookingDetails.purpose}</li>
          <li>Capacity: {booking.bookingDetails.capacity}</li>
          <li>Resources: {booking.bookingDetails.resources}</li>
          <li>Restrictions: {booking.bookingDetails.restrictions}</li>
        </ul>
      </>
    );
  };

  const renderVenueCards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {availableVenues.map((venue) => (
          <div key={venue.id} className="bg-white p-5 rounded-lg border border-indigo-100 shadow-sm hover:shadow-md transition-all duration-300">
            <h4 className="text-xl font-bold text-indigo-700 mb-2">{venue.name}</h4>
            <p className="mb-3">
              <strong className="text-gray-700">Capacity:</strong> {venue.capacity} people
            </p>
            <div className="mb-3">
              <strong className="text-gray-700">Equipment:</strong>
              <ul className="mt-1 space-y-1">
                {venue.equipment.length > 0 ? (
                  venue.equipment.map((item) => (
                    <li key={item} className="text-indigo-600 flex items-center gap-1">
                      <span>✓</span> {item}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">• No specific equipment</li>
                )}
              </ul>
            </div>
            {venue.restrictions.length > 0 && (
              <div className="mb-3">
                <strong className="text-gray-700">Restrictions:</strong>
                <ul className="mt-1 space-y-1">
                  {venue.restrictions.map((restriction) => (
                    <li key={restriction} className="text-red-500 flex items-center gap-1">
                      <span>⚠</span> {restriction}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button
              onClick={() => handleBookVenue(venue.id)}
              disabled={booking.booked || isLoading}
              className={`mt-4 w-full py-2 px-4 rounded-lg font-medium transition duration-200 ease-in-out ${
                booking.booked || isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg hover:-translate-y-1'
              }`}
            >
              {isLoading ? "Processing..." : 
               booking.booked ? "Booking in Progress" : "Book This Venue"}
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      {/* Main Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-white/30 relative">
        {/* Header */}
        <div className="p-6 md:p-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 flex items-center justify-center gap-2">
            📊 Current Availability
          </h1>
          <button 
            onClick={viewHistory}
            className="absolute top-6 right-6 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-medium py-2 px-4 rounded-lg transition duration-200 shadow-md"
          >
            View History
          </button>
        </div>

        {/* Booking Message */}
        {bookingMessage.text && (
          <div className={`p-4 rounded-lg mb-6 text-center font-medium border mx-6 ${
            bookingMessage.type === "success" ? "bg-green-50 text-green-800 border-green-200" :
            bookingMessage.type === "error" ? "bg-red-50 text-red-800 border-red-200" :
            bookingMessage.type === "warning" ? "bg-yellow-50 text-yellow-800 border-yellow-200" :
            "bg-blue-50 text-blue-800 border-blue-200"
          }`}>
            {bookingMessage.text}
          </div>
        )}

        {/* Booking Status Section */}
        <div className="bg-indigo-50 p-6 md:p-8 rounded-xl m-6 border border-indigo-100">
          <h2 className="text-2xl font-bold text-indigo-800 mb-6 flex items-center gap-2">
            📅 Booking Status
          </h2>
          {renderBookingStatus()}
        </div>

        {/* Available Venues Section */}
        <div className="bg-indigo-50 p-6 md:p-8 rounded-xl m-6 border border-indigo-100">
          <h2 className="text-2xl font-bold text-indigo-800 mb-6 flex items-center gap-2">
            🏛️ Available Venues
          </h2>
          {renderVenueCards()}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4 shadow-2xl animate-fadeIn">
            <h4 className="text-2xl font-bold text-gray-800 mb-4">Confirm Cancellation</h4>
            <p className="text-gray-600 mb-6">Are you sure you want to cancel your current booking?</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => handleModalAction(modalAction)}
                disabled={isLoading}
                className={`bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Processing..." : "Yes, Cancel"}
              </button>
              <button 
                onClick={() => setShowConfirmModal(false)}
                disabled={isLoading}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
              >
                No, Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusAvailability;