import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Users,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  GraduationCap,
  FileText,
  ExternalLink,
  Download,
  Award,
  Clock3,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Eye,
  ArrowUpRight,
  X,
  MapPin,
} from "lucide-react";

import { Card, CardContent } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Avatar from "../../components/ui/Avatar";
import Button from "../../components/ui/Button";
import Pagination from "../../components/ui/Pagination";
import { EmptyState } from "../../components/ui/EmptyState";
import { SkeletonApplicationCard } from "../../components/ui/Loading";

import recruiterService from "../../services/RecruiterService";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  "pending",
  "reviewed",
  "shortlisted",
  "interviewing",
  "offered",
  "hired",
  "rejected",
];

const RecruiterApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const navigate = useNavigate();

  // Helper to get candidate display name from snapshot or populated user
  const getCandidateName = (app) => {
    if (app.candidateSnapshot?.name) return app.candidateSnapshot.name;
    if (app.candidate?.firstName)
      return `${app.candidate.firstName} ${app.candidate.lastName || ""}`.trim();
    return "Unknown Candidate";
  };

  // Helper to get candidate email from snapshot or populated user
  const getCandidateEmail = (app) => {
    return app.candidateSnapshot?.email || app.candidate?.email || "";
  };

  // Helper to get candidate phone from snapshot or populated user
  const getCandidatePhone = (app) => {
    return app.candidateSnapshot?.phone || app.candidate?.phone || "";
  };

  // Helper to get candidate address from snapshot
  const getCandidateAddress = (app) => {
    if (app.candidateSnapshot?.address) return app.candidateSnapshot.address;
    const loc = app.candidateSnapshot?.location || app.candidate?.location;
    if (loc) {
      return [loc.addressLine1, loc.city, loc.state, loc.country]
        .filter(Boolean)
        .join(", ");
    }
    return "";
  };

  // Helper to get candidate skills from snapshot or populated user
  const getCandidateSkills = (app) => {
    return app.candidateSnapshot?.skills || app.candidate?.skills || [];
  };

  // Helper to get candidate education from snapshot or populated user
  const getCandidateEducation = (app) => {
    return app.candidateSnapshot?.education || app.candidate?.education || [];
  };

  // Helper to get resume URL
  const getResumeUrl = (app) => {
    return (
      app.candidateSnapshot?.resume || app.resume || app.candidate?.resume || ""
    );
  };

  // Build a resume URL that works with the backend static file serving
  const buildResumeUrl = (resumePath) => {
    if (!resumePath || resumePath === "not-provided") return null;
    if (resumePath.startsWith("http")) return resumePath;
    const cleanPath = resumePath.startsWith("/")
      ? resumePath.slice(1)
      : resumePath;
    return `/${cleanPath}`;
  };

  // Navigate to candidate profile page
  const handleViewProfile = (candidateId) => {
    if (candidateId) {
      navigate(`/recruiter/candidates/${candidateId}`);
    }
  };

  const loadApplications = useCallback(async () => {
    try {
      setLoading(true);

      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (statusFilter) {
        params.status = statusFilter;
      }

      const result = await recruiterService.getApplications(params);

      if (result.success) {
        setApplications(result.data.applications || []);

        if (result.pagination) {
          setPagination(result.pagination);
        }
      } else {
        toast.error(result.error || "Failed to load applications.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, statusFilter]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      if (!search) return true;

      const text = search.toLowerCase();

      return (
        getCandidateName(app).toLowerCase().includes(text) ||
        getCandidateEmail(app).toLowerCase().includes(text) ||
        app.job?.title?.toLowerCase().includes(text)
      );
    });
  }, [applications, search]);

  const handleStatusChange = async (applicationId, status) => {
    const result = await recruiterService.updateApplicationStatus(
      applicationId,
      status,
    );

    if (result.success) {
      toast.success("Status Updated");
      loadApplications();
    }
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowDetailModal(true);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "pending":
        return "default";
      case "reviewed":
        return "secondary";
      case "shortlisted":
        return "info";
      case "interviewing":
        return "warning";
      case "offered":
        return "info";
      case "hired":
        return "success";
      case "rejected":
        return "destructive";
      default:
        return "default";
    }
  };

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    shortlisted: applications.filter((a) => a.status === "shortlisted").length,
    hired: applications.filter((a) => a.status === "hired").length,
    reviewed: applications.filter((a) => a.status === "reviewed").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ================= HERO ================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-8 shadow-2xl"
        >
          <div className="absolute right-0 top-0 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-20 h-40 w-40 rounded-full bg-cyan-300/20 blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <div className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-md px-4 py-2 text-sm font-medium text-white">
                Recruiter Dashboard
              </div>
              <h1 className="mt-5 text-5xl font-extrabold text-white tracking-tight">
                Applications
              </h1>
              <p className="mt-3 max-w-2xl text-blue-100 text-lg">
                Manage applications, shortlist top candidates and track hiring
                progress with one dashboard.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="rounded-2xl bg-white/15 backdrop-blur-xl p-5"
              >
                <Users className="text-white mb-3" />
                <h2 className="text-4xl font-bold text-white">{stats.total}</h2>
                <p className="text-blue-100">Total Applications</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="rounded-2xl bg-white/15 backdrop-blur-xl p-5"
              >
                <TrendingUp className="text-white mb-3" />
                <h2 className="text-4xl font-bold text-white">
                  {stats.shortlisted}
                </h2>
                <p className="text-blue-100">Shortlisted</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
          <Card className="rounded-3xl border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-muted-foreground">Pending</p>
                  <h2 className="text-4xl font-bold mt-3">{stats.pending}</h2>
                </div>
                <Clock3 className="text-yellow-500" size={34} />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-muted-foreground">Hired</p>
                  <h2 className="text-4xl font-bold mt-3">{stats.hired}</h2>
                </div>
                <CheckCircle2 className="text-green-500" size={34} />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-muted-foreground">Reviewed</p>
                  <h2 className="text-4xl font-bold mt-3">{stats.reviewed}</h2>
                </div>
                <Eye className="text-blue-500" size={34} />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-muted-foreground">Rejected</p>
                  <h2 className="text-4xl font-bold mt-3">{stats.rejected}</h2>
                </div>
                <XCircle className="text-red-500" size={34} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ================= FILTER ================= */}
        <Card className="rounded-3xl border-0 shadow-xl mt-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-5 lg:items-center">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search candidate, email or job..."
                  className="h-12 w-full rounded-xl border bg-background pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination((prev) => ({
                    ...prev,
                    page: 1,
                  }));
                }}
                className="h-12 rounded-xl border px-5 min-w-[220px]"
              >
                <option value="">All Status</option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* ================= LOADING / EMPTY / LIST ================= */}
        {loading ? (
          <div className="space-y-5 mt-8">
            {[1, 2, 3, 4].map((item) => (
              <SkeletonApplicationCard key={item} />
            ))}
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              variant="no-data"
              title="No Applications Found"
              description="Try changing the filters."
            />
          </div>
        ) : (
          <div className="space-y-6 mt-8">
            {filteredApplications.map((application, index) => (
              <motion.div
                key={application._id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group overflow-hidden rounded-3xl border-0 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                  <CardContent className="p-0">
                    <div className="h-2 w-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500" />

                    <div className="p-6">
                      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
                        <div className="flex items-start gap-5 flex-1">
                          <Avatar
                            src={application.candidate?.avatar}
                            initials={`${(getCandidateName(application).charAt(0) || "").toUpperCase()}`}
                            size="xl"
                          />

                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                              <h2 className="text-2xl font-bold">
                                {getCandidateName(application)}
                              </h2>
                              <Badge
                                variant={getStatusBadgeVariant(
                                  application.status,
                                )}
                              >
                                {application.status}
                              </Badge>
                            </div>

                            <p className="mt-2 text-base font-medium text-primary">
                              {application.job?.title}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-5 text-sm text-muted-foreground">
                              {getCandidateEmail(application) && (
                                <span className="flex items-center gap-2">
                                  <Mail size={15} />
                                  {getCandidateEmail(application)}
                                </span>
                              )}
                              {getCandidatePhone(application) && (
                                <span className="flex items-center gap-2">
                                  <Phone size={15} />
                                  {getCandidatePhone(application)}
                                </span>
                              )}
                              {getCandidateAddress(application) && (
                                <span className="flex items-center gap-2">
                                  <MapPin size={15} />
                                  {getCandidateAddress(application)}
                                </span>
                              )}
                              <span className="flex items-center gap-2">
                                <Calendar size={15} />
                                Applied:{" "}
                                {new Date(
                                  application.createdAt,
                                ).toLocaleDateString()}
                              </span>
                            </div>

                            {getCandidateSkills(application).length > 0 && (
                              <div className="mt-5">
                                <div className="flex flex-wrap gap-2">
                                  {getCandidateSkills(application)
                                    .slice(0, 6)
                                    .map((skill, idx) => (
                                      <span
                                        key={idx}
                                        className="rounded-xl bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                  {getCandidateSkills(application).length >
                                    6 && (
                                    <span className="rounded-xl bg-slate-100 px-3 py-1 text-xs font-semibold dark:bg-slate-700">
                                      +
                                      {getCandidateSkills(application).length -
                                        6}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            {getCandidateEducation(application).length > 0 && (
                              <div className="mt-5 rounded-2xl border bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                                <div className="flex items-center gap-2 mb-2">
                                  <GraduationCap
                                    size={16}
                                    className="text-indigo-500"
                                  />
                                  <span className="font-semibold">
                                    Education
                                  </span>
                                </div>
                                <p className="font-medium">
                                  {getCandidateEducation(application)[0]
                                    ?.degree ||
                                    getCandidateEducation(application)[0]
                                      ?.field ||
                                    ""}
                                  {getCandidateEducation(application)[0]
                                    ?.school &&
                                    ` at ${getCandidateEducation(application)[0].school}`}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex w-full flex-col gap-3 xl:w-64">
                          <Button
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewProfile(application.candidate?._id);
                            }}
                          >
                            <Eye size={16} className="mr-2" />
                            View Profile
                          </Button>

                          {buildResumeUrl(getResumeUrl(application)) && (
                            <Button
                              variant="outline"
                              className="w-full"
                              asChild
                            >
                              <a
                                href={buildResumeUrl(getResumeUrl(application))}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <FileText size={16} className="mr-2" />
                                View Resume
                              </a>
                            </Button>
                          )}

                          <select
                            value={application.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              handleStatusChange(
                                application._id,
                                e.target.value,
                              )
                            }
                            className="h-11 rounded-xl border border-slate-300 bg-background px-4 text-sm outline-none transition focus:ring-2 focus:ring-blue-500 dark:border-slate-700"
                          >
                            {STATUS_OPTIONS.map((status) => (
                              <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() +
                                  status.slice(1)}
                              </option>
                            ))}
                          </select>

                          {buildResumeUrl(getResumeUrl(application)) && (
                            <Button
                              variant="secondary"
                              className="w-full"
                              asChild
                            >
                              <a
                                href={buildResumeUrl(getResumeUrl(application))}
                                download
                              >
                                <Download size={16} className="mr-2" />
                                Download Resume
                              </a>
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(application);
                            }}
                          >
                            <ArrowUpRight size={16} className="mr-2" />
                            Quick View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* ================= PAGINATION ================= */}
        {pagination.pages > 1 && (
          <div className="mt-10 flex justify-center">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* ================= DETAIL MODAL ================= */}
        <AnimatePresence>
          {showDetailModal && selectedApplication && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDetailModal(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
              />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-slate-900"
              >
                {/* Header */}
                <div className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/90">
                  <div className="flex items-center justify-between px-8 py-5">
                    <div>
                      <h2 className="text-2xl font-bold">Candidate Profile</h2>
                      <p className="text-sm text-muted-foreground">
                        Review application and manage hiring status
                      </p>
                    </div>
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="rounded-xl p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <X size={22} />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-8">
                  {/* Hero */}
                  <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                      <div className="flex items-center gap-6">
                        <Avatar
                          src={selectedApplication.candidate?.avatar}
                          initials={`${getCandidateName(selectedApplication).charAt(0) || ""}`}
                          size="xl"
                        />
                        <div>
                          <h2 className="text-3xl font-bold text-white">
                            {getCandidateName(selectedApplication)}
                          </h2>
                          <p className="mt-2 text-blue-100">
                            Applied for
                            <span className="ml-1 font-semibold">
                              {selectedApplication.job?.title}
                            </span>
                          </p>
                          <p className="mt-1 text-blue-200 text-sm">
                            Applied on{" "}
                            {new Date(
                              selectedApplication.createdAt,
                            ).toLocaleDateString()}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <Badge
                              variant={getStatusBadgeVariant(
                                selectedApplication.status,
                              )}
                            >
                              {selectedApplication.status}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div>
                        <select
                          value={selectedApplication.status}
                          onChange={(e) => {
                            handleStatusChange(
                              selectedApplication._id,
                              e.target.value,
                            );
                            setSelectedApplication((prev) => ({
                              ...prev,
                              status: e.target.value,
                            }));
                          }}
                          className="rounded-xl border-0 bg-white px-5 py-3 font-medium text-slate-900"
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Contact Grid */}
                  <div className="mt-8 grid gap-5 md:grid-cols-2">
                    {getCandidateEmail(selectedApplication) && (
                      <Card className="rounded-2xl">
                        <CardContent className="flex items-center gap-4 p-5">
                          <Mail className="text-blue-500" size={22} />
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Email
                            </p>
                            <p className="font-semibold">
                              {getCandidateEmail(selectedApplication)}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {getCandidatePhone(selectedApplication) && (
                      <Card className="rounded-2xl">
                        <CardContent className="flex items-center gap-4 p-5">
                          <Phone className="text-green-500" size={22} />
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Phone
                            </p>
                            <p className="font-semibold">
                              {getCandidatePhone(selectedApplication)}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {getCandidateAddress(selectedApplication) && (
                      <Card className="rounded-2xl">
                        <CardContent className="flex items-center gap-4 p-5">
                          <MapPin className="text-red-500" size={22} />
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Address
                            </p>
                            <p className="font-semibold">
                              {getCandidateAddress(selectedApplication)}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* ================= SKILLS ================= */}
                  {getCandidateSkills(selectedApplication).length > 0 && (
                    <div className="mt-8">
                      <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
                        <Award className="text-yellow-500" size={20} />
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {getCandidateSkills(selectedApplication).map(
                          (skill, index) => (
                            <span
                              key={index}
                              className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                            >
                              {skill}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {/* ================= EDUCATION ================= */}
                  {getCandidateEducation(selectedApplication).length > 0 && (
                    <div className="mt-10">
                      <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
                        <GraduationCap size={20} />
                        Education
                      </h3>
                      <div className="space-y-4">
                        {getCandidateEducation(selectedApplication).map(
                          (edu, index) => (
                            <Card key={index} className="rounded-2xl">
                              <CardContent className="p-5">
                                <h4 className="font-semibold">
                                  {edu.degree || edu.field || "Education"}
                                </h4>
                                <p className="mt-1 text-primary">
                                  {edu.school}
                                </p>
                                <p className="mt-2 text-sm text-muted-foreground">
                                  {edu.startDate &&
                                    new Date(
                                      edu.startDate,
                                    ).toLocaleDateString()}
                                  {" - "}
                                  {edu.current
                                    ? "Present"
                                    : edu.endDate
                                      ? new Date(
                                          edu.endDate,
                                        ).toLocaleDateString()
                                      : ""}
                                </p>
                              </CardContent>
                            </Card>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {/* ================= RESUME ================= */}
                  {buildResumeUrl(getResumeUrl(selectedApplication)) && (
                    <div className="mt-10">
                      <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
                        <FileText size={20} />
                        Resume
                      </h3>
                      <div className="flex flex-wrap gap-4">
                        <Button asChild>
                          <a
                            href={buildResumeUrl(
                              getResumeUrl(selectedApplication),
                            )}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <ExternalLink className="mr-2" size={16} />
                            View Resume
                          </a>
                        </Button>
                        <Button variant="secondary" asChild>
                          <a
                            href={buildResumeUrl(
                              getResumeUrl(selectedApplication),
                            )}
                            download
                          >
                            <Download className="mr-2" size={16} />
                            Download Resume
                          </a>
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* ================= COVER LETTER ================= */}
                  {selectedApplication.coverLetter && (
                    <div className="mt-10">
                      <h3 className="mb-4 text-xl font-bold">Cover Letter</h3>
                      <Card className="rounded-2xl">
                        <CardContent className="p-6">
                          <p className="whitespace-pre-wrap leading-8 text-muted-foreground">
                            {selectedApplication.coverLetter}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RecruiterApplications;
