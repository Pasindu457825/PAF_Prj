import React from "react";
import { Routes, BrowserRouter, Route, Link } from "react-router-dom";
import Home from "./pages/Home";

import CreateUser from "./pages/pasindu/CreateUser";
import UserList from "./pages/pasindu/UsersList";
import UpdateUser from "./pages/pasindu/UpdateUser";
import Login from "./pages/pasindu/LoginPage";
import MyProfile from "./pages/pasindu/MyProfile";

//password
import ForgotPassword from "./pages/pasindu/reset_password/ForgotPassword"; // Import the page
import ResetPassword from "./pages/pasindu/reset_password/ResetPassword";

import PostList from "./pages/tharusha/PostList";
import PostDetail from "./pages/tharusha/PostDetail";
import CreatePost from "./pages/tharusha/CreatePost";
import MyPosts from "./pages/tharusha/MyPosts";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/register" element={<CreateUser />} />
          <Route path="/user-list" element={<UserList />} />
          <Route path="/update-user/:id" element={<UpdateUser />} />
          <Route path="/login" element={<Login />} />
          <Route path="/myprofile" element={<MyProfile />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          
          <Route path="/create" element={<CreatePost />} />
          <Route path="/posts" element={<PostList />} />
        <Route path="/myposts" element={<MyPosts />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
