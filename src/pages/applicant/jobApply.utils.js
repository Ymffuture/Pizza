import { useState, useEffect } from "react";
import { z } from "zod";

/* ---------------------------------------------------
   FILE CONSTRAINTS
--------------------------------------------------- */
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

/* ---------------------------------------------------
   SOUTH AFRICAN ID VALIDATION
--------------------------------------------------- */
export function isValidSouthAfricanID(id) {
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
   DEBOUNCE HOOK
--------------------------------------------------- */
export function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
      }

/* ---------------------------------------------------
   ZOD SCHEMA
--------------------------------------------------- */
export const fileSchema = z
  .instanceof(File, { message: "File is required" })
  .refine((file) => file.size <= MAX_FILE_SIZE, "File must be under 5MB")
  .refine(
    (file) => ACCEPTED_FILE_TYPES.includes(file.type),
    "Only PDF or Word documents are allowed"
  );

export const jobApplySchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    idNumber: z.string().length(13, "ID must be 13 digits"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(10, "Phone required"),
    location: z.string().min(3, "Location required"),
    qualification: z.string().min(2, "Qualification required"),
    experience: z.string().min(1, "Experience required"),
    currentRole: z.string().min(2, "Current role required"),
    portfolio: z.string().optional(),
    gender: z.string().optional(),
    consent: z.literal(true, {
      errorMap: () => ({ message: "You must consent" }),
    }),

    // FILES → individually optional
    cv: z.instanceof(File).nullable().optional(),
    doc1: z.instanceof(File).nullable().optional(),
    doc2: z.instanceof(File).nullable().optional(),
  })
  // 🔥 KEY PART: “at least one file”
  .refine(
    (data) => Boolean(data.cv || data.doc1 || data.doc2),
    {
      message: "Please upload at least one document (CV or other)",
      path: ["cv"], // shows error under CV field in UI
    }
  );
