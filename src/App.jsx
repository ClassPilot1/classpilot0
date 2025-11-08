import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { checkAuthStatus } from "./Store/Slices/AuthSlice";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Header from "./components/layouts/Header";

// pages

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


function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, status, token } = useSelector((state) => state.auth);

  // Check authentication status on app mount
  useEffect(() => {
    // Only check if token exists and we're not already authenticated
    if (token && !isAuthenticated && status === "idle") {
      dispatch(checkAuthStatus());
    }
  }, [dispatch, token, isAuthenticated, status]);

  return (
    <div>
      {isAuthenticated && <Header />}

      <Routes>
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

             <Route 
               path="/editstudent/:id" 
               element={
                 <ProtectedRoute requireAuth={true}>
                   <EditStudent />
                 </ProtectedRoute>
               } 
             />

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
           } />

        <Route 
        path="/home" 
        element={
          <ProtectedRoute requireAuth={true}>
            <Home />
          </ProtectedRoute>
        } />

        <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute requireAuth={true}>
            <Home />
          </ProtectedRoute>
        } />



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

        <Route
          path="/profile"
          element={
            <ProtectedRoute requireAuth={true}>
              <Profile />
            </ProtectedRoute>
          }
        />

     
      </Routes>
    </div>
  );
}

export default App;
