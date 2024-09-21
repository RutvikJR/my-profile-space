import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.scss";
import LandingPage from "./components/LandingPage.jsx";
import RouteHandler from "./components/RouteHandler.jsx";
import TeamSection from "./TeamSection.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/team" element={<TeamSection />} />
        <Route path="/:slug" element={<RouteHandler />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
