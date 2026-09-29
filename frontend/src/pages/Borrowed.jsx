import { useState } from "react";
import { Link } from "react-router-dom";

function Borrowed() {
  const [borrowedGames, setBorrowedGames] = useState([
    {
      id: 1,
      game: "Carcassonne",
      person: "Karan",
      borrowedDate: "2026-09-20",
      returnDate: "2026-09-28",
    },
    {
      id: 2,
      game: "Monopoly",
      person: "Saanya",
      borrowedDate: "2026-09-21",
      returnDate: "2026-09-30",
    },
    {
      id: 3,
      game: "Codenames",
      person: "Gulshan",
      borrowedDate: "2026-09-22",
      returnDate: "2026-09-25",
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const [newBorrow, setNewBorrow] = useState({
    game: "Catan",
    person: "",
    borrowedDate: "",
    returnDate: "",
  });

  const games = [
    "Catan",
    "Exploding Kittens",
    "Carcassonne",
    "UNO",
    "Codenames",
    "Monopoly",
  ];

  const handleAddBorrow = (e) => {
    e.preventDefault();

    const record = {
      id: Date.now(),
      game: newBorrow.game,
      person: newBorrow.person,
      borrowedDate: newBorrow.borrowedDate,
      returnDate: newBorrow.returnDate,
    };

    setBorrowedGames((current) => [
      ...current,
      record,
    ]);

    setNewBorrow({
      game: "Catan",
      person: "",
      borrowedDate: "",
      returnDate: "",
    });

    setShowForm(false);
  };

  const handleReturn = (id) => {
    const record = borrowedGames.find(
      (item) => item.id === id
    );

    const confirmed = window.confirm(
      `Mark "${record.game}" as returned?`
    );

    if (!confirmed) {
      return;
    }

    setBorrowedGames((current) =>
      current.filter((item) => item.id !== id)
    );
  };

  const handleDelete = (id) => {
    const record = borrowedGames.find(
      (item) => item.id === id
    );

    const confirmed = window.confirm(
      `Delete the borrowing record for "${record.game}"?`
    );

    if (!confirmed) {
      return;
    }

    setBorrowedGames((current) =>
      current.filter((item) => item.id !== id)
    );
  };

  const formatDate = (date) => {
    if (!date) return "Not set";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  return (
    <div className="dashboard-page">

      <aside className="dashboard-sidebar">

        <div className="dashboard-logo">
          🎲 Board<span>Night</span>
        </div>

        <nav>

          <Link to="/dashboard">
            📊 Dashboard
          </Link>

          <Link to="/games">
            🎲 My Games
          </Link>

          <Link to="/planner">
            📅 Game Planner
          </Link>

          <Link
            to="/borrowed"
            className="active"
          >
            📦 Borrowed
          </Link>

          <Link to="/profile">
            👤 Profile
          </Link>

        </nav>

        <Link
          to="/"
          className="logout-link"
        >
          ← Back to Home
        </Link>

      </aside>


      <main className="dashboard-main">

        <header className="dashboard-header">

          <div>

            <p className="dashboard-eyebrow">
              GAME TRACKING
            </p>

            <h1>
              Borrowed Games 📦
            </h1>

            <p>
              Keep track of games borrowed by your friends.
            </p>

          </div>

          <button
            className="dashboard-action"
            onClick={() => setShowForm(true)}
          >
            + Record Borrow
          </button>

        </header>


        <section className="dashboard-stats">

          <div className="stat-card">

            <span className="stat-icon">
              📦
            </span>

            <div>
              <strong>
                {borrowedGames.length}
              </strong>

              <p>
                Currently Borrowed
              </p>
            </div>

          </div>


          <div className="stat-card">

            <span className="stat-icon">
              👥
            </span>

            <div>
              <strong>
                {
                  new Set(
                    borrowedGames.map(
                      (item) => item.person
                    )
                  ).size
                }
              </strong>

              <p>
                People Borrowing
              </p>
            </div>

          </div>


          <div className="stat-card">

            <span className="stat-icon">
              🎲
            </span>

            <div>
              <strong>
                {
                  new Set(
                    borrowedGames.map(
                      (item) => item.game
                    )
                  ).size
                }
              </strong>

              <p>
                Games Out
              </p>
            </div>

          </div>


          <div className="stat-card">

            <span className="stat-icon">
              🔔
            </span>

            <div>
              <strong>
                Track
              </strong>

              <p>
                Return Dates
              </p>
            </div>

          </div>

        </section>


        <section className="borrowed-section">

          <div className="borrowed-section-heading">

            <div>

              <p className="card-label">
                CURRENT LOANS
              </p>

              <h2>
                Borrowed From Collection
              </h2>

            </div>

            <span className="game-count">
              {borrowedGames.length} records
            </span>

          </div>


          {borrowedGames.length === 0 ? (

            <div className="empty-borrowed">

              <div>
                🎉
              </div>

              <h3>
                All games are home!
              </h3>

              <p>
                No games are currently borrowed.
              </p>

              <button
                className="dashboard-action"
                onClick={() => setShowForm(true)}
              >
                + Record Borrow
              </button>

            </div>

          ) : (

            <div className="borrowed-grid">

              {borrowedGames.map((item) => (

                <div
                  className="borrowed-card"
                  key={item.id}
                >

                  <div className="borrowed-card-icon">
                    📦
                  </div>

                  <div className="borrowed-card-content">

                    <div className="borrowed-card-top">

                      <div>

                        <p className="planner-label">
                          BORROWED GAME
                        </p>

                        <h3>
                          {item.game}
                        </h3>

                      </div>

                      <span className="borrowed-badge">
                        Borrowed
                      </span>

                    </div>


                    <div className="borrowed-info">

                      <div>
                        👤
                        <span>
                          {item.person}
                        </span>
                      </div>

                      <div>
                        📅
                        <span>
                          Borrowed {formatDate(item.borrowedDate)}
                        </span>
                      </div>

                      <div>
                        🔔
                        <span>
                          Return by {formatDate(item.returnDate)}
                        </span>
                      </div>

                    </div>


                    <div className="borrowed-actions">

                      <button
                        className="return-button"
                        onClick={() =>
                          handleReturn(item.id)
                        }
                      >
                        ✓ Mark Returned
                      </button>

                      <button
                        className="delete-borrow-button"
                        onClick={() =>
                          handleDelete(item.id)
                        }
                      >
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

        <div
          className="game-modal-overlay"
          onClick={() => setShowForm(false)}
        >

          <div
            className="game-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="game-modal-header">

              <div>

                <p className="dashboard-eyebrow">
                  GAME TRACKING
                </p>

                <h2>
                  Record Borrowed Game
                </h2>

              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setShowForm(false)
                }
              >
                ✕
              </button>

            </div>


            <form onSubmit={handleAddBorrow}>

              <label>
                Game
              </label>

              <select
                value={newBorrow.game}
                onChange={(e) =>
                  setNewBorrow({
                    ...newBorrow,
                    game: e.target.value,
                  })
                }
              >

                {games.map((game) => (
                  <option
                    key={game}
                    value={game}
                  >
                    {game}
                  </option>
                ))}

              </select>


              <label>
                Borrowed By
              </label>

              <input
                type="text"
                placeholder="e.g. Karan"
                value={newBorrow.person}
                onChange={(e) =>
                  setNewBorrow({
                    ...newBorrow,
                    person: e.target.value,
                  })
                }
                required
              />


              <label>
                Borrow Date
              </label>

              <input
                type="date"
                value={newBorrow.borrowedDate}
                onChange={(e) =>
                  setNewBorrow({
                    ...newBorrow,
                    borrowedDate: e.target.value,
                  })
                }
                required
              />


              <label>
                Expected Return Date
              </label>

              <input
                type="date"
                value={newBorrow.returnDate}
                onChange={(e) =>
                  setNewBorrow({
                    ...newBorrow,
                    returnDate: e.target.value,
                  })
                }
                required
              />


              <div className="modal-actions">

                <button
                  type="button"
                  className="modal-cancel"
                  onClick={() =>
                    setShowForm(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="modal-save"
                >
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