import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Building2, Save, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";
import { useAuth } from "../../context/AuthContext";
import recruiterService from "../../services/RecruiterService";
import companyService from "../../services/CompanyService";
import toast from "react-hot-toast";

const COMPANY_SIZES = [
  { label: "1-10 employees", value: "1-10" },
  { label: "11-50 employees", value: "11-50" },
  { label: "51-200 employees", value: "51-200" },
  { label: "201-500 employees", value: "201-500" },
  { label: "501-1000 employees", value: "501-1000" },
  { label: "1000+ employees", value: "1000+" },
];

const INDUSTRIES = [
  { label: "Technology", value: "Technology" },
  { label: "Healthcare", value: "Healthcare" },
  { label: "Finance", value: "Finance" },
  { label: "Education", value: "Education" },
  { label: "Manufacturing", value: "Manufacturing" },
  { label: "Retail", value: "Retail" },
  { label: "Media", value: "Media" },
  { label: "Consulting", value: "Consulting" },
  { label: "Government", value: "Government" },
  { label: "Non-profit", value: "Non-profit" },
  { label: "Energy", value: "Energy" },
  { label: "Transportation", value: "Transportation" },
  { label: "Real Estate", value: "Real Estate" },
  { label: "Hospitality", value: "Hospitality" },
  { label: "Other", value: "Other" },
];

const currentYear = new Date().getFullYear();

const initialForm = {
  name: "",
  industry: "",
  size: "1-10",
  website: "",
  founded: "",
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
  description: "",
  mission: "",
  email: "",
  phone: "",
  linkedin: "",
  twitter: "",
};

