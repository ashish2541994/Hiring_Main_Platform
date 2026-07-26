import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Select from "../../components/ui/Select";
import Loader from "../../components/ui/Loader";
import jobApi from "../../services/jobApi";
import recruiterService from "../../services/RecruiterService";
import {
  EXPERIENCE_LEVELS,
  JOB_TYPES,
  REMOTE_OPTIONS,
} from "../../constants/constants";
import toast from "react-hot-toast";

const CATEGORIES = [
  "Engineering",
  "Design",
  "Product",
  "Data",
  "DevOps",
  "Marketing",
  "Sales",
  "Human Resources",
  "Finance",
  "Legal",
  "Healthcare",
  "Education",
  "Other",
];

const MAX_CHARS = {
  title: 100,
  description: 5000,
  requirements: 3000,
  responsibilities: 3000,
  benefits: 2000,
};

const EditJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    title: "",
    companyName: "",
    category: "",
    type: "",
    experienceLevel: "",
    salary: { min: "", max: "" },
    location: {
      type: "on-site",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
      landmark: "",
      coordinates: "",
    },
    skills: [],
    description: "",
    requirements: "",
    responsibilities: "",
    benefits: "",
    applicationDeadline: "",
    status: "draft",
  });

  useEffect(() => {
    loadJob();
  }, [id]);

  const loadJob = async () => {
    try {
      setLoading(true);
      const response = await jobApi.getJobById(id);
      const job = response.data.job;

      setForm({
        title: job.title || "",
        companyName: job.company?.name || "",
        category: job.category || "",
        type: job.type || "",
        experienceLevel: job.experienceLevel || "",
        salary: {
          min: job.salary?.min?.toString() || "",
          max: job.salary?.max?.toString() || "",
        },
        location: {
          type: job.location?.type || "on-site",
          addressLine1: job.location?.addressLine1 || "",
          addressLine2: job.location?.addressLine2 || "",
          city: job.location?.city || "",
          state: job.location?.state || "",
          country: job.location?.country || "",
          zipCode: job.location?.zipCode || "",
          landmark: job.location?.landmark || "",
          coordinates: job.location?.coordinates || "",
        },
        skills: job.skills || [],
        description: job.description || "",
        requirements: job.requirements || "",
        responsibilities: job.responsibilities || "",
        benefits: job.benefits || "",
        applicationDeadline: job.expiresAt
          ? new Date(job.expiresAt).toISOString().split("T")[0]
          : "",
        status: job.status || "draft",
      });
    } catch (error) {
      console.error("Failed to load job:", error);
      toast.error("Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.title?.trim()) {
      newErrors.title = "Job title is required";
    } else if (form.title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    } else if (form.title.length > 100) {
      newErrors.title = "Title cannot exceed 100 characters";
    }

    if (!form.description?.trim()) {
      newErrors.description = "Description is required";
    } else if (form.description.trim().length < 50) {
      newErrors.description = "Description must contain at least 50 characters";
    }

    if (!form.requirements?.trim()) {
      newErrors.requirements = "Requirements are required";
    }

    if (!form.type) newErrors.type = "Employment type is required";
    if (!form.experienceLevel)
      newErrors.experienceLevel = "Experience level is required";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.location?.city?.trim()) newErrors.city = "City is required";
    if (form.skills.length === 0)
      newErrors.skills = "At least one skill is required";

    if (
      form.salary?.min &&
      form.salary?.max &&
      Number(form.salary.min) > Number(form.salary.max)
    ) {
      newErrors.salaryMax = "Max salary must be greater than min salary";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleNestedChange = (parent, field, value) => {
    setForm((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };

  const handleAddSkill = () => {
    const skill = skillInput.trim();
    if (!skill) return;
    if (form.skills.length >= 20) {
      toast.error("Cannot add more than 20 skills");
      return;
    }
    if (form.skills.includes(skill)) {
      toast.error("Skill already added");
      return;
    }
    setForm((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
    setSkillInput("");
  };

  const handleRemoveSkill = (skill) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleSubmit = async (e, statusOverride) => {
    e.preventDefault();

    const finalStatus = statusOverride || form.status;
    setForm((prev) => ({ ...prev, status: finalStatus }));

    if (!validateForm()) {
      toast.error("Please fix the form errors below");
      return;
    }

    setSubmitting(true);

    try {
      const jobData = {
        title: form.title.trim(),
        description: form.description.trim(),
        requirements: form.requirements.trim(),
        type: form.type,
        experienceLevel: form.experienceLevel,
        category: form.category,
        skills: form.skills,
        location: {
          type: form.location.type,
          addressLine1: form.location.addressLine1?.trim() || "",
          addressLine2: form.location.addressLine2?.trim() || "",
          city: form.location.city.trim(),
          state: form.location.state?.trim() || "",
          country: form.location.country?.trim() || "",
          zipCode: form.location.zipCode?.trim() || "",
          landmark: form.location.landmark?.trim() || "",
          coordinates: form.location.coordinates?.trim() || "",
        },
        status: finalStatus,
      };

      if (form.responsibilities?.trim()) {
        jobData.responsibilities = form.responsibilities.trim();
      }
      if (form.benefits?.trim()) {
        jobData.benefits = form.benefits.trim();
      }
      if (form.salary.min || form.salary.max) {
        jobData.salary = {
          min: form.salary.min ? Number(form.salary.min) : undefined,
          max: form.salary.max ? Number(form.salary.max) : undefined,
          currency: "INR",
          period: "yearly",
        };
      }
      if (form.applicationDeadline) {
        jobData.expiresAt = new Date(form.applicationDeadline);
      }

      const result = await recruiterService.updateJob(id, jobData);

      if (result.success) {
        toast.success("Job updated successfully!");
        navigate("/recruiter/jobs");
      } else {
        toast.error(result.error || "Failed to update job");
      }
    } catch (error) {
      console.error("Update job error:", error);
      toast.error("Failed to update job");
    } finally {
      setSubmitting(false);
    }
  };

  const selectTypeOptions = Object.entries(JOB_TYPES).map(([key, value]) => ({
    label: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    value,
  }));

  const selectExpOptions = Object.entries(EXPERIENCE_LEVELS).map(
    ([key, value]) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
      value,
    }),
  );

  const selectRemoteOptions = Object.entries(REMOTE_OPTIONS).map(
    ([key, value]) => ({
      label: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      value,
    }),
  );

  const categoryOptions = CATEGORIES.map((c) => ({ label: c, value: c }));

  if (loading) return <Loader />;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-2">
          <Button variant="ghost" onClick={() => navigate("/recruiter/jobs")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Job</h1>
            <p className="text-muted-foreground">
              Update the job posting details
            </p>
          </div>
        </div>
      </motion.div>

      <form>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Job Title *"
                  placeholder="e.g. Senior Frontend Developer"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  error={errors.title}
                />
                {form.title.length > 0 && (
                  <p className="text-xs text-muted-foreground -mt-3 text-right">
                    {form.title.length}/{MAX_CHARS.title}
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Employment Type *"
                    options={selectTypeOptions}
                    value={form.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                    error={errors.type}
                    placeholder="Select type"
                  />
                  <Select
                    label="Experience Level *"
                    options={selectExpOptions}
                    value={form.experienceLevel}
                    onChange={(e) =>
                      handleChange("experienceLevel", e.target.value)
                    }
                    error={errors.experienceLevel}
                    placeholder="Select level"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Category *"
                    options={categoryOptions}
                    value={form.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                    error={errors.category}
                    placeholder="Select category"
                  />
                  <Input
                    label="Application Deadline"
                    type="date"
                    value={form.applicationDeadline}
                    onChange={(e) =>
                      handleChange("applicationDeadline", e.target.value)
                    }
                    error={errors.applicationDeadline}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Textarea
                    label="Description *"
                    placeholder="Describe the role..."
                    rows={6}
                    value={form.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    error={errors.description}
                  />
                  <p className="text-xs text-muted-foreground text-right mt-1">
                    {form.description.length}/{MAX_CHARS.description}
                  </p>
                </div>
                <div>
                  <Textarea
                    label="Requirements *"
                    placeholder="List the qualifications..."
                    rows={5}
                    value={form.requirements}
                    onChange={(e) =>
                      handleChange("requirements", e.target.value)
                    }
                    error={errors.requirements}
                  />
                  <p className="text-xs text-muted-foreground text-right mt-1">
                    {form.requirements.length}/{MAX_CHARS.requirements}
                  </p>
                </div>
                <div>
                  <Textarea
                    label="Responsibilities"
                    placeholder="Describe key responsibilities for this role..."
                    rows={4}
                    value={form.responsibilities}
                    onChange={(e) =>
                      handleChange("responsibilities", e.target.value)
                    }
                  />
                  <p className="text-xs text-muted-foreground text-right mt-1">
                    {form.responsibilities.length}/{MAX_CHARS.responsibilities}
                  </p>
                </div>
                <div>
                  <Textarea
                    label="Benefits"
                    placeholder="Describe the benefits package"
                    rows={4}
                    value={form.benefits}
                    onChange={(e) => handleChange("benefits", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground text-right mt-1">
                    {form.benefits.length}/{MAX_CHARS.benefits}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  label="Work Type *"
                  options={selectRemoteOptions}
                  value={form.location.type}
                  onChange={(e) =>
                    handleNestedChange("location", "type", e.target.value)
                  }
                />
                <Input
                  label="Address Line 1 *"
                  placeholder="Flat/House No., Building Name, Street Name"
                  value={form.location.addressLine1}
                  onChange={(e) =>
                    handleNestedChange(
                      "location",
                      "addressLine1",
                      e.target.value,
                    )
                  }
                />
                <Input
                  label="Address Line 2 (Optional)"
                  placeholder="Apartment, Floor, Block, Landmark, Area, Locality"
                  value={form.location.addressLine2}
                  onChange={(e) =>
                    handleNestedChange(
                      "location",
                      "addressLine2",
                      e.target.value,
                    )
                  }
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="City *"
                    placeholder="e.g. Bangalore"
                    value={form.location.city}
                    onChange={(e) =>
                      handleNestedChange("location", "city", e.target.value)
                    }
                    error={errors.city}
                  />
                  <Input
                    label="State / Province *"
                    placeholder="e.g. Karnataka"
                    value={form.location.state}
                    onChange={(e) =>
                      handleNestedChange("location", "state", e.target.value)
                    }
                  />
                  <Input
                    label="Country *"
                    placeholder="e.g. India"
                    value={form.location.country}
                    onChange={(e) =>
                      handleNestedChange("location", "country", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Postal / ZIP Code *"
                    placeholder="e.g. 560001"
                    value={form.location.zipCode}
                    onChange={(e) =>
                      handleNestedChange("location", "zipCode", e.target.value)
                    }
                  />
                  <Input
                    label="Landmark (Optional)"
                    placeholder="e.g. Near Phoenix Mall"
                    value={form.location.landmark}
                    onChange={(e) =>
                      handleNestedChange("location", "landmark", e.target.value)
                    }
                  />
                </div>
                <Input
                  label="Google Maps Location / Coordinates (Optional)"
                  placeholder="e.g. https://maps.google.com/?q=..."
                  value={form.location.coordinates}
                  onChange={(e) =>
                    handleNestedChange(
                      "location",
                      "coordinates",
                      e.target.value,
                    )
                  }
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Salary (Optional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Minimum Salary"
                  type="number"
                  min="0"
                  placeholder="e.g. 500000"
                  value={form.salary.min}
                  onChange={(e) =>
                    handleNestedChange("salary", "min", e.target.value)
                  }
                />
                <Input
                  label="Maximum Salary"
                  type="number"
                  min="0"
                  placeholder="e.g. 1500000"
                  value={form.salary.max}
                  onChange={(e) =>
                    handleNestedChange("salary", "max", e.target.value)
                  }
                  error={errors.salaryMax}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills *</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a skill and add..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddSkill}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {errors.skills && (
                  <p className="text-sm text-destructive">{errors.skills}</p>
                )}
                {form.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-destructive transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Save Changes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  type="button"
                  variant="primary"
                  className="w-full"
                  disabled={submitting}
                  onClick={(e) => handleSubmit(e, "active")}
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Saving...
                    </span>
                  ) : (
                    "Publish"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  disabled={submitting}
                  onClick={(e) => handleSubmit(e, "draft")}
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Saving...
                    </span>
                  ) : (
                    "Save Draft"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditJob;
