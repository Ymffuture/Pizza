import { useState, useRef } from "react";
import { z } from "zod";
import { api } from "../../api";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiMapPin,
  FiBriefcase,
  FiUpload,
} from "react-icons/fi";

/* ---------------------------------------------------
   FILE CONSTRAINTS
--------------------------------------------------- */
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

/* ---------------------------------------------------
   SOUTH AFRICAN ID VALIDATION
--------------------------------------------------- */
function isValidSouthAfricanID(id) {
  if (!/^\d{13}$/.test(id)) return false;

  const year = parseInt(id.slice(0, 2), 10);
  const month = parseInt(id.slice(2, 4), 10);
  const day = parseInt(id.slice(4, 6), 10);

  const fullYear =
    year <= new Date().getFullYear() % 100 ? 2000 + year : 1900 + year;
  const date = new Date(fullYear, month - 1, day);

  if (
    date.getFullYear() !== fullYear ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false;
  }

  const citizenship = parseInt(id[10], 10);
  if (![0, 1].includes(citizenship)) return false;

  let sum = 0;
  let alternate = false;
  for (let i = id.length - 1; i >= 0; i--) {
    let n = parseInt(id[i], 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }

  return sum % 10 === 0;
}

/* ---------------------------------------------------
   ZOD SCHEMA
--------------------------------------------------- */
const fileSchema = z
  .instanceof(File, { message: "File is required" })
  .refine((file) => file.size <= MAX_FILE_SIZE, "File must be under 5MB")
  .refine(
    (file) => ACCEPTED_FILE_TYPES.includes(file.type),
    "Only PDF or Word documents are allowed"
  );

const jobApplySchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  idNumber: z.string().refine(isValidSouthAfricanID, {
    message: "Invalid South African ID number",
  }),
  email: z.string().email("Invalid email address"),
  location: z.string().min(2, "Location is required"),
  qualification: z.string().min(2, "Qualification is required"),
  experience: z.string().min(1, "Experience is required"),
  currentRole: z.string().optional(),
  portfolio: z.string().optional(),

  // Documents
  cv: fileSchema,
  doc1: z.instanceof(File).optional(),
  doc2: z.instanceof(File).optional(),
  doc3: z.instanceof(File).optional(),
  doc4: z.instanceof(File).optional(),
  doc5: z.instanceof(File).optional(),
});

/* ---------------------------------------------------
   MAIN COMPONENT
--------------------------------------------------- */
export default function JobApply() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [dob, setDob] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    email: "",
    location: "",
    qualification: "",
    experience: "",
    currentRole: "",
    portfolio: "",
    cv: null,
    doc1: null,
    doc2: null,
    doc3: null,
    doc4: null,
    doc5: null,
  });

  const formRef = useRef(null);

  /* ---------------------------------------------------
     HANDLE CHANGE
  --------------------------------------------------- */
  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setMessage("");

    try {
      jobApplySchema.pick({ [key]: true }).parse({ [key]: value });
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        [key]: err.errors?.[0]?.message,
      }));
    }

    if (key === "idNumber" && /^\d{6}/.test(value)) {
      const year = value.slice(0, 2);
      const month = value.slice(2, 4);
      const day = value.slice(4, 6);
      const prefix =
        parseInt(year, 10) <= new Date().getFullYear() % 100 ? "20" : "19";
      setDob(`${prefix}${year}-${month}-${day}`);
    } else if (key === "idNumber") {
      setDob("");
    }
  };

  /* ---------------------------------------------------
     HANDLE SUBMIT
  --------------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setMessage("");

    try {
      jobApplySchema.parse(formData);

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });

      await api.post("/application/apply", data);

      setMessage("Application submitted successfully 🎉");
      setFormData({
        firstName: "",
        lastName: "",
        idNumber: "",
        email: "",
        location: "",
        qualification: "",
        experience: "",
        currentRole: "",
        portfolio: "",
        cv: null,
        doc1: null,
        doc2: null,
        doc3: null,
        doc4: null,
        doc5: null,
      });
      setDob("");
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors = {};
        err.errors.forEach((e) => {
          fieldErrors[e.path[0]] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ global: "Something went wrong. Please try again." });
      }
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center py-10 px-4">
      <div
        ref={formRef}
        className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6"
      >
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
          Job Application
        </h1>

        {errors.global && (
          <p className="text-red-500 text-sm">{errors.global}</p>
        )}
        {message && <p className="text-green-500 text-sm">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField icon={<FiUser />} placeholder="First Name"
            value={formData.firstName} error={errors.firstName}
            onChange={(v) => handleChange("firstName", v)} />

          <InputField icon={<FiUser />} placeholder="Last Name"
            value={formData.lastName} error={errors.lastName}
            onChange={(v) => handleChange("lastName", v)} />

          <InputField icon={<FiCalendar />} placeholder="ID Number"
            value={formData.idNumber} error={errors.idNumber}
            onChange={(v) => handleChange("idNumber", v)} />

          <InputField icon={<FiCalendar />} placeholder="Date of Birth"
            value={dob} readOnly />

          <InputField icon={<FiMail />} placeholder="Email Address"
            value={formData.email} error={errors.email}
            onChange={(v) => handleChange("email", v)} />

          <InputField icon={<FiMapPin />} placeholder="Location"
            value={formData.location} error={errors.location}
            onChange={(v) => handleChange("location", v)} />

          <InputField icon={<FiBriefcase />} placeholder="Highest Qualification"
            value={formData.qualification} error={errors.qualification}
            onChange={(v) => handleChange("qualification", v)} />

          <InputField icon={<FiBriefcase />} placeholder="Years of Experience"
            value={formData.experience} error={errors.experience}
            onChange={(v) => handleChange("experience", v)} />

          {/* Documents */}
          <div className="space-y-3">
            <FileField
              label="Curriculum Vitae (Required)"
              error={errors.cv}
              onChange={(f) => handleChange("cv", f)}
            />

            {[1, 2, 3, 4, 5].map((n) => (
              <FileField
                key={n}
                label={`Supporting Document ${n}`}
                error={errors[`doc${n}`]}
                onChange={(f) => handleChange(`doc${n}`, f)}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-2xl bg-black dark:bg-gray-100 text-white dark:text-gray-900 font-medium"
          >
            {loading ? "Submitting…" : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------------------------------------------------
   INPUT COMPONENTS
--------------------------------------------------- */
function InputField({
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  readOnly = false,
}) {
  return (
    <div className="space-y-1">
      <div
        className={`flex items-center gap-2 rounded-2xl px-3 h-11 bg-gray-50 dark:bg-gray-700 ${
          error ? "ring-1 ring-red-500" : ""
        }`}
      >
        {icon && <span className="text-gray-400">{icon}</span>}
        <input
          type={type}
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm"
        />
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

function FileField({ label, error, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-500 flex items-center gap-2">
        <FiUpload /> {label}
      </label>
      <input
        type="file"
        onChange={(e) => onChange(e.target.files?.[0])}
        className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:bg-gray-100 file:text-gray-700"
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
