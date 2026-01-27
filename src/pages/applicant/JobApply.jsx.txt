// pages/JobApply.jsx
import axios from "axios";


export default function JobApply() {
const handleSubmit = async (e) => {
e.preventDefault();
const formData = new FormData(e.target);
await axios.post("/api/apply", formData);
alert("Application submitted");
};


return (
<form onSubmit={handleSubmit} className="space-y-4">
<input name="firstName" placeholder="First Name" required />
<input name="lastName" placeholder="Last Name" required />
<input name="idNumber" placeholder="ID Number" required />
<select name="gender">
<option>Male</option>
<option>Female</option>
</select>
<input name="email" type="email" required />


<input type="file" name="cv" required />
{[1,2,3,4,5].map(n => (
<input key={n} type="file" name={`doc${n}`} />
))}


<button type="submit">Apply</button>
</form>
);
}
