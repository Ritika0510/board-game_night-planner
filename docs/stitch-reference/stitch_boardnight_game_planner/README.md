# BoardNight – Enhanced Stitch Design Package

This package contains the refined BoardNight screen designs. The original visual direction has been retained: dark tabletop-gaming UI, violet accents, glass panels and clear card hierarchy.

## Screens

- `boardnight_landing_page/code.html` – landing page
- `boardnight_login_page_byte_squad_sphere/code.html` – **restored login page with animated BYTE SQUAD sphere**
- `boardnight_signup_onboarding_flow/code.html` – signup
- `boardnight_dashboard/code.html` – dashboard
- `boardnight_my_games/code.html` – game collection
- `boardnight_game_planner/code.html` – game-night planning
- `boardnight_lending_custody_tracker/code.html` – borrowed/lent games
- `boardnight_player_profile_passport/code.html` – profile
- `boardnight_match_history/code.html` – match history
- `boardnight_leaderboard/code.html` – XP and player rankings
- `boardnight_communities/code.html` – basic gaming groups
- `boardnight_tournaments/code.html` – basic tournaments

## Login page notes

The login page restores the original split-screen composition from the first Stitch export, removes Discord/Steam/Google social-login buttons and tactical/guild wording, and keeps email/password sign-in. The left panel contains a WebGL animated rose sphere with `BYTE SQUAD` centered over it. A CSS sphere fallback is included if WebGL is unavailable. The form currently demonstrates frontend interactions only; it is not connected to a live authentication API.

## Importing

Import the project folders/screens into Stitch as design references. HTML exports are standalone previews, not a production React application. Backend authentication, routing and database persistence must be connected during implementation.
