import React, { useState } from 'react';

const FileDispatch = () => {
  const [form, setForm] = useState({
    caseType: "",
    netLoanAmount: "",
    insuranceFinance: "",
    grLoanAmount: "",
    roiType: "Fixed",
    roiValue: "",
    emi: "",
    tenor: "",
    emiPlan: "",
    emiStartDate: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-full mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-2">File Dispatch</h2>
      <hr className="mb-6" />
      <form>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {/* Case Type */}
          <div>
            <label className="block text-sm font-semibold mb-1">Case Type</label>
            <select
              name="caseType"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.caseType}
              onChange={handleChange}
            >
              <option value="">Select case type</option>
              <option value="New Car">New Car</option>
              <option value="Used Car">Used Car</option>
              <option value="Top-up">Top-up</option>
              <option value="Refinance">Refinance</option>
            </select>
          </div>
          {/* Net Loan Amount */}
          <div>
            <label className="block text-sm font-semibold mb-1">Net Loan Amount</label>
            <input
              name="netLoanAmount"
              type="number"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.netLoanAmount}
              onChange={handleChange}
              placeholder="Enter net loan amount"
            />
          </div>
          {/* Insurance Finance */}
          <div>
            <label className="block text-sm font-semibold mb-1">Insurance Finance</label>
            <input
              name="insuranceFinance"
              type="number"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-7 00"
              value={form.insuranceFinance}
              onChange={handleChange}
              placeholder="Enter insurance finance"
            />
          </div>
          {/* Gr. Loan Amount */}
          <div>
            <label className="block text-sm font-semibold mb-1">Gr. Loan Amount</label>
            <input
              name="grLoanAmount"
              type="number"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.grLoanAmount}
              onChange={handleChange}
              placeholder="Enter gross loan amount"
            />
          </div>
          {/* ROI Type */}
          <div>
            <label className="block text-sm font-semibold mb-1">ROI Type</label>
            <select
              name="roiType"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.roiType}
              onChange={handleChange}
            >
              <option value="Fixed">Fixed</option>
              <option value="Floating">Floating</option>
            </select>
          </div>
          {/* ROI Value */}
          <div>
            <label className="block text-sm font-semibold mb-1">ROI (%)</label>
            <input
              name="roiValue"
              type="number"
              step="0.01"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.roiValue}
              onChange={handleChange}
              placeholder="Enter ROI (%)"
            />
          </div>
          {/* EMI */}
          <div>
            <label className="block text-sm font-semibold mb-1">EMI</label>
            <input
              name="emi"
              type="number"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.emi}
              onChange={handleChange}
              placeholder="Enter EMI"
            />
          </div>
          {/* Tenor */}
          <div>
            <label className="block text-sm font-semibold mb-1">Tenor (Months)</label>
            <input
              name="tenor"
              type="number"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.tenor}
              onChange={handleChange}
              placeholder="Enter tenor (months)"
            />
          </div>
          {/* EMI Plan */}
          <div>
            <label className="block text-sm font-semibold mb-1">EMI Plan</label>
            <select
              name="emiPlan"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.emiPlan}
              onChange={handleChange}
            >
              <option value="">Select EMI plan</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
          {/* EMI Starting Date */}
          <div>
            <label className="block text-sm font-semibold mb-1">EMI Start Date</label>
            <input
              name="emiStartDate"
              type="date"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.emiStartDate}
              onChange={handleChange}
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

export default FileDispatch;
