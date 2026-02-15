import { Helmet } from "react-helmet";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiMapPin,
  FiBriefcase,
  FiPhone,
  FiCheckCircle,
} from "react-icons/fi";
import { FaExclamationTriangle } from "react-icons/fa";
import Loader from "./Loader";
import { useJobApply } from "./useJobApply";
import {
  InputField,
  FileField,
  InlineLoader,
} from "./JobApplyFields";

/* ---------------------------------------------------
   MAIN COMPONENT
--------------------------------------------------- */
export default function JobApply() {
  const {
    formRef,
    formData,
    dob,
    loading,
    message,
    errors,
    checkingId,
    checkingEmail,
    idExists,
    emailExists,
    handleChange,
    handleSubmit,
    setIdExists,
    setEmailExists,
  } = useJobApply();

  return (
    <div className="min-h-screen flex justify-center w-full dark:text-white px-4">
      <Helmet>
        <title>Apply - Math/Science or MERN</title>
      </Helmet>

      <div
        ref={formRef}
        className="w-full max-w-5xl py-10"
      >
        <h1 className="text-3xl font-semibold mb-2">
          Job / School Application (Developer / DoE)
        </h1>

        <p className="text-sm text-gray-600 dark:text-gray-300">
          This form will remain in our system for 3 months for the next application cycle.
        </p>

        {errors.global && (
          <p className="text-red-600 bg-red-100 p-3 rounded-xl text-sm mt-4">
            {errors.global}
          </p>
        )}

        {message && (
          <p className="text-green-700 bg-green-100 text-sm p-3 rounded-xl flex gap-2 mt-4">
            <FiCheckCircle size={18} />
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 pt-8">

          {/* Personal Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <InputField
              icon={<FiUser />}
              placeholder="First Name"
              tooltip="Enter your legal first name."
              value={formData.firstName}
              error={errors.firstName}
              onChange={(v) => handleChange("firstName", v)}
            />

            <InputField
              icon={<FiUser />}
              placeholder="Last Name"
              tooltip="Enter your legal surname."
              value={formData.lastName}
              error={errors.lastName}
              onChange={(v) => handleChange("lastName", v)}
            />

            <InputField
              icon={<FiCalendar />}
              placeholder="ID Number"
              tooltip="13-digit South African ID number."
              value={formData.idNumber}
              maxLength={13}
              error={errors.idNumber || (idExists && "ID already used")}
              onChange={(v) => {
                setIdExists(false);
                handleChange("idNumber", v);
              }}
            />

            <InputField
              icon={<FiCalendar />}
              placeholder="Date of Birth"
              tooltip="Auto-calculated from your ID number."
              value={dob}
              readOnly
            />

            <InputField
              icon={<FiUser />}
              placeholder="Gender"
              tooltip="Auto-detected from ID."
              value={formData.gender}
              readOnly
            />

            <InputField
              icon={<FiMail />}
              placeholder="Email Address"
              tooltip="We will send updates to this email."
              value={formData.email}
              error={errors.email || (emailExists && "Email already used")}
              onChange={(v) => {
                setEmailExists(false);
                handleChange("email", v);
              }}
            />

            <InputField
              icon={<FiPhone />}
              placeholder="Phone Number"
              tooltip="Include correct mobile number."
              value={formData.phone}
              onChange={(v) => handleChange("phone", v)}
            />

            <InputField
              icon={<FiMapPin />}
              placeholder="Location"
              tooltip="Your current residential area."
              value={formData.location}
              error={errors.location}
              onChange={(v) => handleChange("location", v)}
            />

            <InputField
              icon={<FiBriefcase />}
              placeholder="Highest Qualification"
              tooltip="Example: Matric, Diploma, Degree."
              value={formData.qualification}
              error={errors.qualification}
              onChange={(v) => handleChange("qualification", v)}
            />

            <InputField
              icon={<FiBriefcase />}
              placeholder="School or Job Application"
              tooltip="Specify whether applying for job or school."
              value={formData.experience}
              error={errors.experience}
              onChange={(v) => handleChange("experience", v)}
            />
          </div>

          {/* Documents */}
          <div className="space-y-4">
            <FileField
              label="Curriculum Vitae (Required)"
              tooltip="Upload PDF or DOC format."
              error={errors.cv}
              onChange={(f) => handleChange("cv", f)}
            />

            <FileField
              label="Matric Certificate / School Report"
              tooltip="Latest academic document."
              error={errors.doc1}
              onChange={(f) => handleChange("doc1", f)}
            />

            <FileField
              label="Certified ID Copy"
              tooltip="Certified within last 3 months."
              error={errors.doc2}
              onChange={(f) => handleChange("doc2", f)}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !formData.consent}
            className={`w-full h-12 rounded-2xl font-medium transition flex items-center justify-center
              ${loading || !formData.consent
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black dark:bg-white text-white dark:text-black"}
            `}
          >
            {loading ? <Loader /> : "Submit Application"}
          </button>

        </form>
      </div>
    </div>
  );
}
