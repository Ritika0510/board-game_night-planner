import { useMemo } from "react";
import { Link } from "react-router-dom";
import { DiceIcon, DashboardIcon, CalendarIcon, BoxIcon, UserIcon, CheckIcon, PlusIcon } from "../components/Icons";


const defaultGames = [
  { id: 1, name: "Catan", status: "available" },
  { id: 2, name: "UNO", status: "available" },
  { id: 3, name: "Carcassonne", status: "borrowed" },
  { id: 4, name: "Codenames", status: "available" },
  { id: 5, name: "Ticket to Ride", status: "available" },
];

const defaultBorrowed = [
  { id: 1, game: "Carcassonne", person: "Karan", borrowedDate: "2026-09-20", returnDate: "2026-09-28" },
  { id: 2, game: "Monopoly", person: "Saanya", borrowedDate: "2026-09-21", returnDate: "2026-09-30" },
  { id: 3, game: "Codenames", person: "Gulshan", borrowedDate: "2026-09-22", returnDate: "2026-09-25" },
];

const weekData = [
  { day: "Mon", value: 54 },
  { day: "Tue", value: 72 },
  { day: "Wed", value: 46 },
  { day: "Thu", value: 91 },
  { day: "Fri", value: 100 },
  { day: "Sat", value: 82 },
  { day: "Sun", value: 68 },
];

function Dashboard() {
  const games = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("boardnightGames") || "null") || defaultGames;
    } catch {
      return defaultGames;
    }
  }, []);

  const borrowed = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("boardnightBorrowed") || "null") || defaultBorrowed;
    } catch {
      return defaultBorrowed;
    }
  }, []);

  const totalGames = games.length;
  const availableGames = games.filter((game) => (game.status || "available") !== "borrowed").length;
  const borrowedCount = borrowed.length;

  const borrowerMap = borrowed.reduce((acc, item) => {
    acc[item.person] = (acc[item.person] || 0) + 1;
    return acc;
  }, {});

  const topBorrowers = Object.entries(borrowerMap)
    .map(([person, count]) => ({ person, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const activityFeed = [
    { label: "Borrow record added", value: `${borrowedCount} active loans` },
    { label: "Library health", value: `${availableGames} games ready to play` },
    { label: "Top lender", value: topBorrowers[0]?.person ? `${topBorrowers[0].person} borrowed ${topBorrowers[0].count} games` : "No loans yet" },
  ];

  const recentGames = games.slice(0, 3);

  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <div className="dashboard-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DiceIcon size={22} /> Board<span>Night</span>
        </div>

        <nav>
          <Link to="/dashboard" className="active" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DashboardIcon size={16} /> Dashboard
          </Link>
          <Link to="/games" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><DiceIcon size={16} /> My Games</Link>
          <Link to="/planner" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CalendarIcon size={16} /> Game Planner</Link>
          <Link to="/borrowed" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><BoxIcon size={16} /> Borrowed</Link>
          <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><UserIcon size={16} /> Profile</Link>
        </nav>

        <Link to="/" className="logout-link">
          ← Back to Home
        </Link>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">YOUR DASHBOARD</p>
            <h1>Welcome back</h1>
            <p>Track your collection, borrow flow, and game-night momentum.</p>
          </div>

          <Link to="/planner" className="dashboard-action" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <PlusIcon size={16} /> Plan Game Night
          </Link>
        </header>

        <section className="dashboard-stats">
          <div className="stat-card">
            <span className="stat-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DiceIcon size={24} />
            </span>
            <div>
              <strong>{totalGames}</strong>
              <p>Total Games</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckIcon size={24} />
            </span>
            <div>
              <strong>{availableGames}</strong>
              <p>Available</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BoxIcon size={24} />
            </span>
            <div>
              <strong>{borrowedCount}</strong>
              <p>Borrowed</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DashboardIcon size={24} />
            </span>
            <div>
              <strong>{Math.max(4, Math.round((availableGames / Math.max(totalGames, 1)) * 100))}%</strong>
              <p>Ready to Play</p>
            </div>
          </div>
        </section>


        <section className="dashboard-grid">
          <div className="panel panel-hero">
            <div className="panel-header">
              <div>
                <p className="card-label">NEXT EVENT</p>
                <h2>Friday Game Night</h2>
              </div>
              <span className="event-date">27 SEP</span>
            </div>

            <p className="card-description">A casual night of strategy, chaos, and laughs with the crew.</p>

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

          <div className="panel">
            <div className="panel-header compact-header">
              <div>
                <p className="card-label">BORROWING PULSE</p>
                <h2>Who’s borrowing?</h2>
              </div>
            </div>

            <div className="pulse-list">
              {topBorrowers.length > 0 ? (
                topBorrowers.map(({ person, count }) => (
                  <div key={person} className="pulse-row">
                    <div className="pulse-meta">
                      <span className="pulse-avatar">{person.slice(0, 1).toUpperCase()}</span>
                      <div>
                        <strong>{person}</strong>
                        <small>{count} games</small>
                      </div>
                    </div>
                    <div className="pulse-bar">
                      <span style={{ width: `${Math.min((count / Math.max(borrowedCount, 1)) * 100, 100)}%` }} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-mini-label">No active borrow records yet.</p>
              )}
            </div>
          </div>
        </section>

        <section className="dashboard-grid dashboard-grid-bottom">
          <div className="panel panel-chart">
            <div className="panel-header compact-header">
              <div>
                <p className="card-label">WEEKLY PROGRESS</p>
                <h2>Game activity</h2>
              </div>
            </div>

            <div className="chart-bars">
              {weekData.map(({ day, value }) => (
                <div key={day} className="bar-column">
                  <span className="bar-value">{value}%</span>
                  <div className="bar-track">
                    <span className="bar-fill" style={{ height: `${value}%` }} />
                  </div>
                  <small>{day}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header compact-header">
              <div>
                <p className="card-label">ACTIVITY</p>
                <h2>Recent updates</h2>
              </div>
            </div>

            <ul className="activity-feed">
              {activityFeed.map((item) => (
                <li key={item.label}>
                  <span className="dot" />
                  <div>
                    <strong>{item.label}</strong>
                    <small>{item.value}</small>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="dashboard-card recent-games">
          <div className="card-heading">
            <div>
              <p className="card-label">YOUR COLLECTION</p>
              <h2>Recent favorites</h2>
            </div>
            <Link to="/games">View All →</Link>
          </div>

          <div className="recent-game-list">
            {recentGames.map((game) => (
              <div className="recent-game" key={game.id}>
                <div className="recent-game-icon">{game.name.includes("Catan") ? "♟️" : game.name.includes("UNO") ? "🎴" : game.name.includes("Codenames") ? "🕵️" : "🎲"}</div>
                <div>
                  <strong>{game.name}</strong>
                  <p>{(game.status || "available") === "borrowed" ? "Currently borrowed" : "Ready to play"}</p>
                </div>
                <span className={(game.status || "available") === "borrowed" ? "borrowed-badge" : "available-badge"}>
                  {(game.status || "available") === "borrowed" ? "Borrowed" : "Available"}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;