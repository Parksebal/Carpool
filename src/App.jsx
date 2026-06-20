import { Routes, Route } from "react-router";

import LandingPage from "./pages/LandingPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import CreateProfilePage from "./pages/CreateProfilePage";
import StudentIdUploadPage from "./pages/StudentIdUploadPage";
import VerificationPendingPage from "./pages/VerificationPendingPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />

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

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}