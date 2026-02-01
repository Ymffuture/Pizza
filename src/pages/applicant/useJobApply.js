import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "../../api";
import { z } from "zod";
import {
  jobApplySchema,
  isValidSouthAfricanID,
  useDebounce,
} from "./jobApply.utils";
import { sendApplicationEmail } from "./emailService";

/* ============ NORMALIZERS ============ */
const normalizeIdNumber = (value = "") =>
  value.replace(/\s+/g, "").replace(/[^0-9]/g, "");

const normalizeEmail = (email = "") =>
  email.trim().toLowerCase().replace(/\s+/g, "");

/* ============ NAME FORMATTER ============ */
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

/* ============ REACT QUERY FETCHERS ============ */
const checkIdExists = async (idNumber) => {
  const res = await api.get("/application/exists", {
    params: { idNumber },
  });
  return res.data.exists;
};

const checkEmailExists = async (email) => {
  const res = await api.get("/application/exists", {
    params: { email },
  });
  return res.data.exists;
};

const submitApplication = async (formData) => {
  const data = new FormData();

  Object.entries(formData).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
      data.append(k, v);
    }
  });

  return api.post("/application/apply", data);
};

/* ============ MAIN HOOK ============ */
export function useJobApply() {
  const formRef = useRef(null);
  const { formatName } = useNameFormatter();

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [dob, setDob] = useState("");

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

  /* ============ REACT QUERY: ID CHECK ============ */
  const {
    data: idExists = false,
    isFetching: checkingId,
  } = useQuery({
    queryKey: ["check-id", debouncedId],
    queryFn: () => checkIdExists(debouncedId),
    enabled:
      debouncedId.length === 13 &&
      isValidSouthAfricanID(debouncedId),
  });

  /* ============ REACT QUERY: EMAIL CHECK ============ */
  const {
    data: emailExists = false,
    isFetching: checkingEmail,
  } = useQuery({
    queryKey: ["check-email", debouncedEmail],
    queryFn: () => checkEmailExists(debouncedEmail),
    enabled: z.string().email().safeParse(debouncedEmail).success,
  });

  /* ============ MUTATION: SUBMIT APPLICATION ============ */
  const {
    mutateAsync: submit,
    isLoading: loading,
  } = useMutation({
    mutationFn: submitApplication,
    onSuccess: async (_, variables) => {
      const uploadedFiles = [
        variables.cv?.name,
        variables.doc1?.name,
        variables.doc2?.name,
      ]
        .filter(Boolean)
        .join(", ") || "No files uploaded";

      const formattedFullName = `${formatName(
        variables.firstName
      )} ${formatName(variables.lastName)}`.trim();

      try {
        await sendApplicationEmail({
          email: variables.email,
          fullName: formattedFullName,
          status: "Submitted",
          files: uploadedFiles,
        });
      } catch (err) {
        console.warn("Email failed:", err);
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
    },
    onError: (err) => {
      setErrors({ global: "Application failed. Try again." });
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    },
  });

  /* ============ CHANGE HANDLER ============ */
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

    /* DERIVE DOB + GENDER FROM ID */
    if (key === "idNumber" && /^\d{6}/.test(normalizedValue)) {
      const year = normalizedValue.slice(0, 2);
      const month = normalizedValue.slice(2, 4);
      const day = normalizedValue.slice(4, 6);

      const prefix =
        parseInt(year, 10) <= new Date().getFullYear() % 100
          ? "20"
          : "19";

      setDob(`${prefix}${year}-${month}-${day}`);

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
    } else if (key === "idNumber") {
      setDob("");
    }
  };

  /* ============ SUBMIT HANDLER ============ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    try {
      jobApplySchema.parse(formData);
      await submit(formData);
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
  };
}
