import emailjs from "@emailjs/browser";

export const sendEmail = async ({ email, ticketId, subject, message }) => {
  try {
    await emailjs.send(
      "service_6kca9qq",
      template_id,
      {
        to_email: email,
        ticket_id: ticketId,
        subject,
        message,
      },
      "lAEXMMHEtd0LxCc51"
    );

    console.log("✅ EmailJS email sent");
  } catch (err) {
    console.error("❌ EmailJS error:", err);
  }
};
