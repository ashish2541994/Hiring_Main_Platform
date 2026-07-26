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
import { useState, useEffect, useCallback, useMemo } from "react";
import adminService from "../../services/AdminService";
import useDebounce from "../../hooks/useDebounce";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  Search,
  Loader2,
  RefreshCw,
  UserCheck,
  UserX,
  Shield,
  Eye,
  Phone,
  MapPin,
  Award,
  GraduationCap,
  Briefcase,
  Calendar,
} from "lucide-react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [roleFilter, setRoleFilter] = useState("");

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch || undefined,
        role: roleFilter || undefined,
      };
      const result = await adminService.getUsers(params);
      if (result.success) {
        setUsers(result.data.users || []);
        if (result.data.pagination) setPagination(result.data.pagination);
      } else {
        toast.error(result.error || "Failed to load users");
      }
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, roleFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Reset to page 1 when search or role filter changes
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch, roleFilter]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleToggleActive = async (userId, currentStatus) => {
    try {
      if (currentStatus) {
        await adminService.deactivateUser(userId);
      } else {
        await adminService.activateUser(userId);
      }
      loadUsers();
    } catch {
      toast.error("Failed to update user status");
    }
  };

  const handleToggleVerify = async (userId) => {
    try {
      const result = await adminService.verifyUser(userId);
      if (result.success) loadUsers();
    } catch {
      toast.error("Failed to verify user");
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setRoleFilter("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getLocationText = (user) => {
    if (!user.location) return "";
    const parts = [];
    if (user.location.city) parts.push(user.location.city);
    if (user.location.state) parts.push(user.location.state);
    if (user.location.country) parts.push(user.location.country);
    return parts.join(", ");
  };

  const getSkillsPreview = (skills) => {
    if (!skills || skills.length === 0) return "";
    return skills.length > 2
      ? `${skills.slice(0, 2).join(", ")} +${skills.length - 2}`
      : skills.join(", ");
  };

  const getEducationPreview = (education) => {
    if (!education || education.length === 0) return "";
    const edu = education[0];
    return edu.degree || edu.field || edu.school || "";
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
            User Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {pagination.total > 0
              ? `${pagination.total} users found`
              : "Manage platform users"}
          </p>
        </motion.div>

        {/* Search & Filters */}
        <Card className="mb-6">
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone, skills, education..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                }}
                className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="recruiter">Recruiter</option>
                <option value="candidate">Candidate</option>
                <option value="company">Company</option>
              </select>
              <Button
                variant="ghost"
                onClick={clearFilters}
                title="Clear filters"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              </div>
            ) : users.length === 0 ? (
              <EmptyState
                variant="no-results"
                title="No users found"
                description={
                  debouncedSearch || roleFilter
                    ? "Try adjusting your search or filters."
                    : "No users are registered yet."
                }
                actionLabel="Clear Filters"
                onAction={clearFilters}
              />
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">
                          User
                        </th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">
                          Role
                        </th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">
                          Phone
                        </th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">
                          Location
                        </th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">
                          Education
                        </th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">
                          Skills
                        </th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">
                          Joined
                        </th>
                        <th className="text-center py-3 px-3 text-xs font-medium text-gray-500 uppercase">
                          Jobs
                        </th>
                        <th className="text-center py-3 px-3 text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, idx) => (
                        <motion.tr
                          key={user._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.03 }}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                {user.firstName?.[0]}
                                {user.lastName?.[0]}
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-sm truncate">
                                  {user.firstName} {user.lastName}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <Badge
                              variant={
                                user.role === "admin"
                                  ? "info"
                                  : user.role === "recruiter"
                                    ? "warning"
                                    : "default"
                              }
                            >
                              {user.role || "candidate"}
                            </Badge>
                          </td>
                          <td className="py-3 px-3">
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                              <Phone className="w-3 h-3 shrink-0" />
                              <span className="truncate">
                                {user.phone || "—"}
                              </span>
                            </p>
                          </td>
                          <td className="py-3 px-3">
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3 shrink-0" />
                              <span className="truncate max-w-[120px]">
                                {getLocationText(user) || "—"}
                              </span>
                            </p>
                          </td>
                          <td className="py-3 px-3">
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                              <GraduationCap className="w-3 h-3 shrink-0" />
                              <span className="truncate max-w-[120px]">
                                {getEducationPreview(user.education) || "—"}
                              </span>
                            </p>
                          </td>
                          <td className="py-3 px-3">
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[120px]">
                              {getSkillsPreview(user.skills) || "—"}
                            </p>
                          </td>
                          <td className="py-3 px-3">
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3 shrink-0" />
                              {formatDate(user.createdAt)}
                            </p>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
                              {user.jobsAppliedCount || 0}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center justify-center gap-2">
                              <span
                                className={`inline-flex items-center gap-1 text-xs ${
                                  user.isActive
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {user.isActive ? "Active" : "Inactive"}
                              </span>
                              {user.isVerified && (
                                <Shield className="w-3 h-3 text-green-500" />
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {/* View Profile */}
                              <Link
                                to={`/admin/candidate/${user._id}`}
                                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-600 hover:text-blue-700"
                                title="View Profile"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                              {/* Activate/Deactivate */}
                              <button
                                onClick={() =>
                                  handleToggleActive(user._id, user.isActive)
                                }
                                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                title={
                                  user.isActive ? "Deactivate" : "Activate"
                                }
                              >
                                {user.isActive ? (
                                  <UserX className="w-4 h-4 text-red-500" />
                                ) : (
                                  <UserCheck className="w-4 h-4 text-green-500" />
                                )}
                              </button>
                              {/* Verify */}
                              <button
                                onClick={() => handleToggleVerify(user._id)}
                                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                title="Toggle verification"
                              >
                                <Shield
                                  className={`w-4 h-4 ${
                                    user.isVerified
                                      ? "text-green-500"
                                      : "text-gray-400"
                                  }`}
                                />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Tablet / Mobile Cards */}
                <div className="lg:hidden space-y-3">
                  {users.map((user, idx) => (
                    <motion.div
                      key={user._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                            {user.firstName?.[0]}
                            {user.lastName?.[0]}
                          </div>
                          <div>
                            <p className="font-medium">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            user.role === "admin"
                              ? "info"
                              : user.role === "recruiter"
                                ? "warning"
                                : "default"
                          }
                        >
                          {user.role || "candidate"}
                        </Badge>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {user.phone || "—"}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {getLocationText(user) || "—"}
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          Jobs: {user.jobsAppliedCount || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(user.createdAt)}
                        </div>
                      </div>

                      {/* Skills & Education */}
                      {(user.skills?.length > 0 ||
                        user.education?.length > 0) && (
                        <div className="mb-3 space-y-1">
                          {user.skills?.length > 0 && (
                            <p className="text-xs text-gray-400">
                              <Award className="w-3 h-3 inline mr-1" />
                              {getSkillsPreview(user.skills)}
                            </p>
                          )}
                          {user.education?.length > 0 && (
                            <p className="text-xs text-gray-400">
                              <GraduationCap className="w-3 h-3 inline mr-1" />
                              {getEducationPreview(user.education)}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs ${
                              user.isActive ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                          {user.isVerified && (
                            <Shield className="w-3 h-3 text-green-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Link
                            to={`/admin/candidate/${user._id}`}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-600"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() =>
                              handleToggleActive(user._id, user.isActive)
                            }
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {user.isActive ? (
                              <UserX className="w-4 h-4 text-red-500" />
                            ) : (
                              <UserCheck className="w-4 h-4 text-green-500" />
                            )}
                          </button>
                          <button
                            onClick={() => handleToggleVerify(user._id)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Shield
                              className={`w-4 h-4 ${
                                user.isVerified
                                  ? "text-green-500"
                                  : "text-gray-400"
                              }`}
                            />
                          </button>
                        </div>
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

export default AdminUsers;
