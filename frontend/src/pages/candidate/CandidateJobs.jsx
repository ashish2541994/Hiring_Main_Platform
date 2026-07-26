import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  DollarSign,
  Clock,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  SlidersHorizontal,
  X,
  Filter,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import Pagination from "../../components/ui/Pagination";
import { EmptyState } from "../../components/ui/EmptyState";
import { SkeletonJobCard } from "../../components/ui/Loading";
import jobApi from "../../services/jobApi";
import savedJobApi from "../../services/savedJobApi";
import { useAuth } from "../../context/AuthContext";
import {
  JOB_TYPES,
  EXPERIENCE_LEVELS,
  REMOTE_OPTIONS,
  SALARY_RANGES,
  INDUSTRIES,
  SKILLS,
} from "../../constants/constants";
import toast from "react-hot-toast";

const CandidateJobs = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: "",
    experienceLevel: "",
    remote: "",
    country: "",
    state: "",
    city: "",
    salaryMin: "",
    salaryMax: "",
    category: "",
    skill: "",
    postedDate: "",
    sortBy: "",
  });
  const [savedIds, setSavedIds] = useState(new Set());
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...Object.fromEntries(
          Object.entries(filters).filter(
            ([_, v]) => v !== "" && v !== undefined,
          ),
        ),
      };
      if (searchQuery) params.search = searchQuery;

      const response = await jobApi.getJobs(params);
      const data = response.data;

      setJobs(data.jobs || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to load jobs:", error);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters, searchQuery]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      type: "",
      experienceLevel: "",
      remote: "",
      country: "",
      state: "",
      city: "",
      salaryMin: "",
      salaryMax: "",
      category: "",
      skill: "",
      postedDate: "",
      sortBy: "",
    });
    setSearchQuery("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async (e, jobId) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please login to save jobs");
      navigate("/login");
      return;
    }
    try {
      if (savedIds.has(jobId)) {
        await savedJobApi.unsaveJob(jobId);
        setSavedIds((prev) => {
          const next = new Set(prev);
          next.delete(jobId);
          return next;
        });
        toast.success("Job removed from saved");
      } else {
        await savedJobApi.saveJob(jobId);
        setSavedIds((prev) => new Set(prev).add(jobId));
        toast.success("Job saved successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save job");
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case "full-time":
        return "success";
      case "part-time":
        return "secondary";
      case "contract":
        return "warning";
      case "internship":
        return "info";
      case "freelance":
        return "default";
      default:
        return "default";
    }
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            Find Jobs
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {pagination.total > 0
              ? `${pagination.total} opportunities found`
              : "Discover opportunities that match your skills"}
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card className="mb-6 shadow-sm border-0 ring-1 ring-gray-200 dark:ring-gray-700">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by job title, skill, or company..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" onClick={handleSearch}>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setShowAdvancedFilters(!showAdvancedFilters)
                      }
                      className={
                        showAdvancedFilters
                          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                          : ""
                      }
                    >
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                      {hasActiveFilters && (
                        <span className="ml-1.5 w-2 h-2 rounded-full bg-blue-500 inline-block" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Quick Filters */}
                <div className="flex flex-wrap gap-2">
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange("type", e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">All Types</option>
                    {Object.entries(JOB_TYPES).map(([key, value]) => (
                      <option key={key} value={value}>
                        {key
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filters.experienceLevel}
                    onChange={(e) =>
                      handleFilterChange("experienceLevel", e.target.value)
                    }
                    className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">All Levels</option>
                    {Object.entries(EXPERIENCE_LEVELS).map(([key, value]) => (
                      <option key={key} value={value}>
                        {key.charAt(0).toUpperCase() +
                          key.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filters.remote}
                    onChange={(e) =>
                      handleFilterChange("remote", e.target.value)
                    }
                    className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Work Mode</option>
                    {Object.entries(REMOTE_OPTIONS).map(([key, value]) => (
                      <option key={key} value={value}>
                        {key
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      handleFilterChange("sortBy", e.target.value)
                    }
                    className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Sort: Latest</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest_salary">Highest Salary</option>
                    <option value="lowest_salary">Lowest Salary</option>
                    <option value="most_relevant">Most Relevant</option>
                  </select>
                  <select
                    value={filters.postedDate}
                    onChange={(e) =>
                      handleFilterChange("postedDate", e.target.value)
                    }
                    className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Posted: Any Time</option>
                    <option value="24h">Last 24 hours</option>
                    <option value="3d">Last 3 days</option>
                    <option value="7d">Last 7 days</option>
                    <option value="14d">Last 14 days</option>
                    <option value="30d">Last 30 days</option>
                  </select>
                </div>

                {/* Advanced Filters Panel */}
                {showAdvancedFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-100 dark:border-gray-700 pt-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                          Country
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. India"
                          value={filters.country}
                          onChange={(e) =>
                            handleFilterChange("country", e.target.value)
                          }
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                          State
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Karnataka"
                          value={filters.state}
                          onChange={(e) =>
                            handleFilterChange("state", e.target.value)
                          }
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                          City
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Bangalore"
                          value={filters.city}
                          onChange={(e) =>
                            handleFilterChange("city", e.target.value)
                          }
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                          Industry
                        </label>
                        <select
                          value={filters.category}
                          onChange={(e) =>
                            handleFilterChange("category", e.target.value)
                          }
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          <option value="">All Industries</option>
                          {INDUSTRIES.map((ind) => (
                            <option key={ind} value={ind}>
                              {ind}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                          Skill
                        </label>
                        <select
                          value={filters.skill}
                          onChange={(e) =>
                            handleFilterChange("skill", e.target.value)
                          }
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          <option value="">Any Skill</option>
                          {SKILLS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                          Min Salary
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 500000"
                          value={filters.salaryMin}
                          onChange={(e) =>
                            handleFilterChange("salaryMin", e.target.value)
                          }
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                          Max Salary
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 1500000"
                          value={filters.salaryMax}
                          onChange={(e) =>
                            handleFilterChange("salaryMax", e.target.value)
                          }
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div className="flex items-end">
                        {hasActiveFilters && (
                          <Button
                            variant="ghost"
                            onClick={clearFilters}
                            className="text-red-500 hover:text-red-600"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Clear All Filters
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null;
              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium"
                >
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (s) => s.toUpperCase())}
                  : {value}
                  <button
                    onClick={() => handleFilterChange(key, "")}
                    className="ml-1 hover:text-blue-900 dark:hover:text-blue-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
            <button
              onClick={clearFilters}
              className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Job Listings */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <SkeletonJobCard key={i} />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState
            variant="no-results"
            title="No jobs found"
            description={
              hasActiveFilters || searchQuery
                ? "Try adjusting your search or filters to find what you're looking for."
                : "No jobs are currently available. Check back later for new opportunities."
            }
            actionLabel={
              hasActiveFilters || searchQuery ? "Clear Filters" : undefined
            }
            onAction={clearFilters}
          />
        ) : (
          <>
            <div className="space-y-4">
              {jobs.map((job, index) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card
                    className="hover:shadow-lg transition-all cursor-pointer border-0 ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-blue-300 dark:hover:ring-blue-700"
                    onClick={() => navigate(`/jobs/${job._id}`)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-gray-100">
                              {job.title}
                            </CardTitle>
                            <Badge variant={getTypeBadge(job.type)}>
                              {job.type?.replace("-", " ")}
                            </Badge>
                            {job.location?.type && (
                              <Badge variant="outline">
                                {job.location.type.replace("-", " ")}
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-base">
                            {job.company?.name || "Unknown Company"}
                          </CardDescription>
                        </div>
                        <button
                          onClick={(e) => handleSave(e, job._id)}
                          className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                            savedIds.has(job._id)
                              ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                              : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          {savedIds.has(job._id) ? (
                            <BookmarkCheck className="w-5 h-5" />
                          ) : (
                            <Bookmark className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {[
                            job.location?.city,
                            job.location?.state,
                            job.location?.country,
                          ]
                            .filter(Boolean)
                            .join(", ") ||
                            job.location?.type ||
                            "N/A"}
                        </span>
                        {job.salary?.min && job.salary?.max && (
                          <span className="flex items-center gap-1.5">
                            <DollarSign className="w-4 h-4" />
                            {job.salary.currency || "₹"}
                            {job.salary.min.toLocaleString()} -{" "}
                            {job.salary.max.toLocaleString()}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                        {job.experienceLevel && (
                          <span className="flex items-center gap-1.5 capitalize">
                            <Briefcase className="w-4 h-4" />
                            {job.experienceLevel}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(job.skills || []).slice(0, 5).map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                        {(job.skills || []).length > 5 && (
                          <span className="px-2.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-400 text-xs">
                            +{job.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {pagination.pages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CandidateJobs;
