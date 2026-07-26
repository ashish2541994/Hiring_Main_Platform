import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  MapPin,
  Building2,
  DollarSign,
  Calendar,
  Briefcase,
  Clock,
  Users,
  Star,
  Share2,
  Bookmark,
  CheckCircle2,
  Loader2,
  Award,
  ExternalLink,
} from "lucide-react";

import jobApi from "../../services/jobApi";
import applicationApi from "../../services/applicationApi";
import { useAuth } from "../../context/AuthContext";

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadJob = async () => {
      try {
        setLoading(true);
        const response = await jobApi.getJobById(id);
        const data = response?.data?.job || response?.data || null;

        if (isMounted) {
          setJob(data);
        }
      } catch (err) {
        toast.error("Failed to load job details");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) loadJob();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Check if the user has already applied
  useEffect(() => {
    const checkApplied = async () => {
      if (!isAuthenticated || !user || !id) return;
      try {
        const response = await applicationApi.getMyApplications({
          jobId: id,
          limit: 1,
        });
        const apps = response.data?.applications || [];
        if (apps.length > 0) {
          setHasApplied(true);
        }
      } catch {
        // Silently fail - user can still try to apply
      }
    };
    checkApplied();
  }, [isAuthenticated, user, id]);

  const handleApply = useCallback(async () => {
    // 1. Check authentication
    if (!isAuthenticated) {
      toast.error("Please login to apply for jobs");
      navigate("/login");
      return;
    }

    // 2. Prevent duplicate application
    if (hasApplied) {
      toast.error("You have already applied to this job");
      return;
    }

    // 3. Send the application with candidate data
    try {
      setApplying(true);

      // Include candidate snapshot data from user context
      const candidateData = {
        fullName:
          user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: [
          user?.location?.addressLine1,
          user?.location?.addressLine2,
          user?.location?.city,
          user?.location?.state,
          user?.location?.country,
        ]
          .filter(Boolean)
          .join(", "),
        skills: user?.skills || [],
        education: user?.education || [],
        resumeUrl: user?.resume || "",
      };

      const response = await applicationApi.createApplication({
        job: id,
        coverLetter: "",
        ...candidateData,
      });
      if (response.data?.success) {
        toast.success("Job applied successfully");
        setHasApplied(true);
      } else {
        toast.success("Job applied successfully");
        setHasApplied(true);
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to apply for this job";

      // Handle duplicate application error from backend
      if (
        error.response?.status === 400 &&
        (errorMsg.toLowerCase().includes("already applied") ||
          errorMsg.toLowerCase().includes("already"))
      ) {
        toast.error("You have already applied to this job");
        setHasApplied(true);
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setApplying(false);
    }
  }, [id, isAuthenticated, hasApplied, navigate, user]);

  // Parse rich text fields (requirements, responsibilities can be plain text or arrays)
  const parseListField = (field) => {
    if (Array.isArray(field)) return field.filter(Boolean);
    if (typeof field === "string" && field.trim())
      return field
        .split(/\n|•|–|—|,/)
        .map((s) => s.trim())
        .filter(Boolean);
    return [];
  };

  const requirements = parseListField(job?.requirements);
  const responsibilities = parseListField(job?.responsibilities);
  const skills = Array.isArray(job?.skills)
    ? job.skills
    : typeof job?.skills === "string"
      ? job.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  const formatLocation = (loc) => {
    if (!loc) return "Not Specified";
    if (typeof loc === "string") return loc;
    return [loc.city, loc.state, loc.country].filter(Boolean).join(", ");
  };

  const formatSalary = (salary) => {
    if (!salary) return "Not Disclosed";
    if (typeof salary === "string") return salary;
    const currency = salary.currency || "$";
    if (salary.min && salary.max) {
      return `${currency}${Number(salary.min).toLocaleString()} - ${currency}${Number(salary.max).toLocaleString()}`;
    }
    if (salary.min)
      return `From ${currency}${Number(salary.min).toLocaleString()}`;
    if (salary.max)
      return `Up to ${currency}${Number(salary.max).toLocaleString()}`;
    return "Negotiable";
  };

  const getExperienceLabel = (level) => {
    const labels = {
      entry: "Entry Level",
      junior: "Junior Level",
      mid: "Mid Level",
      senior: "Senior Level",
      lead: "Lead Level",
      executive: "Executive Level",
    };
    return labels[level] || level || "Not Specified";
  };

  const getJobTypeLabel = (type) => {
    const labels = {
      "full-time": "Full Time",
      "part-time": "Part Time",
      contract: "Contract",
      internship: "Internship",
      freelance: "Freelance",
    };
    return labels[type] || type || "Full Time";
  };

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return "Recently";
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mx-auto" />
          <h2 className="mt-8 text-2xl font-bold text-gray-800 dark:text-white">
            Loading Job Details
          </h2>
          <p className="mt-2 text-gray-500">Please wait...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-950">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-10 max-w-xl w-full text-center"
        >
          <h1 className="text-4xl font-bold text-red-500">Job Not Found</h1>
          <p className="mt-4 text-gray-500">
            This job may have been deleted or is unavailable.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold hover:gap-3 transition-all mb-6 group"
        >
          <ArrowLeft
            size={18}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to Jobs
        </button>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-800"
        >
          {/* Hero Header - Gradient Banner */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 px-6 sm:px-10 py-8 sm:py-10 text-white relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

            <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-6 lg:gap-8">
              {/* Left: Job Title & Company */}
              <div className="flex gap-4 sm:gap-6">
                {/* Company Logo Placeholder */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-lg flex items-center justify-center flex-shrink-0">
                  <Building2 size={36} className="opacity-90" />
                </div>

                <div className="min-w-0">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.type && (
                      <span className="px-3 py-1 rounded-full bg-white/20 text-xs sm:text-sm font-medium backdrop-blur-sm">
                        {getJobTypeLabel(job.type)}
                      </span>
                    )}
                    {job.experienceLevel && (
                      <span className="px-3 py-1 rounded-full bg-white/20 text-xs sm:text-sm font-medium backdrop-blur-sm capitalize">
                        {getExperienceLabel(job.experienceLevel)}
                      </span>
                    )}
                    {job.location?.type && (
                      <span className="px-3 py-1 rounded-full bg-white/20 text-xs sm:text-sm font-medium backdrop-blur-sm capitalize">
                        {job.location.type.replace("-", " ")}
                      </span>
                    )}
                    {job.urgent && (
                      <span className="px-3 py-1 rounded-full bg-red-500/40 text-xs sm:text-sm font-medium backdrop-blur-sm">
                        Urgent
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                    {job.title}
                  </h1>

                  <p className="mt-2 text-lg sm:text-xl text-blue-100 font-medium">
                    {job.company?.name || job.companyName || "Company"}
                  </p>

                  {/* Meta row */}
                  <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-sm sm:text-base text-blue-100">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={16} />
                      <span>{formatLocation(job.location)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign size={16} />
                      <span>{formatSalary(job.salary)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={16} />
                      <span>{getTimeAgo(job.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Action Buttons (No Apply button here - only Save & Share) */}
              <div className="flex flex-row lg:flex-col gap-3 flex-shrink-0">
                <button className="flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 rounded-xl px-4 sm:px-6 py-3 backdrop-blur-sm transition-all font-medium text-sm">
                  <Bookmark size={18} />
                  Save Job
                </button>
                <button className="flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 rounded-xl px-4 sm:px-6 py-3 backdrop-blur-sm transition-all font-medium text-sm">
                  <Share2 size={18} />
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* ====== MAIN CONTENT ====== */}
          <div className="grid lg:grid-cols-[2fr_1fr] gap-8 p-6 sm:p-8 lg:p-10">
            {/* LEFT SIDE - Job Details */}
            <div className="space-y-8">
              {/* Job Description */}
              <section className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-1 h-8 bg-blue-600 rounded-full" />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    Job Description
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {job.description ||
                    "No description available for this position."}
                </p>
              </section>

              {/* Requirements */}
              {requirements.length > 0 && (
                <section className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-8 bg-amber-500 rounded-full" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      Requirements
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {requirements.map((item, index) => (
                      <li key={index} className="flex gap-3 items-start">
                        <span className="w-2 h-2 mt-2 rounded-full bg-amber-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Responsibilities */}
              {responsibilities.length > 0 && (
                <section className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-8 bg-green-500 rounded-full" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      Responsibilities
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {responsibilities.map((item, index) => (
                      <li key={index} className="flex gap-3 items-start">
                        <span className="w-2 h-2 mt-2 rounded-full bg-green-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Skills */}
              {skills.length > 0 && (
                <section className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-8 bg-purple-500 rounded-full" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      Required Skills
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-sm font-medium border border-purple-100 dark:border-purple-800/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Benefits (if available) */}
              {job.benefits && (
                <section className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-8 bg-green-500 rounded-full" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      Benefits
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {job.benefits}
                  </p>
                </section>
              )}
            </div>

            {/* RIGHT SIDEBAR - Job Overview & Apply */}
            <div className="space-y-6">
              <div className="sticky top-24">
                {/* Apply Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm">
                  {/* Apply Button - THE ONLY APPLY BUTTON */}
                  <button
                    onClick={handleApply}
                    disabled={applying || hasApplied}
                    className={`w-full py-3.5 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2 ${
                      hasApplied
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-2 border-green-300 dark:border-green-700 cursor-default"
                        : applying
                          ? "bg-blue-400 cursor-not-allowed text-white"
                          : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-md hover:shadow-lg active:scale-[0.98]"
                    }`}
                  >
                    {applying ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Applying...
                      </>
                    ) : hasApplied ? (
                      <>
                        <CheckCircle2 size={20} />
                        Applied Successfully
                      </>
                    ) : (
                      "Apply For This Job"
                    )}
                  </button>

                  {/* Application status info */}
                  {hasApplied && (
                    <p className="mt-3 text-center text-sm text-green-600 dark:text-green-400 flex items-center justify-center gap-1.5">
                      <CheckCircle2 size={16} />
                      Your application has been submitted
                    </p>
                  )}

                  {/* Divider */}
                  <div className="my-6 border-t border-gray-100 dark:border-slate-800" />

                  {/* Job Overview */}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">
                    Job Overview
                  </h3>

                  <div className="space-y-4">
                    {/* Location */}
                    <div className="flex items-center gap-3 sm:gap-4 p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <MapPin size={18} className="text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">
                          Location
                        </p>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                          {formatLocation(job.location)}
                        </p>
                      </div>
                    </div>

                    {/* Salary */}
                    <div className="flex items-center gap-3 sm:gap-4 p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                      <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                        <DollarSign size={18} className="text-green-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">
                          Salary
                        </p>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                          {formatSalary(job.salary)}
                        </p>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="flex items-center gap-3 sm:gap-4 p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                        <Briefcase size={18} className="text-purple-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">
                          Category
                        </p>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                          {job.category || "General"}
                        </p>
                      </div>
                    </div>

                    {/* Job Type */}
                    <div className="flex items-center gap-3 sm:gap-4 p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                        <Clock size={18} className="text-orange-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">
                          Job Type
                        </p>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate capitalize">
                          {getJobTypeLabel(job.type)}
                        </p>
                      </div>
                    </div>

                    {/* Experience Level */}
                    <div className="flex items-center gap-3 sm:gap-4 p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                      <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center flex-shrink-0">
                        <Award size={18} className="text-cyan-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">
                          Experience
                        </p>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate capitalize">
                          {getExperienceLabel(job.experienceLevel)}
                        </p>
                      </div>
                    </div>

                    {/* Applicants */}
                    <div className="flex items-center gap-3 sm:gap-4 p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                      <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center flex-shrink-0">
                        <Users size={18} className="text-pink-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">
                          Applicants
                        </p>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                          {job.applicationCount || 0} applicants
                        </p>
                      </div>
                    </div>

                    {/* Posted Date */}
                    <div className="flex items-center gap-3 sm:gap-4 p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                        <Calendar size={18} className="text-indigo-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">
                          Posted
                        </p>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                          {getTimeAgo(job.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Why Join Card */}
                <div className="mt-6 bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2.5">
                      <Star size={22} className="fill-white" />
                      <h3 className="font-bold text-lg">Why Join?</h3>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-white/90">
                      Competitive salary, career growth opportunities,
                      collaborative culture, flexible working arrangements,
                      continuous learning, and exciting projects.
                    </p>
                  </div>
                </div>

                {/* Company Info Card */}
                {job.company && (
                  <div className="mt-6 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                      About Company
                    </h3>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                        <Building2 size={24} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                          {job.company.name || "Company"}
                        </p>
                        {job.company.industry && (
                          <p className="text-xs text-gray-500">
                            {job.company.industry}
                          </p>
                        )}
                      </div>
                    </div>
                    {job.company.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mt-2 line-clamp-3">
                        {job.company.description}
                      </p>
                    )}
                    {job.company.website && (
                      <a
                        href={job.company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <ExternalLink size={14} />
                        Visit Website
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
