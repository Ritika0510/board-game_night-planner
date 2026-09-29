import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
  });

  const [editMode, setEditMode] = useState(false);

  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [loginHistory, setLoginHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  // ==========================================
  // GET LOGGED-IN USER
  // ==========================================

  const getStoredUser = () => {
    try {
      return JSON.parse(
        localStorage.getItem("boardnightUser") || "null"
      );
    } catch {
      return null;
    }
  };

  const storedUser = getStoredUser();
  const userId = storedUser?.id;

  // ==========================================
  // LOAD PROFILE FROM LOCAL STORAGE
  // ==========================================

  useEffect(() => {
    const user = getStoredUser();

    if (!user) {
      navigate("/login");
      return;
    }

    setProfile({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      location: user.location || "",
    });
  }, [navigate]);

  // ==========================================
  // LOAD LOGIN HISTORY
  // ==========================================

  useEffect(() => {
    const loadLoginHistory = async () => {
      const user = getStoredUser();

      if (!user?.id) {
        setLoginHistory([]);
        setHistoryLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/login-history/${user.id}`
        );

        const data = await response.json();

        if (data.success && Array.isArray(data.history)) {
          setLoginHistory(data.history);
        } else {
          setLoginHistory([]);
        }
      } catch (error) {
        console.error("Login history error:", error);
        setLoginHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    };

    loadLoginHistory();
  }, []);

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSaveProfile = (e) => {
    e.preventDefault();

    const user = getStoredUser();

    if (!user?.id) {
      alert("User session not found. Please login again.");
      navigate("/login");
      return;
    }

    const updatedUser = {
      ...user,
      name: profile.name,
      phone: profile.phone,
      location: profile.location,
    };

    localStorage.setItem(
      "boardnightUser",
      JSON.stringify(updatedUser)
    );

    setEditMode(false);

    alert("Profile updated successfully!");
  };

  // ==========================================
  // CHANGE PASSWORD
  // ==========================================

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!passwords.current) {
      alert("Please enter your current password.");
      return;
    }

    if (!passwords.newPassword) {
      alert("Please enter a new password.");
      return;
    }

    if (passwords.newPassword.length < 8) {
      alert("New password must be at least 8 characters.");
      return;
    }

    if (passwords.newPassword !== passwords.confirm) {
      alert("New passwords do not match.");
      return;
    }

    if (passwords.current === passwords.newPassword) {
      alert(
        "New password must be different from the current password."
      );
      return;
    }

    const user = getStoredUser();

    if (!user?.id) {
      alert("User session not found. Please login again.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            currentPassword: passwords.current,
            newPassword: passwords.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "Password change failed.");
        return;
      }

      alert("Password changed successfully!");

      setPasswords({
        current: "",
        newPassword: "",
        confirm: "",
      });

      setShowPasswordForm(false);
    } catch (error) {
      console.error("Password change error:", error);

      alert(
        "Unable to connect to the server. Make sure the BoardNight backend is running."
      );
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("boardnightUser");
    localStorage.removeItem("boardnightToken");

    navigate("/login");
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (dateString) => {
    if (!dateString) {
      return "Unknown";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="profile-page">

      {/* Navigation */}

      <nav className="profile-navbar">

        <div className="profile-logo">
          🎲 Board<span>Night</span>
        </div>

        <div className="profile-nav-links">
          <Link to="/dashboard">📊 Dashboard</Link>
          <Link to="/games">🎲 My Games</Link>
          <Link to="/planner">🗓️ Game Planner</Link>
          <Link to="/borrowed">🔄 Borrowed</Link>

          <Link
            to="/profile"
            className="active"
          >
            👤 Profile
          </Link>
        </div>

        <button
          className="profile-logout"
          onClick={handleLogout}
        >
          Logout
        </button>

      </nav>

      {/* Main */}

      <main className="profile-main">

        {/* Header */}

        <div className="profile-header">

          <div>
            <h1>My Profile</h1>

            <p>
              Manage your BoardNight account and security.
            </p>
          </div>

        </div>

        {/* Personal Information */}

        <section className="profile-card">

          <div className="profile-card-header">

            <div>
              <h2>Personal Information</h2>

              <p>
                Your BoardNight account information.
              </p>
            </div>

            {!editMode && (
              <button
                className="primary-button"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
            )}

          </div>

          <form onSubmit={handleSaveProfile}>

            <div className="profile-form-grid">

              {/* Name */}

              <div className="profile-field">

                <label>
                  Full name
                </label>

                <input
                  type="text"
                  value={profile.name}
                  disabled={!editMode}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      name: e.target.value,
                    })
                  }
                  required
                />

              </div>

              {/* Email */}

              <div className="profile-field">

                <label>
                  Email address
                </label>

                <input
                  type="email"
                  value={profile.email}
                  disabled
                />

              </div>

              {/* Phone */}

              <div className="profile-field">

                <label>
                  Phone
                </label>

                <input
                  type="text"
                  placeholder="Enter phone number"
                  value={profile.phone}
                  disabled={!editMode}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      phone: e.target.value,
                    })
                  }
                />

              </div>

              {/* Location */}

              <div className="profile-field">

                <label>
                  Location
                </label>

                <input
                  type="text"
                  placeholder="Enter location"
                  value={profile.location}
                  disabled={!editMode}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      location: e.target.value,
                    })
                  }
                />

              </div>

            </div>

            {editMode && (
              <div className="profile-form-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    const user = getStoredUser();

                    setProfile({
                      name: user?.name || "",
                      email: user?.email || "",
                      phone: user?.phone || "",
                      location: user?.location || "",
                    });

                    setEditMode(false);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  Save Changes
                </button>

              </div>
            )}

          </form>

        </section>

        {/* Password & Security */}

        <section className="profile-card">

          <div className="profile-card-header">

            <div>
              <h2>Password & Security</h2>

              <p>
                Keep your account secure.
              </p>
            </div>

            {!showPasswordForm && (
              <button
                className="outline-button"
                onClick={() =>
                  setShowPasswordForm(true)
                }
              >
                Change Password
              </button>
            )}

          </div>

          {showPasswordForm && (

            <form
              className="password-form"
              onSubmit={handleChangePassword}
            >

              {/* Current password */}

              <div className="profile-field">

                <label>
                  Current password
                </label>

                <input
                  type="password"
                  value={passwords.current}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      current: e.target.value,
                    })
                  }
                  autoComplete="current-password"
                  required
                />

              </div>

              {/* New password */}

              <div className="profile-field">

                <label>
                  New password
                </label>

                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      newPassword: e.target.value,
                    })
                  }
                  minLength={8}
                  autoComplete="new-password"
                  required
                />

              </div>

              {/* Confirm */}

              <div className="profile-field">

                <label>
                  Confirm new password
                </label>

                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      confirm: e.target.value,
                    })
                  }
                  minLength={8}
                  autoComplete="new-password"
                  required
                />

              </div>

              {/* Buttons */}

              <div className="profile-form-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setShowPasswordForm(false);

                    setPasswords({
                      current: "",
                      newPassword: "",
                      confirm: "",
                    });
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  Change Password
                </button>

              </div>

            </form>

          )}

        </section>

        {/* Login History */}

        <section className="profile-card">

          <div className="profile-card-header">

            <div>
              <h2>🔐 Login History</h2>

              <p>
                Recent login attempts on your BoardNight account.
              </p>
            </div>

          </div>

          <div className="login-history">

            {historyLoading ? (

              <div className="history-empty">
                Loading login history...
              </div>

            ) : loginHistory.length === 0 ? (

              <div className="history-empty">
                No login history available yet.
              </div>

            ) : (

              loginHistory.map((login) => {

                const successful =
                  login.status === "success";

                return (
                  <div
                    className={`login-history-item ${
                      successful
                        ? "login-success"
                        : "login-failed"
                    }`}
                    key={login.id}
                  >

                    <div className="login-history-icon">
                      {successful ? "✓" : "!"}
                    </div>

                    <div className="login-history-info">

                      <h3>
                        {successful
                          ? "Successful Login"
                          : "Failed Login"}
                      </h3>

                      <p>
                        {formatDate(login.login_at)}
                      </p>

                    </div>

                    <div className="login-history-meta">

                      <span>
                        IP:{" "}
                        {login.ip_address ||
                          "Unknown"}
                      </span>

                      {login.user_agent && (
                        <small>
                          {login.user_agent}
                        </small>
                      )}

                    </div>

                  </div>
                );
              })

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default Profile;