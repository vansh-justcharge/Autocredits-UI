import React from "react";
import { useFormContext } from "../../contexts/FormContext";
import { useNavigate } from "react-router-dom";

const CustomerDetails = () => {
  const { form, updateForm } = useFormContext();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateForm({ [name]: value });
  };

  // For button group fields
  const handleButtonGroup = (field: string, value: string) => {
    updateForm({ [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard/insurance-case/Nominee-Details");
  };

  return (
    <div className="max-w-full mx-auto p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-2">Customer Details</h2>
      <p className="mb-6 text-gray-500">Personal details</p>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-1">Email ID</label>
            <input
              type="email"
              name="email"
              value={form.email || ""}
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              placeholder="Enter email"
              required
            />
          </div>
          {/* Address */}
          <div>
            <label className="block text-sm font-semibold mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={form.address || ""}
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              placeholder="Enter address"
              required
            />
          </div>
          {/* City */}
          <div>
            <label className="block text-sm font-semibold mb-1">City</label>
            <input
              type="text"
              name="city"
              value={form.city || ""}
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              placeholder="Enter city"
              required
            />
          </div>
          {/* Pin */}
          <div>
            <label className="block text-sm font-semibold mb-1">Pin</label>
            <input
              type="text"
              name="pin"
              maxLength={6}
              value={form.pin || ""}
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              placeholder="Enter pin"
              required
            />
          </div>
          {/* Gender as Button Group */}
          <div>
            <label className="block text-sm font-semibold mb-1">Gender</label>
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                className={`flex-1 px-4 py-2 rounded border ${
                  form.gender === "Male"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => handleButtonGroup("gender", "Male")}
              >
                Male
              </button>
              <button
                type="button"
                className={`flex-1 px-4 py-2 rounded border ${
                  form.gender === "Female"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => handleButtonGroup("gender", "Female")}
              >
                Female
              </button>
            </div>
          </div>
          {/* Marital Status as Button Group */}
          <div>
            <label className="block text-sm font-semibold mb-1">Marital Status</label>
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                className={`flex-1 px-4 py-2 rounded border ${
                  form.maritalStatus === "Single"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => handleButtonGroup("maritalStatus", "Single")}
              >
                Single
              </button>
              <button
                type="button"
                className={`flex-1 px-4 py-2 rounded border ${
                  form.maritalStatus === "Married"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => handleButtonGroup("maritalStatus", "Married")}
              >
                Married
              </button>
            </div>
          </div>
          {/* DOB */}
          <div>
            <label className="block text-sm font-semibold mb-1">DOB</label>
            <input
              type="date"
              name="dob"
              value={form.dob || ""}
              required
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
            />
          </div>
          {/* Occupation */}
          <div>
            <label className="block text-sm font-semibold mb-1">Occupation</label>
            <input
              type="text"
              name="occupation"
              value={form.occupation || ""}
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              placeholder="Enter occupation"
              required
            />
          </div>
          {/* Annual Income */}
          <div>
            <label className="block text-sm font-semibold mb-1">Annual Income</label>
            <input
              type="number"
              name="annualIncome"
              value={form.annualIncome || ""}
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              placeholder="Enter annual income"
              required
            />
          </div>
          {/* PAN */}
          <div>
            <label className="block text-sm font-semibold mb-1">PAN</label>
            <input
              type="text"
              name="pan"
              maxLength={25}
              value={form.pan || ""}
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              placeholder="Enter PAN"
              required
            />
          </div>
          {/* Adhar */}
          <div>
            <label className="block text-sm font-semibold mb-1">Adhar</label>
            <input
              type="text"
              name="adhar"
              value={form.adhar || ""}
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              placeholder="Enter Adhar"
              required
            />
          </div>
          {/* GST No */}
          {form.buyerType !== "Individual" && (
            <div>
              <label className="block text-sm font-semibold mb-1">GST No</label>
              <input
                type="text"
                name="gst"
                value={form.gst || ""}
                onChange={handleChange}
                className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
                placeholder="Enter GST No"
                required
              />
            </div>
          )}
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

export default CustomerDetails;
