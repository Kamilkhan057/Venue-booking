import React, { useState, useRef, useEffect } from "react";

const Feedback = () => {
  // State management
  const [formData, setFormData] = useState({
    feedback: "",
    rating: 0,
    category: "general",
    name: "",
    email: "",
    contactAllowed: false,
    priority: "normal"
  });
  
  const [uiState, setUiState] = useState({
    submitted: false,
    hoverRating: 0,
    errorMessage: "",
    isSubmitting: false,
    activeTab: "feedback",
    attachments: [],
    characterCount: 0,
    isMobile: window.innerWidth < 640
  });

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const successTimeoutRef = useRef(null);
  const formRef = useRef(null);

  // Configuration objects
  const emojiScale = {
    1: { emoji: '😡', label: 'Very Bad', tooltip: 'Extremely dissatisfied', color: 'bg-red-100 text-red-800' },
    2: { emoji: '😞', label: 'Bad', tooltip: 'Somewhat dissatisfied', color: 'bg-orange-100 text-orange-800' },
    3: { emoji: '😐', label: 'Neutral', tooltip: 'Neither satisfied nor dissatisfied', color: 'bg-yellow-100 text-yellow-800' },
    4: { emoji: '🙂', label: 'Good', tooltip: 'Somewhat satisfied', color: 'bg-blue-100 text-blue-800' },
    5: { emoji: '😄', label: 'Excellent', tooltip: 'Extremely satisfied', color: 'bg-green-100 text-green-800' },
  };

  const categories = {
    general: "General Feedback",
    bug: "Bug Report",
    feature: "Feature Request",
    ui: "User Interface",
    ux: "User Experience",
    performance: "Performance",
    content: "Content Issue"
  };

  const priorities = {
    low: "Low",
    normal: "Normal",
    high: "High",
    critical: "Critical"
  };

  // Effects
  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        300
      )}px`;
    }

    // Handle window resize
    const handleResize = () => {
      setUiState(prev => ({
        ...prev,
        isMobile: window.innerWidth < 640
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [formData.feedback]);

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (name === 'feedback') {
      setUiState(prev => ({
        ...prev,
        characterCount: value.length
      }));
    }
  };

  const validateForm = () => {
    if (!formData.feedback.trim()) {
      setUiState(prev => ({ 
        ...prev, 
        errorMessage: "❗ Please enter your feedback before submitting.",
        activeTab: "feedback"
      }));
      return false;
    }

    if (formData.rating === 0) {
      setUiState(prev => ({ 
        ...prev, 
        errorMessage: "❗ Please select a rating before submitting.",
        activeTab: "feedback"
      }));
      return false;
    }

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      setUiState(prev => ({ 
        ...prev, 
        errorMessage: "❗ Please enter a valid email address.",
        activeTab: "details"
      }));
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUiState(prev => ({ ...prev, errorMessage: "", isSubmitting: true }));

    if (!validateForm()) {
      setUiState(prev => ({ ...prev, isSubmitting: false }));
      return;
    }

    // Simulate API call
    setTimeout(() => {
      console.log("Feedback Submitted:", { 
        ...formData, 
        attachments: uiState.attachments.length 
      });
      
      setUiState(prev => ({ 
        ...prev, 
        submitted: true,
        isSubmitting: false 
      }));
      
      // Reset form after successful submission
      setFormData({
        feedback: "",
        rating: 0,
        category: "general",
        name: "",
        email: "",
        contactAllowed: false,
        priority: "normal"
      });
      setUiState(prev => ({
        ...prev,
        attachments: [],
        characterCount: 0
      }));

      // Auto-hide success message after 4 seconds
      successTimeoutRef.current = setTimeout(() => {
        setUiState(prev => ({ ...prev, submitted: false }));
      }, 4000);
    }, 1500);
  };

  const handleClear = () => {
    setFormData({
      feedback: "",
      rating: 0,
      category: "general",
      name: "",
      email: "",
      contactAllowed: false,
      priority: "normal"
    });
    setUiState(prev => ({ 
      ...prev, 
      submitted: false,
      errorMessage: "",
      attachments: [],
      characterCount: 0
    }));
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      setUiState(prev => ({ 
        ...prev, 
        errorMessage: "❗ Maximum 3 attachments allowed." 
      }));
      return;
    }
    
    // Check file sizes
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setUiState(prev => ({ 
        ...prev, 
        errorMessage: "❗ Some files exceed the 5MB limit." 
      }));
      return;
    }
    
    setUiState(prev => ({ 
      ...prev, 
      attachments: files.slice(0, 3),
      errorMessage: "" 
    }));
  };

  const removeAttachment = (index) => {
    setUiState(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleTabChange = (tab) => {
    if (tab === 'details' && !formData.feedback.trim()) {
      setUiState(prev => ({ 
        ...prev, 
        errorMessage: "❗ Please enter your feedback before proceeding.",
        activeTab: "feedback"
      }));
      return;
    }
    setUiState(prev => ({ ...prev, activeTab: tab, errorMessage: "" }));
  };

  const getRatingColor = (rating) => {
    if (rating <= 2) return 'bg-red-100 text-red-800';
    if (rating === 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-0 m-0">
      <div className="container mx-auto px-0 sm:px-4 max-w-full h-screen flex flex-col">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-6 sm:px-8 sm:py-8 text-center">
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-white transform -skew-y-2 origin-top"></div>
          <div className="relative z-10">
            <h1 className="text-xl sm:text-2xl font-bold mb-2">Share Your Feedback</h1>
            <p className="text-indigo-100 mb-3 text-sm sm:text-base">
              We appreciate your thoughts to help us improve
            </p>
            {formData.rating > 0 && (
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getRatingColor(formData.rating)}`}>
                {emojiScale[formData.rating].emoji} {emojiScale[formData.rating].label}
              </div>
            )}
          </div>
        </div>

        {/* Main Content - Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
          {/* Messages */}
          {uiState.submitted && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200 flex justify-between items-center animate-fadeIn">
              <div className="flex items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm sm:text-base font-medium">
                  <span className="font-bold">Thank you!</span> Feedback submitted.
                </span>
              </div>
              <button 
                className="text-green-700 hover:text-green-900 text-lg"
                onClick={() => setUiState(prev => ({ ...prev, submitted: false }))}
                aria-label="Close message"
              >
                &times;
              </button>
            </div>
          )}

          {uiState.errorMessage && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 flex justify-between items-center animate-fadeIn">
              <div className="flex items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm sm:text-base font-medium">{uiState.errorMessage}</span>
              </div>
              <button 
                className="text-red-700 hover:text-red-900 text-lg"
                onClick={() => setUiState(prev => ({ ...prev, errorMessage: "" }))}
                aria-label="Close message"
              >
                &times;
              </button>
            </div>
          )}

          {/* Progress indicator */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                {uiState.activeTab === 'feedback' ? 'Step 1 of 2' : 'Step 2 of 2'}
              </span>
              <span className="text-xs font-medium text-gray-500">
                {uiState.activeTab === 'feedback' ? 'Feedback Details' : 'Personal Information'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className={`bg-indigo-600 h-1.5 rounded-full transition-all duration-300 ${uiState.activeTab === 'feedback' ? 'w-1/2' : 'w-full'}`}
              ></div>
            </div>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {uiState.activeTab === 'feedback' ? (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Feedback Category
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-colors"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      {Object.entries(categories).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-colors"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                    >
                      {Object.entries(priorities).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Your Feedback
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    ref={textareaRef}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-colors min-h-[100px] max-h-[300px] resize-none"
                    name="feedback"
                    placeholder="What did you like about your experience? How can we improve?"
                    value={formData.feedback}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    maxLength="500"
                    required
                  ></textarea>
                  <div className="flex justify-between text-xs mt-1">
                    <span className={`${uiState.characterCount > 450 ? 'text-red-500' : 'text-gray-500'}`}>
                      {uiState.characterCount}/500 characters
                    </span>
                    <span className="text-gray-500 hidden sm:inline">
                      Press Ctrl+Enter to submit
                    </span>
                  </div>
                </div>

                <div className="py-3">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-3 text-center">
                    How would you rate your experience?
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="flex justify-center space-x-2 sm:space-x-4">
                    {Object.entries(emojiScale).map(([value, { emoji, label, tooltip, color }]) => (
                      <div key={value} className="flex flex-col items-center group relative">
                        <div
                          className={`text-3xl sm:text-4xl cursor-pointer transition-all duration-200 transform ${
                            parseInt(value) <= (uiState.hoverRating || formData.rating) 
                              ? "scale-110 filter-none" 
                              : "scale-100 grayscale opacity-70"
                          }`}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, rating: parseInt(value) }));
                            setUiState(prev => ({ ...prev, errorMessage: "" }));
                          }}
                          onMouseEnter={() => setUiState(prev => ({ ...prev, hoverRating: parseInt(value) }))}
                          onMouseLeave={() => setUiState(prev => ({ ...prev, hoverRating: 0 }))}
                          role="button"
                          aria-label={label}
                          tabIndex="0"
                        >
                          {emoji}
                          <div className="opacity-0 group-hover:opacity-100 absolute -mt-10 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity">
                            {tooltip}
                          </div>
                        </div>
                        <div className={`text-xs mt-1 ${
                          parseInt(value) <= (uiState.hoverRating || formData.rating) 
                            ? "text-gray-700 font-medium" 
                            : "text-gray-500"
                        }`}>
                          {uiState.isMobile ? '' : label}
                        </div>
                        {formData.rating === parseInt(value) && (
                          <div className={`absolute -bottom-2 ${color} text-xs px-2 py-0.5 rounded-full`}>
                            {uiState.isMobile ? '✓' : 'Selected'}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Attachments (optional)
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        multiple
                        accept="image/*,.pdf,.doc,.docx,.txt"
                      />
                      <div className="px-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span>Upload Files (Max 3)</span>
                      </div>
                    </label>
                    <div className="text-xs text-gray-500">
                      JPG, PNG, PDF, DOC, TXT (≤5MB)
                    </div>
                  </div>
                  
                  {uiState.attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {uiState.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between px-3 py-1.5 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="text-gray-500 flex-shrink-0">
                              {file.type.startsWith('image/') ? '🖼️' : '📄'}
                            </span>
                            <span className="text-xs sm:text-sm font-medium truncate">{file.name}</span>
                            <span className="text-xs text-gray-500 whitespace-nowrap">{(file.size / 1024 / 1024).toFixed(2)}MB</span>
                          </div>
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-700 flex-shrink-0"
                            onClick={() => removeAttachment(index)}
                          >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Your Name (optional)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-colors"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Email Address (optional)
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-colors"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                  />
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-4 sm:h-5">
                    <input
                      type="checkbox"
                      id="contactAllowed"
                      name="contactAllowed"
                      checked={formData.contactAllowed}
                      onChange={handleInputChange}
                      className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-2 sm:ml-3 text-xs sm:text-sm">
                    <label htmlFor="contactAllowed" className="text-gray-700">
                      I agree to be contacted for follow-up questions
                    </label>
                    <p className="text-gray-500 mt-0.5 sm:mt-1">We may reach out for clarification on your feedback</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 sm:pt-6 border-t border-gray-200">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-1 sm:gap-2"
                  disabled={uiState.isSubmitting}
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Form
                </button>
              </div>
              
              <div className="flex gap-3">
                {uiState.activeTab === 'details' ? (
                  <button
                    type="button"
                    className="px-4 py-2 text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-1 sm:gap-2"
                    onClick={() => handleTabChange('feedback')}
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                  </button>
                ) : (
                  <button
                    type="button"
                    className="px-4 py-2 text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-1 sm:gap-2"
                    onClick={() => handleTabChange('details')}
                  >
                    Next
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                )}
                
                {uiState.activeTab === 'details' && (
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs sm:text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md flex items-center gap-1 sm:gap-2"
                    disabled={uiState.isSubmitting}
                  >
                    {uiState.isSubmitting ? (
                      <>
                        <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Submit
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>

          <div className="mt-6 p-4 sm:p-6 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-sm sm:text-base font-bold text-gray-800 flex items-center justify-center gap-2 mb-3">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Tips for Effective Feedback
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-2 sm:gap-3">
                <span className="bg-indigo-100 text-indigo-700 rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">1</span>
                <span>Be specific about what you liked or what could be improved</span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <span className="bg-indigo-100 text-indigo-700 rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">2</span>
                <span>Provide constructive suggestions rather than just criticism</span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <span className="bg-indigo-100 text-indigo-700 rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">3</span>
                <span>Focus on your personal experience rather than general opinions</span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3 hidden sm:flex">
                <span className="bg-indigo-100 text-indigo-700 rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">4</span>
                <span>Use Ctrl+Enter to quickly submit your feedback</span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <span className="bg-indigo-100 text-indigo-700 rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">{uiState.isMobile ? '4' : '5'}</span>
                <span>Screenshots help us understand visual issues better</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;