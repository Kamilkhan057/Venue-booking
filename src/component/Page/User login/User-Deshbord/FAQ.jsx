import React, { useState } from "react";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      question: "How do I book a meeting?",
      answer: "Go to the Booking section and fill out the meeting details. You'll receive a confirmation email once your booking is processed."
    },
    {
      question: "Can I edit a submitted booking?",
      answer: "Currently, editing is not supported. Please cancel and resubmit your booking request. A cancellation link is provided in your confirmation email."
    },
    {
      question: "What is the cancellation policy?",
      answer: "You can cancel meetings up to 24 hours before the scheduled time without penalty. Late cancellations may incur fees depending on your subscription plan."
    },
    {
      question: "How do I reschedule a meeting?",
      answer: "Use the cancellation link in your confirmation email to cancel the existing booking, then create a new booking with your preferred time."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-3">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600">
          Find answers to common questions about our services
        </p>
      </div>

      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <div 
            key={index}
            className="border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <button
              className="flex justify-between items-center w-full p-5 text-left focus:outline-none"
              onClick={() => toggleFAQ(index)}
              aria-expanded={activeIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <h3 className="text-lg font-semibold text-blue-800">
                {faq.question}
              </h3>
              <svg 
                className={`w-5 h-5 text-blue-600 transform transition-transform duration-300 ${
                  activeIndex === index ? 'rotate-180' : ''
                }`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 9l-7 7-7-7" 
                />
              </svg>
            </button>
            
            <div 
              id={`faq-answer-${index}`}
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                activeIndex === index 
                  ? 'max-h-96 opacity-100' 
                  : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-5 pb-5 text-gray-700 bg-blue-50">
                <p>{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;