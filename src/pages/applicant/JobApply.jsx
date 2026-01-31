import { useState, useRef, useEffect } from "react";
import { api } from "../../api";
import { Helmet } from "react-helmet";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiMapPin,
  FiBriefcase,
  FiPhone,
  FiCheckCircle,
} from "react-icons/fi";

import Loader from "./Loader";
import {
  jobApplySchema,
  isValidSouthAfricanID,
  useDebounce,
} from "./jobApply.utils";

import {
  InputField,
  FileField,
  InlineLoader,
} from "./JobApplyFields";


/* ---------------------------------------------------
   MAIN COMPONENT
--------------------------------------------------- */
export default function JobApply() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [dob, setDob] = useState("");
const [checkingId, setCheckingId] = useState(false);
const [checkingEmail, setCheckingEmail] = useState(false);
const [idExists, setIdExists] = useState(false);
const [emailExists, setEmailExists] = useState(false);
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

  
  const debouncedId = useDebounce(formData.idNumber);
const debouncedEmail = useDebounce(formData.email); 


useEffect(() => {
  const checkId = async () => {
    if (debouncedId.length !== 13) return;

    if (!isValidSouthAfricanID(debouncedId)) return;

    try {
      setCheckingId(true);
      const res = await api.get("/application/exists", {
        params: { idNumber: debouncedId },
      });

      setIdExists(res.data.exists);

      if (res.data.exists) {
        setErrors((p) => ({
          ...p,
          idNumber: "An application already exists for this ID",
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingId(false);
    }
  };

  checkId();
}, [debouncedId]);


  useEffect(() => {
  const checkEmail = async () => {
    if (!z.string().email().safeParse(debouncedEmail).success) return;

    try {
      setCheckingEmail(true);
      const res = await api.get("/application/exists", {
        params: { email: debouncedEmail },
      });

      setEmailExists(res.data.exists);

      if (res.data.exists) {
        setErrors((p) => ({
          ...p,
          email: "An application already exists for this email",
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingEmail(false);
    }
  };

  checkEmail();
}, [debouncedEmail]);

  
  
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
      
if (idExists || emailExists) {
  setErrors({
    global: "You already have an application in our system.",
  });
  return;
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

        <form onSubmit={handleSubmit} className="space-y-4 pt-6">
          <InputField icon={<FiUser />} placeholder="First Name"
            value={formData.firstName} error={errors.firstName}
            onChange={(v) => handleChange("firstName", v)} />

          <InputField icon={<FiUser />} placeholder="Last Name"
            value={formData.lastName} error={errors.lastName}
            onChange={(v) => handleChange("lastName", v)} />

          <InputField
  icon={<FiCalendar />}
  placeholder="ID Number"
  value={formData.idNumber}
  error={errors.idNumber || (idExists && "ID already used") }
  onChange={(v) => {
    setIdExists(false);
    handleChange("idNumber", v);
  }}
/>

{checkingId && <InlineLoader label="Checking ID" />}


{!checkingId && formData.idNumber.length === 13 && !errors.idNumber && !idExists &&(
  <p className="text-green-600 text-xs flex gap-1">
    <FiCheckCircle /> ID is available
  </p>
)}


          <InputField icon={<FiCalendar />} placeholder="Date of Birth"
            value={dob} readOnly />
<InputField
  icon={<FiUser />}
  placeholder="Gender"
  value={formData.gender}
  readOnly
/>

          <InputField
  icon={<FiMail />}
  placeholder="Email Address"
  value={formData.email}
  error={errors.email || (emailExists && "Email already used")}
  onChange={(v) => {
    setEmailExists(false);
    handleChange("email", v);
  }}
/>

{checkingEmail && <InlineLoader label="Checking email" />}


{!checkingEmail &&
  formData.email &&
  !errors.email &&
  !emailExists && (
    <p className="text-green-600 text-xs flex gap-1 items-center">
      <FiCheckCircle /> Email is available
    </p>
)}

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
