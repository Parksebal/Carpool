import { Routes, Route } from "react-router";

import LandingPage from "./pages/LandingPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import CreateProfilePage from "./pages/CreateProfilePage";
import StudentIdUploadPage from "./pages/StudentIdUploadPage";
import VerificationPendingPage from "./pages/VerificationPendingPage";
import DashboardPage from "./pages/DashboardPage";

import DriverVerifyPage from "./pages/DriverVerifyPage";
import VehiclePage from "./pages/VehiclePage";

import PostRidePage from "./pages/PostRidePage";
import SearchRidesPage from "./pages/SearchRidesPage";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Student onboarding */}
      <Route
        path="/onboarding/profile"
        element={
          <ProtectedRoute>
            <CreateProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/onboarding/student-id"
        element={
          <ProtectedRoute>
            <StudentIdUploadPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/onboarding/pending"
        element={
          <ProtectedRoute>
            <VerificationPendingPage />
          </ProtectedRoute>
        }
      />

      {/* Main dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Driver flow */}
      <Route
        path="/driver/verify"
        element={
          <ProtectedRoute>
            <DriverVerifyPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/driver/vehicle"
        element={
          <ProtectedRoute>
            <VehiclePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/driver/post"
        element={
          <ProtectedRoute>
            <PostRidePage />
          </ProtectedRoute>
        }
      />

      {/* Rider flow */}
      <Route
        path="/rider/search"
        element={
          <ProtectedRoute>
            <SearchRidesPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}