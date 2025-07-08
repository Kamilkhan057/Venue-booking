import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ITForgot() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        contact: "",
        password: "",
        confirmPassword: "",
        captcha: "",
    });

    function generateCaptcha(length = 5) {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789@!#$%^&*()"; // No confusing letters like O/0 or I/1
        let result = "";
        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }

    const [generatedCaptcha] = useState(() => generateCaptcha(5)); // length = 5

    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [otpVisible, setOtpVisible] = useState(false);
    const [otp, setOtp] = useState(["", "", "", ""]);

    // Handle form change
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Toggle one of email/contact required
    const isEmailFilled = form.email.trim() !== "";
    const isContactFilled = form.contact.trim() !== "";

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isEmailFilled && !isContactFilled) {
            setError("Please fill either Email or Contact number.");
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (form.captcha !== generatedCaptcha) {
            setError("Invalid CAPTCHA.");
            return;
        }
        setError("");
        setOtpVisible(true);
    };

    const handleOtpChange = (index, value) => {
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Auto focus next box
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput && value) nextInput.focus();

        // Auto-submit if complete
        if (index === 3 && newOtp.every((v) => v !== "")) {
            handleConfirm();
        }
    };

    const handleConfirm = () => {
        alert("OTP Verified. Password reset successful.");
        navigate("/");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200 px-4">
            <div className="bg-white shadow-xl rounded-3xl p-8 w-full max-w-lg">
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
                    Forgot Password
                </h2>

                {!otpVisible ? (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email / Contact with OR */}
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                                disabled={isContactFilled}
                                className={`p-2 border w-full rounded-lg transition focus:outline-none ${isEmailFilled ? "border-green-500" : "border-gray-300"
                                    }`}
                            />
                            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 bg-white px-2">
                                OR
                            </div>
                        </div>
                        <input
                            type="tel"
                            name="contact"
                            placeholder="Contact Number"
                            value={form.contact}
                            onChange={handleChange}
                            disabled={isEmailFilled}
                            className={`p-2 border w-full rounded-lg transition focus:outline-none ${isContactFilled ? "border-green-500" : "border-gray-300"
                                }`}
                        />

                        {/* Password */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="New Password"
                                value={form.password}
                                onChange={handleChange}
                                className={`p-2 pr-10 border w-full rounded-lg focus:outline-none ${form.password.length >= 8 ? "border-green-500" : "border-gray-300"
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-2.5 right-3 text-gray-600"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Confirm Password */}
                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                className={`p-2 pr-10 border w-full rounded-lg focus:outline-none ${form.password === form.confirmPassword &&
                                    form.confirmPassword !== ""
                                    ? "border-green-500"
                                    : "border-gray-300"
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute top-2.5 right-3 text-gray-600"
                            >
                                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* CAPTCHA */}
                       <div className="mb-4">
  <label className="text-sm font-medium text-gray-700 mb-1 block">CAPTCHA</label>

  <div className="flex items-center gap-4 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
    {/* CAPTCHA Box */}
    <div className="px-4 py-2 text-base font-semibold bg-gray-100 text-blue-700 border border-blue-300 rounded-md tracking-widest shadow-inner select-none">
      {generatedCaptcha}
    </div>

    {/* Vertical Divider */}
    <div className="h-6 w-px bg-gray-300" />

    {/* CAPTCHA Input */}
    <input
      type="text"
      name="captcha"
      value={form.captcha}
      onChange={handleChange}
      required
      placeholder="Enter CAPTCHA"
      className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200"
    />
  </div>

  {/* Error Text */}
  {error && (
    <p className="text-red-500 text-sm mt-1 animate-pulse">
      {error}
    </p>
  )}
</div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl"
                        >
                            Confirm
                        </button>
                    </form>
                ) : (
                    <>
                        {/* OTP Section */}
                        <h3 className="text-lg text-center mb-4 font-semibold text-blue-700">
                            Enter OTP sent to your contact
                        </h3>
                        <div className="flex justify-center gap-3 mb-5">
                            {otp.map((digit, idx) => (
                                <input
                                    key={idx}
                                    id={`otp-${idx}`}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                                    className="w-12 h-12 text-center border border-gray-300 rounded-md text-lg font-bold"
                                />
                            ))}
                        </div>
                        <button
                            onClick={handleConfirm}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-xl"
                        >
                            Verify OTP
                        </button>
                    </>
                )}

                {/* Back Button */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    <button
                        onClick={() => navigate("/login/it")}
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        ⬅ Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ITForgot;
