import emailjs from "@emailjs/browser";

export const sendEmail = async ({ email, ticketId, subject, message, template_id, service_id, publicKey}) => {
  try {
    await emailjs.send(
      service_id,
      template_id,
      {
        to_email: email,
        ticket_id: ticketId,
        subject,
        message,
      },
      publicKey
      
    );

    console.log("✅ EmailJS email sent");
  } catch (err) {
    console.error("❌ EmailJS error:", err);
  }
};
