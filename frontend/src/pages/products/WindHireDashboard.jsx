import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDashboardPath } from "../../utils/auth";

/**
 * WindHireDashboard is a role-based redirector.
 * It reads the user's role and redirects to the appropriate dashboard
 * under the /products/windhire namespace.
 */
const WindHireDashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Map user role to the appropriate dashboard under /products/windhire
  const role = user.role;
  let targetPath;

  switch (role) {
    case "admin":
    case "super_admin":
      targetPath = "/products/windhire/admin/dashboard";
      break;
    case "recruiter":
    case "hr":
    case "company":
      targetPath = "/products/windhire/recruiter/dashboard";
      break;
    case "candidate":
    default:
      targetPath = "/products/windhire/candidate/dashboard";
      break;
  }

  return <Navigate to={targetPath} replace />;
};

export default WindHireDashboard;
