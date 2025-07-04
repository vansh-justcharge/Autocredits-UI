import React, { useState } from 'react';

const CPVDetails = () => {
  const [form, setForm] = useState({
    familyDetails: "",
    accountNumber: "",
    financialAcademicStatus: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-full mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-2">CPV Details</h2>
      <hr className="mb-6" />
      <form>
        <div className="grid grid-cols-1 gap-y-4">
          {/* Family Details */}
          <div>
            <label className="block text-sm font-semibold mb-1">Family Details</label>
            <textarea
              name="familyDetails"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.familyDetails}
              onChange={handleChange}
              placeholder="Enter family details"
              rows={3}
            />
          </div>
          {/* Account Number */}
          <div>
            <label className="block text-sm font-semibold mb-1">Account Number</label>
            <input
              name="accountNumber"
              type="text"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.accountNumber}
              onChange={handleChange}
              placeholder="Enter account number"
            />
          </div>
          {/* Financial & Academic Status */}
          <div>
            <label className="block text-sm font-semibold mb-1">Financial & Academic Status</label>
            <textarea
              name="financialAcademicStatus"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.financialAcademicStatus}
              onChange={handleChange}
              placeholder="Enter financial and academic status"
              rows={3}
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

export default CPVDetails;
