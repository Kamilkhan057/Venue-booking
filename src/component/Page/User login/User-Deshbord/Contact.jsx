import React, { useState } from "react";
import { 
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane, 
  FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaWhatsapp,
  FaHeadset, FaBuilding, FaCalendarAlt, FaUserTie, FaChevronDown 
} from "react-icons/fa";
import { MdSupportAgent, MdEmail, MdLocalOffer } from "react-icons/md";
import { RiCustomerService2Fill, RiLiveFill } from "react-icons/ri";
import { IoMdHelpBuoy } from "react-icons/io";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("contact");
  const [activeFaq, setActiveFaq] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // Contact Methods Data
  const contactMethods = [
    {
      icon: <FaPhone className="text-blue-600 text-2xl" />,
      title: "Phone Support",
      description: "+91-1234567890",
      subtitle: "Available 24/7 for urgent matters",
      action: "Call Now"
    },
    {
      icon: <FaWhatsapp className="text-blue-600 text-2xl" />,
      title: "WhatsApp",
      description: "+91-9876543210",
      subtitle: "Instant messaging support",
      action: "Message Us"
    },
    {
      icon: <FaEnvelope className="text-blue-600 text-2xl" />,
      title: "Email Us",
      description: "support@example.com",
      subtitle: "Typically respond within 24 hours",
      action: "Send Email"
    },
    {
      icon: <RiLiveFill className="text-blue-600 text-2xl" />,
      title: "Live Chat",
      description: "Start a conversation",
      subtitle: "Available Mon-Fri, 9AM-6PM",
      action: "Chat Now"
    }
  ];

  // Location Information
  const locations = [
    {
      icon: <FaBuilding className="text-blue-600 text-2xl" />,
      title: "Headquarters",
      address: "123 Business Park, Sector 45, Gurugram",
      hours: "Mon-Fri: 9AM-6PM",
      phone: "+91-11-12345678"
    },
    {
      icon: <FaBuilding className="text-blue-600 text-2xl" />,
      title: "Bangalore Office",
      address: "456 Tech Park, Whitefield, Bangalore",
      hours: "Mon-Fri: 9AM-6PM",
      phone: "+91-80-12345678"
    },
    {
      icon: <FaBuilding className="text-blue-600 text-2xl" />,
      title: "Mumbai Office",
      address: "789 Business Tower, Bandra Kurla Complex",
      hours: "Mon-Fri: 9AM-6PM",
      phone: "+91-22-12345678"
    }
  ];

  // FAQ Data
  const faqs = [
    {
      question: "How can I track my support ticket?",
      answer: "Once you submit a ticket, you'll receive a confirmation email with a tracking number. You can use this to check status updates through our customer portal."
    },
    {
      question: "What's your average response time?",
      answer: "We typically respond to emails within 24 hours. Phone calls are answered immediately during business hours, and live chat responses usually come within 15 minutes."
    },
    {
      question: "Do you offer 24/7 customer support?",
      answer: "Our phone support is available 24/7 for urgent matters. Email support follows our business hours, and live chat is available Monday through Friday from 9AM to 6PM."
    },
    {
      question: "Where are your offices located?",
      answer: "We have three offices across India: our headquarters in Gurugram, a regional office in Bangalore, and another in Mumbai. See our Locations section for full details."
    },
    {
      question: "How do I contact the sales team?",
      answer: "For sales inquiries, please email sales@example.com or call our dedicated sales line at +91-9876543210 during business hours."
    }
  ];

  // Team Members Data
  const teamMembers = [
    {
      name: "Aarav Sharma",
      role: "Customer Support Lead",
      email: "aarav@example.com",
      phone: "+91 98765 43210",
      department: "Customer Service",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: "Priya Patel",
      role: "Technical Support Specialist",
      email: "priya@example.com",
      phone: "+91 87654 32109",
      department: "Technical Support",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: "Rahul Gupta",
      role: "Sales Manager",
      email: "rahul@example.com",
      phone: "+91 76543 21098",
      department: "Sales",
      image: "https://randomuser.me/api/portraits/men/75.jpg"
    },
    {
      name: "Neha Singh",
      role: "Account Manager",
      email: "neha@example.com",
      phone: "+91 65432 10987",
      department: "Client Services",
      image: "https://randomuser.me/api/portraits/women/68.jpg"
    }
  ];

  // Support Resources
  const resources = [
    {
      icon: <IoMdHelpBuoy className="text-blue-600 text-2xl" />,
      title: "Help Center",
      description: "Browse our knowledge base",
      link: "/help-center"
    },
    {
      icon: <MdLocalOffer className="text-blue-600 text-2xl" />,
      title: "Product Guides",
      description: "Download user manuals",
      link: "/product-guides"
    },
    {
      icon: <FaCalendarAlt className="text-blue-600 text-2xl" />,
      title: "Schedule a Demo",
      description: "Book a product tour",
      link: "/demo"
    },
    {
      icon: <MdEmail className="text-blue-600 text-2xl" />,
      title: "Email Templates",
      description: "Common request formats",
      link: "/email-templates"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16 md:py-24 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-blue-400"></div>
          <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-blue-500"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Connect With Us</h1>
          <p className="text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto mb-8">
            We're here to help and answer any questions you might have.
          </p>
          
          {/* Added call-to-action buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="tel:+911234567890" 
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              <FaPhone className="text-lg" />
              Call Now
            </a>
            <a 
              href="mailto:support@example.com" 
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <FaEnvelope className="text-lg" />
              Email Support
            </a>
          </div>
        </div>
      </div>

      {/* Fixed Navigation Tabs */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="bg-white rounded-lg shadow-lg -mt-8 md:-mt-12 relative z-10">
          <div className="flex overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab("contact")}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap flex items-center ${activeTab === "contact" ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-500'}`}
            >
              <FaHeadset className="mr-2" />
              Contact Info
            </button>
            <button
              onClick={() => setActiveTab("form")}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap flex items-center ${activeTab === "form" ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-500'}`}
            >
              <FaPaperPlane className="mr-2" />
              Contact Form
            </button>
            <button
              onClick={() => setActiveTab("team")}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap flex items-center ${activeTab === "team" ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-500'}`}
            >
              <FaUserTie className="mr-2" />
              Our Team
            </button>
            <button
              onClick={() => setActiveTab("locations")}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap flex items-center ${activeTab === "locations" ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-500'}`}
            >
              <FaMapMarkerAlt className="mr-2" />
              Locations
            </button>
            <button
              onClick={() => setActiveTab("faq")}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap flex items-center ${activeTab === "faq" ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-500'}`}
            >
              <IoMdHelpBuoy className="mr-2" />
              FAQs
            </button>
            <button
              onClick={() => setActiveTab("resources")}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap flex items-center ${activeTab === "resources" ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-500'}`}
            >
              <MdLocalOffer className="mr-2" />
              Resources
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="bg-white rounded-lg shadow-md mt-4">
          {/* Contact Information Tab */}
          {activeTab === "contact" && (
            <div className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 md:mb-8">How Can We Help You?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                {contactMethods.map((method, index) => (
                  <div key={index} className="bg-gray-50 p-4 md:p-6 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
                    <div className="flex items-center mb-3 md:mb-4">
                      <div className="mr-3 md:mr-4 p-2 md:p-3 bg-blue-50 rounded-full">
                        {method.icon}
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-gray-800">{method.title}</h3>
                    </div>
                    <p className="text-gray-700 text-base md:text-lg font-medium mb-1">{method.description}</p>
                    <p className="text-gray-500 text-xs md:text-sm mb-3 md:mb-4">{method.subtitle}</p>
                    <button className="text-blue-600 text-sm md:text-base font-medium hover:text-blue-800 transition-colors flex items-center">
                      {method.action} →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Form Tab */}
          {activeTab === "form" && (
            <div className="p-4 md:p-6 max-w-3xl mx-auto">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Send Us a Message</h2>
              
              {submitSuccess && (
                <div className="mb-4 md:mb-6 p-3 md:p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label htmlFor="name" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  ></textarea>
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center items-center py-2 md:py-3 px-4 border border-transparent rounded-md shadow-sm text-base md:text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 md:h-5 md:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Team Tab */}
          {activeTab === "team" && (
            <div className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 md:mb-8">Meet Our Support Team</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                {teamMembers.map((member, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-200">
                    <div className="p-4 md:p-6">
                      <div className="flex flex-col items-center mb-3 md:mb-4">
                        <img 
                          src={member.image} 
                          alt={member.name} 
                          className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full object-cover border-4 border-white shadow-md mb-3 md:mb-4"
                        />
                        <h3 className="text-lg md:text-xl font-semibold text-gray-800 text-center">{member.name}</h3>
                        <p className="text-blue-600 text-sm md:text-base text-center">{member.role}</p>
                        <p className="text-gray-500 text-xs md:text-sm text-center">{member.department}</p>
                      </div>
                      <div className="space-y-2 md:space-y-3">
                        <div className="flex items-center text-gray-600 text-xs md:text-sm">
                          <FaEnvelope className="mr-2 text-blue-500" />
                          <a href={`mailto:${member.email}`} className="hover:text-blue-600 truncate">{member.email}</a>
                        </div>
                        <div className="flex items-center text-gray-600 text-xs md:text-sm">
                          <FaPhone className="mr-2 text-blue-500" />
                          <a href={`tel:${member.phone.replace(/\s+/g, '')}`} className="hover:text-blue-600">{member.phone}</a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Locations Tab */}
          {activeTab === "locations" && (
            <div className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 md:mb-8">Our Office Locations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {locations.map((location, index) => (
                  <div key={index} className="bg-gray-50 p-4 md:p-6 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-300">
                    <div className="flex items-center mb-3 md:mb-4">
                      <div className="mr-3 md:mr-4 p-2 md:p-3 bg-blue-50 rounded-full">
                        {location.icon}
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-gray-800">{location.title}</h3>
                    </div>
                    <div className="space-y-2 md:space-y-3">
                      <p className="text-gray-700 text-sm md:text-base flex items-start">
                        <FaMapMarkerAlt className="mr-2 mt-0.5 md:mt-1 text-blue-500" />
                        {location.address}
                      </p>
                      <p className="text-gray-700 text-sm md:text-base flex items-start">
                        <FaClock className="mr-2 mt-0.5 md:mt-1 text-blue-500" />
                        {location.hours}
                      </p>
                      <p className="text-gray-700 text-sm md:text-base flex items-start">
                        <FaPhone className="mr-2 mt-0.5 md:mt-1 text-blue-500" />
                        {location.phone}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === "faq" && (
            <div className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 md:mb-8">Frequently Asked Questions</h2>
              <div className="space-y-3 md:space-y-4">
                {faqs.map((faq, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full text-left p-4 md:p-6 focus:outline-none flex justify-between items-center"
                    >
                      <h3 className="text-base md:text-lg font-medium text-gray-800">{faq.question}</h3>
                      <FaChevronDown 
                        className={`w-4 h-4 md:w-5 md:h-5 text-gray-500 transform transition-transform duration-200 ${activeFaq === index ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {activeFaq === index && (
                      <div className="px-4 md:px-6 pb-4 md:pb-6 pt-0 text-gray-600 text-sm md:text-base">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === "resources" && (
            <div className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 md:mb-8">Helpful Resources</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                {resources.map((resource, index) => (
                  <div key={index} className="bg-gray-50 p-4 md:p-6 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
                    <div className="flex items-center mb-3 md:mb-4">
                      <div className="mr-3 md:mr-4 p-2 md:p-3 bg-blue-50 rounded-full">
                        {resource.icon}
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-gray-800">{resource.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">{resource.description}</p>
                    <a href={resource.link} className="text-blue-600 text-sm md:text-base font-medium hover:text-blue-800 transition-colors">
                      Learn More →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map and Social Section */}
      <div className="bg-gray-100 py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Visit Our Headquarters</h2>
              <div className="bg-white p-3 md:p-4 rounded-lg shadow-md">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.041535836854!2d77.09897231508312!3d28.62864498242095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d04b6f5f3b0e9%3A0x6f5f3b0e96f5f3b0!2sGurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </div>
                <div className="mt-3 md:mt-4 space-y-1 md:space-y-2">
                  <p className="text-gray-700 text-sm md:text-base flex items-start">
                    <FaMapMarkerAlt className="mr-2 mt-0.5 md:mt-1 text-blue-600" />
                    <strong className="mr-1 md:mr-2">Address:</strong> 123 Business Park, Sector 45, Gurugram, Haryana 122003
                  </p>
                  <p className="text-gray-700 text-sm md:text-base flex items-start">
                    <FaClock className="mr-2 mt-0.5 md:mt-1 text-blue-600" />
                    <strong className="mr-1 md:mr-2">Hours:</strong> Monday-Friday: 9AM-6PM
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Stay Connected</h2>
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                <p className="text-gray-700 text-sm md:text-base mb-4 md:mb-6">
                  Follow us on social media for updates, news, and more ways to connect with our team.
                </p>
                <div className="flex flex-wrap gap-3 md:gap-4 mb-6 md:mb-8">
                  <a href="#" className="p-2 md:p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                    <FaFacebook className="text-lg md:text-xl" />
                  </a>
                  <a href="#" className="p-2 md:p-3 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors">
                    <FaTwitter className="text-lg md:text-xl" />
                  </a>
                  <a href="#" className="p-2 md:p-3 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors">
                    <FaLinkedin className="text-lg md:text-xl" />
                  </a>
                  <a href="#" className="p-2 md:p-3 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors">
                    <FaInstagram className="text-lg md:text-xl" />
                  </a>
                  <a href="#" className="p-2 md:p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors">
                    <FaWhatsapp className="text-lg md:text-xl" />
                  </a>
                </div>
                
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 md:mb-3">Subscribe to Our Newsletter</h3>
                  <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">
                    Get the latest updates, news and product offers directly to your inbox.
                  </p>
                  <div className="flex flex-col sm:flex-row">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="flex-grow px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-t-md sm:rounded-tr-none sm:rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button className="bg-blue-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-b-md sm:rounded-bl-none sm:rounded-r-md hover:bg-blue-700 transition-colors whitespace-nowrap">
                      Subscribe
                    </button>
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-700 text-white py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Still Have Questions?</h2>
          <p className="text-base md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our team is always ready to help.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
            <a 
              href="tel:+911234567890" 
              className="bg-white text-blue-700 px-4 py-2 md:px-6 md:py-3 rounded-md font-medium hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <FaPhone className="mr-2" />
              Call Us Now
            </a>
            <a 
              href="mailto:support@example.com" 
              className="bg-blue-800 text-white px-4 py-2 md:px-6 md:py-3 rounded-md font-medium hover:bg-blue-900 transition-colors flex items-center justify-center"
            >
              <FaEnvelope className="mr-2" />
              Email Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;