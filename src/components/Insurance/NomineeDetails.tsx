import React from "react";
import { useFormContext } from "../../contexts/FormContext";
import { useNavigate } from "react-router-dom";

const NomineeReferenceDetails = () => {
  const { form, updateForm } = useFormContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateForm({ [name]: value });
  };

  const handleRelationSelect = (e) => {
    const { value } = e.target;
    if (value === "Other") {
      updateForm({ nomineeRelation: "" }); // Clear to let user type custom relation
    } else {
      updateForm({ nomineeRelation: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nomineeRelation || form.nomineeRelation.trim() === "") {
      alert("Please provide a valid nominee relation.");
      return;
    }

    navigate("/dashboard/insurance-case/Vehicle-Details");
  };

  const isCustomRelation =
    form.nomineeRelation &&
    !["Spouse", "Parent", "Child", "Sibling"].includes(form.nomineeRelation);

  return (
    <div className="max-w-full mx-auto p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Nominee & Reference Details</h2>
      <form onSubmit={handleSubmit}>
        {/* Nominee Details */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Nominee Details</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            <div>
              <label className="block text-sm font-semibold mb-1">Nominee Name</label>
              <input
                type="text"
                name="nomineeName"
                value={form.nomineeName || ""}
                onChange={handleChange}
                required
                className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
                placeholder="Enter nominee name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Age</label>
              <input
                type="number"
                name="nomineeAge"
                value={form.nomineeAge || ""}
                onChange={handleChange}
                required
                min="0"
                className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
                placeholder="Enter age"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Relation</label>
              <select
                onChange={handleRelationSelect}
                className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
                value={
                  ["Spouse", "Parent", "Child", "Sibling"].includes(form.nomineeRelation)
                    ? form.nomineeRelation
                    : "Other"
                }
              >
                <option value="">Select relation</option>
                <option value="Spouse">Spouse</option>
                <option value="Parent">Parent</option>
                <option value="Child">Child</option>
                <option value="Sibling">Sibling</option>
                <option value="Other">Other</option>
              </select>

              {(form.nomineeRelation === "" || isCustomRelation) && (
                <input
                  type="text"
                  name="nomineeRelation"
                  value={form.nomineeRelation}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700 mt-2"
                  placeholder="Enter custom relation"
                />
              )}
            </div>
          </div>
        </div>

        {/* Reference Details */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Reference Details</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            <div>
              <label className="block text-sm font-semibold mb-1">Name</label>
              <input
                type="text"
                name="nomineeReferenceName"
                value={form.nomineeReferenceName || ""}
                onChange={handleChange}
                required
                className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
                placeholder="Enter reference name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Number</label>
              <input
                type="tel"
                name="nomineeReferenceNumber"
                value={form.nomineeReferenceNumber || ""}
                onChange={handleChange}
                required
                className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
                placeholder="Enter reference number"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-black text-white px-8 py-2 rounded hover:bg-gray-800"
          >
            Save And Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default NomineeReferenceDetails;
