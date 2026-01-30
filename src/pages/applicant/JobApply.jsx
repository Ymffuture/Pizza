import { useState, useRef } from "react";
import { z } from "zod";
import { api } from "../../api";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import {Helmet} from "react-helmet" ;
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiMapPin,
  FiBriefcase,
  FiUpload,
  FiPhone, 
} from "react-icons/fi";
import Loader from "./Loader" 

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
  firstName: z.string().min(4, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  idNumber: z.string().refine(isValidSouthAfricanID, {
    message: "Invalid South African ID number",
  }),
  email: z.string().email("Invalid email address"),
  location: z.string().min(6, "Location is required"),
  qualification: z.string().min(2, "Qualification is required"),
  experience: z.string().min(1, "Experience is required"),
  currentRole: z.string().optional(),
  portfolio: z.string().optional(),
phone: z.string().min(10).optional(),

  cv: fileSchema,
  doc1: z.instanceof(File).optional(),
  doc2: z.instanceof(File).optional(),

  consent: z.literal(true, {
    errorMap: () => ({
      message: "You must accept the Terms & Privacy Policy",
    }),
  }),
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
    gender: "",
    doc2: null,
    consent: false, 
    phone: "",

    // doc3: null,
    // doc4: null,
    // doc5: null,
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
      
      if (value.length >= 10) {
    const genderDigits = parseInt(value.slice(6, 10), 10);
    const gender = genderDigits >= 0 && genderDigits <= 4999 ? "Female" : "Male";
    setFormData((prev) => ({ ...prev, gender }));
      }
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

      setMessage("Application submitted successfully!");
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
        gender: "",
        consent: false, 
        phone: "",
 
        // doc3: null,
        // doc4: null,
        // doc5: null,
      });
      setDob("");
    } catch (err) {
  // 1. Frontend validation (Zod)
  if (err instanceof z.ZodError) {
    const fieldErrors = {};
    err.errors.forEach((e) => {
      fieldErrors[e.path[0]] = e.message;
    });
    setErrors(fieldErrors);
  }

  // 2. Backend responded (business logic errors)
  else if (err.response) {
    const { status, data } = err.response;

    // Duplicate application (email / ID already exists)
    if (status === 409) {
      setErrors({
        global: data?.message || "You have already applied for this position.",
      });
    }

    // Validation error from backend
    else if (status === 400 || status === 422) {
      setErrors({
        global: data?.message || "Invalid application data.",
      });
    }

    // Unauthorized
    else if (status === 401) {
      setErrors({
        global: "You are not authorized. Please log in again.",
      });
    }

    // Server error
    else if (status >= 500) {
      setErrors({
        global: "Server error. Please try again later.",
      });
    } else {
      setErrors({
        global: data?.message || "Application failed.",
      });
    }
  }

  // 3. Network error (no response at all)
  else if (err.request) {
    setErrors({
      global: "Network error. Check your internet connection.",
    });
  }

  // 4. Unknown JS error
  else {
    setErrors({
      global: "Unexpected error occurred.",
    });
  }

  formRef.current?.scrollIntoView({ behavior: "smooth" });
} finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center w-full dark:text-white">

      <Helmet >
      <title >Apply - Math/science or MERN </title>
      </Helmet>
      <div
        ref={formRef}
        className="w-full max-w-3xl p-8"
      >
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
          Job / School Application (Developer / DoE) 
        </h1>
   <p className="text-black dark:text-white p-2 rounded-xl text-sm">This form will be in our system for 3 months for next application cycle </p>

<p className="text-gray-600 dark:text-gray-300 p-2 rounded-xl text-sm">This form will act as Agreement between SwiftMeta and the applicant</p>
        
        
        {errors.global && (
          <p className="text-red-600 bg-red-400/10 p-6 p-2 rounded-xl text-sm">{errors.global}</p>
        )}
        {message && <p className="text-green-700 bg-green-500/10 text-sm p-2 rounded-xl p-6 flex gap-2"> <FiCheckCircle size={18}/> {message}</p>}

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
<InputField
  icon={<FiUser />}
  placeholder="Gender"
  value={formData.gender}
  readOnly
/>

          <InputField icon={<FiMail />} placeholder="Email Address"
            value={formData.email} error={errors.email}
            onChange={(v) => handleChange("email", v)} />
<InputField
  icon={<FiPhone />}
  placeholder="Phone Number"
  value={formData.phone}
  onChange={(v) => handleChange("phone", v)}
/>

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
  {/* CV */}
  <FileField
    label="Curriculum Vitae (Required)"
    error={errors.cv}
    onChange={(f) => handleChange("cv", f)}
  />

  {/* Matric / Past Report */}
  <FileField
    label="Matric Certificate / Latest School Report"
    error={errors.doc1}
    onChange={(f) => handleChange("doc1", f)}
  />

  {/* ID Copy */}
  <FileField
    label="Certified ID Copy"
    error={errors.doc2}
    onChange={(f) => handleChange("doc2", f)}
  />
</div>

<div className="space-y-1">
  <label className="flex items-start gap-3 text-sm cursor-pointer">
    <input
      type="checkbox"
      checked={formData.consent}
      onChange={(e) => handleChange("consent", e.target.checked)}
      className="mt-1 accent-black"
    />

    <span className="text-gray-600 dark:text-gray-300">
      I agree to the{" "}
      <a
        href="/terms"
        target="_blank"
        className="underline font-medium"
      >
        Terms & Conditions
      </a>{" "}
      and{" "}
      <a
        href="/policy"
        target="_blank"
        className="underline font-medium"
      >
        Privacy Policy
      </a>
      . I consent to the processing of my personal information in accordance
      with POPIA.
    </span>
  </label>

  {errors.consent && (
    <p className="text-red-500 text-xs flex gap-2">
      <FiAlertCircle size={14} /> {errors.consent}
    </p>
  )}
</div>

          <button
  type="submit"
  disabled={loading || !formData.consent}
  className={`w-full h-11 rounded-2xl font-medium transition flex items-center justify-center
    ${
      loading || !formData.consent
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-black dark:bg-gray-100 text-white dark:text-gray-900"
    }
  `}
>
  {loading ? <Loader /> : "Submit Application"}
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
          error ? "ring-1 ring-red-600/10" : ""
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
      {error && <p className="text-red-600 flex gap-2 text-xs"> <FiAlertCircle size={18} /> {error}</p>}
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
      {error && <p className="text-red-700 bg-red-600/10 flex gap-2 p-2 rounded text-xs"> <FiAlertCircle size={18} /> {error}</p>}
    </div>
  );
}
