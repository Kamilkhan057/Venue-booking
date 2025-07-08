// pages/UserLogin.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

function UserLogin() {
  const navigate = useNavigate();
  const [captcha] = useState(() => Math.floor(1000 + Math.random() * 9000));
  const [form, setForm] = useState({
    email: "",
    password: "",
    captchaInput: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = (e) => {
    e.preventDefault();
    
    setError("");
    alert("Login successful!");
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200 px-4">
      {/* Role Switch Buttons */}
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
        <h2 className="text-xl font-bold text-center text-blue-600">User Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Email"
            className="w-full p-2 border rounded-lg"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Password"
            className="w-full p-2 border rounded-lg"
          />
        
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl"
          >
            Login
          </button>

          {/* Google Login */}
          <div className="flex items-center justify-center mt-4">
            <FcGoogle className="text-2xl mr-2" />
            <span className="text-blue-600 font-semibold cursor-pointer hover:underline">Login with Google</span>
          </div>

          <div className="text-sm text-center mt-2">
            <span className="text-gray-600">Don’t have an account?</span>
            <a href="/register" className="text-blue-600 ml-1 font-medium hover:underline">Register</a>
            <span className="mx-2 text-gray-400">|</span>
            <a href="/forgot-password" className="text-blue-600 font-medium hover:underline">Forgot Password?</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserLogin;
