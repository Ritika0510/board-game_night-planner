# BoardNight Feature Status

## Technology
- Frontend: React 19, Vite, CSS
- Backend: Node.js, Express
- Database: MySQL

## Implemented in this iteration
- My Games collection is stored in MySQL.
- Borrowing a game changes its MySQL game status to `borrowed`; marking it returned changes it back to `available`.
- Match history records a per-match XP delta: win +50, draw 0, chess loss -25, strategy-game loss -20 (Catan, Risk, Carcassonne, Ticket to Ride), party-game loss -10 (UNO, Ludo, Exploding Kittens, Jenga), and other-game loss -15.
- Match game field uses a predefined game dropdown.
- Tournament winner can be entered and explicitly saved.
- Login remember option stores the email only. Password is not stored by the application; browser password-manager support depends on browser settings.
- Profile name, phone and location have GET/PUT API endpoints and are stored in the MySQL `users` table. Logging out clears the session copy, not the database profile.
- Login background sphere has continuous rotation and hue animation.
- Communities support create, join/leave, rules, favourite game and a local member count.

## Storage limitations (important)
- Borrowed/lent transaction records, match history/XP, tournaments and communities are currently saved in this browser's localStorage. They are not yet shared between users or devices.
- Community join/leave and member counts are local demo functionality, not a server-wide membership system.
- The leaderboard currently shows the signed-in user's local summary, not a global leaderboard.

## Setup
1. Start MySQL and create the database using `database/schema.sql`.
2. Copy `backend/.env.example` to `backend/.env` and enter your MySQL credentials.
3. In `backend`, run `npm install`, then `npm start` (or the script specified in `backend/package.json`).
4. In `frontend`, run `npm install`, then `npm run dev`.
5. Open the Vite URL shown in the terminal.

This is an academic project prototype. The API currently follows the project's existing userId-based request pattern and should not be treated as production-grade authentication/authorization.


## Community module update
- Community creation and discovery use MySQL through `/api/communities`.
- Membership uses `community_members` with one membership per user/community.
- Join and leave update shared membership in MySQL.
- Community chat reads/writes `community_messages`; only joined members can read or send messages.
- Run the community table definitions at the end of `database/schema.sql` before using these APIs.
- The frontend no longer uses browser localStorage for community membership or chat messages.


## Community module
The Community page and navigation entry have been removed from the frontend in this build, as requested. Existing database tables and backend community endpoints are retained but are not exposed in the UI.
