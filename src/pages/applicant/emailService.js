import emailjs from "@emailjs/browser";

/**
 * Sends application confirmation email
 * Only metadata is sent (NO FILE CONTENT)
 */
export const sendApplicationEmail = async ({
  email,
  fullName,
  status,
  files,
}) => {
  return emailjs.send(
    "service_uvaemme" ,
  "template_ar2ifvk",
    {
      to_email: email,
      full_name: fullName,
      status,
      files,
    },
    "ABXXnQjrAV_Ej9gLn" 
  );
};
