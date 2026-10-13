import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Layouts
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";
import MechanicLayout from "../layouts/MechanicLayout";
import UserLayout from "../layouts/UserLayout";

// Public Pages
import LandingPage from "../pages/public/LandingPage";
import ServicesPage from "../pages/public/ServicesPage";
import AboutPage from "../pages/public/AboutPage";
import ContactPage from "../pages/public/ContactPage";

// Auth Pages
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserManagement from "../pages/admin/UserManagement";
import MechanicManagement from "../pages/admin/MechanicManagement";
import ServiceManagement from "../pages/admin/ServiceManagement";
import BookingManagement from "../pages/admin/BookingManagement";
import ReportsAnalytics from "../pages/admin/ReportsAnalytics";
import FeedbackReviews from "../pages/admin/FeedbackReviews";
import AdminSettings from "../pages/admin/AdminSettings";

// Mechanic Pages
import MechanicDashboard from "../pages/mechanic/MechanicDashboard";
import MyServiceRequests from "../pages/mechanic/MyServiceRequests";
import JobManagement from "../pages/mechanic/JobManagement";
import ServiceHistory from "../pages/mechanic/ServiceHistory";
import AvailabilityManagement from "../pages/mechanic/AvailabilityManagement";
import EarningsPerformance from "../pages/mechanic/EarningsPerformance";
import MechanicProfile from "../pages/mechanic/MechanicProfile";

// User Pages
import UserDashboard from "../pages/user/UserDashboard";
import VehicleManagement from "../pages/user/VehicleManagement";
import BookService from "../pages/user/BookService";
import MyBookings from "../pages/user/MyBookings";
import ServiceTracking from "../pages/user/ServiceTracking";
import UserServiceHistory from "../pages/user/UserServiceHistory";
import UserReviews from "../pages/user/UserReviews";
import UserProfile from "../pages/user/UserProfile";

// Fallback Pages
import AccessDenied from "../pages/AccessDenied";
import NotFound from "../pages/NotFound";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* 2. Authentication Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* 3. Admin Panel (Protected for role === 'admin') */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="mechanics" element={<MechanicManagement />} />
        <Route path="services" element={<ServiceManagement />} />
        <Route path="bookings" element={<BookingManagement />} />
        <Route path="reports" element={<ReportsAnalytics />} />
        <Route path="reviews" element={<FeedbackReviews />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* 4. Mechanic Panel (Protected for role === 'mechanic') */}
      <Route
        path="/mechanic"
        element={
          <ProtectedRoute allowedRoles={["mechanic"]}>
            <MechanicLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/mechanic/dashboard" replace />} />
        <Route path="dashboard" element={<MechanicDashboard />} />
        <Route path="requests" element={<MyServiceRequests />} />
        <Route path="jobs" element={<JobManagement />} />
        <Route path="history" element={<ServiceHistory />} />
        <Route path="availability" element={<AvailabilityManagement />} />
        <Route path="earnings" element={<EarningsPerformance />} />
        <Route path="profile" element={<MechanicProfile />} />
      </Route>

      {/* 5. User Panel (Protected for role === 'user') */}
      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/user/dashboard" replace />} />
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="vehicles" element={<VehicleManagement />} />
        <Route path="book-service" element={<BookService />} />
        <Route path="bookings" element={<MyBookings />} />
        <Route path="tracking" element={<ServiceTracking />} />
        <Route path="tracking/:id" element={<ServiceTracking />} />
        <Route path="history" element={<UserServiceHistory />} />
        <Route path="reviews" element={<UserReviews />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>

      {/* 6. Utility and Fallback Pages */}
      <Route path="/access-denied" element={<AccessDenied />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

