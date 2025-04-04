import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import reports from "../mocks/reports.json";

const EditReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", date: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const foundReport = reports.find((item) => item.id === id);
    if (id && foundReport) {
      setForm({ name: foundReport.name, date: foundReport.date });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log("data to submit -> ", form);
      navigate(`/${id}`);
    } catch (error) {
      console.error(error);
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
