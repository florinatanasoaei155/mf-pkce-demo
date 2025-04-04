import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOidcFetch } from "@axa-fr/react-oidc";

const EditReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetch } = useOidcFetch();
  const [form, setForm] = useState({ name: "", date: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`http://localhost:9000/api/reports/${id}`);
        if (!response.ok) throw new Error("Failed to fetch report");

        const data = await response.json();
        setForm({ name: data.name, date: data.date });
      } catch (err) {
        setError("Failed to load report.");
      }
    };

    fetchReport();
  }, [id]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:9000/api/reports/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Failed to update report");
      navigate(`/${id}`);
    } catch (err) {
      setError("Failed to update report.");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">✏️ Edit Report</h2>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Report Name"
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          ✅ Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditReport;
