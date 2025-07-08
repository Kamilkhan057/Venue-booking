// pages/ITLogin.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function ITLogin() {
  const navigate = useNavigate();
  const [captcha] = useState(() => Math.floor(1000 + Math.random() * 9000));
  const [form, setForm] = useState({ empId: "", password: "", captchaInput: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = (e) => {
    e.preventDefault();
    if (form.captchaInput !== captcha.toString()) {
      setError("Incorrect CAPTCHA");
      return;
    }
    setError("");
    navigate("/otp");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200 px-4">
      {/* Role Switch */}
<div className="flex flex-wrap justify-center gap-3 mb-8 px-4">
  <button
    onClick={() => navigate('/login/user')}
    className={`min-w-[100px] px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 shadow-sm ${
      window.location.pathname === '/login/user'
        ? 'bg-blue-600 text-white shadow-md'
        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
    }`}
  >
    User
  </button>
  <button
    onClick={() => navigate('/login/it')}
    className={`min-w-[100px] px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 shadow-sm ${
      window.location.pathname === '/login/it'
        ? 'bg-blue-600 text-white shadow-md'
        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
    }`}
  >
    IT Team
  </button>
  <button
    onClick={() => navigate('/login/director')}
    className={`min-w-[100px] px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 shadow-sm ${
      window.location.pathname === '/login/director'
        ? 'bg-blue-600 text-white shadow-md'
        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
    }`}
  >
    Director
  </button>
</div>

      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md space-y-6">
        <h2 className="text-xl font-bold text-center text-blue-600">IT Team Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="text" name="empId" value={form.empId} onChange={handleChange} required placeholder="Employee ID" className="w-full p-2 border rounded-lg" />
          <input type="password" name="password" value={form.password} onChange={handleChange} required placeholder="Password" className="w-full p-2 border rounded-lg" />



   <div className="mb-4">
  <label className="block text-sm font-semibold text-gray-700 mb-1">
    CAPTCHA
  </label>

  <div className="flex items-center justify-between gap-2">
    <div className="flex-1 px-4 py-2 text-lg font-bold text-blue-600 bg-gray-100 rounded-md shadow-inner tracking-widest">
      {captcha}
    </div>
    <input
      type="text"
      name="captchaInput"
      value={form.captchaInput}
      onChange={handleChange}
      required
      placeholder="Enter CAPTCHA"
      className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
    />
  </div>

  {error && (
    <p className="text-red-500 text-sm mt-1 animate-pulse">
      {error}
    </p>
  )}
</div>




          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl">Login</button>
          <div className="text-center mt-4 text-sm">
  Don’t have an account?{" "}
  
  |{" "}
  <a href="/forgot-password-it" className="text-blue-600 font-medium hover:underline">
    Forgot Password?
  </a>
</div>
        </form>
      </div>
    </div>
  );
}

export default ITLogin;
