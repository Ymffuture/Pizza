// components/StatusBadge.jsx
export default function StatusBadge({ status }) {
const map = {
PENDING: "bg-gray-400",
SUCCESSFUL: "bg-green-500",
UNSUCCESSFUL: "bg-red-500",
SECOND_INTAKE: "bg-yellow-500",
};


return (
<span className={`px-3 py-1 text-white rounded ${map[status]}`}>
{status.replace("_", " ")}
</span>
);
}
