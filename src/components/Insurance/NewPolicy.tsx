import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../../contexts/FormContext";

const INITIAL_FORM = {
  policyIssued: "",
  newInsuranceCompany: "",
  newBranch: "",
  newPolicyType: "",
  newPolicyNumber: "",
  newIssueDate: "",
  newDueDate: "",
  newNcbDiscount: "",
  newInsuranceDuration: "",
  idv: "",
  NewTotalPremium: "",
};

const NewPolicyDetails = () => {
  const { form, updateForm } = useFormContext();
  const navigate = useNavigate();

  // If you want to ensure all fields are prefilled, you can do this:
  React.useEffect(() => {
    // Only set defaults if form is empty
    if (!form || Object.keys(form).length === 0) {
      updateForm(INITIAL_FORM);
    }
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateForm({ [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard/insurance-case/Payment-Details");
  };

  return (
    <div className="max-w-full mx-auto p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">New Policy Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          {/* Policy Issued */}
          <div>
            <label className="block text-sm font-semibold mb-1">Policy Issued</label>
            <select
              name="policyIssued"
              value={form.policyIssued || ""}
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          {/* Insurance Company */}
          <div>
            <label className="block text-sm font-semibold mb-1">Insurance Company</label>
            <input
              type="text"
              name="newInsuranceCompany"
              value={form.newInsuranceCompany || ""}
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
              name="newBranch"
              value={form.newBranch || ""}
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              placeholder="Enter branch"
              required
            />
          </div>
          {/* Policy Type */}
          <div>
            <label className="block text-sm font-semibold mb-1">Policy Type</label>
            <select
              name="newPolicyType"
              value={form.newPolicyType || ""}
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
            >
              <option value="">Select</option>
              <option value="Comprehensive">Comprehensive</option>
              <option value="Third Party">Third Party</option>
            </select>
          </div>
          {/* Policy Number */}
          <div>
            <label className="block text-sm font-semibold mb-1">Policy Number</label>
            <input
              type="text"
              name="newPolicyNumber"
              value={form.newPolicyNumber || ""}
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
              name="newIssueDate"
              value={form.newIssueDate || ""}
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              required
            />
          </div>
          {/* Due Date */}
          <div>
            <label className="block text-sm font-semibold mb-1">Due Date</label>
            <input
              type="date"
              name="newDueDate"
              value={form.newDueDate || ""}
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              required
            />
          </div>
          {/* NCB Discount (read-only) */}
          <div>
            <label className="block text-sm font-semibold mb-1">NCB Discount (%)</label>
            <input
              type="text"
              name="newNcbDiscount"
              value={form.newNcbDiscount || ""}
              readOnly
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700 cursor-not-allowed"
              tabIndex={-1}
            />
          </div>
          {/* Insurance Duration (read-only) */}
          <div>
            <label className="block text-sm font-semibold mb-1">Insurance Duration</label>
            <input
              type="text"
              name="newInsuranceDuration"
              value={form.newInsuranceDuration || ""}
              readOnly
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700 cursor-not-allowed"
              tabIndex={-1}
            />
          </div>
          {/* IDV (read-only) */}
          <div>
            <label className="block text-sm font-semibold mb-1">IDV</label>
            <input
              type="text"
              name="idv"
              value={form.idv || ""}
              readOnly
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700 cursor-not-allowed"
              tabIndex={-1}
            />
          </div>
          {/* Total Premium (read-only) */}
          <div>
            <label className="block text-sm font-semibold mb-1">Total Premium</label>
            <input
              type="text"
              name="NewTotalPremium"
              value={form.NewTotalPremium || ""}
              readOnly
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700 cursor-not-allowed"
              tabIndex={-1}
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

export default NewPolicyDetails;
