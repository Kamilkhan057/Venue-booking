import React, { useState, useEffect } from "react";
import { 
  FaEdit, 
  FaTrash, 
  FaCheck, 
  FaTimes, 
  FaStickyNote, 
  FaChartBar,
  FaCalendarAlt,
  FaUser,
  FaFilter,
  FaStar,
  FaUsers,
  FaChartLine,
  FaTags,
  FaPaperclip,
  FaThumbsUp,
  FaThumbsDown
} from "react-icons/fa";

const initialRemarks = [
  { 
    id: 1, 
    text: "Meeting went well. Room was clean and prepared.", 
    date: "2025-06-20", 
    status: "resolved",
    venue: "Conference Room A",
    rating: 5,
    category: "positive",
    attachments: 0,
    assignedTo: "Sarah Johnson"
  },
  { 
    id: 2, 
    text: "Projector was not working. Needs maintenance.", 
    date: "2025-06-22", 
    status: "pending",
    venue: "Main Auditorium",
    rating: 2,
    category: "equipment",
    attachments: 2,
    assignedTo: "Michael Chen"
  },
  { 
    id: 3, 
    text: "Excellent service from the staff. Will book again!", 
    date: "2025-06-25", 
    status: "resolved",
    venue: "Seminar Hall",
    rating: 5,
    category: "positive",
    attachments: 0,
    assignedTo: "Admin Team"
  },
  { 
    id: 4, 
    text: "Room temperature was too cold throughout the meeting", 
    date: "2025-06-28", 
    status: "in-progress",
    venue: "Training Room B",
    rating: 3,
    category: "environment",
    attachments: 1,
    assignedTo: "Facilities Team"
  },
  { 
    id: 5, 
    text: "WiFi connectivity issues during the workshop", 
    date: "2025-07-01", 
    status: "pending",
    venue: "Conference Room C",
    rating: 2,
    category: "technology",
    attachments: 0,
    assignedTo: "IT Support"
  },
];

const venues = ["Conference Room A", "Main Auditorium", "Seminar Hall", "Training Room B", "Conference Room C"];
const categories = ["positive", "equipment", "environment", "technology", "staff", "other"];
const teamMembers = ["Admin Team", "Facilities Team", "IT Support", "Sarah Johnson", "Michael Chen", "Emma Rodriguez"];
const statusOptions = ["all", "pending", "in-progress", "resolved"];

