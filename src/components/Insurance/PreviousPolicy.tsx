import React, { useState } from "react";

const PreviousPolicyDetails = () => {
  const [form, setForm] = useState({
    insuranceCompany: "",
    branch: "",
    policyType: "",
    policyNumber: "",
    issueDate: "",
    dueDate: "",
    ncbDiscount: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    alert("Submitted!\n" + JSON.stringify(form, null, 2));
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
              value={form.insuranceCompany}
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              placeholder="Enter insurance company"
            />
          </div>
          {/* Branch */}
          <div>
            <label className="block text-sm font-semibold mb-1">Branch</label>
            <input
              type="text"
              name="branch"
              value={form.branch}
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              placeholder="Enter branch"
            />
          </div>
          {/* Policy Type */}
          <div>
            <label className="block text-sm font-semibold mb-1">Policy Type</label>
            <input
              type="text"
              name="policyType"
              value={form.policyType}
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              placeholder="Enter policy type"
            />
          </div>
          {/* Policy Number */}
          <div>
            <label className="block text-sm font-semibold mb-1">Policy Number</label>
            <input
              type="text"
              name="policyNumber"
              value={form.policyNumber}
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              placeholder="Enter policy number"
            />
          </div>
          {/* Issue Date */}
          <div>
            <label className="block text-sm font-semibold mb-1">Issue Date</label>
            <input
              type="date"
              name="issueDate"
              value={form.issueDate}
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
            />
          </div>
          {/* Due Date */}
          <div>
            <label className="block text-sm font-semibold mb-1">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
            />
          </div>
          {/* NCB Discount */}
          <div>
            <label className="block text-sm font-semibold mb-1">NCB Discount</label>
            <input
              type="text"
              name="ncbDiscount"
              value={form.ncbDiscount}
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              placeholder="Enter NCB discount"
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
