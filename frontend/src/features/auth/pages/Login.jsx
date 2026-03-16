import React, { useState } from "react";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate form
      if (!formData.email || !formData.password) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      // TODO: Add login API call here
      console.log("Login attempt:", formData);

      // Reset form on success
      setFormData({ email: "", password: "" });
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: "#31b8c6" }}>
            Login
          </h1>
          <p className="text-gray-400">Welcome back to Perplexity</p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition"
                style={{ "--tw-ring-color": "rgb(49, 184, 198)" }}
                onFocus={(e) => (e.target.style.borderColor = "#31b8c6")}
                onBlur={(e) => (e.target.style.borderColor = "")}
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition"
                style={{ "--tw-ring-color": "rgb(49, 184, 198)" }}
                onFocus={(e) => (e.target.style.borderColor = "#31b8c6")}
                onBlur={(e) => (e.target.style.borderColor = "")}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="px-4 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: "rgba(49, 184, 198, 0.1)",
                  borderColor: "#31b8c6",
                  color: "#31b8c6",
                }}
                className="border"
              >
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 text-white font-semibold rounded-lg transition duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ backgroundColor: "#31b8c6" }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#289aad")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#31b8c6")}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="text-center mt-6">
            <a
              href="#"
              className="text-sm font-medium transition"
              style={{ color: "#31b8c6" }}
              onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.target.style.opacity = "1")}
            >
              Forgot your password?
            </a>
          </div>

          {/* Register Link */}
          <div className="text-center mt-4 pt-4 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <a
                href="/register"
                className="font-medium transition"
                style={{ color: "#31b8c6" }}
                onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
                onMouseLeave={(e) => (e.target.style.opacity = "1")}
              >
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
