import React from "react";
import { Routes, BrowserRouter, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import { AuthProvider } from "./context/AuthContext"; // Import the correct export

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
import CourseList from "./components/pamaa/Course/CourseList";
import CourseDetails from "./components/pamaa/Course/CourseDetails";
import CourseCreation from "./components/pamaa/Course/CourseCreation";
import CourseEdit from "./components/pamaa/Course/CourseEdit";
import CourseView from "./components/pamaa/Course/CourseView";
import CertificateDownload from "./components/pamaa/Certificate/CertificateDownload"
import CertificatesList from "./components/pamaa/Certificate/CertificatesList";
import Dashboard from "./components/pamaa/Dashboard/Dashboard";
import LearningNavBar from "./components/pamaa/LearningNavBar";

function App() {
  return (
    <AuthProvider>
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
          <Route
            path="courses/*"
            element={
              <>
                <LearningNavBar />
                <Routes>
                  <Route index element={<CourseList />} />
                  <Route path=":courseId" element={<CourseDetails />} />
                  <Route path="create" element={<CourseCreation />} />
                  <Route path="edit/:courseId" element={<CourseEdit />} />
                  <Route path="view/:courseId" element={<CourseView />} />
                </Routes>
              </>
            }
          />
          <Route
            path="dashboard"
            element={
              <>
                <LearningNavBar />
                <Dashboard />
              </>
            }
          />
          <Route
            path="certificates/*"
            element={
              <>
                <LearningNavBar />
                <Routes>
                  <Route index element={<CertificatesList />} />
                  <Route path=":certificateId" element={<CertificateDownload />} />
                </Routes>
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
