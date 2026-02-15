import { useState, useRef, useEffect } from "react";
import { api } from "../../api";
import { z } from "zod";
import {
  jobApplySchema,
  isValidSouthAfricanID,
  useDebounce,
} from "./jobApply.utils";
import { sendApplicationEmail } from "./emailService";

/* ===================== NORMALIZERS ===================== */
const normalizeIdNumber = (value = "") =>
  value.replace(/\s+/g, "").replace(/[^0-9]/g, "");

const normalizeEmail = (email = "") =>
  email.trim().toLowerCase().replace(/\s+/g, "");

/* ===================== NAME FORMATTER (SINGLE SOURCE) ===================== */
export const useNameFormatter = () => {
  const formatName = (name = "") =>
    name
      .trim()
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return { formatName };
};

/* ===================== MAIN HOOK ===================== */
export function useJobApply() {
  const formRef = useRef(null);
  const { formatName } = useNameFormatter();

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

  const debouncedId = useDebounce(formData.idNumber, 500);
  const debouncedEmail = useDebounce(formData.email, 500);

  /* ===================== ID EXISTENCE CHECK ===================== */
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
        console.error("ID check failed:", err);
      } finally {
        setCheckingId(false);
      }
    };

    checkId();
  }, [debouncedId]);

  /* ===================== EMAIL EXISTENCE CHECK ===================== */
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
        console.error("Email check failed:", err);
      } finally {
        setCheckingEmail(false);
      }
    };

    checkEmail();
  }, [debouncedEmail]);

  /* ===================== CHANGE HANDLER (CRITICAL FIX) ===================== */
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

    setFormData((prev) => ({ ...prev, [key]: normalizedValue }));
    setMessage("");

    // VALIDATE AFTER NORMALIZATION (FIXED)
    try {
      jobApplySchema.pick({ [key]: true }).parse({
        [key]: normalizedValue,
      });

      setErrors((p) => ({ ...p, [key]: undefined }));
    } catch (err) {
      setErrors((p) => ({
        ...p,
        [key]: err.errors?.[0]?.message,
      }));
    }

    /* --------- DERIVE DOB + GENDER FROM ID --------- */
    if (key === "idNumber" && /^\d{6}/.test(normalizedValue)) {
  const year = normalizedValue.slice(0, 2);
  const month = normalizedValue.slice(2, 4);
  const day = normalizedValue.slice(4, 6);

  const currentYear = new Date().getFullYear() % 100;
  const prefix = parseInt(year, 10) <= currentYear ? "20" : "19";

  const monthNum = parseInt(month, 10);
  const dayNum = parseInt(day, 10);
  const fullYear = parseInt(`${prefix}${year}`, 10);

  // Basic range check first
  const isValidMonth = monthNum >= 1 && monthNum <= 12;
  const isValidDay = dayNum >= 1 && dayNum <= 31;

  if (isValidMonth && isValidDay) {
    // Real calendar validation
    const testDate = new Date(fullYear, monthNum - 1, dayNum);

    const isRealDate =
      testDate.getFullYear() === fullYear &&
      testDate.getMonth() === monthNum - 1 &&
      testDate.getDate() === dayNum;

    if (isRealDate) {
      setDob(
        `${fullYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
      );

      if (normalizedValue.length >= 10) {
        const genderDigits = parseInt(
          normalizedValue.slice(6, 10),
          10
        );

        setFormData((p) => ({
          ...p,
          gender: genderDigits <= 4999 ? "Female" : "Male",
        }));
      }
    } else {
      // Decline invalid calendar dates (e.g. Feb 30)
      setDob("");
      console.warn("Invalid calendar date in ID number");
    }
  } else {
    // Decline invalid month/day range
    setDob("");
    console.warn("Invalid month or day in ID number");
  }
} else if (key === "idNumber") {
  setDob("");
}
  } 

  /* ===================== SUBMIT HANDLER (FULLY FIXED) ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setMessage("");

    try {
      jobApplySchema.parse(formData);

      const data = new FormData();

      Object.entries(formData).forEach(([k, v]) => {
        if (v !== undefined && v !== null) {
          data.append(k, v);
        }
      });
    

    await api.post("/application/apply", data, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

      const uploadedFiles = [
        formData.cv?.name,
        formData.doc1?.name,
        formData.doc2?.name,
      ]
        .filter(Boolean)
        .join(", ") || "No files uploaded";

      const formattedFullName = `${formatName(
        formData.firstName
      )} ${formatName(formData.lastName)}`.trim();
      
      try {
        await sendApplicationEmail({
          email: formData.email,
          fullName: formattedFullName,
          status: "Submitted",
          files: uploadedFiles,
        });
      } catch (emailErr) {
        console.warn("Email service failed:", emailErr);
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
