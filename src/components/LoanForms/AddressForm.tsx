import React, { useState } from "react";

const AddressForm = () => {
  const [form, setForm] = useState({
    address: "",
    phoneNumber: "",
    addressProof: null
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, addressProof: e.target.files[0] });
  };

  return (
    <div className="max-w-full mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-2">Address Details</h2>
      <hr className="mb-6" />
      <form>
        <div className="grid grid-cols-1 gap-y-4">
          {/* Address */}
          <div>
            <label className="block text-sm font-semibold mb-1">Address</label>
            <textarea
              name="address"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter address"
              rows={3}
            />
          </div>
          {/* Phone Number */}
          <div>
            <label className="block text-sm font-semibold mb-1">Phone Number</label>
            <input
                name="phoneNumber"
                type="tel"
                className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number"
                maxLength={10}
                pattern="[0-9]{10}"
            />

          </div>
          {/* Address Proof - Aadhar Card Upload */}
          <div>
            <label className="block text-sm font-semibold mb-1">Address Proof (Aadhar Card)</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
            />
            {form.addressProof && (
              <p className="mt-2 text-xs text-gray-500">
                Selected file: {form.addressProof.name}
              </p>
            )}
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

export default AddressForm;
