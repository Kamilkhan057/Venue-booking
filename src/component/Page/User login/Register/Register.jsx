import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
    captcha: "",
  });
  function generateCaptcha(length = 5) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$"; // No confusing letters like O/0 or I/1
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

const [generatedCaptcha] = useState(() => generateCaptcha(5)); // length = 5
const [step, setStep] = useState("form");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (!form.email && !form.contact) {
      setError("Please enter either Email or Contact number.");
      return;
    }

    if (form.email && form.contact) {
      setError("Please enter only one: Email or Contact.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.captcha !== generatedCaptcha) {
      setError("Incorrect CAPTCHA.");
      return;
    }

    setError("");
    setShowOTP(true);
  };

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
  };

  const handleOtpConfirm = () => {
    alert("OTP Verified: " + otp.join(""));
  };


  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200 px-4">
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Register</h2>

        {!showOTP ? (
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="firstName" value={form.firstName} onChange={handleChange} required placeholder="First Name" className="p-2 border rounded-lg w-full" />
              <input name="lastName" value={form.lastName} onChange={handleChange} required placeholder="Last Name" className="p-2 border rounded-lg w-full" />
            </div>

            <div className="relative">
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email (optional)" className="p-2 rounded-lg w-full border border-gray-300" disabled={form.contact !== ""} />
              <p className="absolute text-sm text-center text-gray-500 left-1/2 -translate-x-1/2 top-full mt-1">OR</p>
            </div>

            <input type="tel" name="contact" value={form.contact} onChange={handleChange} placeholder="Contact No (optional)" className="p-2 rounded-lg w-full border border-gray-300" disabled={form.email !== ""} />

            <div className="relative">
              <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} required placeholder="Password" className="p-2 rounded-lg w-full border border-gray-300" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2 text-gray-600 text-sm">{showPassword ? "Hide" : "Show"}</button>
            </div>

            <div className="relative">
              <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required placeholder="Confirm Password" className="p-2 rounded-lg w-full border border-gray-300" />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-2 text-gray-600 text-sm">{showConfirmPassword ? "Hide" : "Show"}</button>
            </div>

            <div>
  <label className="text-sm text-gray-600 mb-1 block">CAPTCHA</label>
  <div className="flex items-center gap-3">
    <div className="px-3 py-1.5 font-bold bg-gray-100 text-blue-700 border border-blue-300 rounded-lg shadow text-sm">
      {generatedCaptcha}
    </div>
    <div className="h-5 w-px bg-gray-400" /> {/* ← vertical divider line */}
    <input
      name="captcha"
      value={form.captcha}
      onChange={handleChange}
      required
      placeholder="Enter CAPTCHA"
      className="p-2 border rounded-lg flex-1 focus:ring-2 focus:ring-blue-400 outline-none"
    />
  </div>
</div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-full font-semibold py-2 rounded-xl">Register</button>
            <div className="mt-6 text-center text-sm text-gray-600">
  Already have an account?
  <Link to="/" className="text-blue-600 font-semibold hover:underline ml-1">
    Back to Login
  </Link>
</div>
          </form>
        ) : (

            
          <div>
            <h3 className="text-lg font-bold mb-2 text-center">Enter OTP</h3>
            <div className="flex justify-center gap-3 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  maxLength={1}
                  className="w-10 h-10 text-center border rounded-md text-lg font-semibold"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                />
              ))}
            </div>
            <button onClick={handleOtpConfirm} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-xl w-full">
              Confirm OTP
            </button>

            

          </div>
          
        )}
      </div>
      
    </div>
  );
}

export default Register;
