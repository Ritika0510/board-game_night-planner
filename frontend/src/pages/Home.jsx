import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">

      {/* NAVBAR */}

      <nav className="home-navbar">

        <div className="home-logo">
          🎲 Board<span>Night</span>
        </div>

        <div className="home-nav-links">
          <Link to="/games">Games</Link>
          <Link to="/planner">Planner</Link>
          <Link to="/borrowed">Borrowed</Link>
        </div>

        <Link
          to="/login"
          className="home-login-button"
        >
          Login
        </Link>

      </nav>


      {/* HERO */}

      <section className="home-hero">

        <div className="home-hero-content">

          <div className="home-badge">
            🎲 YOUR BOARD GAME COMPANION
          </div>

          <h1>
            Plan the night.
            <br />
            <span>Play the game.</span>
          </h1>

          <p>
            Manage your board games, organize game nights,
            and keep track of borrowed games — all in one place.
          </p>

          <div className="home-hero-buttons">

            <Link
              to="/planner"
              className="home-primary-button"
            >
              📅 Plan a Game Night
            </Link>

            <Link
              to="/games"
              className="home-secondary-button"
            >
              🎲 Browse Games
            </Link>

          </div>

        </div>


        {/* DICE CARD */}

        <div className="home-visual">

          <div className="dice-glow"></div>

          <div className="dice-card">

            <div className="large-dice">
              🎲
            </div>

            <div className="dice-card-text">
              <strong>
                Game Night
              </strong>

              <span>
                Your next adventure starts here.
              </span>
            </div>

          </div>

        </div>

      </section>


      {/* STATS */}

      <section className="home-stats">

        <div>
          <strong>
            24+
          </strong>

          <span>
            Board Games
          </span>
        </div>

        <div>
          <strong>
            12
          </strong>

          <span>
            Game Nights
          </span>
        </div>

        <div>
          <strong>
            18
          </strong>

          <span>
            Friends
          </span>
        </div>

        <div>
          <strong>
            ∞
          </strong>

          <span>
            Memories
          </span>
        </div>

      </section>


      {/* POPULAR GAMES */}

      <section className="home-games">

        <div className="home-section-heading">

          <div>
            <p>
              EXPLORE YOUR COLLECTION
            </p>

            <h2>
              Popular Games
            </h2>
          </div>

          <Link to="/games">
            View All →
          </Link>

        </div>


        <div className="home-game-grid">

          <div className="home-game-card">

            <div className="home-game-icon">
              ♟️
            </div>

            <h3>
              Catan
            </h3>

            <p>
              3–4 Players · 60–90 min
            </p>

          </div>


          <div className="home-game-card">

            <div className="home-game-icon">
              🃏
            </div>

            <h3>
              Exploding Kittens
            </h3>

            <p>
              2–5 Players · 15 min
            </p>

          </div>


          <div className="home-game-card">

            <div className="home-game-icon">
              🎴
            </div>

            <h3>
              UNO
            </h3>

            <p>
              2–10 Players · 15–30 min
            </p>

          </div>


          <div className="home-game-card">

            <div className="home-game-icon">
              🏰
            </div>

            <h3>
              Carcassonne
            </h3>

            <p>
              2–5 Players · 45 min
            </p>

          </div>

        </div>

      </section>


      {/* CTA */}

      <section className="home-cta">

        <div>

          <p>
            READY FOR THE NEXT GAME?
          </p>

          <h2>
            Your next game night
            <br />
            is waiting.
          </h2>

        </div>

        <Link
          to="/signup"
          className="home-primary-button"
        >
          Create Free Account →
        </Link>

      </section>


      {/* FOOTER */}

      <footer className="home-footer">

        <div className="home-logo">
          🎲 Board<span>Night</span>
        </div>

        <p>
          Plan better. Play more. 🎲
        </p>

      </footer>

    </div>
  );
}

export default Home;