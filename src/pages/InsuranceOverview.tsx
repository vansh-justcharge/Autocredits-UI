import React from "react";
import { useFormContext } from "../contexts/FormContext";
import { useNavigate } from "react-router-dom";

const InsuranceCaseDetails = () => {
  const { form, updateForm } = useFormContext();
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    updateForm({ [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // You can add validation here if needed
    navigate("/dashboard/insurance-case/Customer-Details");
  };

  return (
    <div className="max-w-full mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-2">Case Details</h2>
      <hr className="mb-6" />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {/* Buyer Name */}
          <div>
            <label className="block text-sm font-semibold mb-1">Buyer Name</label>
            <input
              name="buyerName"
              type="text"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.buyerName}
              onChange={handleChange}
              placeholder="Enter buyer name"
              required
            />
          </div>
          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-semibold mb-1">Mobile Number</label>
            <input
              name="mobileNumber"
              type="tel"
              maxLength={10}
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.mobileNumber}
              onChange={handleChange}
              placeholder="Enter mobile number"
              required
            />
          </div>
          {/* Buyer Type */}
          <div>
            <label className="block text-sm font-semibold mb-1">Buyer Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                className={`flex-1 px-4 py-2 rounded border ${
                  form.buyerType === "Individual"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => updateForm({ buyerType: "Individual" })}
              >
                Individual
              </button>
              <button
                type="button"
                className={`flex-1 px-4 py-2 rounded border ${
                  form.buyerType === "Company"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => updateForm({ buyerType: "Company" })}
              >
                Company
              </button>
            </div>
          </div>
          {/* Insurance Category */}
          <div>
            <label className="block text-sm font-semibold mb-1">Insurance Category</label>
            <select
              name="insuranceCategory"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.insuranceCategory}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="New Car">New Car</option>
              <option value="Renewal">Renewal</option>
              <option value="Health">Health</option>
            </select>
          </div>
          {/* Source */}
          <div>
            <label className="block text-sm font-semibold mb-1">Source</label>
            <select
              name="source"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.source}
              onChange={handleChange}
              required
            >
              <option value="">Select Source</option>
              <option value="Dealer">Dealer</option>
              <option value="Online">Online</option>
              <option value="Referral">Referral</option>
            </select>
          </div>
          {/* Status */}
          <div>
            <label className="block text-sm font-semibold mb-1">Status</label>
            <select
              name="status"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.status}
              onChange={handleChange}
              required
            >
              <option value="">Select Status</option>
              <option value="Follow up">Follow up</option>
              <option value="Closed">Closed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          {/* Follow Up */}
          <div>
            <label className="block text-sm font-semibold mb-1">Follow Up</label>
            <input
              name="followUp"
              type="date"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.followUp}
              required
              onChange={handleChange}
            />
          </div>
          {/* Assign to */}
          <div>
            <label className="block text-sm font-semibold mb-1">Assign to</label>
            <input
              name="assignTo"
              type="text"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.assignTo}
              required
              onChange={handleChange}
              placeholder="Enter assignee"
            />
          </div>
          {/* Comment (Full width) */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-1">Comment</label>
            <input
              name="caseComment"
              type="text"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.caseComment}
              required
              onChange={handleChange}
              placeholder="Enter comment"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Save And Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default InsuranceCaseDetails;
