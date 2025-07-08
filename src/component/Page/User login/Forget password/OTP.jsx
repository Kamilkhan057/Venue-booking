import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function OTP() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/"; // remember where OTP came from

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Focus next input
      if (value && index < otp.length - 1) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleConfirm = () => {
    if (otp.every((digit) => digit !== "")) {
      alert("OTP Verified: " + otp.join(""));
      // Navigate wherever you want after success
    } else {
      alert("Please enter the full OTP.");
    }
  };

  const handleBack = () => {
    navigate(from);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-white px-4">
      <div className="bg-white shadow-xl p-8 rounded-2xl max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold text-green-700 mb-4">OTP Verification</h2>
        <p className="text-gray-600 text-sm mb-6">Please enter the 4-digit code sent to your email/contact.</p>

        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-${idx}`}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              maxLength={1}
              className="w-12 h-12 text-center border border-gray-300 rounded-lg text-xl font-semibold focus:ring-2 focus:ring-green-500 outline-none"
            />
          ))}
        </div>

        <div className="text-sm text-gray-700 mb-4">
          Time left: <span className="font-semibold text-red-500">{minutes}:{seconds}</span>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-xl mb-3"
        >
          Confirm OTP
        </button>

        <button
          onClick={handleBack}
          className="w-full text-green-700 hover:underline text-sm"
        >
          🔙 Back
        </button>
      </div>
    </div>
  );
}

export default OTP;
