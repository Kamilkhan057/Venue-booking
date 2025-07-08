import { useState, useEffect, useRef } from "react";
import { FaBell, FaBars, FaTimes, FaSearch, FaHeadset, FaUser, FaCaretDown } from "react-icons/fa";

function Navbar({ sidebarOpen, setSidebarOpen, setActiveTab }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  const pages = [
    { key: "booking", label: "📅 Booking", sectionId: "booking-section" },
    { key: "slots", label: "🕓 Available Slots", sectionId: "slots-section" },
    { key: "history", label: "📜 History", sectionId: "history-section" },
    { key: "feedback", label: "💬 Feedback", sectionId: "feedback-section" },
    { key: "remarks", label: "📝 Remarks", sectionId: "remarks-section" },
  ];

  const filtered = pages.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (key, sectionId) => {
    setActiveTab(key);
    setSearchTerm("");
    setShowResults(false);
    setHighlightIndex(-1);

    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 200);
  };

  const handleKeyDown = (e) => {
    if (!showResults || filtered.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev === 0 ? filtered.length - 1 : prev - 1
      );
    } else if (e.key === "Enter" && highlightIndex !== -1) {
      e.preventDefault();
      const selected = filtered[highlightIndex];
      handleSelect(selected.key, selected.sectionId);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
        setHighlightIndex(-1);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full backdrop-blur-sm bg-white/95 shadow-sm px-4 md:px-6 transition-all duration-300 flex justify-between items-center py-3 sticky top-0 z-50 border-b border-gray-100">
      {/* Left: Toggle + Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-300"
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {sidebarOpen ? (
            <FaTimes size={20} className="text-blue-700" />
          ) : (
            <FaBars size={20} className="text-blue-700" />
          )}
        </button>
        
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 w-8 h-8 rounded-lg flex items-center justify-center shadow">
            <span className="text-white font-bold text-lg">V</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight hidden sm:block">
            Venue<span className="text-blue-600">Booking</span>
          </h1>
        </div>
      </div>

      {/* Center: Search Bar (only when sidebar is closed) */}
      {!sidebarOpen && (
        <div className="flex-grow max-w-2xl mx-4">
          <div ref={searchRef} className="relative">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3.5 text-gray-400 text-sm" />
              <input
                type="text"
                value={searchTerm}
                placeholder="Search pages..."
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowResults(true);
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => searchTerm && setShowResults(true)}
                className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm w-full bg-white shadow transition-all placeholder-gray-400"
              />
            </div>

            {showResults && searchTerm && (
              <div className="absolute z-50 mt-1.5 w-full bg-white shadow-lg rounded-xl border border-gray-100 max-h-60 overflow-y-auto animate-fadeIn">
                <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b">
                  QUICK NAVIGATION
                </div>
                {filtered.length > 0 ? (
                  filtered.map((item, idx) => (
                    <button
                      key={item.key}
                      onMouseDown={() => handleSelect(item.key, item.sectionId)}
                      className={`flex items-center gap-3 w-full text-left px-4 py-3 text-sm transition-all ${
                        highlightIndex === idx
                          ? "bg-blue-50 text-blue-700"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="bg-blue-50 p-1.5 rounded-lg text-blue-700">
                        {item.label.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{item.label.slice(2)}</div>
                        <div className="text-xs text-gray-500 capitalize">{item.key}</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-6 flex flex-col items-center justify-center">
                    <div className="bg-gray-100 p-3 rounded-full mb-2">
                      <FaSearch className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">No matches found</p>
                    <p className="text-xs text-gray-400 mt-1">Try different keywords</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Right Side: Actions */}
      <div className="flex items-center gap-3">
        <div className="flex gap-2">
          <button
            className="text-gray-500 hover:text-green-600 transition p-2.5 rounded-lg hover:bg-green-50 relative group"
            title="Customer Support"
            aria-label="Support"
          >
            <FaHeadset size={18} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
          </button>

          <button 
            className="text-gray-500 hover:text-blue-600 transition p-2.5 rounded-lg hover:bg-blue-50 relative group"
            aria-label="Notifications"
          >
            <FaBell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>

        {!sidebarOpen && (
          <div 
            ref={profileRef}
            className="flex items-center gap-2 cursor-pointer group pl-2 relative"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow">
                <FaUser size={14} />
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="hidden md:flex items-center">
              <div className="text-right mr-1">
                <p className="text-sm font-medium text-gray-800">Jason D</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
              <FaCaretDown className={`text-gray-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
            </div>
            
            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-fadeIn z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-800">Jason Derulo</p>
                  <p className="text-xs text-gray-500 truncate">name@venuebooking.com</p>
                </div>
                <div className="py-1">
                  <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
                    My Profile
                  </button>
                  <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
                    Account Settings
                  </button>
                  <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
                    Notification Settings
                  </button>
                </div>
                <div className="py-1 border-t border-gray-100">
                  <button className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition">
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;