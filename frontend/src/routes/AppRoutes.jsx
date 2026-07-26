import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loader from "../components/ui/Loader";
import DashboardLayout from "../components/layouts/DashboardLayout";
import PublicLayout from "../components/layouts/PublicLayout";
import AuthLayout from "../components/layouts/AuthLayout";
import PlatformLayout from "../components/layouts/PlatformLayout";
import WindHireLayout from "../components/layouts/WindHireLayout";
import PrivateRoute from "../components/auth/PrivateRoute";
import AdminRoute from "../components/auth/AdminRoute";
import RecruiterRoute from "../components/auth/RecruiterRoute";
import CandidateRoute from "../components/auth/CandidateRoute";
import GuestRoute from "../components/auth/GuestRoute";

// ────── Landing / Company ──────
const NewLandingPage = lazy(() => import("../pages/LandingPage/LandingPage"));

// ────── Platform (Vidhidhruv Solutions) ──────
const PlatformDashboard = lazy(
  () => import("../pages/platform/PlatformDashboard"),
);
const PlatformProfile = lazy(() => import("../pages/platform/PlatformProfile"));

// ────── Product Landing Pages ──────
const WindHireLandingPage = lazy(
  () => import("../pages/products/WindHireLandingPage"),
);
const Product2Landing = lazy(() => import("../pages/products/Product2Landing"));
const Product3Landing = lazy(() => import("../pages/products/Product3Landing"));
const Product4Landing = lazy(() => import("../pages/products/Product4Landing"));
const WindHireDashboard = lazy(
  () => import("../pages/products/WindHireDashboard"),
);

// ────── Public Pages ──────
const LandingPage = lazy(() => import("../pages/public/LandingPage"));
const AboutPage = lazy(() => import("../pages/public/AboutPage"));
const FeaturesPage = lazy(() => import("../pages/public/FeaturesPage"));
const PricingPage = lazy(() => import("../pages/public/PricingPage"));

// ────── Auth Pages ──────
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(
  () => import("../pages/auth/ForgotPasswordPage"),
);
const ResetPasswordPage = lazy(() => import("../pages/auth/ResetPasswordPage"));

// ────── Wind Hire (Admin) ──────
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("../pages/admin/AdminUsers"));
const AdminAnalytics = lazy(() => import("../pages/admin/AdminAnalytics"));
const AdminSettings = lazy(() => import("../pages/admin/AdminSettings"));
const AdminApplications = lazy(
  () => import("../pages/admin/AdminApplications"),
);
const AdminCandidateProfile = lazy(
  () => import("../pages/admin/AdminCandidateProfile"),
);

// ────── Wind Hire (Recruiter) ──────
const RecruiterDashboard = lazy(
  () => import("../pages/recruiter/RecruiterDashboard"),
);
const RecruiterJobs = lazy(() => import("../pages/recruiter/RecruiterJobs"));
const RecruiterApplications = lazy(
  () => import("../pages/recruiter/RecruiterApplications"),
);
const RecruiterCandidates = lazy(
  () => import("../pages/recruiter/RecruiterCandidates"),
);
const RecruiterCandidateProfile = lazy(
  () => import("../pages/recruiter/RecruiterCandidateProfile"),
);
const RecruiterCompany = lazy(
  () => import("../pages/recruiter/RecruiterCompany"),
);
const CreateJob = lazy(() => import("../pages/recruiter/CreateJob"));
const EditJob = lazy(() => import("../pages/recruiter/EditJob"));

// ────── Wind Hire (Candidate) ──────
const CandidateDashboard = lazy(
  () => import("../pages/candidate/CandidateDashboard"),
);
const CandidateJobs = lazy(() => import("../pages/candidate/CandidateJobs"));
const CandidateApplications = lazy(
  () => import("../pages/candidate/CandidateApplications"),
);
const CandidateProfile = lazy(
  () => import("../pages/candidate/CandidateProfile"),
);
const CandidateSavedJobs = lazy(
  () => import("../pages/candidate/CandidateSavedJobs"),
);

// ────── Shared ──────
const JobDetailsPage = lazy(() => import("../pages/jobs/JobDetailsPage"));
const CompanyProfilePage = lazy(
  () => import("../pages/companies/CompanyProfilePage"),
);
const CompaniesPage = lazy(() => import("../pages/companies/CompaniesPage"));
const MessagesPage = lazy(() => import("../pages/messages/MessagesPage"));
const NotificationsPage = lazy(
  () => import("../pages/notifications/NotificationsPage"),
);
const SettingsPage = lazy(() => import("../pages/settings/SettingsPage"));