const RecruiterCompany = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [companyId, setCompanyId] = useState(null);

  // Load company profile on mount
  useEffect(() => {
    loadCompany();
  }, []);

  const loadCompany = async () => {
    setLoading(true);
    try {
      const result = await recruiterService.getMyCompany();
      if (result.success && result.data?.company) {
        const c = result.data.company;
        setCompanyId(c._id);
        setForm({
          name: c.name || "",
          industry: c.industry || "",
          size: c.size || "1-10",
          website: c.website || "",
          founded: c.founded ? String(c.founded) : "",
          location: {
            addressLine1: c.location?.addressLine1 || "",
            addressLine2: c.location?.addressLine2 || "",
            city: c.location?.city || "",
            state: c.location?.state || "",
            country: c.location?.country || "",
            zipCode: c.location?.zipCode || "",
            landmark: c.location?.landmark || "",
            coordinates: c.location?.coordinates || "",
          },
          description: c.description || "",
          mission: c.mission || "",
          email: c.email || "",
          phone: c.phone || "",
          linkedin: c.linkedin || "",
          twitter: c.twitter || "",
        });
      }
      // else: no company — show empty form
    } catch (err) {
      console.error("Load company error:", err);
      // No company — show empty form
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};

    // Company Name (required by model AND validator)
    if (!form.name?.trim()) {
      newErrors.name = "Company name is required";
    } else if (form.name.trim().length > 100) {
      newErrors.name = "Company name cannot exceed 100 characters";
    }

    // Industry (required by model AND validator — enum)
    if (!form.industry) {
      newErrors.industry = "Industry is required";
    }

    // Founded (optional but must be valid year if provided)
    if (form.founded) {
      const year = parseInt(form.founded);
      if (isNaN(year) || year < 1800 || year > currentYear) {
        newErrors.founded = `Year must be between 1800 and ${currentYear}`;
      }
    }

    // Website (optional basic validation)
    if (form.website) {
      const urlPattern = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-]*)*\/?$/i;
      if (!urlPattern.test(form.website.trim())) {
        newErrors.website = "Please enter a valid URL";
      }
    }

    // Description (optional, max 2000)
    if (form.description && form.description.length > 2000) {
      newErrors.description = "Description cannot exceed 2000 characters";
    }

    // Mission (optional, max 1000)
    if (form.mission && form.mission.length > 1000) {
      newErrors.mission = "Mission cannot exceed 1000 characters";
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors below");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: form.name.trim(),
        industry: form.industry,
        size: form.size,
        website: form.website?.trim() || "",
        founded: form.founded ? parseInt(form.founded) : undefined,
        description: form.description?.trim() || "",
        mission: form.mission?.trim() || "",
        location: {
          addressLine1: form.location.addressLine1?.trim() || "",
          addressLine2: form.location.addressLine2?.trim() || "",
          city: form.location.city?.trim() || "",
          state: form.location.state?.trim() || "",
          country: form.location.country?.trim() || "",
          zipCode: form.location.zipCode?.trim() || "",
          landmark: form.location.landmark?.trim() || "",
          coordinates: form.location.coordinates?.trim() || "",
        },
      };

      // Add social/contact fields to the save payload
      // These need to be saved as custom fields if model supports them
      // For now we pass what the model accepts
      if (form.linkedin?.trim()) payload.linkedin = form.linkedin.trim();
      if (form.twitter?.trim()) payload.twitter = form.twitter.trim();
      if (form.email?.trim()) payload.email = form.email.trim();
      if (form.phone?.trim()) payload.phone = form.phone.trim();

      let result;
      if (companyId) {
        // Update existing company
        result = await recruiterService.updateCompany(companyId, payload);
      } else {
        // Create new company
        result = await recruiterService.createCompany(payload);
        if (result.success && result.data?.company?._id) {
          setCompanyId(result.data.company._id);
          // Update user context with new companyId
          if (updateUser) {
            updateUser({ ...user, companyId: result.data.company._id });
          }
        }
      }

      if (result.success) {
        toast.success(
          companyId ? "Company profile updated!" : "Company profile created!",
        );
        // Reload to get full populated data
        await loadCompany();
      }
    } catch (error) {
      console.error("Save company error:", error);
      toast.error(error?.response?.data?.message || "Failed to save company");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Company Profile</h1>
            <p className="text-muted-foreground">
              Manage your company information
            </p>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Main info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Company Name *"
                    placeholder="Enter company name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    error={errors.name}
                  />
                  <Select
                    label="Industry *"
                    options={INDUSTRIES}
                    value={form.industry}
                    onChange={(e) => handleChange("industry", e.target.value)}
                    error={errors.industry}
                    placeholder="Select industry"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select
                    label="Company Size"
                    options={COMPANY_SIZES}
                    value={form.size}
                    onChange={(e) => handleChange("size", e.target.value)}
                  />
                  <Input
                    label="Founded Year"
                    type="number"
                    min="1800"
                    max={currentYear}
                    placeholder="e.g. 2020"
                    value={form.founded}
                    onChange={(e) => handleChange("founded", e.target.value)}
                    error={errors.founded}
                  />
                  <Input
                    label="Website"
                    type="url"
                    placeholder="https://example.com"
                    value={form.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                    error={errors.website}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Textarea
                    label="Description"
                    placeholder="Tell us about your company..."
                    rows={5}
                    value={form.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    error={errors.description}
                  />
                  <p className="text-xs text-muted-foreground text-right mt-1">
                    {form.description.length}/2000
                  </p>
                </div>
                <div>
                  <Textarea
                    label="Mission"
                    placeholder="What is your company's mission?"
                    rows={3}
                    value={form.mission}
                    onChange={(e) => handleChange("mission", e.target.value)}
                    error={errors.mission}
                  />
                  <p className="text-xs text-muted-foreground text-right mt-1">
                    {form.mission.length}/1000
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                    placeholder="e.g. Mumbai"
                    value={form.location.city}
                    onChange={(e) =>
                      handleNestedChange("location", "city", e.target.value)
                    }
                  />
                  <Input
                    label="State / Province *"
                    placeholder="e.g. Maharashtra"
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
                    placeholder="e.g. 400070"
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
          </div>

          {/* Right column - Contact & Save */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact & Social</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="company@example.com"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
                <Input
                  label="Phone"
                  type="tel"
                  placeholder="+1 234 567 890"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
                <Input
                  label="LinkedIn URL"
                  type="url"
                  placeholder="https://linkedin.com/company/..."
                  value={form.linkedin}
                  onChange={(e) => handleChange("linkedin", e.target.value)}
                />
                <Input
                  label="Twitter URL"
                  type="url"
                  placeholder="https://twitter.com/..."
                  value={form.twitter}
                  onChange={(e) => handleChange("twitter", e.target.value)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Save</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {companyId ? "Update Profile" : "Create Profile"}
                    </span>
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

export default RecruiterCompany;
