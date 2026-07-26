import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Pagination from "../../components/ui/Pagination";
import { EmptyState } from "../../components/ui/EmptyState";
import { SkeletonJobCard } from "../../components/ui/Loading";
import savedJobApi from "../../services/savedJobApi";
import toast from "react-hot-toast";
import {
  MapPin,
  DollarSign,
  Bookmark,
  X,
  Clock,
  Briefcase,
} from "lucide-react";
import Badge from "../../components/ui/Badge";

const CandidateSavedJobs = () => {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const loadSavedJobs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await savedJobApi.getSavedJobs({
        page: pagination.page,
        limit: pagination.limit,
      });
      const data = response.data;
      setSavedJobs(data.jobs || data.savedJobs || []);
      if (data.pagination) setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to load saved jobs:", error);
      toast.error("Failed to load saved jobs");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    loadSavedJobs();
  }, [loadSavedJobs]);

  const handleRemove = async (jobId) => {
    try {
      setRemoving(jobId);
      await savedJobApi.unsaveJob(jobId);
      toast.success("Job removed from saved");
      setSavedJobs((prev) =>
        prev.filter((sj) => (sj.job?._id || sj._id) !== jobId),
      );
      setPagination((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
      }));
    } catch (error) {
      toast.error("Failed to remove job");
    } finally {
      setRemoving(null);
    }
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            Saved Jobs
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {pagination.total > 0
              ? `${pagination.total} job${pagination.total > 1 ? "s" : ""} saved for later`
              : "Jobs you've bookmarked for later"}
          </p>
        </motion.div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <SkeletonJobCard key={i} />
            ))}
          </div>
        ) : savedJobs.length === 0 ? (
          <EmptyState
            variant="no-jobs"
            title="No saved jobs"
            description="Browse jobs and save them for later review."
            actionLabel="Browse Jobs"
            onAction={() => navigate("/candidate/jobs")}
          />
        ) : (
          <>
            <div className="space-y-4">
              {savedJobs.map((savedItem, index) => {
                const job = savedItem.job || savedItem;
                if (!job || !job._id) return null;
                return (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className="hover:shadow-lg transition-all cursor-pointer border-0 ring-1 ring-gray-200 dark:ring-gray-700"
                      onClick={() => navigate(`/jobs/${job._id}`)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
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
                            <CardDescription>
                              {job.company?.name || "Unknown Company"}
                            </CardDescription>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemove(job._id);
                            }}
                            disabled={removing === job._id}
                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            {job.location?.city ||
                              job.location?.country ||
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
                        <div className="flex gap-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/jobs/${job._id}`);
                            }}
                          >
                            Apply Now
                          </Button>
                          <Button
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemove(job._id);
                            }}
                            loading={removing === job._id}
                          >
                            <Bookmark className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
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
      </div>
    </div>
  );
};

export default CandidateSavedJobs;
