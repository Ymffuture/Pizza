// pages/admin/AdminApplications.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import StatusBadge from "../../components/StatusBadge";
import DocumentPreview from "../../components/DocumentPreview";


export default function AdminApplications() {
const [apps, setApps] = useState([]);


useEffect(() => {
axios.get("/api/admin/applications").then(res => setApps(res.data));
}, []);


return apps.map(app => (
<div key={app._id} className="border p-4 mb-4">
<h3>{app.firstName} {app.lastName}</h3>
<StatusBadge status={app.status} />


<DocumentPreview url={app.documents.cv.url} />


<select
value={app.status}
onChange={(e) =>
axios.patch(`/api/admin/applications/${app._id}/status`, {
status: e.target.value,
})
}
>
<option>PENDING</option>
<option>SUCCESSFUL</option>
<option>UNSUCCESSFUL</option>
<option>SECOND_INTAKE</option>
</select>
</div>
));
}
