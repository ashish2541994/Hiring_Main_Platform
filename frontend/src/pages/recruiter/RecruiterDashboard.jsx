import { motion } from "framer-motion";
import {
  Briefcase,
  Users,
  FileText,
  Eye,
  ArrowRight,
  Plus,
  Clock,
  XCircle,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import recruiterService from "../../services/RecruiterService";
import jobApi from "../../services/jobApi";
import Loader from "../../components/ui/Loader";
import { EmptyState } from "../../components/ui/EmptyState";
import { SkeletonCard } from "../../components/ui/Loading";

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeJobs: 0,
    draftJobs: 0,
    closedJobs: 0,
    totalApplications: 0,
    shortlisted: 0,
    interviewing: 0,
    rejected: 0,
    hired: 0,
    totalViews: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Load dashboard stats
      const result = await recruiterService.getDashboardStats();

      if (result.success) {
        setStats((prev) => ({
          ...prev,
          ...result.data.stats,
        }));
        setRecentApplications(result.data.recentApplications || []);
      } else {
        setError(result.error);
      }

      // Load job counts by status
      try {
        const activeRes = await jobApi.getMyJobs({
          status: "active",
          limit: 1,
        });
        const draftRes = await jobApi.getMyJobs({ status: "draft", limit: 1 });
        const closedRes = await jobApi.getMyJobs({
          status: "closed",
          limit: 1,
        });

        setStats((prev) => ({
          ...prev,
          activeJobs: activeRes.data.pagination?.total || prev.activeJobs,
          draftJobs: draftRes.data.pagination?.total || 0,
          closedJobs: closedRes.data.pagination?.total || 0,
        }));

        // Get recent jobs
        const allJobsRes = await jobApi.getMyJobs({ limit: 5 });
        setRecentJobs(allJobsRes.data.jobs || []);
      } catch {
        // Non-critical
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const statCards = [
    {
      label: "Active Jobs",
      value: stats.activeJobs,
      icon: Briefcase,
      color: "text-blue-500",
      link: "/recruiter/jobs?status=active",
    },
    {
      label: "Draft Jobs",
      value: stats.draftJobs,
      icon: Clock,
      color: "text-yellow-500",
      link: "/recruiter/jobs?status=draft",
    },
    {
      label: "Closed Jobs",
      value: stats.closedJobs,
      icon: XCircle,
      color: "text-red-500",
      link: "/recruiter/jobs?status=closed",
    },
    {
      label: "Total Applications",
      value: stats.totalApplications,
      icon: FileText,
      color: "text-purple-500",
      link: "/recruiter/applications",
    },
    {
      label: "Shortlisted",
      value: stats.shortlisted,
      icon: CheckCircle,
      color: "text-green-500",
      link: "/recruiter/applications?status=shortlisted",
    },
    {
      label: "Interviewing",
      value: stats.interviewing,
      icon: Users,
      color: "text-cyan-500",
      link: "/recruiter/applications?status=interviewing",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      color: "text-orange-500",
      link: "/recruiter/applications?status=rejected",
    },
    {
      label: "Total Views",
      value: stats.totalViews,
      icon: Eye,
      color: "text-indigo-500",
      link: "/recruiter/jobs",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="mb-8">
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <EmptyState
          variant="no-data"
          title="Failed to load dashboard"
          description={error}
          actionLabel="Retry"
          onAction={loadDashboardData}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              Welcome back, {user?.firstName || "Recruiter"}!
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Manage your jobs and track applications
            </p>
          </div>
          <Button
            className="mt-4 sm:mt-0"
            onClick={() => navigate("/recruiter/jobs/create")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </motion.div>

        {/* Pipeline Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <Link key={stat.label} to={stat.link}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card className="hover:shadow-lg transition-all cursor-pointer border-0 ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-blue-300 dark:hover:ring-blue-700">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                          {stat.label}
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {stat.value}
                        </p>
                      </div>
                      <stat.icon className={`h-7 w-7 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Applications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Applications</CardTitle>
                <Link
                  to="/recruiter/applications"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View All
                </Link>
              </CardHeader>
              <CardContent>
                {recentApplications.length > 0 ? (
                  <div className="space-y-3">
                    {recentApplications.map((app) => (
                      <div
                        key={app._id}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                      >
                        <div>
                          <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                            {app.candidate?.firstName} {app.candidate?.lastName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {app.job?.title}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              app.status === "shortlisted"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                                : app.status === "interviewing"
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                                  : app.status === "reviewed"
                                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                                    : app.status === "hired"
                                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                                      : app.status === "rejected"
                                        ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
                            }`}
                          >
                            {app.status}
                          </span>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    variant="no-data"
                    title="No applications yet"
                    description="Applications from candidates will appear here."
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Jobs & Pipeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Jobs</CardTitle>
                <Link
                  to="/recruiter/jobs"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Manage Jobs
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentJobs.length > 0 ? (
                  <div className="space-y-2">
                    {recentJobs.map((job) => (
                      <div
                        key={job._id}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate text-gray-900 dark:text-gray-100">
                            {job.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {job.applicationCount || 0} application(s)
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ml-2 ${
                            job.status === "active"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                              : job.status === "draft"
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
                                : job.status === "closed"
                                  ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                                  : "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300"
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    variant="no-data"
                    title="No jobs yet"
                    description="Create your first job posting to get started."
                    actionLabel="Post Job"
                    onAction={() => navigate("/recruiter/jobs/create")}
                  />
                )}

                <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Hiring Pipeline
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Shortlisted</span>
                      <span className="font-semibold text-green-600">
                        {stats.shortlisted}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Interviewing</span>
                      <span className="font-semibold text-blue-600">
                        {stats.interviewing}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Rejected</span>
                      <span className="font-semibold text-red-600">
                        {stats.rejected}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Hired</span>
                      <span className="font-semibold text-emerald-600">
                        {stats.hired}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100 dark:border-gray-700">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Total
                      </span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">
                        {stats.totalApplications}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => navigate("/recruiter/jobs/create")}
                  className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                >
                  <Plus className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                      Post New Job
                    </p>
                    <p className="text-xs text-gray-500">
                      Create a job listing
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 ml-auto text-gray-400" />
                </button>
                <button
                  onClick={() => navigate("/recruiter/applications")}
                  className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                >
                  <Users className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                      View Applications
                    </p>
                    <p className="text-xs text-gray-500">Review applicants</p>
                  </div>
                  <ArrowRight className="h-5 w-5 ml-auto text-gray-400" />
                </button>
                <button
                  onClick={() => navigate("/recruiter/company")}
                  className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                >
                  <Briefcase className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                      Company Profile
                    </p>
                    <p className="text-xs text-gray-500">Update company info</p>
                  </div>
                  <ArrowRight className="h-5 w-5 ml-auto text-gray-400" />
                </button>
                <button
                  onClick={() => navigate("/recruiter/jobs")}
                  className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                >
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                      Job Performance
                    </p>
                    <p className="text-xs text-gray-500">Track your listings</p>
                  </div>
                  <ArrowRight className="h-5 w-5 ml-auto text-gray-400" />
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
