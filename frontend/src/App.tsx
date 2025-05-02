import "./App.css";
import { Routes, Route } from "react-router";
import SignUp from "./components/SignUp.js";
function App() {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}

export default App;
