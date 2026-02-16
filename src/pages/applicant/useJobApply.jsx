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
        } else {
          setErrors((p) => ({ ...p, idNumber: undefined }));
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
        } else {
          setErrors((p) => ({ ...p, email: undefined }));
        }
      } catch (err) {
        console.error("Email check failed:", err);
      } finally {
        setCheckingEmail(false);
      }
    };

    checkEmail();
  }, [debouncedEmail]);

  /* ===================== CHANGE HANDLER ===================== */
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

    // Update form data
    setFormData((prev) => ({ ...prev, [key]: normalizedValue }));
    setMessage("");

    // Real-time field validation
    try {
      jobApplySchema.pick({ [key]: true }).parse({
        [key]: normalizedValue,
      });
      setErrors((p) => ({ ...p, [key]: undefined }));
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors((p) => ({
          ...p,
          [key]: err.errors?.[0]?.message,
        }));
      }
    }

    /* --------- DERIVE DOB + GENDER FROM ID --------- */
    if (key === "idNumber") {
      if (/^\d{6}/.test(normalizedValue)) {
        const year = normalizedValue.slice(0, 2);
        const month = normalizedValue.slice(2, 4);
        const day = normalizedValue.slice(4, 6);

        const currentYear = new Date().getFullYear() % 100;
        const prefix = parseInt(year, 10) <= currentYear ? "20" : "19";

        const monthNum = parseInt(month, 10);
        const dayNum = parseInt(day, 10);
        const fullYear = parseInt(`${prefix}${year}`, 10);

        const isValidMonth = monthNum >= 1 && monthNum <= 12;
        const isValidDay = dayNum >= 1 && dayNum <= 31;

        if (isValidMonth && isValidDay) {
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
            return; // Exit early
          }
        }
      }

      // Invalid or incomplete ID → clear DOB
      setDob("");
    }
  };

  /* ===================== SUBMIT HANDLER (FIXED) ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setMessage("");

    try {
      // 1. Full schema validation
      jobApplySchema.parse(formData);

      // 2. Official ID verification (moved BEFORE submission)
      const verification = await api.post("/verify-id", {
        idNumber: formData.idNumber,
      });

      if (!verification.data.valid) {
        setErrors({ idNumber: "ID failed official verification" });
        return; // Stop here
      }

      // 3. Prepare FormData
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== undefined && v !== null) {
          data.append(k, v);
        }
      });

      // 4. Submit application
      await api.post("/application/apply", data);

      // 5. Prepare email data
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

      // 6. Send confirmation email
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

      // 7. Success
      setMessage("Application submitted successfully!");

      // 8. Reset form
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
        console.error("Submit error:", err);
        setErrors({ global: "Application failed. Please try again." }, err);
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
