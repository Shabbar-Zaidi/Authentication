import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import Login from "./pages/Register";
import Profile from "./pages/Profile";
import CreateProfile from "./pages/CreateProfile";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";
import EmailVerification from "./pages/EmailVerification";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, setIsAuthenticated, user, setUser } = useAppContext();
  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated, "user:", user);

  // If authenticated but user is not loaded into context, try to hydrate from localStorage
  useEffect(() => {
    if (isAuthenticated && !user) {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          console.warn("ProtectedRoute: failed to parse stored user", e);
        }
      }
    }
  }, [isAuthenticated, user, setUser]);

  if (!isAuthenticated) {
    return <Navigate to="/register" replace />;
  }

  // If still no user after hydration, show nothing (or a loader) until user is available
  if (!user) return null;

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user, setUser } = useAppContext();
  console.log("RedirectAuthenticatedUser - isAuthenticated:", isAuthenticated, "user:", user);

  React.useEffect(() => {
    if (isAuthenticated && !user) {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          console.warn("RedirectAuthenticatedUser: failed to parse stored user", e);
        }
      }
    }
  }, [isAuthenticated, user, setUser]);

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { isAuthenticated, setIsAuthenticated } = useAppContext();

  useEffect(() => {
    const checkAuth = async () => {
      // Implement authentication check logic here
      const user = localStorage.getItem("user");
      setIsAuthenticated(!!user); // Set to true if user exists in localStorage
    };

    checkAuth();
  }, [setIsAuthenticated]);

  // if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div>
      <Routes>
        {/* <Route path="/" element={<Profile />} /> */}

        <Route path="/register" element={<Login />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <ResetPassword />
            </RedirectAuthenticatedUser>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes> */}
      <Toaster />
    </div>
  );
}

export default App;
