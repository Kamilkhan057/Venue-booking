// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Login Pages
import UserLogin from "./component/Page/User login/Login/UserLogin.jsx";
import DirectorLogin from "./component/Page/Directer/Login/DirectorLogin.jsx";
import ITLogin from "./component/Page/ITteam login/Login/ITLogin.jsx";

// Auth Pages
import Register from "./component/Page/User login/Register/Register.jsx";
import OTP from "./component/Page/User login/Forget password/OTP.jsx";
import ForgotPassword from "./component/Page/User login/Forget password/Forget.jsx";

// User Dashboard Pages
import Home from "./component/Page/User login/User-Deshbord/Home.jsx";
import DashboardLayout from "./component/Page/User login/User-Deshbord/DashboardLayout.jsx";
import Booking from "./component/Page/User login/User-Deshbord/Booking.jsx";
import AvailableSchedule from "./component/Page/User login/User-Deshbord/AvailableSchedule.jsx";
import History from "./component/Page/User login/User-Deshbord/History.jsx";
import Remarks from "./component/Page/User login/User-Deshbord/Remarks.jsx";
import Feedback from "./component/Page/User login/User-Deshbord/Feedback.jsx";

import "./App.css";
import ITForgot from "./component/Page/ITteam login/Forget pass/ITForget.jsx";
import DirecterForgot from "./component/Page/Directer/Forget password/DirecterForget.jsx";
import DirecterRegister from "./component/Page/Directer/Resister/DirecterRegister.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌐 Default Redirect to User Login */}
        <Route path="/" element={<Navigate to="/login/user" />} />

        {/* 🔐 Login Pages */}
        <Route path="/login/user" element={<UserLogin />} />
        <Route path="/login/director" element={<DirectorLogin />} />
        <Route path="/login/it" element={<ITLogin />} />

        {/* 🧾 Auth Pages */}
        <Route path="/register" element={<Register />} />
        <Route path="/register-Directer" element={<DirecterRegister />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password-it" element={<ITForgot />} />
        <Route path="/forgot-password-Directer" element={<DirecterForgot />} />

        {/* 📊 Dashboard Pages */}
        <Route path="/dashboard" element={<DashboardLayout />} />
        
        <Route path="/home" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/available" element={<AvailableSchedule />} />
        <Route path="/history" element={<History />} />
        <Route path="/remarks" element={<Remarks />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </Router>
  );
}

export default App;
