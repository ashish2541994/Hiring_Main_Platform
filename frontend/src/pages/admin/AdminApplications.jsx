import { motion } from "framer-motion";
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
import { useState, useEffect, useCallback } from "react";
import adminService from "../../services/AdminService";
import toast from "react-hot-toast";
import { Search, Loader2, RefreshCw, Eye, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

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

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const loadApplications = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        status: statusFilter || undefined,
      };
      const result = await adminService.getAllApplications(params);
      if (result.success) {
        setApplications(result.data.applications || []);
        if (result.data.pagination) setPagination(result.data.pagination);
      } else {
        toast.error(result.error || "Failed to load applications");
      }
    } catch (error) {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchQuery, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadApplications();
    }, 300);
    return () => clearTimeout(timer);
  }, [loadApplications]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            Application Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {pagination.total > 0
              ? `${pagination.total} applications found`
              : "Review and manage candidate applications"}
          </p>
        </motion.div>

        {/* Search & Filters */}
        <Card className="mb-6">
          <CardContent className="pt-4 pb-4">
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by candidate name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interviewing">Interviewing</option>
                <option value="offered">Offered</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
              <Button type="submit" variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("");
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              </div>
            ) : applications.length === 0 ? (
              <EmptyState
                variant="no-data"
                title="No applications found"
                description="Try adjusting your search or filters."
                actionLabel="Clear Filters"
                onAction={() => {
                  setSearchQuery("");
                  setStatusFilter("");
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
              />
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                          Job
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                          Company
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                          Candidate
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                          Email
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                          Applied Date
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                          Actions
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
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {app.company?.name || app.job?.company || "N/A"}
                            </p>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-sm font-medium">
                              {app.candidate?.firstName}{" "}
                              {app.candidate?.lastName}
                            </p>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-sm text-gray-500">
                              {app.candidate?.email || "N/A"}
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
                          <td className="py-3 px-4 text-right">
                            <Link
                              to={`/admin/candidate/${app.candidate?._id}`}
                              className="inline-flex items-center gap-1 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-600 hover:text-blue-700"
                              title="View Candidate Profile"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
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
                          <p className="text-xs text-gray-500">
                            {app.company?.name || "N/A"}
                          </p>
                        </div>
                        <Badge variant={STATUS_COLORS[app.status] || "default"}>
                          {app.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>
                          {app.candidate?.firstName} {app.candidate?.lastName}
                        </span>
                        <span>•</span>
                        <span className="text-xs">{app.candidate?.email}</span>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <span className="text-xs text-gray-400">
                          {formatDate(app.createdAt)}
                        </span>
                        <Link
                          to={`/admin/candidate/${app.candidate?._id}`}
                          className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> View Profile
                        </Link>
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminApplications;
