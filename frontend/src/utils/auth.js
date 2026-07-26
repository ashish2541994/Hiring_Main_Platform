export const getDashboardPath = (role) => {
  switch (role) {
    case "admin":
    case "super_admin":
      return "/products/windhire/admin/dashboard";
    case "recruiter":
    case "hr":
    case "company":
      return "/products/windhire/recruiter/dashboard";
    case "candidate":
    default:
      return "/products/windhire/candidate/dashboard";
  }
};

export const getProfilePath = (role) => {
  switch (role) {
    case "candidate":
      return "/products/windhire/candidate/profile";
    case "recruiter":
    case "hr":
    case "company":
      return "/products/windhire/recruiter/company";
    case "admin":
    case "super_admin":
      return "/products/windhire/admin/settings";
    default:
      return "/products/windhire/settings";
  }
};

/**
 * Platform-level dashboard path (product hub)
 */
export const getPlatformDashboardPath = () => "/dashboard";

/**
 * Platform-level profile path
 */
export const getPlatformProfilePath = () => "/profile";
