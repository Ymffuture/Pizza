import { useState, useRef } from "react";
import { api } from "../../api";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";

export default function JobApply() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [dob, setDob] = useState("");
  const formRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData(e.target);

      const idNumber = formData.get("idNumber") || "";
      if (idNumber.length !== 13) {
        setError("ID Number must be exactly 13 digits");
        formRef.current.scrollIntoView({ behavior: "smooth" });
        setLoading(false);
        return;
      }

      await api.post("/application/apply", formData);
      setMessage("Application submitted successfully");
      e.target.reset();
      setDob("");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      formRef.current.scrollIntoView({ behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  const handleIdChange = (e) => {
    const val = e.target.value;
    if (/^\d{0,13}$/.test(val)) {
      // extract DOB from first 6 digits YYMMDD
      if (val.length >= 6) {
        const year = val.slice(0, 2);
        const month = val.slice(2, 4);
        const day = val.slice(4, 6);
        setDob(`19${year}-${month}-${day}`); // simple assumption: 1900s
      } else {
        setDob("");
      }
    }
  };

  return (
   <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center py-10 px-4 transition-colors duration-300">
  <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6 transition-colors duration-300">
    
      <div
        ref={formRef}
        className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-8 space-y-6"
      >
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Job Application
          </h1>
          <p className="text-gray-500 mt-1">
            Please fill in your details carefully
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-2xl p-3 mb-4">
            <FiAlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Success */}
        {message && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 rounded-2xl p-3 mb-4">
            <FiCheckCircle className="w-5 h-5" />
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="firstName" label="First Name" required />
              <Input name="lastName" label="Last Name" required />
              <Input
                name="idNumber"
                label="ID Number"
                required
                maxLength={13}
                onChange={handleIdChange}
              />
              <Input label="Date of Birth" value={dob} readOnly />
              <Select name="gender" label="Gender" options={["Male", "Female", "Other"]} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Input name="email" label="Email Address" type="email" required />
              <Input name="location" label="Location (City, Country)" />
            </div>
          </section>

          {/* Professional Info */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Professional Background
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="qualification" label="Highest Qualification" />
              <Input name="experience" label="Years of Experience" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Input name="currentRole" label="Current Role / Position" />
              <Input name="portfolio" label="Portfolio / LinkedIn URL" />
            </div>
          </section>

          {/* Documents */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
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
            className="w-full py-3 rounded-2xl text-white font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? "Submitting…" : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------- Reusable Components ---------- */
function Input(props) {
  const { label, ...rest } = props; // destructure inside the function
  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-500 mb-1">{label}</label>
      <input
        {...rest}
        className="h-11 rounded-2xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300"
      />
    </div>
  );
}

function Select(props) {
  const { label, options, ...rest } = props;
  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-500 mb-1">{label}</label>
      <select
        {...rest}
        className="h-11 rounded-2xl px-4 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors duration-300"
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

function FileInput(props) {
  const { label, ...rest } = props;
  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-500 mb-1">{label}</label>
      <input
        type="file"
        {...rest}
        className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 dark:file:bg-gray-700 dark:file:text-gray-100 dark:hover:file:bg-gray-600 transition-colors duration-300"
      />
    </div>
  );
}

