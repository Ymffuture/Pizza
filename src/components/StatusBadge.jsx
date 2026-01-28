export default function StatusBadge({ status = "PENDING" }) {
  const styles = {
    PENDING:
      "bg-gray-100 text-gray-700 border border-gray-300",
    SUCCESSFUL:
      "bg-green-100 text-green-700 border border-green-300",
    UNSUCCESSFUL:
      "bg-red-100 text-red-700 border border-red-300",
    SECOND_INTAKE:
      "bg-yellow-100 text-yellow-700 border border-yellow-300",
  };

  return (
    <span
      className={`
        px-3 py-1 text-xs font-medium
        rounded-full
        ${styles[status] || styles.PENDING}
      `}
    >
      {status.replace("_", " ")}
    </span>
  );
}
