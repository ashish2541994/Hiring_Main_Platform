import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Pagination from "../../components/ui/Pagination";
import { EmptyState } from "../../components/ui/EmptyState";
import adminService from "../../services/AdminService";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Download,
  Eye,
  Calendar,
  Loader2,
  Building2,
  Bookmark,
  Globe,
} from "lucide-react";

const STATUS_COLORS = {
  pending: "warning",
  reviewed: "info",
  shortlisted: "info",
  interviewing: "info",
  offered: "success",
  hired: "success",
  rejected: "danger",
  withdrawn: "default",
};

const AdminCandidateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const result = await adminService.getCandidateProfile(id);
      if (result.success) {
        setProfile(result.data.profile);
      } else {
        toast.error(result.error || "Failed to load candidate profile");
        navigate("/admin/users");
      }
    } catch (error) {
      toast.error("Failed to load candidate profile");
      navigate("/admin/users");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const loadApplications = useCallback(async () => {
    try {
      setApplicationsLoading(true);
      const result = await adminService.getCandidateApplications(id, {
        page: pagination.page,
        limit: pagination.limit,
      });
      if (result.success) {
        setApplications(result.data.applications || []);
        if (result.data.pagination) setPagination(result.data.pagination);
      }
    } catch (error) {
      console.error("Failed to load applications:", error);
    } finally {
      setApplicationsLoading(false);
    }
  }, [id, pagination.page, pagination.limit]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleViewResume = (resumePath) => {
    if (resumePath) {
      window.open(`/${resumePath}`, "_blank");
    } else {
      toast.error("No resume available");
    }
  };

  const handleDownloadResume = (resumePath) => {
    if (resumePath) {
      const link = document.createElement("a");
      link.href = `/${resumePath}`;
      link.download = resumePath.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast.error("No resume available to download");
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <EmptyState
            variant="no-data"
            title="Candidate not found"
            description="The candidate you're looking for doesn't exist or has been removed."
            actionLabel="Back to Users"
            onAction={() => navigate("/admin/users")}
          />
        </div>
      </div>
    );
  }

  const hasLocation =
    profile.location?.city ||
    profile.location?.state ||
    profile.location?.country;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Back Button & Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Users
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {profile.firstName?.[0]}
              {profile.lastName?.[0]}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {profile.email}
                <span className="mx-2">•</span>
                <Badge variant="info">{profile.role || "candidate"}</Badge>
                {profile.isVerified && (
                  <Badge variant="success">Verified</Badge>
                )}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Personal Info & Education */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-500" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wider">
                        Full Name
                      </label>
                      <p className="text-sm font-medium mt-1">
                        {profile.firstName} {profile.lastName}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wider">
                        Email
                      </label>
                      <p className="text-sm font-medium mt-1 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-gray-400" />
                        {profile.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wider">
                        Phone
                      </label>
                      <p className="text-sm font-medium mt-1 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        {profile.phone || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wider">
                        Registered Date
                      </label>
                      <p className="text-sm font-medium mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        {formatDate(profile.createdAt)}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs text-gray-500 uppercase tracking-wider">
                        Address / Location
                      </label>
                      <p className="text-sm font-medium mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {hasLocation
                          ? `${profile.location?.city || ""}${profile.location?.city && profile.location?.state ? ", " : ""}${profile.location?.state || ""}${(profile.location?.city || profile.location?.state) && profile.location?.country ? " - " : ""}${profile.location?.country || ""}`
                          : profile.location?.addressLine1 || "Not provided"}
                      </p>
                      {profile.location?.addressLine1 && (
                        <p className="text-xs text-gray-400 mt-1">
                          {profile.location.addressLine1}
                          {profile.location.addressLine2 &&
                            `, ${profile.location.addressLine2}`}
                        </p>
                      )}
                    </div>
                  </div>

                  {profile.bio && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <label className="text-xs text-gray-500 uppercase tracking-wider">
                        Bio
                      </label>
                      <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
                        {profile.bio}
                      </p>
                    </div>
                  )}

                  {(profile.yearsOfExperience > 0 ||
                    profile.currentCompany ||
                    profile.currentDesignation) && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                        Professional Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {profile.currentCompany && (
                          <div>
                            <label className="text-xs text-gray-400">
                              Current Company
                            </label>
                            <p className="text-sm font-medium">
                              {profile.currentCompany}
                            </p>
                          </div>
                        )}
                        {profile.currentDesignation && (
                          <div>
                            <label className="text-xs text-gray-400">
                              Designation
                            </label>
                            <p className="text-sm font-medium">
                              {profile.currentDesignation}
                            </p>
                          </div>
                        )}
                        {profile.yearsOfExperience > 0 && (
                          <div>
                            <label className="text-xs text-gray-400">
                              Experience
                            </label>
                            <p className="text-sm font-medium">
                              {profile.yearsOfExperience} years
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Education Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-purple-500" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.education && profile.education.length > 0 ? (
                    <div className="space-y-4">
                      {profile.education.map((edu, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">
                                {edu.degree || "Degree"}{" "}
                                {edu.field ? `in ${edu.field}` : ""}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                {edu.school || "School/University"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                            {edu.startDate && (
                              <span>
                                {new Date(edu.startDate).getFullYear()}
                              </span>
                            )}
                            {edu.startDate && (edu.endDate || edu.current) && (
                              <span>-</span>
                            )}
                            {edu.current ? (
                              <span className="text-green-500 font-medium">
                                Present
                              </span>
                            ) : edu.endDate ? (
                              <span>{new Date(edu.endDate).getFullYear()}</span>
                            ) : null}
                          </div>
                          {edu.description && (
                            <p className="text-xs text-gray-500 mt-2">
                              {edu.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-4">
                      No education details provided
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Skills Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-500" />
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.skills && profile.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-4">
                      No skills listed
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Resume & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                      Jobs Applied
                    </span>
                    <span className="text-xl font-bold text-blue-700 dark:text-blue-300">
                      {profile.applicationCount || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <span className="text-sm text-purple-700 dark:text-purple-300">
                      Skills
                    </span>
                    <span className="text-xl font-bold text-purple-700 dark:text-purple-300">
                      {profile.skills?.length || 0}
                    </span>
                  </div>
                  {profile.yearsOfExperience > 0 && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                      <span className="text-sm text-green-700 dark:text-green-300">
                        Experience
                      </span>
                      <span className="text-xl font-bold text-green-700 dark:text-green-300">
                        {profile.yearsOfExperience}y
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Resume Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-500" />
                    Resume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.resumes && profile.resumes.length > 0 ? (
                    <div className="space-y-3">
                      {profile.resumes.map((resume, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                              <FileText className="w-5 h-5 text-orange-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-orange-800 dark:text-orange-200 truncate">
                                {resume.originalName || "Resume"}
                              </p>
                              {resume.fileSize && (
                                <p className="text-xs text-orange-600 dark:text-orange-400">
                                  {resume.fileSize > 1024
                                    ? `${(resume.fileSize / 1024).toFixed(1)} KB`
                                    : `${resume.fileSize} B`}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewResume(resume.file)}
                              className="flex-1"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadResume(resume.file)}
                              className="flex-1"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : profile.resume ? (
                    <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-orange-800 dark:text-orange-200 truncate">
                            Resume
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewResume(profile.resume)}
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadResume(profile.resume)}
                          className="flex-1"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-400">
                        No resume uploaded
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Application History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-500" />
                Application History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {applicationsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                </div>
              ) : applications.length > 0 ? (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                            Job Title
                          </th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                            Company
                          </th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                            Applied Date
                          </th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map((app, idx) => (
                          <motion.tr
                            key={app._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: idx * 0.03 }}
                            className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          >
                            <td className="py-3 px-4">
                              <p className="font-medium text-sm">
                                {app.job?.title || "N/A"}
                              </p>
                            </td>
                            <td className="py-3 px-4">
                              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                {app.company?.name ||
                                  app.job?.company?.name ||
                                  "N/A"}
                              </p>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-500">
                              {formatDate(app.createdAt)}
                            </td>
                            <td className="py-3 px-4">
                              <Badge
                                variant={STATUS_COLORS[app.status] || "default"}
                              >
                                {app.status}
                              </Badge>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile View */}
                  <div className="md:hidden space-y-3">
                    {applications.map((app, idx) => (
                      <motion.div
                        key={app._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium">
                              {app.job?.title || "N/A"}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <Building2 className="w-3 h-3" />
                              {app.company?.name ||
                                app.job?.company?.name ||
                                "N/A"}
                            </p>
                          </div>
                          <Badge
                            variant={STATUS_COLORS[app.status] || "default"}
                          >
                            {app.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-400 mt-2">
                          Applied: {formatDate(app.createdAt)}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {pagination.pages > 1 && (
                    <div className="mt-6">
                      <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.pages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              ) : (
                <EmptyState
                  variant="no-data"
                  title="No applications yet"
                  description="This candidate hasn't applied to any jobs."
                />
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminCandidateProfile;
