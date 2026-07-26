import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import Avatar from "../../components/ui/Avatar";
import Badge from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { SkeletonCard } from "../../components/ui/Loading";
import applicationApi from "../../services/applicationApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const RecruiterCandidates = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      const response = await applicationApi.getApplications({ limit: 50 });
      const applications = response.data.applications || [];

      // Group unique candidates from applications
      const uniqueCandidates = [];
      const seenIds = new Set();

      applications.forEach((app) => {
        if (app.candidate && !seenIds.has(app.candidate._id)) {
          seenIds.add(app.candidate._id);
          uniqueCandidates.push({
            _id: app.candidate._id,
            firstName: app.candidate.firstName,
            lastName: app.candidate.lastName,
            email: app.candidate.email,
            avatar: app.candidate.avatar,
            jobTitle: app.job?.title,
            status: app.status,
            appliedAt: app.createdAt,
          });
        }
      });

      setCandidates(uniqueCandidates);
    } catch (error) {
      console.error("Failed to load candidates:", error);
      toast.error("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "hired":
        return "success";
      case "shortlisted":
      case "interviewing":
        return "info";
      case "pending":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-64 bg-muted rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
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
        <h1 className="text-3xl font-bold mb-2">Candidates</h1>
        <p className="text-muted-foreground">
          Browse candidates who applied to your jobs
        </p>
      </motion.div>

      {candidates.length === 0 ? (
        <EmptyState
          variant="no-users"
          title="No candidates yet"
          description="Candidates who apply to your jobs will appear here."
          actionLabel="View Jobs"
          onAction={() => navigate("/recruiter/jobs")}
        />
      ) : (
        <div className="space-y-4">
          {candidates.map((candidate, index) => (
            <motion.div
              key={candidate._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar
                        initials={
                          (candidate.firstName?.[0] || "") +
                          (candidate.lastName?.[0] || "")
                        }
                        size="md"
                      />
                      <div>
                        <CardTitle>
                          {candidate.firstName} {candidate.lastName}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {candidate.jobTitle || "Applied to a job"}
                        </p>
                        {candidate.email && (
                          <p className="text-xs text-muted-foreground">
                            {candidate.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge variant={getStatusBadgeVariant(candidate.status)}>
                      {candidate.status?.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Applied on{" "}
                    {new Date(candidate.appliedAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterCandidates;
