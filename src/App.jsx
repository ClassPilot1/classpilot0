/**
 * Main App Component / Qaybta Ugu Weyn ee Codka
 * Handles routing and authentication checks for the entire application
 * Wuxuu maamulaa routing iyo hubinta xaqiijinta dhammaan codka
 */
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { checkAuthStatus } from "./Store/Slices/AuthSlice";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Header from "./components/layouts/Header";

// Page Components / Qaybaha Bogagga
import Login from "./Pages/Login";
import CreateAccount from "./Pages/CreateAccount";
import Home from "./Pages/Home";
import AddStudentPage from "./Pages/AddStudent";
import AddClass from "./Pages/AddClass";
import EditStudent from "./Pages/EditStudent";
import EditClass from "./Pages/EditClass";
import ViewStudent from "./Pages/ViewStudent";
import ViewClass from "./Pages/viewClass";
import ClassDetail from "./Pages/ClassDetail";
import Profile from "./Pages/Profile";
import About from "./Pages/About";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, status, token } = useSelector((state) => state.auth);

  /**
   * Check authentication status when app loads
   * Hubi xaaladda xaqiijinta marka codku bilaabmo
   */
  useEffect(() => {
    // Only check if token exists and we're not already authenticated
    // Kaliya hubi haddii token jiro oo aan xaqiijin hore u sameyn
    if (token && !isAuthenticated && status === "idle") {
      dispatch(checkAuthStatus());
    }
  }, [dispatch, token, isAuthenticated, status]);

  return (
    <div>
      {/* Show header only when user is authenticated / Muuji madaxa kaliya marka isticmaaluhu xaqiijiyey */}
      {isAuthenticated && <Header />}

      {/* Application Routes / Waddooyinka Codka */}
      <Routes>
        {/* Public Routes / Waddooyin Guud */}
        <Route path="/" element={<Login />} />

        <Route
          path="/login"
          element={
            <ProtectedRoute requireAuth={false}>
              <Login />
            </ProtectedRoute>
          }
        />

        <Route path="/register" element={<CreateAccount />} />

        {/* Protected Routes - Require Authentication / Waddooyin La Ilaaliyey - Waa in Xaqiijinta La Sameeyo */}
        
        {/* Student Management Routes / Waddooyinka Maamulka Ardayda */}
        <Route
          path="/editstudent/:id"
          element={
            <ProtectedRoute requireAuth={true}>
              <EditStudent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/viewstudent"
          element={
            <ProtectedRoute requireAuth={true}>
              <ViewStudent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/addstudent"
          element={
            <ProtectedRoute requireAuth={true}>
              <AddStudentPage />
            </ProtectedRoute>
          }
        />

        {/* Class Management Routes / Waddooyinka Maamulka Fasalka */}
        <Route
          path="/editclass/:id"
          element={
            <ProtectedRoute requireAuth={true}>
              <EditClass />
            </ProtectedRoute>
          }
        />

        <Route
          path="/addclass"
          element={
            <ProtectedRoute requireAuth={true}>
              <AddClass />
            </ProtectedRoute>
          }
        />

        <Route
          path="/viewclass"
          element={
            <ProtectedRoute requireAuth={true}>
              <ViewClass />
            </ProtectedRoute>
          }
        />

        <Route
          path="/class/:id"
          element={
            <ProtectedRoute requireAuth={true}>
              <ClassDetail />
            </ProtectedRoute>
          }
        />

        {/* Dashboard Routes / Waddooyinka Dashboard */}
        <Route
          path="/home"
          element={
            <ProtectedRoute requireAuth={true}>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requireAuth={true}>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Profile and About Routes / Waddooyinka Profile iyo About */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute requireAuth={true}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/about"
          element={
            <ProtectedRoute requireAuth={true}>
              <About />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
