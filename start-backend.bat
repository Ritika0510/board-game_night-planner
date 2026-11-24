@echo off
cd /d "%~dp0backend"
if not exist .env (
  echo Missing backend\.env. Copy .env.example to .env and add your MySQL password.
  pause
  exit /b 1
)
if not exist node_modules call npm install
npm start
pause
