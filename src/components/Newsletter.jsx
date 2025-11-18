import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import emailjs from "@emailjs/browser";
import { toast, Toaster } from "react-hot-toast";

const Newsletter = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await emailjs.send(
        "YOUR_SERVICE_ID", // replace with your EmailJS service ID
        "YOUR_TEMPLATE_ID", // replace with your EmailJS template ID
        {
          from_name: values.name,
          from_email: values.email,
        },
        "YOUR_PUBLIC_KEY" // replace with your EmailJS public key
      );
      toast.success("Thank you! You are now subscribed.");
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
          <h4 className="text-blue-400 font-semibold uppercase mb-2">
            Newsletter
          </h4>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Get the Latest Updates
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Subscribe to our newsletter to receive updates, offers, and news directly to your inbox.
          </p>
        </div>

        <Form layout="vertical" onFinish={handleSubmit} className="space-y-4">
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input
              placeholder="Your Name"
              className="border-gray-300 focus:border-blue-400 focus:ring-blue-400"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              placeholder="you@example.com"
              className="border-gray-300 focus:border-blue-400 focus:ring-blue-400"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-400 hover:bg-blue-500 w-full"
              loading={loading}
            >
              Subscribe
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default Newsletter;
