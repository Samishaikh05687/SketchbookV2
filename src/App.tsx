import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Whiteboard from "./Whiteboard"; // your existing canvas logic
import Navbar from "./pages/Navbar";

function App() {
  return (
      <div className="p-5">
    <Router>
         <Navbar/>
      <Routes>
         <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/canvas" element={<Whiteboard />} />
      </Routes>
    </Router>
      </div>
  );
}

export default App;
