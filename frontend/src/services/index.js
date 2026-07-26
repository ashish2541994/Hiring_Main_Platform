// Centralized API services export
import authApi from "./authApi";
import jobApi from "./jobApi";
import candidateApi from "./candidateApi";
import companyApi from "./companyApi";
import adminApi from "./adminApi";
import chatApi from "./chatApi";
import notificationApi from "./notificationApi";
import reportApi from "./reportApi";
import applicationApi from "./applicationApi";

const apiServices = {
  auth: authApi,
  jobs: jobApi,
  candidate: candidateApi,
  company: companyApi,
  admin: adminApi,
  chat: chatApi,
  notifications: notificationApi,
  reports: reportApi,
  applications: applicationApi,
};

export default apiServices;

// Individual exports for convenience
export {
  authApi,
  jobApi,
  candidateApi,
  companyApi,
  adminApi,
  chatApi,
  notificationApi,
  reportApi,
  applicationApi,
};
