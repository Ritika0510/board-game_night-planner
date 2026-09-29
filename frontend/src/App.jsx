import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import MyGames from "./pages/MyGames";
import GamePlanner from "./pages/GamePlanner";
import Borrowed from "./pages/Borrowed";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/games"
          element={<MyGames />}
        />

        <Route
          path="/planner"
          element={<GamePlanner />}
        />

        <Route
          path="/borrowed"
          element={<Borrowed />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;