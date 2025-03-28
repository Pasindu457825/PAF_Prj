import React from "react";
import { Routes, BrowserRouter, Route, Link } from "react-router-dom";
import Home from "./pages/Home";

//user
import CreateUser from "./pages/pasindu/CreateUser";
import UserList from "./pages/pasindu/UsersList";
import UpdateUser from "./pages/pasindu/UpdateUser";
import Login from "./pages/pasindu/LoginPage";
import MyProfile from "./pages/pasindu/MyProfile";

//password
import ForgotPassword from "./pages/pasindu/reset_password/ForgotPassword"; // Import the page
import ResetPassword from "./pages/pasindu/reset_password/ResetPassword";

//gropus
import GroupsPage from "./pages/pasindu/user_group/GroupsPage";
import GroupDetailPage from "./pages/pasindu/user_group/GroupDetailPage";
import ViewGroupsPage from "./pages/pasindu/user_group/ViewGroupsPage";


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* user */}
          <Route path="/register" element={<CreateUser />} />
          <Route path="/user-list" element={<UserList />} />
          <Route path="/update-user/:id" element={<UpdateUser />} />
          <Route path="/login" element={<Login />} />
          <Route path="/myprofile" element={<MyProfile />} />

          {/* reset-password */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* group */}
          <Route path="/groups/:userId" element={<GroupsPage />} />
          <Route path="/groups/view/:groupId" element={<GroupDetailPage />} />
          <Route path="/groups/view" element={<ViewGroupsPage />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
