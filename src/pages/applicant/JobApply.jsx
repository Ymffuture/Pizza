import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiMapPin,
  FiBriefcase,
  FiPhone,
  FiCheckCircle,
  FiXCircle,
  FiUpload,
  FiFileText,
  FiShield,
  FiInfo,
  FiChevronRight,
  FiLock,
} from "react-icons/fi";
import Loader2 from "./Loader2";
import { FaExclamationTriangle } from 'react-icons/fa';
import Loader from "./Loader";
import {
  jobApplySchema,
  isValidSouthAfricanID,
  useDebounce,
} from "./jobApply.utils";
import { useJobApply } from "./useJobApply";

/* ============================================
   SMART UI COMPONENTS
============================================ */

const ProgressBar = ({ current, total }) => (
  <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 z-50">
    <motion.div
      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
      initial={{ width: 0 }}
      animate={{ width: `${(current / total) * 100}%` }}
      transition={{ duration: 0.5 }}
    />
  </div>
);

const SectionHeader = ({ number, title, description, isActive, isComplete }) => (
  <motion.div 
    className={`mb-6 p-4 rounded-2xl border-2 transition-all duration-300 ${
      isActive 
        ? "border-blue-500/30 bg-blue-50/50 dark:bg-blue-900/20" 
        : isComplete 
        ? "border-green-500/30 bg-green-50/30 dark:bg-green-900/10"
        : "border-transparent bg-gray-50 dark:bg-gray-800/30"
    }`}
    layout
  >
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
        isComplete 
          ? "bg-green-500 text-white" 
          : isActive 
          ? "bg-blue-500 text-white"
          : "bg-gray-200 dark:bg-gray-700 text-gray-500"
      }`}>
        {isComplete ? <FiCheckCircle size={20} /> : number}
      </div>
      <div className="flex-1">
        <h3 className={`font-semibold ${isActive ? "text-blue-900 dark:text-blue-100" : "text-gray-900 dark:text-gray-100"}`}>
          {title}
        </h3>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        )}
      </div>
      {isComplete && <FiCheckCircle className="text-green-500" size={24} />}
    </div>
  </motion.div>
);

const SmartInput = ({ 
  icon: Icon, 
  label, 
  value, 
  error, 
  onChange, 
  tooltip, 
  isValid, 
  isChecking,
  helperText,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
        {tooltip && (
          <button
            type="button"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setShowTooltip(!showTooltip)}
            className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 hover:bg-blue-500 hover:text-white transition-colors"
          >
            <FiInfo size={12} />
          </button>
        )}
      </label>

      <AnimatePresence>
        {showTooltip && tooltip && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute z-20 left-0 right-0 -top-2 transform -translate-y-full mb-2 p-3 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg shadow-xl"
          >
            <div className="relative">
              {tooltip}
              <div className="absolute bottom-0 left-6 transform translate-y-full -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-800" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`relative flex items-center transition-all duration-300 ${
        isFocused ? "transform scale-[1.02]" : ""
      }`}>
        <div className={`absolute left-4 transition-colors duration-300 ${
          isFocused ? "text-blue-500" : "text-gray-400"
        }`}>
          <Icon size={20} />
        </div>

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full pl-12 pr-10 py-4 rounded-2xl border-2 outline-none transition-all duration-300 bg-white dark:bg-gray-800 ${
            error 
              ? "border-red-300 focus:border-red-500 bg-red-50/30 dark:bg-red-900/10" 
              : isValid 
              ? "border-green-300 focus:border-green-500 bg-green-50/30 dark:bg-green-900/10"
              : "border-gray-200 dark:border-gray-700 focus:border-blue-500"
          } ${props.readOnly ? "bg-gray-100 dark:bg-gray-900 cursor-not-allowed" : ""}`}
          {...props}
        />

        <div className="absolute right-4">
          {isChecking ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader size={16} />
            </motion.div>
          ) : isValid ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-green-500"
            >
              <FiCheckCircle size={20} />
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-red-500"
            >
              <FiXCircle size={20} />
            </motion.div>
          ) : null}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {error ? (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 text-sm text-red-600 flex items-center gap-2"
          >
            <FaExclamationTriangle size={14} />
            {error}
          </motion.p>
        ) : helperText ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 text-sm text-gray-500 dark:text-gray-400"
          >
            {helperText}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
};

