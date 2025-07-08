import React, { useState } from "react";

const VehicleDetails = () => {
  const [form, setForm] = useState({
    registerNumber: "",
    make: "",
    model: "",
    variant: "",
    engineNumber: "",
    chassiNumber: "",
    makeMonthYear: "",
    registerMonthYear: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-full mx-auto p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Vehicle Details</h2>
      <form>
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1">Register Number</label>
            <input
              type="text"
              name="registerNumber"
              value={form.registerNumber}
              onChange={handleChange}
              required
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              placeholder="Enter register number"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Make</label>
            <input
              type="text"
              name="make"
              value={form.make}
              onChange={handleChange}
              required
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              placeholder="Enter make"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Model</label>
            <input
              type="text"
              name="model"
              value={form.model}
              required
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              placeholder="Enter model"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Variant</label>
            <input
              type="text"
              name="variant"
              value={form.variant}
              required
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              placeholder="Enter variant"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Engine Number</label>
            <input
              type="text"
              name="engineNumber"
              value={form.engineNumber}
              onChange={handleChange}
              required
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              placeholder="Enter engine number"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Chassi Number</label>
            <input
              type="text"
              name="chassiNumber"
              value={form.chassiNumber}
              onChange={handleChange}
              required
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              placeholder="Enter chassi number"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Make Month/Year</label>
            <input
              type="month"
              name="makeMonthYear"
              value={form.makeMonthYear}
              onChange={handleChange}
              required
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Register Month/Year</label>
            <input
              type="month"
              name="registerMonthYear"
              value={form.registerMonthYear}
              required
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
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

export default VehicleDetails;
