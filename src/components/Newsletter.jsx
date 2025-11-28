import React, { useState, useEffect } from "react";
import { Form, Input, Button } from "antd";
import emailjs from "@emailjs/browser";
import { toast} from "react-hot-toast";

const { TextArea } = Input;

const Newsletter = () => {
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [form] = Form.useForm();

  useEffect(() => {
    const lastSent = localStorage.getItem("newsletter_last_sent");
    if (lastSent) {
      const diff = Math.floor((Date.now() - Number(lastSent)) / 1000);
      const remaining = 7200 - diff;
      if (remaining > 0) setCooldown(remaining);
    }
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h}h : ${m}m : ${s}s`;
  };

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
      form.resetFields();
      localStorage.setItem("newsletter_last_sent", Date.now().toString());
      setCooldown(7200);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="dark:bg-black bg-[#f5f5f7] py-24 transition-all duration-500">

      

      <div
        className="
          max-w-3xl mx-auto px-8 py-16 rounded-[32px]
          backdrop-blur-xl bg-white/70 dark:bg-white/5 
          border border-white/40 dark:border-white/10 
          shadow-[0_8px_32px_rgba(0,0,0,0.1)]
          transition-all duration-500
        "
      >
        {/* HEADER */}
        <div className="text-center mb-12">
          <h4 className="text-blue-500 font-semibold tracking-wide uppercase mb-3">
            Newsletter
          </h4>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            Stay Inspired.
          </h2>

          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-xl mx-auto">
            Get updates, insights, and helpful resources — straight to your inbox.
          </p>
        </div>

        {/* FORM */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-6"
        >
          {/* NAME */}
          <Form.Item
            name="name"
            label={
              <span className="text-gray-900 dark:text-gray-200 font-medium">
                Full Name
              </span>
            }
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input
              placeholder="John Appleseed"
              className="
                h-12 rounded-2xl px-4 text-gray-800 dark:text-gray-100
                bg-white/70 dark:bg-white/5
                border border-gray-200 dark:border-gray-700
                focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20
                transition-all duration-300
              "
            />
          </Form.Item>

          {/* EMAIL */}
          <Form.Item
            name="email"
            label={
              <span className="text-gray-900 dark:text-gray-200 font-medium">
                Email Address
              </span>
            }
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input
              placeholder="you@example.com"
              className="
                h-12 rounded-2xl px-4 text-gray-800 dark:text-gray-100
                bg-white/70 dark:bg-white/5
                border border-gray-200 dark:border-gray-700
                focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20
                transition-all duration-300
              "
            />
          </Form.Item>

          {/* MESSAGE */}
          <Form.Item
            name="message"
            label={
              <span className="text-gray-900 dark:text-gray-200 font-medium">
                Message
              </span>
            }
            rules={[{ required: true, message: "Please write your message" }]}
          >
            <TextArea
              rows={5}
              placeholder="Write something..."
              className="
                rounded-2xl p-4 text-gray-800 dark:text-gray-100
                bg-white/70 dark:bg-white/5
                border border-gray-200 dark:border-gray-700
                focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20
                transition-all duration-300
              "
            />
          </Form.Item>

          {/* BUTTON */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={cooldown > 0}
              loading={loading}
              className={`
                w-full h-12 text-lg font-semibold rounded-2xl transition-all duration-300
                ${
                  cooldown > 0
                    ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                }
              `}
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