const FileUploadZone = ({ label, tooltip, error, onChange, accept = ".pdf,.doc,.docx" }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileName, setFileName] = useState(null);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      onChange(file);
    }
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onChange(file);
    }
  };

  return (
    <motion.div
      className={`relative p-6 rounded-2xl border-2 border-dashed transition-all duration-300 dark:text-white ${
        isDragOver 
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]" 
          : fileName 
          ? "border-green-500 bg-green-50 dark:bg-green-900/10"
          : "border-gray-300 dark:border-gray-700 hover:border-gray-400"
      } ${error ? "border-red-300 bg-red-50/30" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      whileHover={{ scale: 1.01 }}
    >
      <input
        ref={inputRef}
        type="file"
        onChange={handleChange}
        accept={accept}
        className="hidden"
      />

      <div className="flex flex-col items-center text-center">
        {fileName ? (
          <>
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
              <FiFileText className="text-green-600" size={24} />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{fileName}</p>
            <button
              type="button"
              onClick={() => { setFileName(null); onChange(null); }}
              className="mt-2 text-xs text-red-500 hover:text-red-600"
            >
              Remove file
            </button>
          </>
        ) : (
          <>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
              isDragOver ? "bg-blue-100 dark:bg-blue-900/30" : "bg-gray-100 dark:bg-gray-800"
            }`}>
              <FiUpload className={isDragOver ? "text-blue-600" : "text-gray-400"} size={24} />
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Drop file here or <span className="text-blue-600 underline cursor-pointer" onClick={() => inputRef.current?.click()}>browse</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">{tooltip}</p>
          </>
        )}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -bottom-8 left-0 text-xs text-red-600 flex items-center gap-1"
        >
          <FaExclamationTriangle size={12} />
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

