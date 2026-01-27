import { useState } from "react";
import {api} from "../../api";

export default function JobApply() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData(e.target);
      await api.post("/apply", formData);
      setMessage("Application submitted successfully");
      e.target.reset();
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex justify-center py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Job Application
          </h1>
          <p className="text-gray-500 mt-1">
            Please fill in your details carefully
          </p>
        </div>

        {message && (
          <div className="mb-6 text-sm text-center text-gray-700">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Personal Information */}
          <section>
            <h2 className="text-lg font-medium mb-4">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="firstName" label="First Name" required />
              <Input name="lastName" label="Last Name" required />
              <Input name="idNumber" label="ID Number" required />
              <Select name="gender" label="Gender" options={["Male", "Female", "Other"]} />
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="email" label="Email Address" type="email" required />
              <Input name="location" label="Location (City, Country)" />
            </div>
          </section>

          {/* Professional Information */}
          <section>
            <h2 className="text-lg font-medium mb-4">
              Professional Background
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="qualification" label="Highest Qualification" />
              <Input name="experience" label="Years of Experience" />
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="currentRole" label="Current Role / Position" />
              <Input name="portfolio" label="Portfolio / LinkedIn URL" />
            </div>
          </section>

          {/* Documents */}
          <section>
            <h2 className="text-lg font-medium mb-4">
              Documents
            </h2>

            <FileInput name="cv" label="Curriculum Vitae (Required)" required />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <FileInput
                  key={n}
                  name={`doc${n}`}
                  label={`Supporting Document ${n}`}
                />
              ))}
            </div>
          </section>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl text-sm font-medium transition hover:bg-gray-900 disabled:opacity-50"
          >
            {loading ? "Submitting…" : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------- Reusable Components ---------- */

function Input({ label, ...props }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-600 mb-1">
        {label}
      </label>
      <input
        {...props}
        className="h-11 rounded-xl border border-gray-300 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
      />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-600 mb-1">
        {label}
      </label>
      <select
        {...props}
        className="h-11 rounded-xl border border-gray-300 px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function FileInput({ label, ...props }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-600 mb-1">
        {label}
      </label>
      <input
        type="file"
        {...props}
        className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
      />
    </div>
  );
}
