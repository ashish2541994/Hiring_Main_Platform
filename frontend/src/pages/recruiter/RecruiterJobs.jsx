import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  ExternalLink,
  Search,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Input from "../../components/ui/Input";
import Pagination from "../../components/ui/Pagination";
import { EmptyState } from "../../components/ui/EmptyState";
import { SkeletonJobCard } from "../../components/ui/Loading";
import { useConfirmDialog } from "../../components/ui/ConfirmDialog";
import recruiterService from "../../services/RecruiterService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const RecruiterJobs = () => {
  const navigate = useNavigate();
  const { confirm } = useConfirmDialog();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [openMenuId, setOpenMenuId] = useState(null);

  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (searchQuery) params.search = searchQuery;
      if (statusFilter) params.status = statusFilter;

      const result = await recruiterService.getMyJobs(params);

      if (result.success) {
        setJobs(result.data.jobs || []);
        if (result.pagination) {
          setPagination(result.pagination);
        }
      } else {
        toast.error(result.error || "Failed to load jobs");
      }
    } catch (error) {
      console.error("Failed to load jobs:", error);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchQuery, statusFilter]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleStatusChange = async (jobId, newStatus) => {
    const confirmed = await confirm({
      title:
        newStatus === "active"
          ? "Publish Job"
          : newStatus === "closed"
            ? "Close Job"
            : "Update Job Status",
      message: `Are you sure you want to ${newStatus === "active" ? "publish" : newStatus === "closed" ? "close" : "update"} this job?`,
      confirmText:
        newStatus === "active"
          ? "Publish"
          : newStatus === "closed"
            ? "Close"
            : "Update",
      cancelText: "Cancel",
    });

    if (!confirmed) return;

    const result = await recruiterService.updateJobStatus(jobId, newStatus);
    if (result.success) {
      loadJobs();
    }
  };

  const handleDelete = async (jobId, jobTitle) => {
    const confirmed = await confirm({
      title: "Delete Job",
      message: `Are you sure you want to delete "${jobTitle}"?`,
      warning:
        "This action cannot be undone. All applications for this job will also be affected.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });

    if (!confirmed) return;

    const result = await recruiterService.deleteJob(jobId);
    if (result.success) {
      loadJobs();
    }
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "draft":
        return "secondary";
      case "closed":
        return "destructive";
      case "paused":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">My Jobs</h1>
          <p className="text-muted-foreground">Manage your job postings</p>
        </div>
        <Button onClick={() => navigate("/recruiter/jobs/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Job
        </Button>
      </motion.div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="closed">Closed</option>
              <option value="paused">Paused</option>
            </select>
            <Button type="submit" variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Jobs List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <SkeletonJobCard key={i} />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          variant="no-jobs"
          title={
            searchQuery || statusFilter
              ? "No jobs match your criteria"
              : "You haven't posted any jobs yet"
          }
          description={
            searchQuery || statusFilter
              ? "Try adjusting your search or filters."
              : "Create your first job posting to start receiving applications."
          }
          actionLabel={
            searchQuery || statusFilter ? "Clear Filters" : "Create Job"
          }
          onAction={() => {
            if (searchQuery || statusFilter) {
              setSearchQuery("");
              setStatusFilter("");
              setPagination((prev) => ({ ...prev, page: 1 }));
            } else {
              navigate("/recruiter/jobs/create");
            }
          }}
        />
      ) : (
        <>
          <div className="space-y-4">
            {jobs.map((job, index) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="relative">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-lg">{job.title}</CardTitle>
                          <Badge variant={getStatusBadgeVariant(job.status)}>
                            {job.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {job.company?.name || "No company"} &bull; Created on{" "}
                          {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === job._id ? null : job._id,
                            )
                          }
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                        {openMenuId === job._id && (
                          <div
                            className="absolute right-0 mt-1 w-48 bg-card border border-border rounded-lg shadow-lg z-10 py-1"
                            onMouseLeave={() => setOpenMenuId(null)}
                          >
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                navigate(`/jobs/${job._id}`);
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-accent transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </button>
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                navigate(`/recruiter/jobs/edit/${job._id}`);
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-accent transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </button>
                            {job.status === "draft" && (
                              <button
                                onClick={() => {
                                  setOpenMenuId(null);
                                  handleStatusChange(job._id, "active");
                                }}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-accent transition-colors"
                              >
                                <ExternalLink className="h-4 w-4" />
                                Publish
                              </button>
                            )}
                            {job.status === "active" && (
                              <button
                                onClick={() => {
                                  setOpenMenuId(null);
                                  handleStatusChange(job._id, "closed");
                                }}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-accent transition-colors"
                              >
                                <X className="h-4 w-4" />
                                Close
                              </button>
                            )}
                            <hr className="my-1 border-border" />
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                handleDelete(job._id, job.title);
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-6 text-sm">
                      <div>
                        <p className="text-muted-foreground">Applications</p>
                        <p className="font-semibold">
                          {job.applicationCount || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Views</p>
                        <p className="font-semibold">{job.viewCount || 0}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Type</p>
                        <p className="font-semibold capitalize">
                          {job.type || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Location</p>
                        <p className="font-semibold">
                          {job.location?.city || job.location?.type || "N/A"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
    </div>
  );
};

export default RecruiterJobs;
