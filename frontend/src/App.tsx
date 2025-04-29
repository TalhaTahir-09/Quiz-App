import "./App.css";
import { Routes, Route } from "react-router";
import SignIn from "./components/SignIn.tsx";
function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
    </Routes>
  );
}

export default App;
