import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="dashboard-page">

      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">
          🎲 Board<span>Night</span>
        </div>

        <nav>
          <Link to="/dashboard" className="active">
            📊 Dashboard
          </Link>

          <Link to="/games">
            🎲 My Games
          </Link>

          <Link to="/planner">
            📅 Game Planner
          </Link>

          <Link to="/borrowed">
            📦 Borrowed
          </Link>

          <Link to="/profile">
            👤 Profile
          </Link>
        </nav>

        <Link to="/" className="logout-link">
          ← Back to Home
        </Link>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">

        {/* Header */}
        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">
              YOUR DASHBOARD
            </p>

            <h1>Good evening, Faisal 👋</h1>

            <p>
              Ready to plan your next game night?
            </p>
          </div>

          <Link to="/planner" className="dashboard-action">
            + Plan Game Night
          </Link>
        </header>

        {/* Statistics */}
        <section className="dashboard-stats">

          <div className="stat-card">
            <span className="stat-icon">🎲</span>
            <div>
              <strong>24</strong>
              <p>Total Games</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">✅</span>
            <div>
              <strong>19</strong>
              <p>Available</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">📦</span>
            <div>
              <strong>5</strong>
              <p>Borrowed</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">📅</span>
            <div>
              <strong>3</strong>
              <p>Upcoming Nights</p>
            </div>
          </div>

        </section>

        {/* Content Grid */}
        <section className="dashboard-grid">

          {/* Upcoming Game Night */}
          <div className="dashboard-card upcoming-card">

            <div className="card-heading">
              <div>
                <p className="card-label">
                  NEXT EVENT
                </p>

                <h2>Friday Game Night</h2>
              </div>

              <span className="event-date">
                27 SEP
              </span>
            </div>

            <p className="card-description">
              A casual game night with friends.
            </p>

            <div className="event-info">
              <span>👥 8 Players</span>
              <span>🕖 7:00 PM</span>
              <span>📍 Common Room</span>
            </div>

            <div className="game-tags">
              <span>Catan</span>
              <span>UNO</span>
              <span>Codenames</span>
            </div>

            <Link to="/planner" className="card-button">
              View Game Night →
            </Link>

          </div>

          {/* Quick Actions */}
          <div className="dashboard-card">

            <p className="card-label">
              QUICK ACTIONS
            </p>

            <h2>What do you want to do?</h2>

            <div className="quick-actions">

              <Link to="/games">
                <span>🎲</span>
                <div>
                  <strong>Manage Games</strong>
                  <small>Add or edit your games</small>
                </div>
              </Link>

              <Link to="/planner">
                <span>📅</span>
                <div>
                  <strong>Plan Game Night</strong>
                  <small>Create a new event</small>
                </div>
              </Link>

              <Link to="/borrowed">
                <span>📦</span>
                <div>
                  <strong>Track Borrowed</strong>
                  <small>See who has your games</small>
                </div>
              </Link>

            </div>

          </div>

        </section>

        {/* Recently Added */}
        <section className="dashboard-card recent-games">

          <div className="card-heading">
            <div>
              <p className="card-label">
                YOUR COLLECTION
              </p>

              <h2>Recently Added Games</h2>
            </div>

            <Link to="/games">
              View All →
            </Link>
          </div>

          <div className="recent-game-list">

            <div className="recent-game">
              <div className="recent-game-icon">
                ♟️
              </div>

              <div>
                <strong>Catan</strong>
                <p>3–4 Players • 60–90 min</p>
              </div>

              <span className="available-badge">
                Available
              </span>
            </div>

            <div className="recent-game">
              <div className="recent-game-icon">
                🃏
              </div>

              <div>
                <strong>Exploding Kittens</strong>
                <p>2–5 Players • 15 min</p>
              </div>

              <span className="available-badge">
                Available
              </span>
            </div>

            <div className="recent-game">
              <div className="recent-game-icon">
                🏰
              </div>

              <div>
                <strong>Carcassonne</strong>
                <p>2–5 Players • 45 min</p>
              </div>

              <span className="borrowed-badge">
                Borrowed
              </span>
            </div>

          </div>

        </section>

      </main>
    </div>
  );
}

export default Dashboard;