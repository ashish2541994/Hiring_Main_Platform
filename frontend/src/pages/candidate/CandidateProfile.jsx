import { motion } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import { useAuth } from "../../context/AuthContext";
import candidateApi from "../../services/candidateApi";
import resumeApi from "../../services/resumeApi";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Github,
  Linkedin,
  Globe,
  FileText,
  Save,
  Loader2,
  Plus,
  X,
  DollarSign,
  Clock,
  Upload,
  Download,
  Trash2,
} from "lucide-react";

const AVAILABILITY_OPTIONS = [
  { label: "Immediately", value: "immediately" },
  { label: "15 Days", value: "15_days" },
  { label: "30 Days", value: "30_days" },
  { label: "60 Days", value: "60_days" },
  { label: "Negotiable", value: "negotiable" },
];

const GENDER_OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

const LANGUAGE_PROFICIENCY = [
  { label: "Basic", value: "basic" },
  { label: "Conversational", value: "conversational" },
  { label: "Fluent", value: "fluent" },
  { label: "Native", value: "native" },
];

const CandidateProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [deletingResume, setDeletingResume] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    nationality: "",
    preferredLanguage: "",
    location: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
      landmark: "",
      coordinates: "",
    },
    bio: "",
    professionalSummary: "",
    currentCompany: "",
    currentDesignation: "",
    yearsOfExperience: 0,
    expectedSalary: "",
    preferredJobType: "",
    preferredLocation: "",
    availability: "",
    skills: [],
    education: [],
    languages: [],
    socialLinks: { linkedin: "", github: "", portfolio: "", website: "" },
    resume: "",
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeInfo, setResumeInfo] = useState(null);
  const [newSkill, setNewSkill] = useState("");
  const [newLanguage, setNewLanguage] = useState({
    language: "",
    proficiency: "",
  });
  const [newEducation, setNewEducation] = useState({
    school: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  });

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await candidateApi.getProfile();
      const data = response.data.profile;
      if (data) {
        setProfile({
          firstName: data.firstName || user?.firstName || "",
          lastName: data.lastName || user?.lastName || "",
          email: data.email || user?.email || "",
          phone: data.phone || "",
          gender: data.gender || "",
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split("T")[0] : "",
          nationality: data.nationality || "",
          preferredLanguage: data.preferredLanguage || "",
          location: data.location || {
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            country: "",
            zipCode: "",
            landmark: "",
            coordinates: "",
          },
          bio: data.bio || "",
          professionalSummary: data.professionalSummary || "",
          currentCompany: data.currentCompany || "",
          currentDesignation: data.currentDesignation || "",
          yearsOfExperience: data.yearsOfExperience || 0,
          expectedSalary: data.expectedSalary || "",
          preferredJobType: data.preferredJobType || "",
          preferredLocation: data.preferredLocation || "",
          availability: data.availability || "",
          skills: data.skills || [],
          education: data.education || [],
          languages: data.languages || [],
          socialLinks: data.socialLinks || {
            linkedin: "",
            github: "",
            portfolio: "",
            website: "",
          },
          resume: data.resume || "",
        });
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadResumeInfo = useCallback(async () => {
    try {
      const response = await resumeApi.getResumes();
      const resumes = response.data.resumes;
      if (resumes && resumes.length > 0) {
        setResumeInfo(resumes[0]);
      } else {
        setResumeInfo(null);
      }
    } catch (error) {
      console.error("Failed to load resume info:", error);
    }
  }, []);

  useEffect(() => {
    loadProfile();
    loadResumeInfo();
  }, [loadProfile, loadResumeInfo]);

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));
  };

  const handleSocialChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [field]: value },
    }));
  };

  const addSkill = () => {
    const skill = newSkill.trim();
    if (!skill) return;
    if (profile.skills.includes(skill)) {
      toast.error("Skill already added");
      return;
    }
    setProfile((prev) => ({
      ...prev,
      skills: [...prev.skills, skill],
    }));
    setNewSkill("");
  };

  const removeSkill = (skill) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const addLanguage = () => {
    if (!newLanguage.language || !newLanguage.proficiency) {
      toast.error("Please enter language and proficiency");
      return;
    }
    setProfile((prev) => ({
      ...prev,
      languages: [...prev.languages, newLanguage],
    }));
    setNewLanguage({ language: "", proficiency: "" });
  };

  const removeLanguage = (idx) => {
    setProfile((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== idx),
    }));
  };

  const addEducation = () => {
    if (!newEducation.school || !newEducation.degree || !newEducation.field) {
      toast.error("Please fill in school, degree and field");
      return;
    }
    setProfile((prev) => ({
      ...prev,
      education: [...prev.education, newEducation],
    }));
    setNewEducation({
      school: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    });
  };

  const removeEducation = (idx) => {
    setProfile((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== idx),
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await candidateApi.updateProfile(profile);
      if (response.data.success) {
        toast.success("Profile updated successfully");
        if (updateUser) updateUser(response.data.profile);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Resume Management
  const handleResumeSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a PDF or Word document");
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setResumeFile(file);
    }
  };

  const handleUploadResume = async () => {
    if (!resumeFile) {
      toast.error("Please select a file to upload");
      return;
    }
    try {
      setUploadingResume(true);
      const formData = new FormData();
      formData.append("resume", resumeFile);
      const response = await resumeApi.uploadResume(resumeFile);
      if (response.data.success) {
        toast.success("Resume uploaded successfully");
        setResumeFile(null);
        setProfile((prev) => ({
          ...prev,
          resume: response.data.resume?.file || response.data.resume?.file,
        }));
        await loadResumeInfo();
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload resume");
    } finally {
      setUploadingResume(false);
    }
  };

  const handleViewResume = () => {
    if (resumeInfo?.file) {
      window.open(`/${resumeInfo.file}`, "_blank");
    } else if (profile.resume) {
      window.open(`/${profile.resume}`, "_blank");
    } else {
      toast.error("No resume available to view");
    }
  };

  const handleDeleteResume = async () => {
    if (!resumeInfo?._id) {
      toast.error("No resume to delete");
      return;
    }
    try {
      setDeletingResume(true);
      await resumeApi.deleteResume(resumeInfo._id);
      toast.success("Resume deleted successfully");
      setResumeInfo(null);
      setShowDeleteConfirm(false);
      setProfile((prev) => ({ ...prev, resume: "" }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete resume");
    } finally {
      setDeletingResume(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "professional", label: "Professional", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "skills", label: "Skills & Languages", icon: Award },
    { id: "resume", label: "Resume & Social", icon: FileText },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            My Profile
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your professional profile
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-4">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === "personal" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        value={profile.firstName}
                        onChange={(e) =>
                          handleChange("firstName", e.target.value)
                        }
                      />
                      <Input
                        label="Last Name"
                        value={profile.lastName}
                        onChange={(e) =>
                          handleChange("lastName", e.target.value)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Email"
                        value={profile.email}
                        disabled
                        icon={<Mail className="w-4 h-4" />}
                      />
                      <Input
                        label="Phone"
                        value={profile.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        icon={<Phone className="w-4 h-4" />}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                        label="Gender"
                        options={GENDER_OPTIONS}
                        value={profile.gender}
                        onChange={(e) => handleChange("gender", e.target.value)}
                      />
                      <Input
                        label="Date of Birth"
                        type="date"
                        value={profile.dateOfBirth}
                        onChange={(e) =>
                          handleChange("dateOfBirth", e.target.value)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Nationality"
                        value={profile.nationality}
                        onChange={(e) =>
                          handleChange("nationality", e.target.value)
                        }
                      />
                      <Input
                        label="Preferred Language"
                        value={profile.preferredLanguage}
                        onChange={(e) =>
                          handleChange("preferredLanguage", e.target.value)
                        }
                      />
                    </div>
                    <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Address
                      </h4>
                      <div className="space-y-4">
                        <Input
                          label="Address Line 1 *"
                          placeholder="Flat/House No., Building Name, Street Name"
                          value={profile.location.addressLine1}
                          onChange={(e) =>
                            handleLocationChange("addressLine1", e.target.value)
                          }
                        />
                        <Input
                          label="Address Line 2 (Optional)"
                          placeholder="Apartment, Floor, Block, Landmark, Area, Locality"
                          value={profile.location.addressLine2}
                          onChange={(e) =>
                            handleLocationChange("addressLine2", e.target.value)
                          }
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Input
                            label="City *"
                            placeholder="e.g. Mumbai"
                            value={profile.location.city}
                            onChange={(e) =>
                              handleLocationChange("city", e.target.value)
                            }
                          />
                          <Input
                            label="State / Province *"
                            placeholder="e.g. Maharashtra"
                            value={profile.location.state}
                            onChange={(e) =>
                              handleLocationChange("state", e.target.value)
                            }
                          />
                          <Input
                            label="Country *"
                            placeholder="e.g. India"
                            value={profile.location.country}
                            onChange={(e) =>
                              handleLocationChange("country", e.target.value)
                            }
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Postal / ZIP Code *"
                            placeholder="e.g. 400070"
                            value={profile.location.zipCode}
                            onChange={(e) =>
                              handleLocationChange("zipCode", e.target.value)
                            }
                          />
                          <Input
                            label="Landmark (Optional)"
                            placeholder="e.g. Near Phoenix Mall"
                            value={profile.location.landmark}
                            onChange={(e) =>
                              handleLocationChange("landmark", e.target.value)
                            }
                          />
                        </div>
                        <Input
                          label="Google Maps Location / Coordinates (Optional)"
                          placeholder="e.g. https://maps.google.com/?q=..."
                          value={profile.location.coordinates}
                          onChange={(e) =>
                            handleLocationChange("coordinates", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <Textarea
                      label="Bio"
                      rows={3}
                      value={profile.bio}
                      onChange={(e) => handleChange("bio", e.target.value)}
                      placeholder="Tell us a little about yourself..."
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "professional" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Current Company"
                        value={profile.currentCompany}
                        onChange={(e) =>
                          handleChange("currentCompany", e.target.value)
                        }
                        icon={<Briefcase className="w-4 h-4" />}
                      />
                      <Input
                        label="Current Designation"
                        value={profile.currentDesignation}
                        onChange={(e) =>
                          handleChange("currentDesignation", e.target.value)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Years of Experience"
                        type="number"
                        min="0"
                        max="50"
                        value={profile.yearsOfExperience}
                        onChange={(e) =>
                          handleChange(
                            "yearsOfExperience",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        icon={<Clock className="w-4 h-4" />}
                      />
                      <Input
                        label="Expected Salary"
                        value={profile.expectedSalary}
                        onChange={(e) =>
                          handleChange("expectedSalary", e.target.value)
                        }
                        icon={<DollarSign className="w-4 h-4" />}
                        placeholder="e.g. ₹15,00,000 per year"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Preferred Job Type"
                        value={profile.preferredJobType}
                        onChange={(e) =>
                          handleChange("preferredJobType", e.target.value)
                        }
                        placeholder="e.g. Full-time, Remote"
                      />
                      <Input
                        label="Preferred Location"
                        value={profile.preferredLocation}
                        onChange={(e) =>
                          handleChange("preferredLocation", e.target.value)
                        }
                        placeholder="e.g. Bangalore, India"
                      />
                    </div>
                    <div>
                      <Select
                        label="Availability"
                        options={AVAILABILITY_OPTIONS}
                        value={profile.availability}
                        onChange={(e) =>
                          handleChange("availability", e.target.value)
                        }
                      />
                    </div>
                    <Textarea
                      label="Professional Summary"
                      rows={5}
                      value={profile.professionalSummary}
                      onChange={(e) =>
                        handleChange("professionalSummary", e.target.value)
                      }
                      placeholder="Write a detailed summary of your professional background, key achievements, and career goals..."
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "education" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Education</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profile.education.map((edu, idx) => (
                      <div
                        key={idx}
                        className="flex items-start justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                      >
                        <div>
                          <p className="font-medium">
                            {edu.degree} in {edu.field}
                          </p>
                          <p className="text-sm text-gray-500">{edu.school}</p>
                          <p className="text-xs text-gray-400">
                            {edu.startDate} -{" "}
                            {edu.current ? "Present" : edu.endDate}
                          </p>
                          {edu.description && (
                            <p className="text-xs text-gray-400 mt-1">
                              {edu.description}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeEducation(idx)}
                          className="p-1 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border border-dashed border-gray-200 dark:border-gray-600 rounded-lg">
                      <Input
                        label="School/University"
                        value={newEducation.school}
                        onChange={(e) =>
                          setNewEducation({
                            ...newEducation,
                            school: e.target.value,
                          })
                        }
                      />
                      <Input
                        label="Degree"
                        value={newEducation.degree}
                        onChange={(e) =>
                          setNewEducation({
                            ...newEducation,
                            degree: e.target.value,
                          })
                        }
                      />
                      <Input
                        label="Field of Study"
                        value={newEducation.field}
                        onChange={(e) =>
                          setNewEducation({
                            ...newEducation,
                            field: e.target.value,
                          })
                        }
                      />
                      <div className="flex gap-2">
                        <Input
                          label="Start Date"
                          type="date"
                          value={newEducation.startDate}
                          onChange={(e) =>
                            setNewEducation({
                              ...newEducation,
                              startDate: e.target.value,
                            })
                          }
                        />
                        {!newEducation.current && (
                          <Input
                            label="End Date"
                            type="date"
                            value={newEducation.endDate}
                            onChange={(e) =>
                              setNewEducation({
                                ...newEducation,
                                endDate: e.target.value,
                              })
                            }
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-2 md:col-span-2">
                        <input
                          type="checkbox"
                          checked={newEducation.current}
                          onChange={(e) =>
                            setNewEducation({
                              ...newEducation,
                              current: e.target.checked,
                            })
                          }
                          className="w-4 h-4"
                        />
                        <label className="text-sm">Currently studying</label>
                      </div>
                      <div className="md:col-span-2">
                        <Textarea
                          label="Description (Optional)"
                          rows={2}
                          value={newEducation.description}
                          onChange={(e) =>
                            setNewEducation({
                              ...newEducation,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addEducation}
                      >
                        <Plus className="w-4 h-4 mr-1" /> Add Education
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "skills" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 mb-4">
                      <Input
                        placeholder="Type a skill and press Add"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addSkill())
                        }
                      />
                      <Button variant="outline" onClick={addSkill}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm"
                        >
                          {skill}
                          <button
                            onClick={() => removeSkill(skill)}
                            className="hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      {profile.skills.length === 0 && (
                        <p className="text-sm text-gray-400">
                          No skills added yet
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Languages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {profile.languages.map((lang, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 mb-2"
                      >
                        <span className="font-medium">{lang.language}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500 capitalize">
                            {lang.proficiency}
                          </span>
                          <button
                            onClick={() => removeLanguage(idx)}
                            className="hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-2 mt-3">
                      <Input
                        placeholder="Language"
                        value={newLanguage.language}
                        onChange={(e) =>
                          setNewLanguage({
                            ...newLanguage,
                            language: e.target.value,
                          })
                        }
                      />
                      <select
                        value={newLanguage.proficiency}
                        onChange={(e) =>
                          setNewLanguage({
                            ...newLanguage,
                            proficiency: e.target.value,
                          })
                        }
                        className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                      >
                        <option value="">Proficiency</option>
                        {LANGUAGE_PROFICIENCY.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <Button variant="outline" onClick={addLanguage}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "resume" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Resume Management Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Resume / CV</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Existing Resume Info */}
                    {resumeInfo ? (
                      <div className="flex items-center gap-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                        <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-green-800 dark:text-green-200 truncate">
                            {resumeInfo.originalName || "Resume"}
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-400">
                            {resumeInfo.fileSize
                              ? formatFileSize(resumeInfo.fileSize)
                              : ""}
                            {resumeInfo.createdAt &&
                              ` • Uploaded ${new Date(resumeInfo.createdAt).toLocaleDateString()}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleViewResume}
                            title="View Resume"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <label
                            className="cursor-pointer p-2 rounded-lg border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors inline-flex items-center justify-center"
                            title="Replace Resume"
                          >
                            <Upload className="w-4 h-4" />
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept=".pdf,.doc,.docx"
                              className="hidden"
                              onChange={(e) => {
                                handleResumeSelect(e);
                                if (e.target.files[0]) {
                                  // Auto-upload on replace
                                  const file = e.target.files[0];
                                  setResumeFile(file);
                                  setTimeout(() => {
                                    if (file) handleUploadResume();
                                  }, 100);
                                }
                              }}
                            />
                          </label>
                          {showDeleteConfirm ? (
                            <div className="flex items-center gap-1">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleDeleteResume}
                                loading={deletingResume}
                              >
                                Confirm
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowDeleteConfirm(false)}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowDeleteConfirm(true)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              title="Delete Resume"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 mb-4">
                        No resume uploaded yet. Upload your resume to apply for
                        jobs.
                      </p>
                    )}

                    {/* Upload new resume */}
                    <div className="mt-4 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <label className="flex-1 w-full cursor-pointer">
                          <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <Upload className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {resumeFile
                                ? resumeFile.name
                                : "Choose a file (PDF, DOC, DOCX up to 5MB)"}
                            </span>
                          </div>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={handleResumeSelect}
                          />
                        </label>
                        {resumeFile && !resumeInfo && (
                          <Button
                            onClick={handleUploadResume}
                            loading={uploadingResume}
                            disabled={uploadingResume}
                          >
                            {uploadingResume ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload
                              </>
                            )}
                          </Button>
                        )}
                        {resumeFile && resumeInfo && (
                          <Button
                            onClick={handleUploadResume}
                            loading={uploadingResume}
                            disabled={uploadingResume}
                            variant="outline"
                          >
                            {uploadingResume ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Replacing...
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4 mr-2" />
                                Replace
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                      {resumeFile && (
                        <button
                          onClick={() => {
                            setResumeFile(null);
                            if (fileInputRef.current)
                              fileInputRef.current.value = "";
                          }}
                          className="mt-2 text-xs text-red-500 hover:text-red-700"
                        >
                          Clear selection
                        </button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Social Links Card */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Social Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      label="LinkedIn"
                      value={profile.socialLinks.linkedin}
                      onChange={(e) =>
                        handleSocialChange("linkedin", e.target.value)
                      }
                      icon={<Linkedin className="w-4 h-4 text-blue-600" />}
                      placeholder="https://linkedin.com/in/your-profile"
                    />
                    <Input
                      label="GitHub"
                      value={profile.socialLinks.github}
                      onChange={(e) =>
                        handleSocialChange("github", e.target.value)
                      }
                      icon={<Github className="w-4 h-4" />}
                      placeholder="https://github.com/your-username"
                    />
                    <Input
                      label="Portfolio"
                      value={profile.socialLinks.portfolio}
                      onChange={(e) =>
                        handleSocialChange("portfolio", e.target.value)
                      }
                      icon={<Globe className="w-4 h-4 text-green-600" />}
                      placeholder="https://your-portfolio.com"
                    />
                    <Input
                      label="Website"
                      value={profile.socialLinks.website}
                      onChange={(e) =>
                        handleSocialChange("website", e.target.value)
                      }
                      icon={<Globe className="w-4 h-4" />}
                      placeholder="https://your-website.com"
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Save Button */}
            <div className="flex justify-end sticky bottom-6">
              <Button
                size="lg"
                onClick={handleSave}
                loading={saving}
                className="shadow-lg"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
