import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DitheringSphere from "../components/DitheringSphere";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(() => localStorage.getItem("boardnightRememberedEmail") || "");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem("boardnightRememberMe") === "true");

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
        "http://localhost:5000/api/auth/login",
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

      localStorage.setItem("boardnightRememberMe", rememberMe ? "true" : "false");
      if (rememberMe) localStorage.setItem("boardnightRememberedEmail", email);
      else localStorage.removeItem("boardnightRememberedEmail");

      /*
        ==========================================
        LOGIN SUCCESS
        ==========================================
      */

      const destination = typeof location.state?.from === "string" && location.state.from.startsWith("/") ? location.state.from : "/dashboard";
      navigate(destination, { replace: true });

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
    <div className="auth-page auth-page-fullscreen">
      <div className="auth-background-layer" aria-hidden="true">
        <DitheringSphere />
        <div className="auth-background-shade" />
        <div className="sphere-center-trigger" aria-label="Move pointer here to reveal the creators" tabIndex="0">
          <span className="sphere-brand-name">BYTE SQUAD</span>
          <span className="sphere-creators">CREATED BY<br />FAISAL · RITIKA · KHUSHI<br />SAANYA · KARAN · GULSHAN · VANSHIKA</span>
        </div>
      </div>
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo"><span className="auth-dice">✣</span> Board<span>Night</span><small>YOUR TABLE IS WAITING</small></div>

        {/* Heading */}
        <div className="auth-kicker">WELCOME BACK, PLAYER</div><h1>Good to see<br/>you again.</h1>

        <p className="auth-subtitle">
          Sign in to your space and get the next game night rolling.
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
            {loading ? "Signing in..." : "Enter BoardNight  →"}
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