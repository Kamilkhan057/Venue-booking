import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      startExitAnimation();
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const startExitAnimation = () => {
    setIsExiting(true);
    setTimeout(() => navigate("/dashboard"), 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-300 via-indigo-200 to-purple-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          transition: { duration: 0.6, ease: "easeOut" }
        }}
        exit={{ 
          opacity: 0, 
          scale: 0.98, 
          y: 20,
          transition: { duration: 0.5 }
        }}
        className="backdrop-blur-xl bg-white/70 border border-white/40 shadow-[0_25px_50px_-15px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-8 md:p-12 w-full max-w-2xl text-center space-y-8 relative overflow-hidden"
      >
        {/* Floating gradient bubbles */}
        <div className="absolute -inset-10 -z-10 opacity-70">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-300/40 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-sky-300/40 rounded-full blur-3xl animate-float animation-delay-2000"></div>
        </div>

        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0, rotate: -15 }}
          animate={{ 
            scale: 1, 
            opacity: 1, 
            rotate: 0,
            transition: { 
              type: "spring", 
              damping: 10, 
              stiffness: 100,
              delay: 0.2
            }
          }}
          whileHover={{ scale: 1.05, rotate: [0, 3, -3, 0] }}
          className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg flex items-center justify-center"
        >
          <motion.span 
            className="text-white text-3xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.4 } }}
          >
            VB
          </motion.span>
        </motion.div>

        {/* Welcome Text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Venue Booking</span>
          </h1>
          <p className="text-lg text-gray-600 mt-3 max-w-md mx-auto">
            Manage your reservations with speed and elegance
          </p>
        </motion.div>

        {/* Progress Bar with Glow */}
        <div className="mt-8 px-4">
          <div className="relative w-full h-2.5 bg-gray-200/80 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-[0_0_8px_rgba(66,153,225,0.6)]"
            />
          </div>
          
          <div className="flex justify-between mt-3">
            <span className="text-sm text-gray-500">Loading dashboard...</span>
            <span className="text-sm font-medium text-indigo-600">
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                ●
              </motion.span> Live
            </span>
          </div>
        </div>

        {/* Animated Skip Button */}
        <motion.button
          onClick={startExitAnimation}
          whileHover={{ 
            scale: 1.05,
            background: "linear-gradient(to right, #3b82f6, #6366f1)",
            boxShadow: "0 4px 14px rgba(99, 102, 241, 0.25)"
          }}
          whileTap={{ scale: 0.98 }}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-full shadow-sm transition-all duration-300 relative overflow-hidden"
        >
          <span className="relative z-10">Enter Dashboard Now</span>
          <motion.span
            className="absolute inset-0 bg-white opacity-0 hover:opacity-10"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.1 }}
          />
        </motion.button>
        
        <p className="text-xs text-gray-400 mt-4">
          Redirecting in <span className="font-medium">5</span> seconds...
        </p>
      </motion.div>
      
      {/* Add this to your CSS file or tailwind config */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-15px); }
          75% { transform: translateY(15px) translateX(-5px); }
        }
        .animate-float { animation: float 12s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
}

export default Home;