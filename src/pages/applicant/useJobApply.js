import { useState, useRef, useEffect } from "react";
import { api } from "../../api";
import { z } from "zod";
import {
  jobApplySchema,
  isValidSouthAfricanID,
  useDebounce,
} from "./jobApply.utils";
import { sendApplicationEmail } from "./emailService";

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
  }, [debouncedId]);

  /* ---------------- EMAIL CHECK ---------------- */
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

  /* ---------------- CHANGE HANDLER ---------------- */
  const handleChange = (key, value) => {
    setFormData((p) => ({ ...p, [key]: value }));
    setMessage("");

    try {
      jobApplySchema.pick({ [key]: true }).parse({ [key]: value });
      setErrors((p) => ({ ...p, [key]: undefined }));
    } catch (err) {
      setErrors((p) => ({
        ...p,
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
        if (v) data.append(k, v);
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

      try {
        await sendApplicationEmail({
          email: formData.email,
          fullName: `${formData.firstName} ${formData.lastName}`,
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
