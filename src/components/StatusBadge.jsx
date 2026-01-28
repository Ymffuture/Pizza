import { motion } from "framer-motion";
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
} from "react-icons/fi";

export default function StatusBadge({ status = "PENDING" }) {
  const config = {
    PENDING: {
      label: "Pending",
      icon: <FiClock />,
      tooltip: "Your application is still under review",
      description:
        "Your application has been received and is currently being reviewed by our team. No action is required from you at this stage.",
      styles: "bg-gray-100 text-gray-700 border border-gray-300",
    },
    SUCCESSFUL: {
      label: "Successful",
      icon: <FiCheckCircle />,
      tooltip: "You have been accepted",
      description:
        "Congratulations! Your application was successful. You will be contacted with the next steps shortly.",
      styles: "bg-green-100 text-green-700 border border-green-300",
    },
    UNSUCCESSFUL: {
      label: "Unsuccessful",
      icon: <FiXCircle />,
      tooltip: "Your application was not approved",
      description:
        "Unfortunately, your application was not successful this time. You are welcome to apply again in the future.",
      styles: "bg-red-100 text-red-700 border border-red-300",
    },
    SECOND_INTAKE: {
      label: "Second Intake",
      icon: <FiRefreshCw />,
      tooltip: "You may be reconsidered",
      description:
        "Your application is being considered for the second intake. We will notify you once a final decision has been made.",
      styles: "bg-yellow-100 text-yellow-700 border border-yellow-300",
    },
  };

  const current = config[status] || config.PENDING;

  return (
    <div className="space-y-2">
      {/* Badge */}
      <motion.span
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        title={current.tooltip} // tooltip (brief info)
        className={`
          inline-flex items-center gap-2
          px-3 py-1 text-xs font-medium
          rounded-full cursor-help
          ${current.styles}
        `}
      >
        <span className="text-sm">{current.icon}</span>
        {current.label}
      </motion.span>

      {/* Full description */}
      <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md">
        {current.description}
      </p>
    </div>
  );
}
