import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Award,
  FileText,
  ExternalLink,
  Download,
  Briefcase,
  Calendar,
  User,
  Building2,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Avatar from "../../components/ui/Avatar";
import Button from "../../components/ui/Button";
import candidateApi from "../../services/candidateApi";

const RecruiterCandidateProfile = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await candidateApi.getCandidateProfile(candidateId);
      if (response.data?.success) {
        setProfile(response.data.profile);
      }
    } catch (error) {
      toast.error("Failed to load candidate profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [candidateId]);

  useEffect(() => {
    if (candidateId) loadProfile();
  }, [candidateId, loadProfile]);

  const getResumeUrl = (resumePath) => {
    if (!resumePath || resumePath === "not-provided" || resumePath === "")
      return null;
    if (resumePath.startsWith("http")) return resumePath;
    const cleanPath = resumePath.startsWith("/")
      ? resumePath.slice(1)
      : resumePath;
    return `/${cleanPath}`;
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
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin mx-auto" />
          <h2 className="mt-6 text-xl font-bold text-gray-800 dark:text-white">
            Loading Candidate Profile
          </h2>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-950">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-10 max-w-xl w-full text-center">
          <h1 className="text-3xl font-bold text-red-500">
            Candidate Not Found
          </h1>
          <p className="mt-4 text-gray-500">
            This candidate profile may not exist or has been removed.
          </p>
          <Button onClick={() => navigate(-1)} className="mt-6">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const resumeUrl = getResumeUrl(profile.resume);
  const fullName =
    profile.fullName ||
    `${profile.firstName || ""} ${profile.lastName || ""}`.trim() ||
    "Unknown Candidate";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold mb-6 transition-all group"
        >
          <ArrowLeft
            size={18}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to Applications
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* ================= PROFILE HEADER ================= */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-8 shadow-2xl">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-20 h-32 w-32 rounded-full bg-cyan-300/20 blur-3xl" />

            <div className="relative flex flex-col sm:flex-row items-center gap-6">
              <Avatar
                initials={fullName.charAt(0) || "U"}
                size="xl"
                className="w-20 h-20 text-3xl"
              />
              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold text-white">{fullName}</h1>
                <p className="mt-1 text-blue-100">
                  {profile.currentDesignation && (
                    <span className="mr-2">{profile.currentDesignation}</span>
                  )}
                  {profile.currentCompany && (
                    <span>at {profile.currentCompany}</span>
                  )}
                </p>
                <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-blue-100">
                  {profile.email && (
                    <span className="flex items-center gap-1.5">
                      <Mail size={14} /> {profile.email}
                    </span>
                  )}
                  {profile.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone size={14} /> {profile.phone}
                    </span>
                  )}
                </div>
                {profile.yearsOfExperience > 0 && (
                  <div className="mt-2 flex items-center gap-1.5 text-sm text-blue-100">
                    <Briefcase size={14} />
                    {profile.yearsOfExperience} years of experience
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
            {/* ================= LEFT COLUMN ================= */}
            <div className="space-y-6">
              {/* Personal Information */}
              <Card className="rounded-3xl border-0 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-500 px-6 py-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <User size={20} />
                    Personal Information
                  </h2>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        Full Name
                      </p>
                      <p className="font-semibold">{fullName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        Email
                      </p>
                      <p className="font-semibold">{profile.email || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        Phone
                      </p>
                      <p className="font-semibold">{profile.phone || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        Nationality
                      </p>
                      <p className="font-semibold">
                        {profile.nationality || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Address
                    </p>
                    <p className="font-semibold">
                      {[
                        profile.location?.addressLine1,
                        profile.location?.addressLine2,
                        profile.location?.city,
                        profile.location?.state,
                        profile.location?.country,
                      ]
                        .filter(Boolean)
                        .join(", ") || "N/A"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Education */}
              {profile.education && profile.education.length > 0 && (
                <Card className="rounded-3xl border-0 shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <GraduationCap size={20} />
                      Education
                    </h2>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    {profile.education.map((edu, idx) => (
                      <div
                        key={idx}
                        className="border-b border-gray-100 dark:border-slate-700 last:border-0 pb-4 last:pb-0"
                      >
                        <h3 className="font-bold">
                          {edu.degree || edu.field || "Education"}
                        </h3>
                        <p className="text-primary font-medium">{edu.school}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {edu.startDate &&
                            new Date(edu.startDate).toLocaleDateString()}
                          {" - "}
                          {edu.current
                            ? "Present"
                            : edu.endDate
                              ? new Date(edu.endDate).toLocaleDateString()
                              : ""}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Application History */}
              {profile.applicationHistory &&
                profile.applicationHistory.length > 0 && (
                  <Card className="rounded-3xl border-0 shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Briefcase size={20} />
                        Application History
                      </h2>
                    </div>
                    <CardContent className="p-6 space-y-4">
                      {profile.applicationHistory.map((app, idx) => (
                        <div
                          key={idx}
                          className="border-b border-gray-100 dark:border-slate-700 last:border-0 pb-4 last:pb-0"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold">{app.jobTitle}</h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <Building2 size={14} />
                                {app.company?.name || "Unknown Company"}
                              </p>
                            </div>
                            <Badge variant={getStatusBadgeVariant(app.status)}>
                              {app.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                            <Calendar size={12} />
                            Applied:{" "}
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
            </div>

            {/* ================= RIGHT COLUMN ================= */}
            <div className="space-y-6">
              {/* Skills */}
              {profile.skills && profile.skills.length > 0 && (
                <Card className="rounded-3xl border-0 shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Award size={20} />
                      Skills
                    </h2>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="rounded-xl bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 text-sm font-semibold text-blue-700 dark:text-blue-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Resume */}
              {resumeUrl && (
                <Card className="rounded-3xl border-0 shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-rose-500 to-red-500 px-6 py-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <FileText size={20} />
                      Resume
                    </h2>
                  </div>
                  <CardContent className="p-6 space-y-3">
                    <Button className="w-full" asChild>
                      <a href={resumeUrl} target="_blank" rel="noreferrer">
                        <ExternalLink size={16} className="mr-2" />
                        View Resume
                      </a>
                    </Button>
                    <Button variant="secondary" className="w-full" asChild>
                      <a href={resumeUrl} download>
                        <Download size={16} className="mr-2" />
                        Download Resume
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Profile Completion */}
              {profile.profileCompletion !== undefined && (
                <Card className="rounded-3xl border-0 shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <User size={20} />
                      Profile Completion
                    </h2>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16">
                        <svg
                          className="w-16 h-16 transform -rotate-90"
                          viewBox="0 0 64 64"
                        >
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="4"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="4"
                            strokeDasharray={`${profile.profileCompletion * 1.76} 176`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                          {profile.profileCompletion}%
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold">Profile Complete</p>
                        <p className="text-sm text-muted-foreground">
                          {profile.profileCompletion >= 80
                            ? "Great profile!"
                            : profile.profileCompletion >= 50
                              ? "Getting there"
                              : "Needs improvement"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RecruiterCandidateProfile;
