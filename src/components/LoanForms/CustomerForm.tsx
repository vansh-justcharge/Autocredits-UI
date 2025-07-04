import { useState, ChangeEvent } from "react";

const LoanApplicationForm = () => {
  const [form, setForm] = useState({
    customerName: "",
    caseType: "",
    loanAmount: "",
    financeForm: "",
    dsaCode: "",
    tenor: "",
    roi: "",
    vehicleModel: "",
    vehicleVariant: "",
    regNumber: "",
    exShowroomPrice: "",
    loginDate: "",
    loginTime: "",
    source: "",
    origin: "",
    dealtBy: "",
    closedBy: "",
    preDocsPreparedBy: "",
    comment: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-full mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-2">Loan Application Details</h2>
      <hr className="mb-6" />
      <form>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {/* Customer Name */}
          <div>
            <label className="block text-sm font-semibold mb-1">Customer Name</label>
            <input
              name="customerName"
              type="text"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.customerName}
              onChange={handleChange}
              placeholder="Enter customer name"
            />
          </div>
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
              <option value="new car">New Car</option>
              <option value="used car">Used Car</option>
              <option value="car-cashin">Car Cashin</option>
              <option value="top-up">Top-up</option>
            </select>
          </div>
          {/* Loan Amount */}
          <div>
            <label className="block text-sm font-semibold mb-1">Loan Amount</label>
            <input
              name="loanAmount"
              type="number"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.loanAmount}
              onChange={handleChange}
              placeholder="Enter loan amount"
            />
          </div>
          {/* Finance Form */}
          <div>
            <label className="block text-sm font-semibold mb-1">Finance Form (Bank)</label>
            <input
              name="financeForm"
              type="text"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.financeForm}
              onChange={handleChange}
              placeholder="Enter bank name"
            />
          </div>
          {/* DSA Code */}
          <div>
            <label className="block text-sm font-semibold mb-1">DSA Code</label>
            <input
              name="dsaCode"
              type="text"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.dsaCode}
              onChange={handleChange}
              placeholder="Enter DSA code"
            />
          </div>
          {/* Tenor */}
          <div>
            <label className="block text-sm font-semibold mb-1">Tenor</label>
            <input
              name="tenor"
              type="number"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.tenor}
              onChange={handleChange}
              placeholder="Enter tenor (months)"
            />
          </div>
          {/* ROI */}
          <div>
            <label className="block text-sm font-semibold mb-1">ROI</label>
            <input
              name="roi"
              type="number"
              step="0.01"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.roi}
              onChange={handleChange}
              placeholder="Enter ROI (%)"
            />
          </div>
          {/* Vehicle Model */}
          <div>
            <label className="block text-sm font-semibold mb-1">Vehicle Model</label>
            <input
              name="vehicleModel"
              type="text"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.vehicleModel}
              onChange={handleChange}
              placeholder="Enter vehicle model"
            />
          </div>
          {/* Vehicle Variant */}
          <div>
            <label className="block text-sm font-semibold mb-1">Vehicle Variant</label>
            <input
              name="vehicleVariant"
              type="text"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.vehicleVariant}
              onChange={handleChange}
              placeholder="Enter vehicle variant"
            />
          </div>
          {/* Reg Number (if not new car) */}
          {form.caseType !== "new car" && (
            <div>
              <label className="block text-sm font-semibold mb-1">Registration Number</label>
              <input
                name="regNumber"
                type="text"
                className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
                value={form.regNumber}
                onChange={handleChange}
                placeholder="Enter registration number"
              />
            </div>
          )}
          {/* Ex-Showroom Price */}
          <div>
            <label className="block text-sm font-semibold mb-1">Ex-Showroom Price</label>
            <input
              name="exShowroomPrice"
              type="number"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.exShowroomPrice}
              onChange={handleChange}
              placeholder="Enter ex-showroom price"
            />
          </div>
          {/* Login Date */}
          <div>
            <label className="block text-sm font-semibold mb-1">Login Date</label>
            <input
              name="loginDate"
              type="date"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.loginDate}
              onChange={handleChange}
            />
          </div>
          {/* Login Time */}
          <div>
            <label className="block text-sm font-semibold mb-1">Login Time</label>
            <input
              name="loginTime"
              type="time"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.loginTime}
              onChange={handleChange}
            />
          </div>
          {/* Source */}
          <div>
            <label className="block text-sm font-semibold mb-1">Source</label>
            <select
              name="source"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.source}
              onChange={handleChange}
            >
              <option value="">Select source</option>
              <option value="direct">Direct</option>
              <option value="reference customer">Reference Customer</option>
              <option value="indirect">Indirect (Reference)</option>
            </select>
          </div>
          {/* Origin */}
          <div>
            <label className="block text-sm font-semibold mb-1">Origin</label>
            <input
              name="origin"
              type="text"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.origin}
              onChange={handleChange}
              placeholder="Enter origin"
            />
          </div>
          {/* Dealt By */}
          <div>
            <label className="block text-sm font-semibold mb-1">Dealt By</label>
            <input
              name="dealtBy"
              type="text"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.dealtBy}
              onChange={handleChange}
              placeholder="Enter dealt by"
            />
          </div>
          {/* Closed By */}
          <div>
            <label className="block text-sm font-semibold mb-1">Closed By</label>
            <input
              name="closedBy"
              type="text"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.closedBy}
              onChange={handleChange}
              placeholder="Enter closed by"
            />
          </div>
          {/* Pre Docs Prepared By */}
          <div>
            <label className="block text-sm font-semibold mb-1">Pre Docs Prepared By</label>
            <input
              name="preDocsPreparedBy"
              type="text"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.preDocsPreparedBy}
              onChange={handleChange}
              placeholder="Enter pre docs prepared by"
            />
          </div>
          {/* Comment */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-1">Comment</label>
            <input
              name="comment"
              type="text"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.comment}
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

export default LoanApplicationForm;
