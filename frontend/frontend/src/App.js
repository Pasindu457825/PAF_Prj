import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";

import CreateUser from "./pages/pasindu/CreateUser";
import UserList from "./pages/pasindu/UsersList";

function App() {
  return (
    <div>

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/add-user" element={<CreateUser />} />
        <Route path="/user-list" element={<UserList />} />
      </Routes>
    </div>
  );
}

export default App;
