import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import UsersPage from "./pages/pasindu/UsersPage";
import Home from "./pages/Home";

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> |<Link to="/users">Users</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<UsersPage />} />
      </Routes>
    </div>
  );
}

export default App;
