import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL, getAuthHeaders } from "../config/api";
import { DiceIcon, DashboardIcon, CalendarIcon, BoxIcon, UserIcon, UsersIcon, ClockIcon, EditIcon, TrashIcon, CheckIcon, PlusIcon, CloseIcon, LocationIcon } from "../components/Icons";

function GamePlanner() {
  // ==========================================
  // STATE
  // ==========================================

  const [events, setEvents] = useState([]);
  const [games, setGames] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [gamesLoading, setGamesLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [newEvent, setNewEvent] = useState({
    title: "",
    gameId: "",
    date: "",
    time: "",
    location: "",
    players: 2,
    notes: "",
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
  // LOAD GAME NIGHTS
  // ==========================================

  const loadEvents = async () => {
    const user = getStoredUser();

    if (!user?.id) {
      setError("User session not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/game-nights/${user.id}`,
        {
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load game nights."
        );
      }

      setEvents(
        Array.isArray(data.events)
          ? data.events
          : []
      );
    } catch (error) {
      console.error("Load game nights error:", error);

      setError(
        "Unable to load game nights. Make sure the BoardNight backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD USER'S GAMES
  // ==========================================

  const loadGames = async () => {
    const user = getStoredUser();

    if (!user?.id) {
      setGamesLoading(false);
      return;
    }

    try {
      setGamesLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/games/${user.id}`,
        {
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load games."
        );
      }

      setGames(
        Array.isArray(data.games)
          ? data.games
          : []
      );
    } catch (error) {
      console.error("Load games error:", error);
    } finally {
      setGamesLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadEvents();
    loadGames();
  }, []);

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "Date not set";
    }

    const selectedDate = new Date(
      `${String(date).slice(0, 10)}T00:00:00`
    );

    return selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  // ==========================================
  // FORMAT TIME
  // ==========================================

  const formatTime = (time) => {
    if (!time) {
      return "Time not set";
    }

    const parts = String(time).split(":");

    if (parts.length < 2) {
      return time;
    }

    const hours = Number(parts[0]);
    const minutes = parts[1];

    const suffix = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 || 12;

    return `${displayHour}:${minutes} ${suffix}`;
  };

  // ==========================================
  // GET GAME NAME
  // ==========================================

  const getGameName = (event) => {
    if (event.game_names) {
      return event.game_names;
    }

    return "Game not selected";
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setNewEvent({
      title: "",
      gameId:
        games.length > 0
          ? String(games[0].id)
          : "",
      date: "",
      time: "",
      location: "",
      players: 2,
      notes: "",
    });

    setEditingEvent(null);
  };

  // ==========================================
  // OPEN ADD FORM
  // ==========================================

  const handleOpenAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  // ==========================================
  // OPEN EDIT FORM
  // ==========================================

  const handleEditEvent = (event) => {
    const eventGameNames = event.game_names
      ? event.game_names
          .split(",")
          .map((name) => name.trim())
      : [];

    const matchingGame = games.find((game) =>
      eventGameNames.includes(game.name)
    );

    setEditingEvent(event);

    setNewEvent({
      title: event.title || "",

      gameId: matchingGame
        ? String(matchingGame.id)
        : "",

      date: event.event_date
        ? String(event.event_date).slice(0, 10)
        : "",

      time: event.start_time
        ? String(event.start_time).slice(0, 5)
        : "",

      location: event.location || "",

      players: event.max_players || 2,

      notes: event.notes || "",
    });

    setShowForm(true);
  };

  // ==========================================
  // CLOSE FORM
  // ==========================================

  const handleCloseForm = () => {
    if (saving) {
      return;
    }

    resetForm();
    setShowForm(false);
  };

  // ==========================================
  // CREATE / UPDATE GAME NIGHT
  // ==========================================

  const handleSaveEvent = async (e) => {
    e.preventDefault();

    const user = getStoredUser();

    if (!user?.id) {
      alert("User session not found. Please login again.");
      return;
    }

    if (!newEvent.title.trim()) {
      alert("Please enter an event name.");
      return;
    }

    if (!newEvent.gameId) {
      alert("Please select a game.");
      return;
    }

    if (!newEvent.date) {
      alert("Please select a date.");
      return;
    }

    if (!newEvent.time) {
      alert("Please select a time.");
      return;
    }

    const players = Number(newEvent.players);

    if (!Number.isInteger(players) || players < 1) {
      alert("Please enter a valid number of players.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        userId: user.id,
        title: newEvent.title.trim(),
        gameId: Number(newEvent.gameId),
        eventDate: newEvent.date,
        startTime: newEvent.time,
        location:
          newEvent.location.trim() || null,
        maxPlayers: players,
        notes:
          newEvent.notes.trim() || null,
        status:
          editingEvent?.status || "planned",
      };

      // ========================================
      // UPDATE
      // ========================================

      if (editingEvent) {
        const response = await fetch(
          `${API_BASE_URL}/api/game-nights/${editingEvent.id}`,
          {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          alert(
            data.message ||
              "Unable to update game night."
          );
          return;
        }

        alert("Game night updated successfully!");

        resetForm();
        setShowForm(false);

        await loadEvents();

        return;
      }

      // ========================================
      // CREATE
      // ========================================

      const response = await fetch(
        `${API_BASE_URL}/api/game-nights`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(
          data.message ||
            "Unable to create game night."
        );
        return;
      }

      alert("Game night created successfully!");

      resetForm();
      setShowForm(false);

      await loadEvents();
    } catch (error) {
      console.error(
        "Save game night error:",
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
  // DELETE GAME NIGHT
  // ==========================================

  const handleDeleteEvent = async (id) => {
    const user = getStoredUser();

    if (!user?.id) {
      alert("User session not found. Please login again.");
      return;
    }

    const event = events.find(
      (item) => item.id === id
    );

    if (!event) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${event.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/game-nights/${id}?userId=${user.id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(
          data.message ||
            "Unable to delete game night."
        );
        return;
      }

      setEvents((currentEvents) =>
        currentEvents.filter(
          (item) => item.id !== id
        )
      );

      alert("Game night deleted successfully!");
    } catch (error) {
      console.error(
        "Delete game night error:",
        error
      );

      alert(
        "Unable to connect to the server. Make sure the BoardNight backend is running."
      );
    }
  };

  // ==========================================
  // STATISTICS
  // ==========================================

  const upcomingEvents = events.filter(
    (event) => event.status === "planned"
  );

  const gamesPlanned = new Set(
    events.flatMap((event) =>
      event.game_names
        ? event.game_names
            .split(",")
            .map((name) => name.trim())
        : []
    )
  ).size;

  const playerSlots = events.reduce(
    (total, event) =>
      total + Number(event.max_players || 0),
    0
  );

  const planningStatus =
    events.length > 0
      ? "Ready"
      : "Start Planning";

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="dashboard-page">

      {/* SIDEBAR */}

      <aside className="dashboard-sidebar">

        <div className="dashboard-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DiceIcon size={22} /> Board<span>Night</span>
        </div>

        <nav>

          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DashboardIcon size={16} /> Dashboard
          </Link>

          <Link to="/games" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DiceIcon size={16} /> My Games
          </Link>

          <Link
            to="/planner"
            className="active"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <CalendarIcon size={16} /> Game Planner
          </Link>

          <Link to="/borrowed" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BoxIcon size={16} /> Borrowed
          </Link>

          <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserIcon size={16} /> Profile
          </Link>

        </nav>


        <button
          className="logout-link"
          onClick={() => {
            localStorage.removeItem(
              "boardnightUser"
            );

            localStorage.removeItem(
              "boardnightToken"
            );

            window.location.href = "/login";
          }}
        >
          ← Logout
        </button>

      </aside>

      {/* MAIN CONTENT */}

      <main className="dashboard-main">

        <header className="dashboard-header">

          <div>

            <p className="dashboard-eyebrow">
              PLAN YOUR NIGHT
            </p>

            <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              Game Planner <CalendarIcon size={24} />
            </h1>

            <p>
              Organize your next board game night.
            </p>

          </div>

          <button
            className="dashboard-action"
            onClick={handleOpenAddForm}
            disabled={gamesLoading}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <PlusIcon size={16} /> Plan Game Night
          </button>

        </header>

        {/* ERROR */}

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {/* STATS */}

        <section className="dashboard-stats">

          <div className="stat-card">

            <span className="stat-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarIcon size={24} />
            </span>

            <div>

              <strong>
                {upcomingEvents.length}
              </strong>

              <p>
                Upcoming Nights
              </p>

            </div>

          </div>


          <div className="stat-card">

            <span className="stat-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DiceIcon size={24} />
            </span>

            <div>

              <strong>
                {gamesPlanned}
              </strong>

              <p>
                Games Planned
              </p>

            </div>

          </div>

          <div className="stat-card">

            <span className="stat-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UsersIcon size={24} />
            </span>

            <div>

              <strong>
                {playerSlots}
              </strong>

              <p>
                Player Slots
              </p>

            </div>

          </div>

          <div className="stat-card">

            <span className="stat-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckIcon size={24} />
            </span>

            <div>

              <strong>
                {planningStatus}
              </strong>

              <p>
                Planning Status
              </p>

            </div>

          </div>


        </section>

        {/* GAME NIGHTS */}

        <section className="planner-section">

          <div className="planner-section-heading">

            <div>

              <p className="card-label">
                UPCOMING
              </p>

              <h2>
                Your Game Nights
              </h2>

            </div>

            <span className="game-count">
              {events.length} events
            </span>

          </div>

          {/* LOADING */}

          {loading ? (

            <div className="empty-planner">

              <div className="empty-planner-icon">
                ⏳
              </div>

              <h3>
                Loading game nights...
              </h3>

              <p>
                Fetching your plans from the
                BoardNight database.
              </p>

            </div>

          ) : events.length === 0 ? (

            /* EMPTY */

            <div className="empty-planner">

              <div className="empty-planner-icon">
                📅
              </div>

              <h3>
                No game nights planned
              </h3>

              <p>
                Create your first game night and
                get your friends together.
              </p>

              <button
                className="dashboard-action"
                onClick={handleOpenAddForm}
                disabled={gamesLoading}
              >
                + Plan Game Night
              </button>

            </div>

          ) : (

            /* GAME NIGHT CARDS */

            <div className="planner-grid">

              {events.map((event) => (

                <div
                  className="planner-card"
                  key={event.id}
                >

                  <div className="planner-date">

                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CalendarIcon size={16} />
                    </span>

                    <strong>
                      {formatDate(
                        event.event_date
                      )}
                    </strong>

                  </div>

                  <div className="planner-card-content">

                    <div className="planner-card-top">

                      <div>

                        <p className="planner-label">
                          GAME NIGHT
                        </p>

                        <h3>
                          {event.title}
                        </h3>

                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                        }}
                      >

                        <button
                          className="planner-delete"
                          title="Edit event"
                          onClick={() =>
                            handleEditEvent(
                              event
                            )
                          }
                          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <EditIcon size={14} />
                        </button>

                        <button
                          className="planner-delete"
                          title="Delete event"
                          onClick={() =>
                            handleDeleteEvent(
                              event.id
                            )
                          }
                          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <TrashIcon size={14} />
                        </button>

                      </div>

                    </div>

                    <div className="planner-details">

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <DiceIcon size={16} />
                        <span>
                          {getGameName(event)}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ClockIcon size={16} />
                        <span>
                          {formatTime(
                            event.start_time
                          )}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <LocationIcon size={16} />
                        <span>
                          {event.location ||
                            "Location not set"}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <UsersIcon size={16} />
                        <span>
                          {event.max_players} Players
                        </span>
                      </div>

                    </div>

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

      {showForm && (

        <div
          className="game-modal-overlay"
          onClick={handleCloseForm}
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
                  GAME NIGHT
                </p>

                <h2>
                  {editingEvent
                    ? "Edit Game Night"
                    : "Plan a Game Night"}
                </h2>

              </div>

              <button
                className="modal-close"
                onClick={handleCloseForm}
                disabled={saving}
              >
                ✕
              </button>

            </div>

            <form onSubmit={handleSaveEvent}>

              {/* EVENT NAME */}

              <label>
                Event Name
              </label>

              <input
                type="text"
                placeholder="e.g. Friday Game Night"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    title: e.target.value,
                  })
                }
                required
              />

              {/* GAME */}

              <label>
                Select Game
              </label>

              <select
                value={newEvent.gameId}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    gameId: e.target.value,
                  })
                }
                disabled={gamesLoading}
                required
              >

                {games.length === 0 ? (

                  <option value="">
                    No games available
                  </option>

                ) : (

                  games.map((game) => (

                    <option
                      key={game.id}
                      value={game.id}
                    >
                      {game.name}
                    </option>

                  ))

                )}

              </select>

              {/* DATE */}

              <label>
                Date
              </label>

              <input
                type="date"
                value={newEvent.date}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    date: e.target.value,
                  })
                }
                required
              />

              {/* TIME */}

              <label>
                Time
              </label>

              <input
                type="time"
                value={newEvent.time}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    time: e.target.value,
                  })
                }
                required
              />

              {/* LOCATION */}

              <label>
                Location
              </label>

              <input
                type="text"
                placeholder="e.g. My Home"
                value={newEvent.location}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    location: e.target.value,
                  })
                }
              />

              {/* PLAYERS */}

              <label>
                Number of Players
              </label>

              <input
                type="number"
                min="1"
                max="100"
                value={newEvent.players}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    players: e.target.value,
                  })
                }
                required
              />

              {/* NOTES */}

              <label>
                Notes
              </label>

              <textarea
                rows="3"
                placeholder="Any additional notes..."
                value={newEvent.notes}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    notes: e.target.value,
                  })
                }
              />

              {/* BUTTONS */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="modal-cancel"
                  onClick={handleCloseForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="modal-save"
                  disabled={
                    saving ||
                    games.length === 0
                  }
                >
                  {saving
                    ? editingEvent
                      ? "Saving..."
                      : "Creating..."
                    : editingEvent
                    ? "Save Changes"
                    : "Create Game Night"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default GamePlanner; 