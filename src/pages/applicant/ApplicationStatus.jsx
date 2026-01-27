import { useEffect, useState } from "react";
import axios from "axios";
import StatusBadge from "../../components/StatusBadge";

export default function ApplicationStatus() {
  const [application, setApplication] = useState(null);

  useEffect(() => {
    // Example: fetch latest application
    axios.get("/api/application/latest").then((res) => {
      setApplication(res.data);
    });
  }, []);

  if (!application) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-2">
        Application Status
      </h2>

      <p className="mb-2">
        {application.firstName} {application.lastName}
      </p>

      <StatusBadge status={application.status} />

      <p className="mt-4 text-sm text-gray-600">
        Last updated: {new Date(application.updatedAt).toLocaleString()}
      </p>
    </div>
  );
}
