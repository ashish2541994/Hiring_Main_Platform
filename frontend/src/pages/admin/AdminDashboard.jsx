import { motion } from "framer-motion";
import {
  Users,
  Briefcase,
  Building2,
  FileText,
  ArrowRight,
  Settings,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import adminService from "../../services/AdminService";
import Loader from "../../components/ui/Loader";
import { EmptyState } from "../../components/ui/EmptyState";
import { SkeletonCard } from "../../components/ui/Loading";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await adminService.getStats();
      if (result.success) {
        setStats(result.data.stats);
        setRecentUsers(result.data.recentUsers || []);
        setRecentJobs(result.data.recentJobs || []);
      } else {
        setError(result.error || "Failed to load dashboard");
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
      label: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-blue-500",
      link: "/admin/users",
    },
    {
      label: "Active Jobs",
      value: stats?.totalJobs || 0,
      icon: Briefcase,
      color: "text-purple-500",
      link: "/admin/users",
    },
    {
      label: "Companies",
      value: stats?.totalCompanies || 0,
      icon: Building2,
      color: "text-green-500",
      link: "/admin/users",
    },
    {
      label: "Applications",
      value: stats?.totalApplications || 0,
      icon: FileText,
      color: "text-orange-500",
      link: "/admin/users",
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

  if (error) {
    return (
      <EmptyState
        variant="no-data"
        title="Failed to load dashboard"
        description={error}
        actionLabel="Retry"
        onAction={loadDashboardData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Platform overview and management
          </p>
        </motion.div>

        {/* Stats Cards */}
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
                        <p className="text-2xl font-bold">
                          {stat.value.toLocaleString()}
                        </p>
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
          {/* Recent Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Users</CardTitle>
                <Link
                  to="/admin/users"
                  className="text-sm text-primary hover:underline"
                >
                  View All
                </Link>
              </CardHeader>
              <CardContent>
                {recentUsers.length > 0 ? (
                  <div className="space-y-3">
                    {recentUsers.map((user, idx) => (
                      <div
                        key={user._id || idx}
                        className="flex items-center justify-between p-3 rounded-lg bg-accent/50"
                      >
                        <div>
                          <p className="font-medium">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {user.role || "user"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm py-4 text-center">
                    No recent users
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Jobs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Jobs</CardTitle>
                <Link
                  to="/admin/users"
                  className="text-sm text-primary hover:underline"
                >
                  View All
                </Link>
              </CardHeader>
              <CardContent>
                {recentJobs.length > 0 ? (
                  <div className="space-y-3">
                    {recentJobs.map((job, idx) => (
                      <div
                        key={job._id || idx}
                        className="flex items-center justify-between p-3 rounded-lg bg-accent/50"
                      >
                        <div>
                          <p className="font-medium">{job.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {job.company?.name || "Unknown Company"}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-xs px-2 py-1 rounded-full capitalize ${
                              job.status === "active"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                                : job.status === "closed"
                                  ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
                            }`}
                          >
                            {job.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm py-4 text-center">
                    No recent jobs
                  </p>
                )}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/admin/users"
                  className="flex items-center gap-3 p-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                >
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Manage Users</p>
                    <p className="text-sm text-muted-foreground">
                      View and manage users
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 ml-auto text-muted-foreground" />
                </Link>
                <Link
                  to="/admin/users"
                  className="flex items-center gap-3 p-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                >
                  <Briefcase className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Manage Jobs</p>
                    <p className="text-sm text-muted-foreground">
                      View all job listings
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 ml-auto text-muted-foreground" />
                </Link>
                <Link
                  to="/admin/settings"
                  className="flex items-center gap-3 p-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                >
                  <Settings className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">System Settings</p>
                    <p className="text-sm text-muted-foreground">
                      Configure platform
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 ml-auto text-muted-foreground" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
