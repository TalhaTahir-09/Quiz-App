import "./App.css";
import { Routes, Route } from "react-router";
import SignUp from "./components/SignUp.js";
import Login from './components/Login.js'
import Home from './components/Home.js'

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      

    </Routes>
  );
}

export default App;
