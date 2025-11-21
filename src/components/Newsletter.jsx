import React, { useState, useEffect } from "react";
import { Form, Input, Button } from "antd";
import emailjs from "@emailjs/browser";
import { toast, Toaster } from "react-hot-toast";

const { TextArea } = Input;

const Newsletter = () => {
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0); // seconds left
  const [form] = Form.useForm();

  // ⏳ Check cooldown on load
  useEffect(() => {
    const lastSent = localStorage.getItem("newsletter_last_sent");
    if (lastSent) {
      const diff = Math.floor((Date.now() - Number(lastSent)) / 1000);
      const remaining = 7200 - diff; // 2 hours = 7200 seconds
      if (remaining > 0) setCooldown(remaining);
    }
  }, []);

  // ⏳ Countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;

    return `${h}h : ${m}m : ${s}s`;
  };

  // 📩 Submit handler
  const handleSubmit = async (values) => {
    if (cooldown > 0) return;

    setLoading(true);
    try {
      await emailjs.send(
        "service_kw38oux",
        "template_etyg50k",
        {
          from_name: values.name,
          from_email: values.email,
          message: values.message,
        },
        "IolitXztFVvhZg6PX"
      );

      toast.success("Message sent successfully!");

      // 🧹 Clear form fields
      form.resetFields();

      // 🕒 Save cooldown timestamp
      localStorage.setItem("newsletter_last_sent", Date.now().toString());
      setCooldown(7200); // 2 hours cooldown
    } catch (error) {
      console.error(error);
      toast.error("Oops! Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="dark:bg-black py-16 transition-colors duration-300">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="max-w-2xl mx-auto px-6 lg:px-20 rounded-3xl border border-gray-300 dark:border-gray-700 py-12">
        <div className="text-center mb-8">
          <h4 className="text-blue-400 font-semibold uppercase mb-2">Newsletter</h4>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Get the Latest Updates
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Subscribe or send us a quick message. We’d love to hear from you.
          </p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-4"
        >
          {/* NAME */}
          <Form.Item
            name="name"
            label={<span className="text-gray-900 dark:text-gray-200 font-semibold text-sm">Full Name</span>}
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input
              placeholder="Your Name"
              className="border-gray-300 dark:bg-gray-900 dark:text-gray-200"
            />
          </Form.Item>

          {/* EMAIL */}
          <Form.Item
            name="email"
            label={<span className="text-gray-900 dark:text-gray-200 font-semibold text-sm">Email</span>}
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              placeholder="yourname@example.com"
              className="border-gray-300 dark:bg-gray-900 dark:text-gray-200"
            />
          </Form.Item>

          {/* MESSAGE */}
          <Form.Item
            name="message"
            label={<span className="text-gray-900 dark:text-gray-200 font-semibold text-sm">Message</span>}
            rules={[{ required: true, message: "Please enter your message" }]}
          >
            <TextArea
              rows={5}
              placeholder="Ask anything"
              className="border-gray-100 dark:bg-gray-900 dark:text-white"
            />
          </Form.Item>

          {/* BUTTON */}
          <Form.Item>
  <Button
    type="primary"
    htmlType="submit"
    disabled={cooldown > 0}
    loading={loading}
    className={`w-full !text-white text-red-600 transition-colors duration-300
      ${cooldown > 0
        ? "bg-gray-500 dark:!bg-red-600 dark:hover:!bg-red-700 cursor-not-allowed"
        : "bg-blue-300 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700"
      }`}
  >
    {cooldown > 0 ? `Wait ${formatTime(cooldown)}` : "Send Message"}
  </Button>
</Form.Item>

        </Form>
      </div>
    </section>
  );
};

export default Newsletter;
