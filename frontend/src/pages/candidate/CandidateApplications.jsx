import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
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
import { SkeletonApplicationCard } from "../../components/ui/Loading";
import { useConfirmDialog } from "../../components/ui/ConfirmDialog";
import applicationApi from "../../services/applicationApi";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  "pending",
  "reviewed",
  "shortlisted",
  "interviewing",
  "offered",
  "hired",
  "rejected",
  "withdrawn",
];

const CandidateApplications = () => {
  const { confirm } = useConfirmDialog();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
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
      const params = { page: pagination.page, limit: pagination.limit };
      if (statusFilter) params.status = statusFilter;

      const response = await applicationApi.getMyApplications(params);
      const data = response.data;

      setApplications(data.applications || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to load applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, statusFilter]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const handleWithdraw = async (applicationId, jobTitle) => {
    const confirmed = await confirm({
      title: "Withdraw Application",
      message: `Are you sure you want to withdraw your application for "${jobTitle}"?`,
      warning: "This action cannot be undone.",
      confirmText: "Withdraw",
      cancelText: "Cancel",
      variant: "destructive",
    });

    if (!confirmed) return;

    try {
      await applicationApi.withdrawApplication(applicationId);
      toast.success("Application withdrawn");
      loadApplications();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to withdraw application",
      );
    }
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
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
      case "withdrawn":
        return "destructive";
      default:
        return "default";
    }
  };

  const canWithdraw = (status) => {
    return !["hired", "rejected", "withdrawn"].includes(status);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">My Applications</h1>
        <p className="text-muted-foreground">Track your job applications</p>
      </motion.div>

      {/* Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Status</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <SkeletonApplicationCard key={i} />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          variant="no-data"
          title={
            statusFilter
              ? `No applications with status "${statusFilter}"`
              : "No applications yet"
          }
          description={
            statusFilter
              ? "Try a different status filter."
              : "Start applying to jobs to see your applications here."
          }
          actionLabel={statusFilter ? "Clear Filter" : "Browse Jobs"}
          onAction={
            statusFilter
              ? () => {
                  setStatusFilter("");
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }
              : () => window.location.assign("/candidate/jobs")
          }
        />
      ) : (
        <>
          <div className="space-y-4">
            {applications.map((application, index) => (
              <motion.div
                key={application._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {application.job?.title || "Job position"}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {application.company?.name ||
                            application.job?.company?.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={getStatusBadgeVariant(application.status)}
                        >
                          {application.status?.toUpperCase()}
                        </Badge>
                        {canWithdraw(application.status) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleWithdraw(
                                application._id,
                                application.job?.title || "this position",
                              )
                            }
                            className="text-red-600 hover:text-red-700"
                          >
                            Withdraw
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>
                        Applied on{" "}
                        {new Date(application.createdAt).toLocaleDateString()}
                      </span>
                      {application.job?.location && (
                        <span>
                          •{" "}
                          {[
                            application.job.location.city,
                            application.job.location.state,
                            application.job.location.country,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      )}
                      {application.job?.type && (
                        <span>• {application.job.type}</span>
                      )}
                    </div>
                    {/* Timeline */}
                    {application.timeline &&
                      application.timeline.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <p className="text-xs text-muted-foreground mb-2">
                            Activity Timeline:
                          </p>
                          <div className="space-y-1">
                            {application.timeline.slice(-3).map((entry, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 text-xs text-muted-foreground"
                              >
                                <span className="w-2 h-2 rounded-full bg-primary/50" />
                                <span className="capitalize">
                                  {entry.status}
                                </span>
                                <span>-</span>
                                <span>{entry.note}</span>
                                <span>
                                  {new Date(
                                    entry.createdAt,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
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

export default CandidateApplications;
