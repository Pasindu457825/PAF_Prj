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


import PostList from "./pages/tharusha/PostList";
import PostDetail from "./pages/tharusha/PostDetail";
import CreatePost from "./pages/tharusha/CreatePost";
import MyPosts from "./pages/tharusha/MyPosts";
import EditPost from "./pages/tharusha/EditPost";

//gropus
import GroupsPage from "./pages/pasindu/user_group/GroupsPage";
import GroupDetailPage from "./pages/pasindu/user_group/GroupDetailPage";
import ViewGroupsPage from "./pages/pasindu/user_group/ViewGroupsPage";
import GroupNotifications from "./pages/pasindu/user_group/GroupNotifications";

//gropus
import GroupChat from "./pages/pasindu/group_chat/GroupChat";

// Learning
import CourseCatalog from "./pages/pamaa/CourseCatalog";
import CourseDetail from "./pages/pamaa/CourseDetail";
import LearningDashboard from "./pages/pamaa/LearningDashboard";
import CourseProgress from "./pages/pamaa/CourseProgress";
import Certificate from "./pages/pamaa/Certificate";


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


          
          <Route path="/create" element={<CreatePost />} />
          <Route path="/posts" element={<PostList />} />
        <Route path="/myposts" element={<MyPosts />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/editpost/:id" element={<EditPost />} />


          {/* group */}
          <Route path="/groups/:userId" element={<GroupsPage />} />
          <Route path="/groups/view/:groupId" element={<GroupDetailPage />} />
          <Route path="/groups/view" element={<ViewGroupsPage />} />
          <Route path="/notifications" element={<GroupNotifications />} />

          {/* group chat */}
          <Route path="/groups/chat/:groupId" element={<GroupChat />} />

           {/* Learning */}
          <Route path="/courses" element={<CourseCatalog />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/my-learning" element={<LearningDashboard />} />
          <Route path="/learning/:courseId" element={<CourseProgress />} />
          <Route path="/certificates/:userEmail/:courseId" element={<Certificate />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
