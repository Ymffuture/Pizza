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

export const optionalFileSchema = z.union([
  z.null(),
  z.undefined(),
  fileSchema,  // Applies size and type refines only if a File is provided
]);

export const jobApplySchema = z.object({
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

  cv: optionalFileSchema,
  doc1: optionalFileSchema,
  doc2: optionalFileSchema,

  consent: z.literal(true, {
    errorMap: () => ({
      message: "You must accept the Terms & Privacy Policy",
    }),
  }),
})

