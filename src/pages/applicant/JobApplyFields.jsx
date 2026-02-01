import { FiAlertCircle, FiCheckCircle, FiUpload } from "react-icons/fi";

export function InlineLoader({ label = "Checking…" }) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-400">
      <span className="w-3 h-3 rounded-full border-2 border-gray-300 border-t-gray-500 animate-spin" />
      <span>{label}</span>
      <span className="relative w-10 h-[2px] bg-gray-300 overflow-hidden rounded">
        <span className="absolute inset-0 bg-gray-500 animate-pulse" />
      </span>
    </div>
  );
}

export function InputField({
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  readOnly = false,
  inputMode,
  pattern,
  maxLength,
}) {
  return (
    <div className="space-y-1">
      <div
        className={`flex items-center gap-2 rounded-2xl px-3 h-11 bg-gray-50 dark:bg-gray-700 ${
          error ? "ring-1 ring-red-600/10" : ""
        }`}
      >
        {icon && <span className="text-gray-400">{icon}</span>}
        <input
          type={type}
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          inputMode={inputMode}
          pattern={pattern}
          maxLength={maxLength}
          className="flex-1 bg-transparent outline-none text-sm"
        />
      </div>
      {error && (
        <p className="text-red-600 flex gap-2 text-xs">
          <FiAlertCircle size={18} /> {error}
        </p>
      )}
    </div>
  );
}


export function FileField({ label, error, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-500 flex items-center gap-2">
        <FiUpload /> {label}
      </label>
      <input
        type="file"
        onChange={(e) => onChange(e.target.files?.[0])}
        className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:bg-gray-100 file:text-gray-700"
      />
      {error && <p className="text-red-700 bg-red-600/10 flex gap-2 p-2 rounded text-xs"> <FiAlertCircle size={18} /> {error}</p>}
    </div>
  );
}
