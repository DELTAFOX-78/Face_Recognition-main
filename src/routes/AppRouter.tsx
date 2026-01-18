import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { studentRoutes } from "./studentRoutes";
import { teacherRoutes } from "./teacherRoutes";
import LandingPage from "../pages/LandingPage";

export default function AppRouter() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />

          {/* Student Routes */}
          {studentRoutes}

          {/* Teacher Routes */}
          {teacherRoutes}
        </Routes>
      </div>
    </Router>
  );
}