const ConsentBox = ({ checked, onChange, error }) => (
  <motion.div 
    className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
      checked 
        ? "border-green-500/30 bg-green-50/30 dark:bg-green-900/10" 
        : "border-gray-200 dark:border-gray-700"
    } ${error ? "border-red-300 bg-red-50/30" : ""}`}
    whileHover={{ scale: 1.01 }}
  >
    <label className="flex items-start gap-4 cursor-pointer">
      <div className="relative flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center ${
          checked 
            ? "bg-green-500 border-green-500" 
            : "border-gray-300 dark:border-gray-600 peer-hover:border-gray-400"
        }`}>
          {checked && <FiCheckCircle className="text-white" size={16} />}
        </div>
      </div>
      
      <div className="flex-1 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        <span className="font-medium text-gray-900 dark:text-gray-100">I agree to the processing of my personal information</span> in accordance with the{" "}
        <a href="/terms" target="_blank" className="text-blue-600 hover:underline font-medium">Terms & Conditions</a> and{" "}
        <a href="/policy" target="_blank" className="text-blue-600 hover:underline font-medium">Privacy Policy</a>. 
        I understand this application will be stored for 3 months.
      </div>
    </label>
    
    {error && (
      <motion.p
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        className="mt-3 text-sm text-red-600 flex items-center gap-2"
      >
        <FaExclamationTriangle size={14} />
        {error}
      </motion.p>
    )}
  </motion.div>
);

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
    handlePhoneChange,
  } = useJobApply();

  const [activeSection, setActiveSection] = useState(1);

  // Calculate completion status
  const sections = [
    {
      id: 1,
      title: "Personal Information",
      description: "Basic details and identification",
      fields: ["firstName", "lastName", "idNumber", "dob", "gender"],
      isComplete: formData.firstName && formData.lastName && formData.idNumber.length === 13 && !idExists && !errors.idNumber,
    },
    {
      id: 2,
      title: "Contact Details",
      description: "How we'll reach you",
      fields: ["email", "phone", "location"],
      isComplete: formData.email && !emailExists && !errors.email && formData.phone && formData.location,
    },
    {
      id: 3,
      title: "Qualifications & Experience",
      description: "Your background and skills",
      fields: ["qualification", "experience"],
      isComplete: formData.qualification && formData.experience,
    },
    {
      id: 4,
      title: "Documents",
      description: "Required documentation",
      fields: ["cv", "doc1", "doc2"],
      isComplete: formData.cv && formData.doc1 && formData.doc2,
    },
  ];

  const completedSections = sections.filter(s => s.isComplete).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-950 dark:to-blue-950/20 pb-20 dark:text-white">
      <Helmet>
        <title>Apply - Developer / Education Position</title>
      </Helmet>

      <ProgressBar current={completedSections} total={sections.length} />

      {loading && <Loader2 fullScreen />}

      <div className="max-w-3xl mx-auto px-4 pt-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 pt-28"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
            <FiBriefcase size={16} />
            <span>SwiftMeta Careers</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Application Form
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
            Join our team as a Developer or Education Specialist. Complete all sections to submit your application.
          </p>
        </motion.div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div 
            className="p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center gap-3 text-amber-600 mb-2">
              <FiCalendar size={20} />
              <span className="font-semibold text-sm">Duration</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Applications stored for 3 months for next cycle</p>
          </motion.div>

          <motion.div 
            className="p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center gap-3 text-blue-600 mb-2">
              <FiShield size={20} />
              <span className="font-semibold text-sm">Agreement</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">This form acts as a binding agreement</p>
          </motion.div>

          <motion.div 
            className="p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center gap-3 text-green-600 mb-2">
              <FiLock size={20} />
              <span className="font-semibold text-sm">Security</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">POPIA compliant data processing</p>
          </motion.div>
        </div>

        {/* Global Messages */}
        <AnimatePresence>
          {errors.global && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3"
            >
              <FiXCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-800 dark:text-red-200 text-sm">{errors.global}</p>
            </motion.div>
          )}

          {message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-start gap-3"
            >
              <FiCheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-green-800 dark:text-green-200 text-sm">{message}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Personal Info */}
          <SectionHeader 
            number={1} 
            title="Personal Information" 
            description="Enter your legal name and South African ID"
            isActive={activeSection === 1}
            isComplete={sections[0].isComplete}
          />
          
          <div className="space-y-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700 ml-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SmartInput
                icon={FiUser}
                label="First Name"
                placeholder="John"
                value={formData.firstName}
                error={errors.firstName}
                onChange={(v) => handleChange("firstName", v)}
                isValid={formData.firstName && !errors.firstName}
              />
              <SmartInput
                icon={FiUser}
                label="Last Name"
                placeholder="Doe"
                value={formData.lastName}
                error={errors.lastName}
                onChange={(v) => handleChange("lastName", v)}
                isValid={formData.lastName && !errors.lastName}
              />
            </div>

            <SmartInput
              icon={FiCalendar}
              label="ID Number"
              placeholder="YYMMDDSSSSCAZ"
              value={formData.idNumber}
              tooltip="13-digit South African ID. Format: YYMMDDSSSSCAZ"
              error={errors.idNumber || (idExists ? "This ID is already registered" : null)}
              onChange={(v) => {
                setIdExists(false);
                handleChange("idNumber", v);
              }}
              isChecking={checkingId}
              isValid={formData.idNumber.length === 13 && !checkingId && !idExists && !errors.idNumber}
              helperText={!checkingId && formData.idNumber.length === 13 && !errors.idNumber && !idExists ? "✓ Valid South African ID format" : null}
              maxLength={13}
              inputMode="numeric"
            />

            <div className="grid grid-cols-2 gap-4">
              <SmartInput
                icon={FiCalendar}
                label="Date of Birth"
                value={dob}
                readOnly
                helperText="Auto-calculated from ID"
              />
              <SmartInput
                icon={FiUser}
                label="Gender"
                value={formData.gender}
                readOnly
                helperText="Auto-detected from ID"
              />
            </div>
          </div>

          {/* Section 2: Contact */}
          <SectionHeader 
            number={2} 
            title="Contact Details" 
            description="How we'll communicate with you"
            isActive={activeSection === 2}
            isComplete={sections[1].isComplete}
          />

          <div className="space-y-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700 ml-5">
            <SmartInput
              icon={FiMail}
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              tooltip="We'll send confirmation and status updates here"
              error={errors.email || (emailExists ? "Email already registered" : null)}
              onChange={(v) => {
                setEmailExists(false);
                handleChange("email", v);
              }}
              isChecking={checkingEmail}
              isValid={formData.email && !checkingEmail && !emailExists && !errors.email}
              helperText={formData.email && !errors.email && !emailExists && !checkingEmail ? "✓ Email format valid" : null}
            />

            <SmartInput
              icon={FiPhone}
              label="Phone Number"
              placeholder="082 123 4567"
              value={formData.phone}
              onChange={handlePhoneChange}
              error={errors.phone}
              isValid={formData.phone?.length === 10}
              helperText="10-digit South African mobile number"
              maxLength={10}
              inputMode="tel"
            />

            <SmartInput
              icon={FiMapPin}
              label="Location"
              placeholder="City, Province"
              value={formData.location}
              error={errors.location}
              onChange={(v) => handleChange("location", v)}
              isValid={formData.location && !errors.location}
            />
          </div>

          {/* Section 3: Qualifications */}
          <SectionHeader 
            number={3} 
            title="Qualifications & Experience" 
            description="Your educational and professional background"
            isActive={activeSection === 3}
            isComplete={sections[2].isComplete}
          />

          <div className="space-y-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700 ml-5">
            <SmartInput
              icon={FiBriefcase}
              label="Highest Qualification"
              placeholder="e.g., BSc Computer Science, N6 Electrical"
              value={formData.qualification}
              tooltip="Include your highest completed qualification"
              error={errors.qualification}
              onChange={(v) => handleChange("qualification", v)}
              isValid={formData.qualification && !errors.qualification}
            />

            <SmartInput
              icon={FiBriefcase}
              label="Experience / Current Status"
              placeholder="Students: School + Grade | Professionals: Tech stack + Years"
              value={formData.experience}
              tooltip={<><strong>Students:</strong> Current school & grade<br/><strong>Professionals:</strong> Tech stack, years exp, target role</>}
              error={errors.experience}
              onChange={(v) => handleChange("experience", v)}
              isValid={formData.experience && !errors.experience}
              helperText="Be specific about technologies or subjects"
            />
          </div>

          {/* Section 4: Documents */}
          <SectionHeader 
            number={4} 
            title="Required Documents" 
            description="Upload your CV and verification documents"
            isActive={activeSection === 4}
            isComplete={sections[3].isComplete}
          />

          <div className="space-y-6 pl-4 border-l-2 border-gray-200 dark:border-gray-700 ml-5">
            <FileUploadZone
              label="Curriculum Vitae"
              tooltip="PDF preferred • Max 8MB • Include contact details & projects"
              error={errors.cv}
              onChange={(f) => handleChange("cv", f)}
              accept=".pdf,.doc,.docx"
            />

            <FileUploadZone
              label="Matric Certificate / Latest Report"
              tooltip="PDF or clear image • Max 5MB"
              error={errors.doc1}
              onChange={(f) => handleChange("doc1", f)}
              accept=".pdf,.jpg,.jpeg,.png"
            />

            <FileUploadZone
              label="Certified ID Copy"
              tooltip="Must be certified by SAPS/Commissioner of Oaths • Max 5MB"
              error={errors.doc2}
              onChange={(f) => handleChange("doc2", f)}
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>

          {/* Consent */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="pt-6"
          >
            <ConsentBox
              checked={formData.consent}
              onChange={(v) => handleChange("consent", v)}
              error={errors.consent}
            />
          </motion.div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading || !formData.consent}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
              loading || !formData.consent
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25"
            }`}
          >
            {loading ? (
              <>
                <Loader />
                <span>Processing Application...</span>
              </>
            ) : (
              <>
                <span>Submit Application</span>
                <FiChevronRight size={20} />
              </>
            )}
          </motion.button>

          <p className="text-center text-xs text-gray-500 dark:text-gray-600">
            By submitting, you confirm all information is accurate and agree to our data processing terms.
          </p>
        </form>
      </div>
    </div>
  );
}
