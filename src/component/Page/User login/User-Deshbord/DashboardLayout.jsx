import { useState, useEffect } from "react";
import Booking from "./Booking";
import AvailableSlots from "./AvailableSchedule";
import History from "./History";
import Feedback from "./Feedback";
import Remarks from "./Remarks";
import Navbar from "./Navbar";
import Contact from "./Contact";
import FAQ from "./FAQ";

import {
  FaCalendarAlt,
  FaClock,
  FaHistory,
  FaCommentAlt,
  FaStickyNote,
  FaUser,
  FaSignOutAlt,
  FaTimes,
  FaQuestionCircle,
} from "react-icons/fa";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("booking");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const sectionId = `${activeTab}-section`;
    const section = document.getElementById(sectionId);
    if (section) {
      setTimeout(() => {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 400);
    }
  }, [activeTab]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "auto";
  }, [sidebarOpen]);

  const renderContent = () => {
    switch (activeTab) {
      case "booking":
        return <div id="booking-section"><Booking /></div>;
      case "slots":
        return <div id="slots-section"><AvailableSlots /></div>;
      case "history":
        return <div id="history-section"><History /></div>;
      case "feedback":
        return <div id="feedback-section"><Feedback /></div>;
      case "remarks":
        return <div id="remarks-section"><Remarks /></div>;
     case "contact":
  return <div id="contact-section"><Contact /></div>;
case "faq":
  return <div id="faq-section"><FAQ /></div>;
      default:
        return <div>Select an option</div>;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-white overflow-hidden">
      {/* Navbar */}
      <Navbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setActiveTab={setActiveTab}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="relative w-64 bg-gradient-to-b from-blue-700 to-blue-900 shadow-2xl z-30 md:static fixed h-full overflow-y-auto transition-all duration-300">
            <div className="p-6 pb-2 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white tracking-wide">
                Dashboard Menu
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden text-white hover:text-blue-200 transition"
              >
                <FaTimes />
              </button>
            </div>

            <nav className="mt-4 px-4 space-y-2">
              {[
                { key: "booking", label: "Booking", icon: <FaCalendarAlt className="mr-3" /> },
                { key: "slots", label: "Available Slots", icon: <FaClock className="mr-3" /> },
                { key: "history", label: "History", icon: <FaHistory className="mr-3" /> },
                { key: "feedback", label: "Feedback", icon: <FaCommentAlt className="mr-3" /> },
                { key: "remarks", label: "Remarks", icon: <FaStickyNote className="mr-3" /> },
                { key: "contact", label: "Contact", icon: <FaUser className="mr-3" /> },
                { key: "faq", label: "FAQ", icon: <FaQuestionCircle className="mr-3" /> },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                    activeTab === item.key
                      ? "bg-blue-500 text-white shadow-lg"
                      : "text-blue-100 hover:bg-blue-600 hover:text-white"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-16 pt-6 border-t border-blue-500 mx-4 px-4 pb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center">
                    <FaUser className="text-blue-800 text-xl" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-blue-800"></div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Jason D</p>
                  <p className="text-xs text-blue-200">name@gmail.com</p>
                </div>
              </div>
              <button className="w-full flex items-center justify-center px-4 py-2 text-sm text-blue-200 bg-blue-800 hover:bg-blue-700 rounded-lg transition">
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>

            <div className="px-6 pb-6">
              <div className="bg-blue-600/40 backdrop-blur-sm rounded-xl p-4 border border-blue-500">
                <h3 className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-2">Premium Account</h3>
                <div className="h-2 bg-blue-800 rounded-full mb-2">
                  <div className="h-2 bg-green-400 rounded-full" style={{ width: "75%" }}></div>
                </div>
                <p className="text-xs text-blue-100">75% of features used</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-0 md:p-1">
          <div className="bg-white rounded-1xl shadow-lg p-4 md:p-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
