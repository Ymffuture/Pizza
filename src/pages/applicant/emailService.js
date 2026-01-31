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
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    {
      to_email: email,
      full_name: fullName,
      status,
      files,
    },
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  );
};
