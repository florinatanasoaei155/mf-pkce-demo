import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOidcFetch } from "@axa-fr/react-oidc";

const EditReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetch } = useOidcFetch();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  const handleSave = async () => {
    await fetch(`http://localhost:9000/api/reports/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, date }),
    });
    navigate(`/${id}`);
  };

  return (
    <div>
      <h3>Edit Report #{id}</h3>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default EditReport;
