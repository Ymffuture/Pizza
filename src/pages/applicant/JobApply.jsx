import { useState, useRef } from "react";
import { api } from "../../api";
import { FiUser, FiMail, FiCalendar, FiMapPin, FiBriefcase } from "react-icons/fi";

export default function JobApply() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [dob, setDob] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    email: "",
    location: "",
    gender: "",
    qualification: "",
    experience: "",
    currentRole: "",
    portfolio: "",
  });
  const formRef = useRef();

  const handleChange = (key, value) => {
  setFormData((prev) => ({ ...prev, [key]: value }));

  if (key !== "idNumber") return;

  if (!/^\d{0,13}$/.test(value)) return;

  if (value.length < 6) {
    setDob("");
    setError("");
    return;
  }

  const year = value.slice(0, 2);
  const month = value.slice(2, 4);
  const day = value.slice(4, 6);

  const yearPrefix = year[0] === "0" ? "20" : "19";
  const fullYear = yearPrefix + year;

  const monthNum = Number(month);
  const dayNum = Number(day);

  const isValidDate =
    monthNum >= 1 &&
    monthNum <= 12 &&
    dayNum >= 1 &&
    dayNum <= 31;

  if (!isValidDate) {
    setDob("");
    setError("Invalid ID number, please check your ID number.");
    return;
  }

  setError("");
  setDob(`${fullYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`);
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (formData.idNumber.length !== 13) {
      setError("ID Number must be exactly 13 digits");
      formRef.current.scrollIntoView({ behavior: "smooth" });
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      await api.post("/application/apply", data);
      setMessage("Application submitted successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        idNumber: "",
        email: "",
        location: "",
        gender: "",
        qualification: "",
        experience: "",
        currentRole: "",
        portfolio: "",
      });
      setDob("");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      formRef.current.scrollIntoView({ behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center py-10 px-4 transition-colors duration-300">
      <div
        ref={formRef}
        className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6 transition-colors duration-300"
      >
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Job Application</h1>
        <p className="text-gray-500 dark:text-gray-300">Please fill in your details carefully</p>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900 dark:text-red-400 rounded-2xl p-3">
            <FiUser />
            <span>{error}</span>
          </div>
        )}
        {message && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900 dark:text-green-400 rounded-2xl p-3">
            <FiCheckCircle />
            <span>{message}</span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div className="space-y-4">
            <InputField
              icon={<FiUser />}
              placeholder="First Name"
              value={formData.firstName}
              onChange={(v) => handleChange("firstName", v)}
            />
            <InputField
              icon={<FiUser />}
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(v) => handleChange("lastName", v)}
            />
            <InputField
              icon={<FiCalendar />}
              placeholder="ID Number"
              value={formData.idNumber}
              onChange={(v) => handleChange("idNumber", v)}
            />
            <InputField
              icon={<FiCalendar />}
              placeholder="Date of Birth"
              value={dob}
              onChange={() => {}}
              type="text"
            />
            <InputField
              icon={<FiMail />}
              placeholder="Email Address"
              value={formData.email}
              onChange={(v) => handleChange("email", v)}
              type="email"
            />
            <InputField
              icon={<FiMapPin />}
              placeholder="Location (City, Country)"
              value={formData.location}
              onChange={(v) => handleChange("location", v)}
            />
          </div>

          {/* Professional Info */}
          <div className="space-y-4">
            <InputField
              icon={<FiBriefcase />}
              placeholder="Highest Qualification"
              value={formData.qualification}
              onChange={(v) => handleChange("qualification", v)}
            />
            <InputField
              icon={<FiBriefcase />}
              placeholder="Years of Experience"
              value={formData.experience}
              onChange={(v) => handleChange("experience", v)}
            />
            <InputField
              icon={<FiBriefcase />}
              placeholder="Current Role / Position"
              value={formData.currentRole}
              onChange={(v) => handleChange("currentRole", v)}
            />
            <InputField
              icon={<FiBriefcase />}
              placeholder="Portfolio / LinkedIn URL"
              value={formData.portfolio}
              onChange={(v) => handleChange("portfolio", v)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-2xl bg-black dark:bg-gray-100 text-white dark:text-gray-900 font-medium hover:opacity-90 transition"
          >
            {loading ? "Submitting…" : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------- Reusable Components ---------- */
function InputField({ icon, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl px-3 h-11 bg-gray-50 dark:bg-gray-700 transition-colors duration-300">
      {icon && <span className="text-gray-400 dark:text-gray-300">{icon}</span>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-gray-100"
      />
    </div>
  );
}
