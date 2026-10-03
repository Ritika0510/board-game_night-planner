import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

function MyGames() {
  // ==========================================
  // STATE
  // ==========================================

  const [games, setGames] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("boardnightGames") || "null") || [];
    } catch {
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Games");

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGame, setEditingGame] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [newGame, setNewGame] = useState({
    name: "",
    minPlayers: "",
    maxPlayers: "",
    playTimeMinutes: "",
    category: "",
    description: "",
    icon: "🎲",
  });

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

  // ==========================================
  // GAME ICON
  // ==========================================

  const getGameIcon = (game) => {
    const name = game.name?.toLowerCase() || "";
    const category = game.category?.toLowerCase() || "";

    if (name.includes("catan")) return "♟️";
    if (name.includes("uno")) return "🎴";
    if (name.includes("monopoly")) return "🏠";
    if (name.includes("carcassonne")) return "🏰";
    if (name.includes("codenames")) return "🕵️";
    if (name.includes("exploding")) return "🃏";

    if (category.includes("strategy")) return "♟️";
    if (category.includes("party")) return "🎉";
    if (category.includes("card")) return "🃏";

    return "🎲";
  };

  // ==========================================
  // FORMAT GAME FOR UI
  // ==========================================

  const formatGame = (game) => {
    const min = game.min_players;
    const max = game.max_players;

    let players = "Players not specified";

    if (min && max) {
      players =
        min === max
          ? `${min} Player${min > 1 ? "s" : ""}`
          : `${min}–${max} Players`;
    } else if (min) {
      players = `${min}+ Players`;
    } else if (max) {
      players = `Up to ${max} Players`;
    }

    let time = "Time not specified";

    if (game.play_time_minutes) {
      time = `${game.play_time_minutes} min`;
    }

    return {
      ...game,
      icon: getGameIcon(game),
      players,
      time,
      status:
        game.status === "borrowed"
          ? "Borrowed"
          : "Available",
    };
  };

  // ==========================================
  // LOAD GAMES
  // ==========================================

  const loadGames = async () => {
    const user = getStoredUser();

    if (!user?.id) {
      setError(
        "User session not found. Please login again."
      );
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/games/${user.id}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load games."
        );
      }

      const formattedGames = Array.isArray(data.games)
        ? data.games.map(formatGame)
        : [];

      setGames(formattedGames);
    } catch (error) {
      console.error("Load games error:", error);

      setError(
        "Unable to load games. Make sure the BoardNight backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem("boardnightGames", JSON.stringify(games));
  }, [games]);

  useEffect(() => {
    loadGames();
  }, []);

  // ==========================================
  // SEARCH + FILTER
  // ==========================================

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchesSearch = game.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All Games" ||
        game.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [games, search, filter]);

  // ==========================================
  // STATISTICS
  // ==========================================

  const availableCount = games.filter(
    (game) => game.status === "Available"
  ).length;

  const borrowedCount = games.filter(
    (game) => game.status === "Borrowed"
  ).length;

  const averagePlaytime =
    games.length > 0
      ? Math.round(
          games.reduce(
            (total, game) =>
              total +
              Number(game.play_time_minutes || 0),
            0
          ) / games.length
        )
      : 0;

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setNewGame({
      name: "",
      minPlayers: "",
      maxPlayers: "",
      playTimeMinutes: "",
      category: "",
      description: "",
      icon: "🎲",
    });

    setEditingGame(null);
  };

  // ==========================================
  // ADD / EDIT GAME
  // ==========================================

  const handleAddGame = async (e) => {
    e.preventDefault();

    const user = getStoredUser();

    if (!user?.id) {
      alert(
        "User session not found. Please login again."
      );
      return;
    }

    if (!newGame.name.trim()) {
      alert("Please enter a game name.");
      return;
    }

    const minPlayers = Number(
      newGame.minPlayers
    );

    const maxPlayers = Number(
      newGame.maxPlayers
    );

    const playTimeMinutes = Number(
      newGame.playTimeMinutes
    );

    if (
      !Number.isInteger(minPlayers) ||
      minPlayers <= 0
    ) {
      alert(
        "Please enter a valid minimum number of players."
      );
      return;
    }

    if (
      !Number.isInteger(maxPlayers) ||
      maxPlayers <= 0
    ) {
      alert(
        "Please enter a valid maximum number of players."
      );
      return;
    }

    if (minPlayers > maxPlayers) {
      alert(
        "Minimum players cannot be greater than maximum players."
      );
      return;
    }

    if (
      !Number.isInteger(playTimeMinutes) ||
      playTimeMinutes <= 0
    ) {
      alert("Please enter a valid play time.");
      return;
    }

    try {
      setSaving(true);

      // ========================================
      // EDIT EXISTING GAME
      // ========================================

      if (editingGame) {
        const response = await fetch(
          `http://localhost:5000/api/games/${editingGame.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user.id,
              name: newGame.name.trim(),
              description:
                newGame.description.trim() || null,
              minPlayers,
              maxPlayers,
              playTimeMinutes,
              category:
                newGame.category.trim() || null,
              status:
                editingGame.status === "Borrowed"
                  ? "borrowed"
                  : "available",
            }),
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          alert(
            data.message ||
              "Unable to update game."
          );
          return;
        }

        const updatedGame = formatGame(
          data.game
        );

        setGames((currentGames) =>
          currentGames.map((game) =>
            game.id === updatedGame.id
              ? updatedGame
              : game
          )
        );

        resetForm();
        setShowAddForm(false);

        alert("Game updated successfully!");

        return;
      }

      // ========================================
      // ADD NEW GAME
      // ========================================

      const response = await fetch(
        "http://localhost:5000/api/games",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            name: newGame.name.trim(),
            description:
              newGame.description.trim() || null,
            minPlayers,
            maxPlayers,
            playTimeMinutes,
            category:
              newGame.category.trim() || null,
            status: "available",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(
          data.message || "Unable to add game."
        );
        return;
      }

      const addedGame = formatGame(data.game);

      setGames((currentGames) => [
        addedGame,
        ...currentGames,
      ]);

      resetForm();
      setShowAddForm(false);

      alert("Game added successfully!");
    } catch (error) {
      console.error(
        "Add/Edit game error:",
        error
      );

      alert(
        "Unable to connect to the server. Make sure the BoardNight backend is running."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE GAME
  // ==========================================

  const handleDeleteGame = async (id) => {
    const user = getStoredUser();

    if (!user?.id) {
      alert(
        "User session not found. Please login again."
      );
      return;
    }

    const game = games.find(
      (item) => item.id === id
    );

    if (!game) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${game.name}" from your collection?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/games/${id}?userId=${user.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(
          data.message ||
            "Unable to delete game."
        );
        return;
      }

      setGames((currentGames) =>
        currentGames.filter(
          (item) => item.id !== id
        )
      );

      alert("Game deleted successfully!");
    } catch (error) {
      console.error(
        "Delete game error:",
        error
      );

      alert(
        "Unable to connect to the server. Make sure the BoardNight backend is running."
      );
    }
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const handleEditGame = (game) => {
    setEditingGame(game);

    setNewGame({
      name: game.name || "",
      minPlayers:
        game.min_players || "",
      maxPlayers:
        game.max_players || "",
      playTimeMinutes:
        game.play_time_minutes || "",
      category:
        game.category || "",
      description:
        game.description || "",
      icon:
        game.icon || "🎲",
    });

    setShowAddForm(true);
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem(
      "boardnightUser"
    );

    localStorage.removeItem(
      "boardnightToken"
    );

    window.location.href = "/login";
  };

  // ==========================================
  // OPEN ADD MODAL
  // ==========================================

  const handleOpenAddForm = () => {
    resetForm();
    setShowAddForm(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const handleCloseModal = () => {
    if (saving) {
      return;
    }

    resetForm();
    setShowAddForm(false);
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="dashboard-page">

      {/* ======================================
          SIDEBAR
      ====================================== */}

      <aside className="dashboard-sidebar">

        <div className="dashboard-logo">
          🎲 Board<span>Night</span>
        </div>

        <nav>

          <Link to="/dashboard">
            📊 Dashboard
          </Link>

          <Link
            to="/games"
            className="active"
          >
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

        <button
          className="logout-link"
          onClick={handleLogout}
        >
          ← Logout
        </button>

      </aside>

      {/* ======================================
          MAIN
      ====================================== */}

      <main className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <div>

            <p className="dashboard-eyebrow">
              YOUR COLLECTION
            </p>

            <h1>
              My Games 🎲
            </h1>

            <p>
              Manage your board game collection.
            </p>

          </div>

          <button
            className="dashboard-action"
            onClick={handleOpenAddForm}
          >
            + Add Game
          </button>

        </header>

        {/* ERROR */}

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {/* SEARCH + FILTER */}

        <div className="games-toolbar">

          <div className="game-search">

            🔍

            <input
              type="text"
              placeholder="Search games..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <select
            className="game-filter"
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
          >

            <option>
              All Games
            </option>

            <option>
              Available
            </option>

            <option>
              Borrowed
            </option>

          </select>

        </div>

        {/* ====================================
            STATS
        ==================================== */}

        <section className="dashboard-stats">

          <div className="stat-card">

            <span className="stat-icon">
              🎲
            </span>

            <div>

              <strong>
                {games.length}
              </strong>

              <p>
                Total Games
              </p>

            </div>

          </div>

          <div className="stat-card">

            <span className="stat-icon">
              ✅
            </span>

            <div>

              <strong>
                {availableCount}
              </strong>

              <p>
                Available
              </p>

            </div>

          </div>

          <div className="stat-card">

            <span className="stat-icon">
              📦
            </span>

            <div>

              <strong>
                {borrowedCount}
              </strong>

              <p>
                Borrowed
              </p>

            </div>

          </div>

          <div className="stat-card">

            <span className="stat-icon">
              ⏱️
            </span>

            <div>

              <strong>
                {averagePlaytime
                  ? `${averagePlaytime}m`
                  : "0m"}
              </strong>

              <p>
                Avg. Playtime
              </p>

            </div>

          </div>

        </section>

        {/* ====================================
            GAMES SECTION
        ==================================== */}

        <section className="games-page-section">

          <div className="games-section-heading">

            <div>

              <p className="card-label">
                COLLECTION
              </p>

              <h2>
                All Games
              </h2>

            </div>

            <span className="game-count">
              {filteredGames.length} games shown
            </span>

          </div>

          {/* LOADING */}

          {loading ? (

            <div className="empty-games">

              <div>
                ⏳
              </div>

              <h3>
                Loading games...
              </h3>

              <p>
                Fetching your collection from
                the BoardNight database.
              </p>

            </div>

          ) : filteredGames.length === 0 ? (

            /* EMPTY */

            <div className="empty-games">

              <div>
                🎲
              </div>

              <h3>
                No games found
              </h3>

              <p>
                Try another search or add a
                new game to your collection.
              </p>

            </div>

          ) : (

            /* GAME CARDS */

            <div className="my-games-grid">

              {filteredGames.map((game) => (

                <div
                  className="my-game-card"
                  key={game.id}
                >

                  <div className="my-game-icon">
                    {game.icon}
                  </div>

                  <div className="my-game-content">

                    <div className="my-game-top">

                      <h3>
                        {game.name}
                      </h3>

                      <span
                        className={
                          game.status ===
                          "Available"
                            ? "available-badge"
                            : "borrowed-badge"
                        }
                      >
                        {game.status}
                      </span>

                    </div>

                    <p>
                      👥 {game.players}
                    </p>

                    <p>
                      ⏱️ {game.time}
                    </p>

                    {game.category && (
                      <p>
                        🏷️ {game.category}
                      </p>
                    )}

                    {game.status ===
                      "Borrowed" &&
                      game.borrowedBy && (
                        <p className="borrowed-person">
                          📦 Borrowed by{" "}
                          {game.borrowedBy}
                        </p>
                      )}

                  </div>

                  {/* GAME ACTIONS */}

                  <div className="game-actions">

                    <button
                      title="Edit"
                      onClick={() =>
                        handleEditGame(game)
                      }
                    >
                      ✏️
                    </button>

                    <button
                      title="Delete"
                      onClick={() =>
                        handleDeleteGame(
                          game.id
                        )
                      }
                    >
                      🗑️
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

      {/* ======================================
          ADD / EDIT MODAL
      ====================================== */}

      {showAddForm && (

        <div
          className="game-modal-overlay"
          onClick={handleCloseModal}
        >

          <div
            className="game-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="game-modal-header">

              <div>

                <p className="dashboard-eyebrow">
                  COLLECTION
                </p>

                <h2>
                  {editingGame
                    ? "Edit Game"
                    : "Add New Game"}
                </h2>

              </div>

              <button
                className="modal-close"
                onClick={handleCloseModal}
                disabled={saving}
              >
                ✕
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleAddGame}
            >

              {/* GAME NAME */}

              <label>
                Game Name
              </label>

              <input
                type="text"
                placeholder="e.g. Chess"
                value={newGame.name}
                onChange={(e) =>
                  setNewGame({
                    ...newGame,
                    name: e.target.value,
                  })
                }
                required
              />

              {/* MIN PLAYERS */}

              <label>
                Minimum Players
              </label>

              <input
                type="number"
                min="1"
                placeholder="e.g. 2"
                value={
                  newGame.minPlayers
                }
                onChange={(e) =>
                  setNewGame({
                    ...newGame,
                    minPlayers:
                      e.target.value,
                  })
                }
                required
              />

              {/* MAX PLAYERS */}

              <label>
                Maximum Players
              </label>

              <input
                type="number"
                min="1"
                placeholder="e.g. 4"
                value={
                  newGame.maxPlayers
                }
                onChange={(e) =>
                  setNewGame({
                    ...newGame,
                    maxPlayers:
                      e.target.value,
                  })
                }
                required
              />

              {/* PLAY TIME */}

              <label>
                Playtime (minutes)
              </label>

              <input
                type="number"
                min="1"
                placeholder="e.g. 60"
                value={
                  newGame.playTimeMinutes
                }
                onChange={(e) =>
                  setNewGame({
                    ...newGame,
                    playTimeMinutes:
                      e.target.value,
                  })
                }
                required
              />

              {/* CATEGORY */}

              <label>
                Category
              </label>

              <input
                type="text"
                placeholder="e.g. Strategy"
                value={
                  newGame.category
                }
                onChange={(e) =>
                  setNewGame({
                    ...newGame,
                    category:
                      e.target.value,
                  })
                }
              />

              {/* DESCRIPTION */}

              <label>
                Description
              </label>

              <textarea
                placeholder="Describe the game..."
                value={
                  newGame.description
                }
                onChange={(e) =>
                  setNewGame({
                    ...newGame,
                    description:
                      e.target.value,
                  })
                }
                rows="3"
              />

              {/* ICON */}

              <label>
                Game Icon
              </label>

              <select
                value={newGame.icon}
                onChange={(e) =>
                  setNewGame({
                    ...newGame,
                    icon: e.target.value,
                  })
                }
              >

                <option>
                  🎲
                </option>

                <option>
                  ♟️
                </option>

                <option>
                  🃏
                </option>

                <option>
                  🎴
                </option>

                <option>
                  🏰
                </option>

                <option>
                  🏠
                </option>

                <option>
                  🕵️
                </option>

                <option>
                  🚀
                </option>

                <option>
                  🧩
                </option>

              </select>

              {/* MODAL BUTTONS */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="modal-cancel"
                  onClick={handleCloseModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="modal-save"
                  disabled={saving}
                >
                  {saving
                    ? editingGame
                      ? "Saving..."
                      : "Adding..."
                    : editingGame
                    ? "Save Changes"
                    : "Add Game"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default MyGames;