const NotFoundPage = lazy(() => import("../pages/error/NotFoundPage"));
const UnauthorizedPage = lazy(() => import("../pages/error/UnauthorizedPage"));
const ServerErrorPage = lazy(() => import("../pages/error/ServerErrorPage"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* ═══════════════════════════════════════════
            COMPANY LANDING (standalone)
           ═══════════════════════════════════════════ */}
        <Route index element={<NewLandingPage />} />

        {/* ═══════════════════════════════════════════
            PLATFORM PAGES (Vidhidhruv Solutions)
           ═══════════════════════════════════════════ */}
        <Route
          element={
            <PrivateRoute>
              <PlatformLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<PlatformDashboard />} />
          <Route path="profile" element={<PlatformProfile />} />
        </Route>

        {/* ═══════════════════════════════════════════
            PUBLIC ROUTES
           ═══════════════════════════════════════════ */}
        <Route element={<PublicLayout />}>
          <Route path="about" element={<AboutPage />} />
          <Route path="features" element={<FeaturesPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="companies" element={<CompaniesPage />} />
          <Route path="jobs/:id" element={<JobDetailsPage />} />
          <Route path="companies/:id" element={<CompanyProfilePage />} />
          <Route path="401" element={<UnauthorizedPage />} />
          <Route path="500" element={<ServerErrorPage />} />
        </Route>

        {/* ═══════════════════════════════════════════
            AUTH ROUTES
           ═══════════════════════════════════════════ */}
        <Route element={<AuthLayout />}>
          <Route
            path="login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="register"
            element={
              <GuestRoute>
                <RegisterPage />
              </GuestRoute>
            }
          />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password/:token" element={<ResetPasswordPage />} />
        </Route>

        {/* ═══════════════════════════════════════════
            PRODUCT LANDING PAGES (standalone)
           ═══════════════════════════════════════════ */}
        <Route path="products/windhire" element={<WindHireLandingPage />} />
        <Route path="products/product2" element={<Product2Landing />} />
        <Route path="products/product3" element={<Product3Landing />} />
        <Route path="products/product4" element={<Product4Landing />} />

        {/* ═══════════════════════════════════════════
            WIND HIRE DASHBOARD REDIRECTOR
           ═══════════════════════════════════════════ */}
        <Route
          path="products/windhire/dashboard"
          element={
            <PrivateRoute>
              <WindHireDashboard />
            </PrivateRoute>
          }
        />

        {/* ═══════════════════════════════════════════
            WIND HIRE — ADMIN
           ═══════════════════════════════════════════ */}
        <Route
          element={
            <AdminRoute>
              <WindHireLayout />
            </AdminRoute>
          }
        >
          <Route
            path="products/windhire/admin"
            element={
              <Navigate to="/products/windhire/admin/dashboard" replace />
            }
          />
          <Route
            path="products/windhire/admin/dashboard"
            element={<AdminDashboard />}
          />
          <Route
            path="products/windhire/admin/users"
            element={<AdminUsers />}
          />
          <Route
            path="products/windhire/admin/applications"
            element={<AdminApplications />}
          />
          <Route
            path="products/windhire/admin/candidate/:id"
            element={<AdminCandidateProfile />}
          />
          <Route
            path="products/windhire/admin/analytics"
            element={<AdminAnalytics />}
          />
          <Route
            path="products/windhire/admin/settings"
            element={<AdminSettings />}
          />
        </Route>

        {/* ═══════════════════════════════════════════
            WIND HIRE — RECRUITER
           ═══════════════════════════════════════════ */}
        <Route
          element={
            <RecruiterRoute>
              <WindHireLayout />
            </RecruiterRoute>
          }
        >
          <Route
            path="products/windhire/recruiter"
            element={
              <Navigate to="/products/windhire/recruiter/dashboard" replace />
            }
          />
          <Route
            path="products/windhire/recruiter/dashboard"
            element={<RecruiterDashboard />}
          />
          <Route
            path="products/windhire/recruiter/jobs"
            element={<RecruiterJobs />}
          />
          <Route
            path="products/windhire/recruiter/jobs/create"
            element={<CreateJob />}
          />
          <Route
            path="products/windhire/recruiter/jobs/edit/:id"
            element={<EditJob />}
          />
          <Route
            path="products/windhire/recruiter/applications"
            element={<RecruiterApplications />}
          />
          <Route
            path="products/windhire/recruiter/candidates"
            element={<RecruiterCandidates />}
          />
          <Route
            path="products/windhire/recruiter/candidates/:candidateId"
            element={<RecruiterCandidateProfile />}
          />
          <Route
            path="products/windhire/recruiter/company"
            element={<RecruiterCompany />}
          />
        </Route>

        {/* ═══════════════════════════════════════════
            WIND HIRE — CANDIDATE
           ═══════════════════════════════════════════ */}
        <Route
          element={
            <CandidateRoute>
              <WindHireLayout />
            </CandidateRoute>
          }
        >
          <Route
            path="products/windhire/candidate"
            element={
              <Navigate to="/products/windhire/candidate/dashboard" replace />
            }
          />
          <Route
            path="products/windhire/candidate/dashboard"
            element={<CandidateDashboard />}
          />
          <Route
            path="products/windhire/candidate/jobs"
            element={<CandidateJobs />}
          />
          <Route
            path="products/windhire/candidate/applications"
            element={<CandidateApplications />}
          />
          <Route
            path="products/windhire/candidate/profile"
            element={<CandidateProfile />}
          />
          <Route
            path="products/windhire/candidate/saved-jobs"
            element={<CandidateSavedJobs />}
          />
        </Route>

        {/* ═══════════════════════════════════════════
            WIND HIRE — SHARED AUTHENTICATED ROUTES
           ═══════════════════════════════════════════ */}
        <Route
          element={
            <PrivateRoute>
              <WindHireLayout />
            </PrivateRoute>
          }
        >
          <Route path="products/windhire/messages" element={<MessagesPage />} />
          <Route
            path="products/windhire/notifications"
            element={<NotificationsPage />}
          />
          <Route path="products/windhire/settings" element={<SettingsPage />} />
        </Route>

        {/* ═══════════════════════════════════════════
            404 — CATCH ALL
           ═══════════════════════════════════════════ */}
        <Route element={<PublicLayout />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
