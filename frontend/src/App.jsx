import './App.css';
import './LightTheme.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Workspace from './pages/Workspace';

function RequireAuth({ children }) {
  const raw = localStorage.getItem('boardnightUser');
  let user = null;
  try { user = raw ? JSON.parse(raw) : null; } catch { user = null; }
  return user?.id ? children : <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
}

function App(){
  return <BrowserRouter><Routes>
    <Route path="/" element={<Home/>}/><Route path="/login" element={<Login/>}/><Route path="/signup" element={<Signup/>}/>
    <Route path="/dashboard" element={<RequireAuth><Workspace section="dashboard"/></RequireAuth>}/>
    <Route path="/games" element={<RequireAuth><Workspace section="games"/></RequireAuth>}/><Route path="/planner" element={<RequireAuth><Workspace section="planner"/></RequireAuth>}/>
    <Route path="/borrowed" element={<RequireAuth><Workspace section="borrowed"/></RequireAuth>}/><Route path="/matches" element={<RequireAuth><Workspace section="matches"/></RequireAuth>}/>
    <Route path="/leaderboard" element={<RequireAuth><Workspace section="leaderboard"/></RequireAuth>}/>
    <Route path="/tournaments" element={<RequireAuth><Workspace section="tournaments"/></RequireAuth>}/><Route path="/profile" element={<RequireAuth><Workspace section="profile"/></RequireAuth>}/>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes></BrowserRouter>
}
export default App;