const Remarks = () => {
  const [remarks, setRemarks] = useState(initialRemarks);
  const [newRemark, setNewRemark] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [rating, setRating] = useState(0);
  const [activeTab, setActiveTab] = useState("remarks");
  const [showStatistics, setShowStatistics] = useState(true);
  const [trendPeriod, setTrendPeriod] = useState("month");
  const [newCategory, setNewCategory] = useState("");
  const [newAttachment, setNewAttachment] = useState(null);

  // Statistics calculation
  const resolvedCount = remarks.filter(r => r.status === "resolved").length;
  const pendingCount = remarks.filter(r => r.status === "pending").length;
  const inProgressCount = remarks.filter(r => r.status === "in-progress").length;
  const positiveRemarks = remarks.filter(r => r.category === "positive").length;
  
  const averageRating = remarks.length > 0 
    ? (remarks.reduce((sum, remark) => sum + (remark.rating || 0), 0) / remarks.length).toFixed(1) 
    : 0;
  
  const venuePerformance = venues.map(venue => {
    const venueRemarks = remarks.filter(r => r.venue === venue);
    const venueRating = venueRemarks.length > 0 
      ? (venueRemarks.reduce((sum, r) => sum + r.rating, 0) / venueRemarks.length).toFixed(1)
      : 0;
    return { venue, rating: venueRating, count: venueRemarks.length };
  }).sort((a, b) => b.rating - a.rating);

  const categoryDistribution = categories.map(category => {
    const count = remarks.filter(r => r.category === category).length;
    return { category, count };
  }).filter(item => item.count > 0);

  const handleAddRemark = (e) => {
    e.preventDefault();
    if (newRemark.trim() === "") return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newEntry = {
        id: Date.now(),
        text: newRemark,
        date: new Date().toISOString().split("T")[0],
        status: "pending",
        venue: selectedVenue || "General",
        rating: rating,
        category: selectedCategory !== "all" ? selectedCategory : "other",
        attachments: newAttachment ? 1 : 0,
        assignedTo: "Unassigned"
      };

      setRemarks([newEntry, ...remarks]);
      setNewRemark("");
      setSelectedVenue("");
      setRating(0);
      setSelectedCategory("all");
      setNewAttachment(null);
      setIsSubmitting(false);
    }, 500);
  };

  const handleEditRemark = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const handleSaveEdit = (id) => {
    setRemarks(remarks.map(remark => 
      remark.id === id ? { ...remark, text: editText } : remark
    ));
    setEditingId(null);
  };

  const handleDeleteRemark = (id) => {
    setRemarks(remarks.filter(remark => remark.id !== id));
  };

  const handleStatusChange = (id, status) => {
    setRemarks(remarks.map(remark => 
      remark.id === id ? { ...remark, status } : remark
    ));
  };

  const handleAssignTo = (id, assignee) => {
    setRemarks(remarks.map(remark => 
      remark.id === id ? { ...remark, assignedTo: assignee } : remark
    ));
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "resolved":
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center">
          <FaCheck className="mr-1" /> Resolved
        </span>;
      case "pending":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center">
          <FaTimes className="mr-1" /> Pending
        </span>;
      case "in-progress":
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex items-center">
          <FaChartLine className="mr-1" /> In Progress
        </span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Unknown</span>;
    }
  };

  const getCategoryBadge = (category) => {
    switch(category) {
      case "positive":
        return <span className="px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs flex items-center">
          <FaThumbsUp className="mr-1" /> Positive
        </span>;
      case "equipment":
        return <span className="px-2 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs">Equipment</span>;
      case "environment":
        return <span className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs">Environment</span>;
      case "technology":
        return <span className="px-2 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs">Technology</span>;
      case "staff":
        return <span className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs">Staff</span>;
      default:
        return <span className="px-2 py-1 bg-gray-50 text-gray-700 border border-gray-200 rounded-full text-xs">Other</span>;
    }
  };

  const filteredRemarks = remarks.filter(remark => {
    const venueMatch = selectedVenue ? remark.venue === selectedVenue : true;
    const statusMatch = selectedStatus === "all" || remark.status === selectedStatus;
    const categoryMatch = selectedCategory === "all" || remark.category === selectedCategory;
    return venueMatch && statusMatch && categoryMatch;
  });

  const handleAttachmentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAttachment(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header with Tabs */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <FaStickyNote className="text-white text-2xl mr-3" />
            <div>
              <h1 className="text-xl font-bold text-white">Venue Feedback & Remarks</h1>
              <p className="text-blue-100 mt-1">Comprehensive feedback management system</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowStatistics(!showStatistics)}
              className="flex items-center px-3 py-1 bg-blue-500 hover:bg-blue-400 rounded-lg text-white text-sm"
            >
              <FaChartBar className="mr-1" />
              {showStatistics ? "Hide Stats" : "Show Stats"}
            </button>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap border-b border-blue-500">
          {["remarks", "analytics", "categories", "team"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg mr-2 ${
                activeTab === tab 
                  ? "bg-white text-blue-700" 
                  : "text-blue-200 hover:text-white"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Statistics Section */}
      {showStatistics && (
        <div className="bg-blue-50 border-b">
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
              <div className="text-sm text-gray-500 mb-1 flex items-center">
                <FaStickyNote className="mr-1" /> Total Remarks
              </div>
              <div className="text-2xl font-bold text-blue-700">{remarks.length}</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
              <div className="text-sm text-gray-500 mb-1 flex items-center">
                <FaCheck className="mr-1" /> Resolved
              </div>
              <div className="text-2xl font-bold text-green-700">{resolvedCount}</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-yellow-100">
              <div className="text-sm text-gray-500 mb-1 flex items-center">
                <FaChartLine className="mr-1" /> In Progress
              </div>
              <div className="text-2xl font-bold text-yellow-700">{inProgressCount}</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
              <div className="text-sm text-gray-500 mb-1 flex items-center">
                <FaStar className="mr-1" /> Avg. Rating
              </div>
              <div className="flex items-center">
                <div className="text-2xl font-bold text-purple-700 mr-2">{averageRating}</div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={i < averageRating ? "text-yellow-400" : "text-gray-300"} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-6">
        {activeTab === "remarks" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Add Remark Form */}
            <div className="lg:col-span-1 bg-blue-50 p-5 rounded-lg border border-blue-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaStickyNote className="mr-2 text-blue-600" />
                Add New Remark
              </h2>
              
              <form onSubmit={handleAddRemark}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Venue
                  </label>
                  <select
                    value={selectedVenue}
                    onChange={(e) => setSelectedVenue(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Venues</option>
                    {venues.map(venue => (
                      <option key={venue} value={venue}>{venue}</option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Rating
                  </label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-2xl focus:outline-none"
                      >
                        <FaStar className={star <= rating ? "text-yellow-400" : "text-gray-300"} />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">{rating}.0</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Remark
                  </label>
                  <textarea
                    value={newRemark}
                    onChange={(e) => setNewRemark(e.target.value)}
                    placeholder="Describe your experience, report issues, or provide suggestions..."
                    rows={4}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Attachment
                  </label>
                  <div className="flex items-center">
                    <label className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200">
                      <FaPaperclip className="mr-2" />
                      {newAttachment ? newAttachment.name : "Attach File"}
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={handleAttachmentChange}
                      />
                    </label>
                    {newAttachment && (
                      <span className="ml-2 text-sm text-gray-600">{newAttachment.name}</span>
                    )}
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting || newRemark.trim() === ""}
                  className={`w-full py-2 rounded-lg font-medium flex items-center justify-center ${
                    isSubmitting || newRemark.trim() === ""
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Submit Remark"
                  )}
                </button>
              </form>
              
              <div className="mt-8">
                <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                  <FaUser className="mr-2 text-blue-600" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="text-sm p-3 bg-white rounded-lg border">
                    <p className="font-medium">You submitted a remark</p>
                    <p className="text-gray-600">Conference Room A • 2 hours ago</p>
                  </div>
                  <div className="text-sm p-3 bg-white rounded-lg border">
                    <p className="font-medium">Your remark was resolved</p>
                    <p className="text-gray-600">Seminar Hall • Yesterday</p>
                  </div>
                  <div className="text-sm p-3 bg-white rounded-lg border">
                    <p className="font-medium">You rated Main Auditorium</p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < 4 ? "text-yellow-400" : "text-gray-300"} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column - Remarks List */}
            <div className="lg:col-span-2">
              <div className="bg-white border rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2 md:mb-0">
                    All Remarks ({filteredRemarks.length})
                  </h2>
                  
                  <div className="flex flex-wrap gap-2">
                    <div className="relative">
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="pl-8 pr-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 appearance-none"
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>
                            {status === "all" ? "All Status" : status}
                          </option>
                        ))}
                      </select>
                      <FaFilter className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                    </div>
                    
                    <div className="relative">
                      <select
                        value={selectedVenue}
                        onChange={(e) => setSelectedVenue(e.target.value)}
                        className="pl-8 pr-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 appearance-none"
                      >
                        <option value="">All Venues</option>
                        {venues.map(venue => (
                          <option key={venue} value={venue}>{venue}</option>
                        ))}
                      </select>
                      <FaCalendarAlt className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                    </div>
                    
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="pl-8 pr-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 appearance-none"
                      >
                        <option value="all">All Categories</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      <FaTags className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
                
                {filteredRemarks.length === 0 ? (
                  <div className="text-center py-12">
                    <FaStickyNote className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No remarks found</h3>
                    <p className="mt-1 text-gray-500">
                      Try changing your filters or submit a new remark
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredRemarks.map((remark) => (
                      <div 
                        key={remark.id}
                        className={`p-4 rounded-lg border-l-4 ${
                          remark.status === "resolved" 
                            ? "border-green-500 bg-green-50" 
                            : remark.status === "pending"
                            ? "border-yellow-500 bg-yellow-50"
                            : "border-blue-500 bg-blue-50"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium text-gray-800">{remark.venue}</h3>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <FaStar 
                                    key={i} 
                                    className={`text-sm ${i < remark.rating ? "text-yellow-400" : "text-gray-300"}`} 
                                  />
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-2">
                              {getCategoryBadge(remark.category)}
                              {getStatusBadge(remark.status)}
                              {remark.attachments > 0 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-full text-xs flex items-center">
                                  <FaPaperclip className="mr-1" /> {remark.attachments} file
                                </span>
                              )}
                            </div>
                            
                            {editingId === remark.id ? (
                              <div className="mb-3">
                                <textarea
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  rows={2}
                                  className="w-full p-2 border rounded focus:ring focus:ring-blue-200"
                                />
                              </div>
                            ) : (
                              <p className="text-gray-700">{remark.text}</p>
                            )}
                            
                            <div className="flex flex-col sm:flex-row sm:items-center mt-3 text-sm text-gray-500">
                              <div className="flex items-center mb-1 sm:mb-0">
                                <FaCalendarAlt className="mr-1 text-gray-400" />
                                <span>{remark.date}</span>
                              </div>
                              <div className="sm:mx-3 hidden sm:block">•</div>
                              <div className="mt-1 sm:mt-0 flex items-center">
                                <FaUser className="mr-1 text-gray-400" />
                                <span>{remark.assignedTo}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2 ml-3">
                            {editingId === remark.id ? (
                              <>
                                <button 
                                  onClick={() => handleSaveEdit(remark.id)}
                                  className="p-2 text-green-600 hover:bg-green-100 rounded-full"
                                  title="Save changes"
                                >
                                  <FaCheck />
                                </button>
                                <button 
                                  onClick={() => setEditingId(null)}
                                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                                  title="Cancel"
                                >
                                  <FaTimes />
                                </button>
                              </>
                            ) : (
                              <>
                                <button 
                                  onClick={() => handleEditRemark(remark.id, remark.text)}
                                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                                  title="Edit remark"
                                >
                                  <FaEdit />
                                </button>
                                <button 
                                  onClick={() => handleDeleteRemark(remark.id)}
                                  className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                                  title="Delete remark"
                                >
                                  <FaTrash />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-2 border-t border-gray-100 flex flex-wrap gap-2">
                          <select
                            value={remark.assignedTo}
                            onChange={(e) => handleAssignTo(remark.id, e.target.value)}
                            className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                          >
                            {teamMembers.map(member => (
                              <option key={member} value={member}>{member}</option>
                            ))}
                          </select>
                          
                          <button
                            onClick={() => handleStatusChange(remark.id, "pending")}
                            className={`px-2 py-1 text-xs rounded ${
                              remark.status === "pending" 
                                ? "bg-yellow-500 text-white" 
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            Mark Pending
                          </button>
                          <button
                            onClick={() => handleStatusChange(remark.id, "in-progress")}
                            className={`px-2 py-1 text-xs rounded ${
                              remark.status === "in-progress" 
                                ? "bg-blue-500 text-white" 
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            In Progress
                          </button>
                          <button
                            onClick={() => handleStatusChange(remark.id, "resolved")}
                            className={`px-2 py-1 text-xs rounded ${
                              remark.status === "resolved" 
                                ? "bg-green-500 text-white" 
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            Mark Resolved
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mt-6 bg-white border rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-3">Remark Guidelines</h3>
                <ul className="text-sm text-gray-600 list-disc pl-5 space-y-2">
                  <li><span className="font-medium">Be specific:</span> Mention venue names, equipment issues, and staff interactions</li>
                  <li><span className="font-medium">Include details:</span> Date, time, and location help us investigate</li>
                  <li><span className="font-medium">Suggest solutions:</span> We value your ideas for improvement</li>
                  <li><span className="font-medium">Rating system:</span> Rate your experience from 1 to 5 stars</li>
                  <li><span className="font-medium">Response time:</span> We aim to respond to all remarks within 48 hours</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Venue Performance */}
            <div className="bg-white border rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaChartBar className="mr-2 text-blue-600" />
                Venue Performance
              </h2>
              
              <div className="space-y-4">
                {venuePerformance.map((venue, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-1/4 text-sm font-medium text-gray-700">{venue.venue}</div>
                    <div className="w-1/2 mx-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${(venue.rating / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-1/4 flex items-center">
                      <div className="text-sm font-medium text-gray-700 mr-2">{venue.rating}</div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={`text-sm ${i < venue.rating ? "text-yellow-400" : "text-gray-300"}`} 
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-xs text-gray-500">({venue.count})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Category Distribution */}
            <div className="bg-white border rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaTags className="mr-2 text-blue-600" />
                Category Distribution
              </h2>
              
              <div className="space-y-3">
                {categoryDistribution.map((category, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 capitalize">{category.category}</span>
                      <span className="text-sm font-medium text-gray-700">{category.count} ({((category.count / remarks.length) * 100).toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full" 
                        style={{ 
                          width: `${(category.count / remarks.length) * 100}%`,
                          backgroundColor: 
                            category.category === "positive" ? "#10B981" :
                            category.category === "equipment" ? "#8B5CF6" :
                            category.category === "environment" ? "#3B82F6" :
                            category.category === "technology" ? "#6366F1" :
                            category.category === "staff" ? "#F59E0B" : "#9CA3AF"
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Resolution Trends */}
            <div className="bg-white border rounded-lg p-4 lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <FaChartLine className="mr-2 text-blue-600" />
                  Resolution Trends
                </h2>
                <div className="flex space-x-2">
                  {["week", "month", "quarter"].map(period => (
                    <button
                      key={period}
                      onClick={() => setTrendPeriod(period)}
                      className={`px-3 py-1 text-xs rounded ${
                        trendPeriod === period 
                          ? "bg-blue-600 text-white" 
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="h-64 flex items-end justify-between pt-4">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                  <div key={day} className="flex flex-col items-center">
                    <div className="text-xs text-gray-500 mb-1">{day}</div>
                    <div className="flex items-end">
                      <div 
                        className="w-8 bg-blue-500 mx-1 rounded-t" 
                        style={{ height: `${Math.random() * 100}px` }}
                      ></div>
                      <div 
                        className="w-8 bg-green-500 mx-1 rounded-t" 
                        style={{ height: `${Math.random() * 100}px` }}
                      ></div>
                    </div>
                    <div className="flex mt-1">
                      <div className="w-4 h-1 bg-blue-500 mr-1"></div>
                      <div className="text-xs text-gray-500">Pending</div>
                    </div>
                    <div className="flex mt-1">
                      <div className="w-4 h-1 bg-green-500 mr-1"></div>
                      <div className="text-xs text-gray-500">Resolved</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Category Management */}
            <div className="lg:col-span-2 bg-white border rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaTags className="mr-2 text-blue-600" />
                Feedback Categories
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map(category => (
                  <div 
                    key={category} 
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center mb-2">
                      {getCategoryBadge(category)}
                      <span className="ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        {remarks.filter(r => r.category === category).length}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {category === "positive" ? "Positive feedback and compliments" :
                       category === "equipment" ? "Issues with venue equipment" :
                       category === "environment" ? "Temperature, lighting, and ambiance" :
                       category === "technology" ? "WiFi, AV systems, and tech support" :
                       category === "staff" ? "Staff behavior and service quality" :
                       "Other feedback and suggestions"}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium text-gray-800 mb-3">Add New Category</h3>
                <div className="flex">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter new category name"
                    className="flex-1 p-2 border rounded-l-lg focus:ring focus:ring-blue-200"
                  />
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700">
                    Add
                  </button>
                </div>
              </div>
            </div>
            
            {/* Category Statistics */}
            <div className="bg-white border rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaChartBar className="mr-2 text-blue-600" />
                Category Insights
              </h2>
              
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-700 mb-1">Most Common Category</div>
                  <div className="font-medium text-gray-900">Equipment Issues</div>
                  <div className="text-xs text-gray-500 mt-1">32% of all remarks</div>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-gray-700 mb-1">Fastest Resolution</div>
                  <div className="font-medium text-gray-900">Positive Feedback</div>
                  <div className="text-xs text-gray-500 mt-1">Resolved within 2 hours on average</div>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="text-sm text-gray-700 mb-1">Most Challenging</div>
                  <div className="font-medium text-gray-900">Technology Issues</div>
                  <div className="text-xs text-gray-500 mt-1">Takes 3.2 days to resolve on average</div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-sm text-gray-700 mb-1">Highest Impact</div>
                  <div className="font-medium text-gray-900">Staff Feedback</div>
                  <div className="text-xs text-gray-500 mt-1">Leads to 45% of process improvements</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "team" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Team Members */}
            <div className="bg-white border rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaUsers className="mr-2 text-blue-600" />
                Team Members
              </h2>
              
              <div className="space-y-3">
                {teamMembers.map((member, index) => (
                  <div 
                    key={index} 
                    className="p-3 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <FaUser className="text-blue-700" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{member}</div>
                        <div className="text-xs text-gray-500">
                          {remarks.filter(r => r.assignedTo === member).length} assigned tasks
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex justify-between text-xs">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {remarks.filter(r => r.assignedTo === member && r.status === "pending").length} Pending
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                        {remarks.filter(r => r.assignedTo === member && r.status === "resolved").length} Resolved
                      </span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                        {remarks.filter(r => r.assignedTo === member && r.status === "in-progress").length} In Progress
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Team Performance */}
            <div className="lg:col-span-2 bg-white border rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaChartLine className="mr-2 text-blue-600" />
                Team Performance
              </h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Member</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resolved</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satisfaction</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {teamMembers.map((member, index) => {
                      const assigned = remarks.filter(r => r.assignedTo === member).length;
                      const resolved = remarks.filter(r => r.assignedTo === member && r.status === "resolved").length;
                      const satisfaction = assigned > 0 ? ((resolved / assigned) * 5).toFixed(1) : 0;
                      
                      return (
                        <tr key={index}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                                <FaUser className="text-blue-700 text-sm" />
                              </div>
                              <div className="text-sm font-medium text-gray-900">{member}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{assigned}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{resolved}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {assigned > 0 ? (Math.random() * 5).toFixed(1) + " days" : "-"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900 mr-2">{satisfaction}</div>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <FaStar 
                                    key={i} 
                                    className={`text-sm ${i < satisfaction ? "text-yellow-400" : "text-gray-300"}`} 
                                  />
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-3">Team Performance Insights</h3>
                <ul className="text-sm text-gray-600 list-disc pl-5 space-y-2">
                  <li>Facilities Team resolves equipment issues 35% faster than average</li>
                  <li>IT Support handles technology issues with 92% satisfaction rate</li>
                  <li>Positive feedback responses are typically resolved within 2 hours</li>
                  <li>Staff-related feedback has the highest impact on service improvements</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Remarks;