import React, { useState } from "react";

const Feedback = () => {
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState("feedback"); // For tab navigation
  const [name, setName] = useState(""); // For contact form
  const [email, setEmail] = useState(""); // For contact form

  const emojiScale = {
    1: { emoji: '😡', label: 'Very Bad' },
    2: { emoji: '😞', label: 'Bad' },
    3: { emoji: '😐', label: 'Neutral' },
    4: { emoji: '🙂', label: 'Good' },
    5: { emoji: '😄', label: 'Excellent' },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!feedback.trim()) {
      setErrorMessage("❗ Please enter your feedback before submitting.");
      return;
    }

    if (rating === 0) {
      setErrorMessage("❗ Please select a smile rating before submitting.");
      return;
    }

    console.log("Feedback Submitted:", { feedback, rating });
    setSubmitted(true);
    setFeedback("");
    setRating(0);
    setHoverRating(0);

    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) {
      setErrorMessage("❗ Please fill all fields before submitting.");
      return;
    }
    console.log("Contact Form Submitted:", { name, email });
    setSubmitted(true);
    setName("");
    setEmail("");

    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  const handleClear = () => {
    setFeedback("");
    setRating(0);
    setHoverRating(0);
    setSubmitted(false);
    setErrorMessage("");
  };

  return (
    <div className="feedback-page-wrapper">
      <style>
        {`
          /* General Styles */
          body {
            margin: 0;
            font-family: 'Poppins', sans-serif;
            background-color: #f0f2f5;
          }

          .feedback-page-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 2rem;
            background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
            box-sizing: border-box;
          }

          /* Main Card */
          .feedback-card {
            background-color: #ffffff;
            border-radius: 1.5rem;
            box-shadow: 0 1rem 2.5rem rgba(0, 0, 0, 0.1);
            max-width: 800px;
            width: 100%;
            margin: 0 auto;
            padding: 0;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.4);
          }

          /* Header Section */
          .feedback-header-section {
            background: linear-gradient(to right, #4a6bff, #6a5acd);
            color: white;
            padding: 2.5rem;
            text-align: center;
          }

          .feedback-main-heading {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 0.5rem;
            color: white;
          }

          .feedback-sub-heading {
            color: rgba(255, 255, 255, 0.9);
            font-size: 1.1rem;
            margin-bottom: 0;
          }

          /* Navigation Tabs */
          .tabs-container {
            display: flex;
            border-bottom: 1px solid #e0e0e0;
          }

          .tab {
            flex: 1;
            padding: 1.2rem;
            text-align: center;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            border-bottom: 3px solid transparent;
          }

          .tab:hover {
            background-color: #f8f9fa;
          }

          .tab.active {
            border-bottom: 3px solid #4a6bff;
            color: #4a6bff;
          }

          /* Content Area */
          .content-area {
            padding: 2.5rem;
          }

          /* Feedback Form */
          .feedback-form {
            margin-bottom: 2rem;
          }

          .form-group {
            margin-bottom: 1.5rem;
          }

          .form-label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #333;
          }

          .form-input, .feedback-textarea {
            width: 100%;
            padding: 1rem;
            border-radius: 0.5rem;
            border: 1px solid #ddd;
            outline: none;
            font-size: 1rem;
            transition: all 0.3s ease;
          }

          .feedback-textarea {
            min-height: 150px;
            resize: vertical;
          }

          .form-input:focus, .feedback-textarea:focus {
            border-color: #4a6bff;
            box-shadow: 0 0 0 3px rgba(74, 107, 255, 0.1);
          }

          .char-count {
            text-align: right;
            font-size: 0.8rem;
            color: #666;
            margin-top: 0.5rem;
          }

          /* Emoji Rating */
          .emoji-rating-section {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin: 2rem 0;
          }

          .emoji-rating-item {
            font-size: 3rem;
            cursor: pointer;
            transition: all 0.2s ease;
            filter: grayscale(100%) opacity(0.6);
          }

          .emoji-rating-item.selected, .emoji-rating-item:hover {
            filter: grayscale(0%) opacity(1);
            transform: scale(1.1);
          }

          /* Buttons */
          .button-group {
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
            margin-top: 2rem;
          }

          .btn {
            padding: 0.8rem 1.8rem;
            border-radius: 0.5rem;
            border: none;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 600;
            transition: all 0.3s ease;
          }

          .btn-primary {
            background-color: #4a6bff;
            color: white;
          }

          .btn-primary:hover {
            background-color: #3a5bef;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }

          .btn-secondary {
            background-color: #f0f0f0;
            color: #333;
          }

          .btn-secondary:hover {
            background-color: #e0e0e0;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }

          /* Messages */
          .message {
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1.5rem;
            text-align: center;
            font-weight: 500;
          }

          .success-message {
            background-color: #e8f5e9;
            color: #2e7d32;
          }

          .error-message {
            background-color: #ffebee;
            color: #c62828;
          }

          /* Additional Sections */
          .features-section {
            margin-top: 3rem;
            padding: 2rem;
            background-color: #f8f9fa;
            border-radius: 1rem;
          }

          .section-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 1.5rem;
            text-align: center;
          }

          .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
          }

          .feature-card {
            background: white;
            padding: 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            transition: transform 0.3s ease;
          }

          .feature-card:hover {
            transform: translateY(-5px);
          }

          .feature-icon {
            font-size: 2rem;
            margin-bottom: 1rem;
            color: #4a6bff;
          }

          .feature-title {
            font-weight: 600;
            margin-bottom: 0.5rem;
          }

          .feature-desc {
            color: #666;
            font-size: 0.9rem;
          }

          /* FAQ Section */
          .faq-section {
            margin-top: 3rem;
          }

          .faq-item {
            margin-bottom: 1rem;
            border: 1px solid #eee;
            border-radius: 0.5rem;
            overflow: hidden;
          }

          .faq-question {
            padding: 1rem;
            background: #f8f9fa;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .faq-answer {
            padding: 1rem;
            background: white;
            border-top: 1px solid #eee;
          }

          /* Responsive */
          @media (max-width: 768px) {
            .feedback-header-section {
              padding: 1.5rem;
            }
            .feedback-main-heading {
              font-size: 2rem;
            }
            .content-area {
              padding: 1.5rem;
            }
            .emoji-rating-item {
              font-size: 2.5rem;
            }
            .features-grid {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 480px) {
            .feedback-card {
              border-radius: 1rem;
            }
            .feedback-main-heading {
              font-size: 1.8rem;
            }
            .tab {
              padding: 1rem 0.5rem;
              font-size: 0.9rem;
            }
            .button-group {
              flex-direction: column;
            }
            .btn {
              width: 100%;
            }
          }
        `}
      </style>

      <div className="feedback-card">
        <div className="feedback-header-section">
          <h1 className="feedback-main-heading">Customer Feedback</h1>
          <p className="feedback-sub-heading">
            We value your opinion to help us improve
          </p>
        </div>

        <div className="tabs-container">
          <div 
            className={`tab ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => setActiveTab('feedback')}
          >
            Feedback Form
          </div>
          <div 
            className={`tab ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            Contact Us
          </div>
          <div 
            className={`tab ${activeTab === 'faq' ? 'active' : ''}`}
            onClick={() => setActiveTab('faq')}
          >
            FAQ
          </div>
        </div>

        <div className="content-area">
          {submitted && (
            <div className="message success-message">
              Thank you! Your {activeTab === 'feedback' ? 'feedback' : 'message'} has been submitted.
            </div>
          )}

          {errorMessage && (
            <div className="message error-message">
              {errorMessage}
            </div>
          )}

          {activeTab === 'feedback' && (
            <form onSubmit={handleSubmit} className="feedback-form">
              <div className="form-group">
                <label className="form-label">Your Feedback</label>
                <textarea
                  className="feedback-textarea"
                  placeholder="What did you like about your experience? How can we improve?"
                  value={feedback}
                  onChange={(e) => {
                    setFeedback(e.target.value);
                    setSubmitted(false);
                    setErrorMessage("");
                  }}
                  maxLength="500"
                ></textarea>
                <div className="char-count">
                  {feedback.length}/500 characters
                </div>
              </div>

              <div className="emoji-rating-section">
                {Object.entries(emojiScale).map(([value, { emoji, label }]) => (
                  <span
                    key={value}
                    className={`emoji-rating-item ${
                      parseInt(value) <= (hoverRating || rating) ? "selected" : ""
                    }`}
                    onClick={() => {
                      setRating(parseInt(value));
                      setErrorMessage("");
                    }}
                    onMouseEnter={() => setHoverRating(parseInt(value))}
                    onMouseLeave={() => setHoverRating(0)}
                    role="img"
                    aria-label={label}
                  >
                    {emoji}
                  </span>
                ))}
              </div>

              <div className="button-group">
                <button
                  type="button"
                  onClick={handleClear}
                  className="btn btn-secondary"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          )}

          {activeTab === 'contact' && (
            <form onSubmit={handleContactSubmit} className="feedback-form">
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  className="feedback-textarea"
                  placeholder="How can we help you?"
                  value={feedback}
                  onChange={(e) => {
                    setFeedback(e.target.value);
                    setSubmitted(false);
                    setErrorMessage("");
                  }}
                  maxLength="500"
                ></textarea>
                <div className="char-count">
                  {feedback.length}/500 characters
                </div>
              </div>

              <div className="button-group">
                <button
                  type="button"
                  onClick={() => {
                    setName("");
                    setEmail("");
                    setFeedback("");
                    setSubmitted(false);
                    setErrorMessage("");
                  }}
                  className="btn btn-secondary"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Send Message
                </button>
              </div>
            </form>
          )}

          {activeTab === 'faq' && (
            <div className="faq-section">
              <h3 className="section-title">Frequently Asked Questions</h3>
              
              <div className="faq-item">
                <div className="faq-question">
                  <span>How is my feedback used?</span>
                  <span>+</span>
                </div>
                <div className="faq-answer">
                  Your feedback helps us identify areas for improvement and make our services better. 
                  We analyze all feedback to prioritize changes and updates.
                </div>
              </div>
              
              <div className="faq-item">
                <div className="faq-question">
                  <span>Can I submit feedback anonymously?</span>
                  <span>+</span>
                </div>
                <div className="faq-answer">
                  Yes, you can leave the name and email fields blank if you prefer to remain anonymous.
                </div>
              </div>
              
              <div className="faq-item">
                <div className="faq-question">
                  <span>How long does it take to get a response?</span>
                  <span>+</span>
                </div>
                <div className="faq-answer">
                  We try to respond to all feedback within 3-5 business days. For urgent matters, 
                  please use the contact form instead.
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'faq' && (
            <div className="features-section">
              <h3 className="section-title">Why Your Feedback Matters</h3>
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">💡</div>
                  <h4 className="feature-title">Continuous Improvement</h4>
                  <p className="feature-desc">
                    Your suggestions directly influence our product roadmap and service improvements.
                  </p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">👥</div>
                  <h4 className="feature-title">Community Driven</h4>
                  <p className="feature-desc">
                    Help shape the experience for all users by sharing your perspective.
                  </p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🚀</div>
                  <h4 className="feature-title">Fast Response</h4>
                  <p className="feature-desc">
                    Our team reviews feedback daily to quickly implement the best ideas.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;