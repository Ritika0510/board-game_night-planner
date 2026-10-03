import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const defaultGames = [
  { id: 1, name: "Catan", status: "available" },
  { id: 2, name: "UNO", status: "available" },
  { id: 3, name: "Carcassonne", status: "borrowed" },
  { id: 4, name: "Codenames", status: "available" },
  { id: 5, name: "Monopoly", status: "available" },
  { id: 6, name: "Ticket to Ride", status: "available" },
];

const defaultBorrowed = [
  { id: 1, game: "Carcassonne", person: "Karan", borrowedDate: "2026-09-20", returnDate: "2026-09-28" },
  { id: 2, game: "Monopoly", person: "Saanya", borrowedDate: "2026-09-21", returnDate: "2026-09-30" },
  { id: 3, game: "Codenames", person: "Gulshan", borrowedDate: "2026-09-22", returnDate: "2026-09-25" },
];

function Borrowed() {
  const [games, setGames] = useState(() => {
    try {
      const storedGames = JSON.parse(localStorage.getItem("boardnightGames") || "null");
      return Array.isArray(storedGames) && storedGames.length > 0 ? storedGames : defaultGames;
    } catch {
      return defaultGames;
    }
  });

  const [borrowedGames, setBorrowedGames] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("boardnightBorrowed") || "null") || defaultBorrowed;
    } catch {
      return defaultBorrowed;
    }
  });

  const [showForm, setShowForm] = useState(false);
  const [newBorrow, setNewBorrow] = useState({
    game: defaultGames[0].name,
    person: "",
    borrowedDate: "",
    returnDate: "",
  });

  useEffect(() => {
    localStorage.setItem("boardnightGames", JSON.stringify(games));
  }, [games]);

  useEffect(() => {
    localStorage.setItem("boardnightBorrowed", JSON.stringify(borrowedGames));
  }, [borrowedGames]);

  const availableGameList = useMemo(
    () => games.filter((game) => !borrowedGames.some((record) => record.game.toLowerCase() === game.name.toLowerCase())),
    [games, borrowedGames]
  );

  const availableGames = availableGameList.length;

  const handleGameChange = (gameName) => {
    setNewBorrow((current) => ({ ...current, game: gameName }));
  };

  const addGameToCollection = (gameName) => {
    setGames((current) => {
      const exists = current.some((game) => game.name.toLowerCase() === gameName.toLowerCase());
      if (exists) {
        return current.map((game) =>
          game.name.toLowerCase() === gameName.toLowerCase()
            ? { ...game, status: "borrowed" }
            : game
        );
      }

      return [...current, { id: Date.now(), name: gameName, status: "borrowed" }];
    });
  };

  const normalizedGameName = newBorrow.game.trim();

  const canRecordBorrow = normalizedGameName.length > 0 && !borrowedGames.some(
    (record) => record.game.toLowerCase() === normalizedGameName.toLowerCase()
  );

  const peopleBorrowing = useMemo(
    () => new Set(borrowedGames.map((item) => item.person)).size,
    [borrowedGames]
  );

  const returnSoon = useMemo(
    () => borrowedGames.filter((record) => new Date(record.returnDate) > new Date()).length,
    [borrowedGames]
  );

  const handleAddBorrow = (e) => {
    e.preventDefault();

    if (!normalizedGameName || !newBorrow.person.trim() || !canRecordBorrow) {
      return;
    }

    const record = {
      id: Date.now(),
      game: normalizedGameName,
      person: newBorrow.person.trim(),
      borrowedDate: newBorrow.borrowedDate,
      returnDate: newBorrow.returnDate,
    };

    setBorrowedGames((current) => [record, ...current]);
    addGameToCollection(normalizedGameName);

    setNewBorrow({
      game: availableGameList[0]?.name || "",
      person: "",
      borrowedDate: "",
      returnDate: "",
    });
    setShowForm(false);
  };

  const handleReturn = (id) => {
    const record = borrowedGames.find((item) => item.id === id);
    if (!record) return;

    const confirmed = window.confirm(`Mark "${record.game}" as returned?`);
    if (!confirmed) return;

    setBorrowedGames((current) => current.filter((item) => item.id !== id));
    setGames((current) =>
      current.map((game) =>
        game.name.toLowerCase() === record.game.toLowerCase()
          ? { ...game, status: "available" }
          : game
      )
    );
  };

  const handleDelete = (id) => {
    const record = borrowedGames.find((item) => item.id === id);
    if (!record) return;

    const confirmed = window.confirm(`Delete the borrowing record for "${record.game}"?`);
    if (!confirmed) return;

    setBorrowedGames((current) => current.filter((item) => item.id !== id));
  };

  const formatDate = (date) => {
    if (!date) return "Not set";
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">
          🎲 Board<span>Night</span>
        </div>

        <nav>
          <Link to="/dashboard">📊 Dashboard</Link>
          <Link to="/games">🎲 My Games</Link>
          <Link to="/planner">📅 Game Planner</Link>
          <Link to="/borrowed" className="active">📦 Borrowed</Link>
          <Link to="/profile">👤 Profile</Link>
        </nav>

        <Link to="/" className="logout-link">← Back to Home</Link>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">GAME TRACKING</p>
            <h1>Borrowed Games 📦</h1>
            <p>Keep track of what is out and what is available to play.</p>
          </div>

          <button className="dashboard-action" onClick={() => setShowForm(true)}>
            + Record Borrow
          </button>
        </header>

        <section className="dashboard-stats">
          <div className="stat-card">
            <span className="stat-icon">📦</span>
            <div>
              <strong>{borrowedGames.length}</strong>
              <p>Currently Borrowed</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">👥</span>
            <div>
              <strong>{peopleBorrowing}</strong>
              <p>People Borrowing</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🎲</span>
            <div>
              <strong>{availableGames}</strong>
              <p>Games Available</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🔔</span>
            <div>
              <strong>{returnSoon}</strong>
              <p>Due Soon</p>
            </div>
          </div>
        </section>

        <section className="borrowed-section">
          <div className="borrowed-section-heading">
            <div>
              <p className="card-label">CURRENT LOANS</p>
              <h2>Borrowed from collection</h2>
            </div>
            <span className="game-count">{borrowedGames.length} records</span>
          </div>

          {borrowedGames.length === 0 ? (
            <div className="empty-borrowed">
              <div>🎉</div>
              <h3>All games are home!</h3>
              <p>No games are currently borrowed.</p>
              <button className="dashboard-action" onClick={() => setShowForm(true)}>
                + Record Borrow
              </button>
            </div>
          ) : (
            <div className="borrowed-grid">
              {borrowedGames.map((item) => (
                <div className="borrowed-card" key={item.id}>
                  <div className="borrowed-card-icon">📦</div>

                  <div className="borrowed-card-content">
                    <div className="borrowed-card-top">
                      <div>
                        <p className="planner-label">BORROWED GAME</p>
                        <h3>{item.game}</h3>
                      </div>
                      <span className="borrowed-badge">Borrowed</span>
                    </div>

                    <div className="borrowed-info">
                      <div>👤 <span>{item.person}</span></div>
                      <div>📅 <span>Borrowed {formatDate(item.borrowedDate)}</span></div>
                      <div>🔔 <span>Return by {formatDate(item.returnDate)}</span></div>
                    </div>

                    <div className="borrowed-actions">
                      <button className="return-button" onClick={() => handleReturn(item.id)}>
                        ✓ Mark Returned
                      </button>
                      <button className="delete-borrow-button" onClick={() => handleDelete(item.id)}>
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {showForm && (
        <div className="game-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="game-modal" onClick={(e) => e.stopPropagation()}>
            <div className="game-modal-header">
              <div>
                <p className="dashboard-eyebrow">GAME TRACKING</p>
                <h2>Record borrowed game</h2>
              </div>
              <button className="modal-close" onClick={() => setShowForm(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBorrow}>
              <label>Game</label>
              <input
                type="text"
                list="available-games"
                placeholder="Choose or type a game name"
                value={newBorrow.game}
                onChange={(e) => handleGameChange(e.target.value)}
                required
              />
              <datalist id="available-games">
                {availableGameList.map((game) => (
                  <option key={game.id ?? game.name} value={game.name} />
                ))}
              </datalist>
              {normalizedGameName && !canRecordBorrow && (
                <small className="borrow-game-hint">This game is already marked as borrowed.</small>
              )}

              <label>Borrowed By</label>
              <input
                type="text"
                placeholder="e.g. Karan"
                value={newBorrow.person}
                onChange={(e) => setNewBorrow({ ...newBorrow, person: e.target.value })}
                required
              />

              <label>Borrow Date</label>
              <input
                type="date"
                value={newBorrow.borrowedDate}
                onChange={(e) => setNewBorrow({ ...newBorrow, borrowedDate: e.target.value })}
                required
              />

              <label>Expected Return Date</label>
              <input
                type="date"
                value={newBorrow.returnDate}
                onChange={(e) => setNewBorrow({ ...newBorrow, returnDate: e.target.value })}
                required
              />

              <div className="modal-actions">
                <button type="button" className="modal-cancel" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="modal-save" disabled={!canRecordBorrow}>
                  Record Borrow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Borrowed;