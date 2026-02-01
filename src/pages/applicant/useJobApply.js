import { useState, useRef, useEffect } from "react";
import { api } from "../../api";
import { z } from "zod";
import {
  jobApplySchema,
  isValidSouthAfricanID,
  useDebounce,
} from "./jobApply.utils";
import { sendApplicationEmail } from "./emailService";

const normalizeIdNumber = (value = "") => {
  return value
    .replace(/\s+/g, "")      // remove ALL spaces
    .replace(/[^0-9]/g, "");  // remove anything that is NOT a digit
};

const normalizeEmail = (email = "") => {
  return email
    .trim()                 // remove leading/trailing spaces
    .toLowerCase()          // standardize case
    .replace(/\s+/g, "");  // remove ANY spaces inside the string
};

export const useNameFormatter = () => {
  const formatName = (name = "") => {
    return name
      .trim()
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  };

  return { formatName };
};


export function useJobApply() {
  const formRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [dob, setDob] = useState("");

  const [checkingId, setCheckingId] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [idExists, setIdExists] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
const { formatName } = useNameFormatter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    email: "",
    phone: "",
    location: "",
    qualification: "",
    experience: "",
    currentRole: "",
    portfolio: "",
    gender: "",
    consent: false,
    cv: null,
    doc1: null,
    doc2: null,
  });

  const debouncedId = useDebounce(formData.idNumber);
  const debouncedEmail = useDebounce(formData.email);

  /* ---------------- ID CHECK ---------------- */
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
  }, [debouncedId, isValidSouthAfricanID]);

  /* ---------------- EMAIL CHECK ---------------- */
  useEffect(() => {
    const checkEmail = async () => {
      const emailSchema = z.string().email();

      if (!emailSchema.safeParse(debouncedEmail).success) return;


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

  /* ---------------- CHANGE HANDLER ---------------- */
  const handleChange = (key, value) => {
    
  let normalizedValue = value;

if (key === "firstName" || key === "lastName") {
  normalizedValue = formatName(value);
}

if (key === "email") {
  normalizedValue = normalizeEmail(value);
}

if (key === "idNumber") {
  normalizedValue = normalizeIdNumber(value);
}

setFormData((p) => ({ ...p, [key]: normalizedValue }));
setMessage("");


    try {
      jobApplySchema
  .pick({ [key]: true })
  .parse({ [key]: normalizedValue });

      setErrors((p) => ({ ...p, [key]: undefined }));
    } catch (err) {
      setErrors((p) => ({
        ...p,
        [key]: err.errors?.[0]?.message,
      }));
    }
    
if (key === "idNumber" && /^\d{6}/.test(normalizedValue)) {
  const year = normalizedValue.slice(0, 2);
  const month = normalizedValue.slice(2, 4);
  const day = normalizedValue.slice(4, 6);
      const prefix =
        parseInt(year, 10) <= new Date().getFullYear() % 100 ? "20" : "19";

      setDob(`${prefix}${year}-${month}-${day}`);

      if (normalizedValue.length >= 10) {
  const genderDigits = parseInt(normalizedValue.slice(6, 10), 10);
        setFormData((p) => ({
          ...p,
          gender: genderDigits <= 4999 ? "Female" : "Male",
        }));
      }
    } else if (key === "idNumber") {
      setDob("");
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setMessage("");

    try {
      jobApplySchema.parse(formData);

      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
  if (v !== null && v !== undefined && v !== "") {
    data.append(k, v);
  }
});

      /* ---- BACKEND SUBMIT ---- */
      await api.post("/application/apply", data);

      /* ---- EMAIL AFTER SUCCESS ---- */
      const uploadedFiles = [
        formData.cv?.name,
        formData.doc1?.name,
        formData.doc2?.name,
      ]
        .filter(Boolean)
        .join(", ");
      
const formatName = (name = "") => {
  return name
    .trim()
    .toLowerCase()
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
};

      try {
        const formattedFullName = `${formatName(formData.firstName)} ${formatName(
  formData.lastName
)}`.trim();

await sendApplicationEmail({
  email: formData.email,
  fullName: formattedFullName,
  status: "Submitted",
  files: uploadedFiles || "No files uploaded",
});
      } catch (emailErr) {
        console.warn("EmailJS failed:", emailErr);
      }

      setMessage("Application submitted successfully!");

      setFormData({
        firstName: "",
        lastName: "",
        idNumber: "",
        email: "",
        phone: "",
        location: "",
        qualification: "",
        experience: "",
        currentRole: "",
        portfolio: "",
        gender: "",
        consent: false,
        cv: null,
        doc1: null,
        doc2: null,
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
        setErrors({ global: "Application failed. Try again." });
      }

      formRef.current?.scrollIntoView({ behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  return {
    formRef,
    formData,
    dob,
    loading,
    message,
    errors,
    checkingId,
    checkingEmail,
    idExists,
    emailExists,
    handleChange,
    handleSubmit,
    setIdExists,
    setEmailExists,
  };
}
