import React from "react";
import { useFormContext } from "../../contexts/FormContext";
import { useNavigate } from "react-router-dom";

const PreviousPolicyDetails = () => {
  const { form, updateForm } = useFormContext();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateForm({ [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/dashboard/insurance-case/Quotes");
  };

  return (
    <div className="max-w-full mx-auto p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Previous Policy Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          {/* Insurance Company */}
          <div>
            <label className="block text-sm font-semibold mb-1">Insurance Company</label>
            <input
              type="text"
              name="insuranceCompany"
              value={form.insuranceCompany || ""}
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              placeholder="Enter insurance company"
              required
            />
          </div>
          {/* Branch */}
          <div>
            <label className="block text-sm font-semibold mb-1">Branch</label>
            <input
              type="text"
              name="branch"
              value={form.branch || ""}
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              placeholder="Enter branch"
              required
            />
          </div>
          {/* Policy Type */}
          <div>
            <label className="block text-sm font-semibold mb-1">Policy Type</label>
            <input
              type="text"
              name="policyType"
              value={form.policyType || ""}
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              placeholder="Enter policy type"
              required
            />
          </div>
          {/* Policy Number */}
          <div>
            <label className="block text-sm font-semibold mb-1">Policy Number</label>
            <input
              type="text"
              name="policyNumber"
              value={form.policyNumber || ""}
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              placeholder="Enter policy number"
              required
            />
          </div>
          {/* Issue Date */}
          <div>
            <label className="block text-sm font-semibold mb-1">Issue Date</label>
            <input
              type="date"
              name="issueDate"
              value={form.issueDate || ""}
              onChange={handleChange}
              required
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
            />
          </div>
          {/* Due Date */}
          <div>
            <label className="block text-sm font-semibold mb-1">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate || ""}
              onChange={handleChange}
              required
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
            />
          </div>
          {/* NCB Discount */}
          <div>
            <label className="block text-sm font-semibold mb-1">NCB Discount (%)</label>
            <select
              name="ncbDiscount"
              value={form.ncbDiscount || ""}
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700 pr-10"
              required
            >
              <option value="">Select NCB</option>
              <option value="0">0%</option>
              <option value="20">20%</option>
              <option value="25">25%</option>
              <option value="35">35%</option>
              <option value="50">50%</option>
            </select>
          </div>
          {/* Claim Taken Last Year */}
          <div>
            <label className="block text-sm font-semibold mb-1">Claim Taken Last Year</label>
            <input 
              type="number"
              name="claimLastYear"
              onChange={handleChange}
              value={form.claimLastYear || ""}
              required
              className="bg-gray-100 border border-gray-200 px-3 py-2 w-full rounded text-gray-700"
              placeholder="Enter Your Amount"
            />
          </div>
        </div>
        <div className="mt-8 flex justify-end">
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

export default PreviousPolicyDetails;
