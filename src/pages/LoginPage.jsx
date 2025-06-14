import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { authService, userService } from "../services";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await authService.signInWithGoogle();
      if (error) throw error;

      // Google OAuth will redirect and handle navigation elsewhere
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Sign in with Supabase Auth
      const { data, error } = await authService.login(
        formData.email,
        formData.password
      );

      if (error) throw error;

      // Update last login timestamp
      if (data?.user) {
        await userService.updateLastLogin(data.user.id);
      }

      // Redirect to Dashboard page
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError("Please enter your email address first");
      return;
    }

    try {
      const { error } = await authService.resetPassword(formData.email);
      if (error) throw error;
      alert("Password reset instructions have been sent to your email");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="mt-30 flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Welcome back,</h2>
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-500 font-medium hover:underline"
            >
              Sign up
            </Link>{" "}
            here
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <button
          className="w-full flex items-center justify-center border rounded-lg py-2 mb-4 hover:bg-gray-50"
          onClick={handleGoogleLogin}
          type="button"
        >
          <FcGoogle className="text-xl mr-2" />
          Continue with Google
        </button>

        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="mx-2 text-gray-400 text-sm">Or</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={handleForgotPassword}
            className="text-sm text-blue-500 hover:underline"
          >
            Forgotten password?
          </button>
        </div>
      </div>
    </div>
  );
}
