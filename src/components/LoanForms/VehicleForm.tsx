import React, { useState } from 'react';

const VehicleForm = () => {
  const [form, setForm] = useState({
    make: "",
    model: "",
    exShowroomPrice: "",
    insuranceAmount: "",
    roadTax: "",
    financeFrom: "",
    dsaCode: "",
    paymentFavoring: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-full mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-2">Vehicle Details</h2>
      <hr className="mb-6" />
      <form>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {/* Make */}
          <div>
            <label className="block text-sm font-semibold mb-1">Make</label>
            <input
              name="make"
              type="text"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.make}
              onChange={handleChange}
              placeholder="Enter vehicle make"
            />
          </div>
          {/* Model */}
          <div>
            <label className="block text-sm font-semibold mb-1">Model</label>
            <input
              name="model"
              type="text"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.model}
              onChange={handleChange}
              placeholder="Enter vehicle model"
            />
          </div>
          {/* Ex Showroom Price */}
          <div>
            <label className="block text-sm font-semibold mb-1">Ex Showroom Price</label>
            <input
              name="exShowroomPrice"
              type="number"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.exShowroomPrice}
              onChange={handleChange}
              placeholder="Enter ex showroom price"
            />
          </div>
          {/* Insurance Amount */}
          <div>
            <label className="block text-sm font-semibold mb-1">Insurance Amount</label>
            <input
              name="insuranceAmount"
              type="number"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.insuranceAmount}
              onChange={handleChange}
              placeholder="Enter insurance amount"
            />
          </div>
          {/* Road Tax */}
          <div>
            <label className="block text-sm font-semibold mb-1">Road Tax</label>
            <input
              name="roadTax"
              type="number"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.roadTax}
              onChange={handleChange}
              placeholder="Enter road tax"
            />
          </div>
          {/* Finance From */}
          <div>
            <label className="block text-sm font-semibold mb-1">Finance From</label>
            <input
              name="financeFrom"
              type="text"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.financeFrom}
              onChange={handleChange}
              placeholder="Enter finance from"
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
          {/* Payment Favoring */}
          <div>
            <label className="block text-sm font-semibold mb-1">Payment Favoring</label>
            <input
              name="paymentFavoring"
              type="text"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.paymentFavoring}
              onChange={handleChange}
              placeholder="Enter payment favoring"
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

export default VehicleForm;
