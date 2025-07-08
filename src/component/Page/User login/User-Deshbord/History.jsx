import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const History = () => {
  const [bookingHistory, setBookingHistory] = useState([
    {
      id: 1,
      date: "2025-06-15",
      time: "10:00 AM",
      type: "Virtual",
      venue: "Conference Room A",
      status: "Upcoming",
      description: "Quarterly strategy meeting with remote team members"
    },
    {
      id: 2,
      date: "2025-06-20",
      time: "2:00 PM",
      type: "Physical",
      venue: "Main Auditorium",
      status: "Completed",
      description: "Annual company-wide conference with keynote speakers"
    },
    {
      id: 3,
      date: "2025-06-28",
      time: "11:00 AM",
      type: "Physical",
      venue: "Seminar Hall",
      status: "Upcoming",
      description: "Product launch event for new software platform"
    },
    {
      id: 4,
      date: "2025-05-10",
      time: "9:30 AM",
      type: "Virtual",
      venue: "Zoom Meeting",
      status: "Completed",
      description: "Client onboarding session for new account"
    },
    {
      id: 5,
      date: "2025-07-05",
      time: "3:00 PM",
      type: "Physical",
      venue: "Training Room B",
      status: "Cancelled",
      description: "Team building workshop (rescheduled)"
    }
  ]);

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Load from localStorage on component mount
  useEffect(() => {
    const savedBookings = localStorage.getItem("bookingHistory");
    if (savedBookings) {
      setBookingHistory(JSON.parse(savedBookings));
    }
  }, []);

  // Save to localStorage when bookings change
  useEffect(() => {
    localStorage.setItem("bookingHistory", JSON.stringify(bookingHistory));
  }, [bookingHistory]);

  const filteredBookings = bookingHistory.filter(booking => {
    const matchesFilter = filter === "all" || booking.status.toLowerCase() === filter;
    const matchesSearch = booking.venue.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         booking.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const cancelBooking = (id) => {
    setBookingHistory(prev => 
      prev.map(booking => 
        booking.id === id ? { ...booking, status: "Cancelled" } : booking
      )
    );
  };

  const closeDetails = () => {
    setSelectedBooking(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-[90%] max-w-[1800px] mx-auto py-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Search and Filters */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search bookings by venue, type or description..."
                  className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute left-4 top-3.5 h-6 w-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    filter === "all" ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("upcoming")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    filter === "upcoming" ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setFilter("completed")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    filter === "completed" ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Completed
                </button>
                <button
                  onClick={() => setFilter("cancelled")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    filter === "cancelled" ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Cancelled
                </button>
              </div>
            </div>
          </div>

          {/* Bookings List */}
          <div className="divide-y divide-gray-200">
            {filteredBookings.length === 0 ? (
              <div className="p-12 text-center">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-xl font-medium text-gray-900">No bookings found</h3>
                <p className="mt-2 text-gray-500 max-w-md mx-auto">
                  {searchTerm 
                    ? "No matching bookings found. Try different keywords." 
                    : "You don't have any bookings yet."}
                </p>
              </div>
            ) : (
              filteredBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 h-12 w-12 rounded-lg flex items-center justify-center ${
                          booking.status === "Upcoming" ? "bg-blue-100 text-blue-800" :
                          booking.status === "Completed" ? "bg-green-100 text-green-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {booking.type === "Virtual" ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            )}
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">{booking.venue}</h3>
                          <p className="text-gray-600 mt-1 truncate">{booking.description}</p>
                          <div className="flex flex-wrap items-center mt-2 text-sm text-gray-500 gap-x-4 gap-y-2">
                            <span className="flex items-center">
                              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {booking.date}
                            </span>
                            <span className="flex items-center">
                              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {booking.time}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              booking.status === "Upcoming" ? "bg-blue-100 text-blue-800" :
                              booking.status === "Completed" ? "bg-green-100 text-green-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button 
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(booking);
                        }}
                      >
                        Details
                      </button>
                      {booking.status === "Upcoming" && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            cancelBooking(booking.id);
                          }}
                          className="px-4 py-2 bg-red-600 rounded-lg text-sm font-medium text-white hover:bg-red-700 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedBooking.venue}</h2>
                  <p className="text-gray-600 mt-1">{selectedBooking.description}</p>
                </div>
                <button 
                  onClick={closeDetails}
                  className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">Booking Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{selectedBooking.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{selectedBooking.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{selectedBooking.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedBooking.status === "Upcoming" ? "bg-blue-100 text-blue-800" :
                        selectedBooking.status === "Completed" ? "bg-green-100 text-green-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {selectedBooking.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">Additional Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600 block mb-1">Venue Address:</span>
                      <span className="font-medium">
                        {selectedBooking.type === "Virtual" 
                          ? "Online meeting link will be shared via email"
                          : "123 Conference Center, Main Street, City"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 block mb-1">Participants:</span>
                      <span className="font-medium">Up to {selectedBooking.type === "Virtual" ? "100" : "50"} people</span>
                    </div>
                    <div>
                      <span className="text-gray-600 block mb-1">Equipment:</span>
                      <span className="font-medium">
                        {selectedBooking.type === "Virtual" 
                          ? "Video conferencing setup"
                          : "Projector, microphone, whiteboard"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Important Notes</h3>
                <ul className="list-disc list-inside text-blue-700 space-y-1">
                  <li>Please arrive 15 minutes before your scheduled time</li>
                  {selectedBooking.type === "Virtual" ? (
                    <li>Test your audio and video setup before joining</li>
                  ) : (
                    <li>Bring any necessary materials with you</li>
                  )}
                  <li>Cancellations must be made at least 24 hours in advance</li>
                </ul>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button 
                  onClick={closeDetails}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
                {selectedBooking.status === "Upcoming" && (
                  <button 
                    onClick={() => {
                      cancelBooking(selectedBooking.id);
                      closeDetails();
                    }}
                    className="px-4 py-2 bg-red-600 rounded-lg text-sm font-medium text-white hover:bg-red-700 transition-colors"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default History;