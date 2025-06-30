import React, { useState } from "react";

const initialState = {
  paymentType: "Car Payment",
  referenceId: "",
  customerName: "",
  amount: "",
  paymentDate: "",
  paymentMethod: "",
  paymentStatus: "",
  additionalNote: "",
};

const PaymentForm = () => {
  const [form, setForm] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    alert("Form submitted:\n" + JSON.stringify(form, null, 2));
    setForm(initialState);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-full mx-auto bg-white p-6 rounded-lg shadow flex flex-col gap-4 mt-4"
      style={{ fontFamily: "inherit" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Payment Type */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Payment Type</label>
          <select
            name="paymentType"
            value={form.paymentType}
            onChange={handleChange}
            className="bg-gray-100 rounded px-3 py-2"
            required
          >
            <option>Car Payment</option>
            <option>Loan EMI</option>
            <option>Insurance</option>
          </select>
        </div>
        {/* Reference ID */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Reference ID</label>
          <input
            type="text"
            name="referenceId"
            value={form.referenceId}
            onChange={handleChange}
            placeholder="Enter your reference id"
            className="bg-gray-100 rounded px-3 py-2"
            required
          />
        </div>
        {/* Customer Name */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Customer Name</label>
          <input
            type="text"
            name="customerName"
            value={form.customerName}
            onChange={handleChange}
            placeholder="Enter Customer name"
            className="bg-gray-100 rounded px-3 py-2"
            required
          />
        </div>
        {/* Amount */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Amount</label>
          <input
            type="text"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Enter your amount"
            className="bg-gray-100 rounded px-3 py-2"
            required
          />
        </div>
        {/* Payment Date */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Payment Date</label>
          <input
            type="date"
            name="paymentDate"
            value={form.paymentDate}
            onChange={handleChange}
            placeholder="Enter Payment Date"
            className="bg-gray-100 rounded px-3 py-2"
            required
          />
        </div>
        {/* Payment Method */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Payment Method</label>
          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
            className="bg-gray-100 rounded px-3 py-2"
            required
          >
            <option value="">Enter Payment Method</option>
            <option>Cash</option>
            <option>Card</option>
            <option>Online Transfer</option>
            <option>Cheque</option>
          </select>
        </div>
      </div>
      {/* Payment Status */}
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium">Payment Status</label>
        <input
          type="text"
          name="paymentStatus"
          value={form.paymentStatus}
          onChange={handleChange}
          placeholder="Paid / Pending / Financing"
          className="bg-gray-100 rounded px-3 py-2"
          required
        />
      </div>
      {/* Additional Note */}
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium">Additional Note</label>
        <textarea
          name="additionalNote"
          value={form.additionalNote}
          onChange={handleChange}
          placeholder="Enter additional notes here"
          className="bg-gray-100 rounded px-3 py-2 min-h-[60px]"
        />
      </div>
      {/* Submit Button */}
      <button
        type="submit"
        className="bg-gray-400 text-white px-6 py-2 rounded mt-2 w-32"
      >
        Submit
      </button>
    </form>
  );
};

export default PaymentForm;
