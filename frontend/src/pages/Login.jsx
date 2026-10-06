import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api";
import { DiceIcon } from "../components/Icons";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      console.log("Login API response:", data);

      if (!response.ok || !data.success) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      /*
        ==========================================
        SAVE LOGGED-IN USER
        ==========================================
      */

      const user =
        data.user ||
        data.account ||
        data.data?.user ||
        null;

      if (!user) {
        setError(
          "Login successful, but user information was not returned by the server."
        );
        return;
      }

      const loggedInUser = {
        id: user.id,
        name: user.name || "",
        email: user.email || email,
        phone: user.phone || "",
        location: user.location || "",
      };

      /*
        Profile.jsx reads:
        localStorage.getItem("boardnightUser")
      */

      localStorage.setItem(
        "boardnightUser",
        JSON.stringify(loggedInUser)
      );

      /*
        Save token too if backend provides one.
      */

      if (data.token) {
        localStorage.setItem(
          "boardnightToken",
          data.token
        );
      }

      /*
        Remember me is currently kept as a preference.
      */

      localStorage.setItem(
        "boardnightRememberMe",
        rememberMe ? "true" : "false"
      );

      /*
        ==========================================
        LOGIN SUCCESS
        ==========================================
      */

      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to the server. Make sure the BoardNight backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <DiceIcon size={24} /> Board<span>Night</span>
        </div>


        {/* Heading */}
        <h1>Welcome back</h1>

        <p className="auth-subtitle">
          Login to continue planning your game nights.
        </p>

        {/* Error */}
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>

          {/* Email */}
          <label>Email address</label>

          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          {/* Password */}
          <div className="password-label-row">

            <label>Password</label>

            <button
              type="button"
              className="forgot-password"
              onClick={() =>
                alert(
                  "Password reset will be available in a future security step."
                )
              }
            >
              Forgot password?
            </button>

          </div>

          <div className="password-wrapper">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className="show-password"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? "Hide" : "Show"}
            </button>

          </div>

          {/* Remember me */}
          <label className="remember">

            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) =>
                setRememberMe(e.target.checked)
              }
            />

            Remember me

          </label>

          {/* Submit */}
          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Signup */}
        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/signup">
            Create one
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;