import { motion } from "framer-motion";
import {
  Briefcase,
  FileText,
  Bookmark,
  TrendingUp,
  ArrowRight,
  UserCircle,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import applicationApi from "../../services/applicationApi";
import jobApi from "../../services/jobApi";
import { EmptyState } from "../../components/ui/EmptyState";
import { SkeletonCard } from "../../components/ui/Loading";
import {
  calculateProfileCompletion,
  getMissingProfileFields,
} from "../../utils/profileCheck";
import toast from "react-hot-toast";

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalApplications: 0,
    interviews: 0,
    shortlisted: 0,
    savedJobs: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch applications for candidate
      const appsResult = await applicationApi.getMyApplications({ limit: 5 });
      const apps = appsResult.data.applications || [];
      setRecentApplications(apps);

      // Calculate stats from applications
      const totalApplications =
        appsResult.data.pagination?.total || apps.length;
      const interviews = apps.filter((a) => a.status === "interviewing").length;
      const shortlistedCount = apps.filter(
        (a) => a.status === "shortlisted" || a.status === "interviewing",
      ).length;

      setStats({
        totalApplications,
        interviews,
        shortlisted: shortlistedCount,
        savedJobs: 0,
      });

      // Fetch recommended/published jobs
      const jobsResult = await jobApi.getJobs({ limit: 3 });
      setRecommendedJobs(jobsResult.data.jobs || []);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate profile completion
  const profileCompletion = useMemo(() => {
    return calculateProfileCompletion(user);
  }, [user]);

  const missingFields = useMemo(() => {
    return getMissingProfileFields(user);
  }, [user]);

  const needsProfileUpdate = missingFields.length > 0;

  const statCards = [
    {
      label: "Applications",
      value: stats.totalApplications,
      icon: FileText,
      color: "text-blue-500",
      link: "/candidate/applications",
    },
    {
      label: "Saved Jobs",
      value: stats.savedJobs,
      icon: Bookmark,
      color: "text-purple-500",
      link: "/candidate/saved-jobs",
    },
    {
      label: "Interviews",
      value: stats.interviews,
      icon: Briefcase,
      color: "text-green-500",
      link: "/candidate/applications",
    },
    {
      label: "Shortlisted",
      value: stats.shortlisted,
      icon: TrendingUp,
      color: "text-orange-500",
      link: "/candidate/applications",
    },
  ];

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <div className="h-8 w-64 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-48 bg-muted rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.firstName || "Candidate"}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your job search
        </p>
      </motion.div>

      {/* Profile Completion Card */}
      {needsProfileUpdate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="border-0 ring-1 ring-amber-200 dark:ring-amber-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                  <UserCircle className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        Complete Your Profile
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {missingFields.length} field
                        {missingFields.length > 1 ? "s" : ""} missing —{" "}
                        {profileCompletion}% complete
                      </p>
                    </div>
                    <Link to="/candidate/profile">
                      <Button size="sm" variant="outline">
                        Complete Now
                      </Button>
                    </Link>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        profileCompletion < 30
                          ? "bg-red-500"
                          : profileCompletion < 70
                            ? "bg-amber-500"
                            : "bg-green-500"
                      }`}
                      style={{ width: `${profileCompletion}%` }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {missingFields.slice(0, 5).map((field) => (
                      <span
                        key={field.key}
                        className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
                      >
                        {field.label}
                      </span>
                    ))}
                    {missingFields.length > 5 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">
                        +{missingFields.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Link key={stat.label} to={stat.link}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Applications</CardTitle>
              <Link
                to="/candidate/applications"
                className="text-sm text-primary hover:underline"
              >
                View All
              </Link>
            </CardHeader>
            <CardContent>
              {recentApplications.length > 0 ? (
                <div className="space-y-4">
                  {recentApplications.map((app) => (
                    <div
                      key={app._id}
                      className="flex items-center justify-between p-3 rounded-lg bg-accent/50"
                    >
                      <div>
                        <p className="font-medium">{app.job?.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {app.company?.name || app.job?.company?.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            app.status === "shortlisted"
                              ? "bg-green-100 text-green-700"
                              : app.status === "interviewing"
                                ? "bg-blue-100 text-blue-700"
                                : app.status === "reviewed"
                                  ? "bg-purple-100 text-purple-700"
                                  : app.status === "hired"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : app.status === "rejected"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {app.status}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground text-sm">
                    No applications yet.{" "}
                    <Link
                      to="/candidate/jobs"
                      className="text-primary hover:underline"
                    >
                      Browse jobs
                    </Link>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Jobs</CardTitle>
              <Link
                to="/candidate/jobs"
                className="text-sm text-primary hover:underline"
              >
                Browse All
              </Link>
            </CardHeader>
            <CardContent>
              {recommendedJobs.length > 0 ? (
                <div className="space-y-4">
                  {recommendedJobs.map((job) => (
                    <Link
                      key={job._id}
                      to={`/jobs/${job._id}`}
                      className="block"
                    >
                      <div className="p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors">
                        <p className="font-medium">{job.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {job.company?.name}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <span>
                            {[
                              job.location?.city,
                              job.location?.state,
                              job.location?.country,
                            ]
                              .filter(Boolean)
                              .join(", ") || job.location?.type}
                          </span>
                          <span>•</span>
                          <span className="capitalize">{job.type}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground text-sm">
                    No jobs available at the moment.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/candidate/jobs"
                className="flex items-center gap-3 p-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
              >
                <Briefcase className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Browse Jobs</p>
                  <p className="text-sm text-muted-foreground">
                    Find your next opportunity
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 ml-auto text-muted-foreground" />
              </Link>
              <Link
                to="/candidate/profile"
                className="flex items-center gap-3 p-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
              >
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Update Profile</p>
                  <p className="text-sm text-muted-foreground">
                    Keep your profile current
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 ml-auto text-muted-foreground" />
              </Link>
              <Link
                to="/candidate/saved-jobs"
                className="flex items-center gap-3 p-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
              >
                <Bookmark className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Saved Jobs</p>
                  <p className="text-sm text-muted-foreground">
                    View saved opportunities
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 ml-auto text-muted-foreground" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CandidateDashboard;
