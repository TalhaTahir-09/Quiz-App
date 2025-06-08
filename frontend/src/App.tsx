import "./App.css";
import { Routes, Route } from "react-router";
import SignUp from "./components/SignUp.js";
import Login from './components/Login.js'
import Home from './components/Home.js'
import QuizConfig from './components/QuizConfig.js'
import QuizPage from "./components/QuizPage.js";
import Profile from './components/Profile.js'
import Leaderboard from './components/Leaderboard.js'

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/quiz-config" element={<QuizConfig />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
    </Routes>
  );
}

export default App;
