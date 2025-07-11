import React from "react";
import { useFormContext } from "../../contexts/FormContext";
import { useNavigate } from "react-router-dom";

const PAYMENT_MODES = ["Cash", "Cheque", "Online"];

const PaymentScreen = () => {
  const { form, updateForm } = useFormContext();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateForm({ [name]: value });
  };

  const handlePaymentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/dashboard/insurance-case/Documents");
  };

  return (
    <section className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Payment Details</h2>
      <form
        className="bg-gray-50 rounded-lg p-6 space-y-6"
        onSubmit={handlePaymentSubmit}
      >
        <div className="grid grid-cols-2 gap-6">
          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold mb-1">Amount</label>
            <input
              type="number"
              name="paymentAmount"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              placeholder="Enter amount"
              value={form.paymentAmount || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          {/* Payment Mode */}
          <div>
            <label className="block text-sm font-semibold mb-1">Payment Mode</label>
            <select
              name="paymentMode"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.paymentMode || PAYMENT_MODES[0]}
              onChange={handleInputChange}
              required
            >
              {PAYMENT_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>
          {/* Payment Date */}
          <div>
            <label className="block text-sm font-semibold mb-1">Payment Date</label>
            <input
              type="date"
              name="paymentDate"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.paymentDate || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          {/* Receipt Number */}
          <div>
            <label className="block text-sm font-semibold mb-1">Receipt Number</label>
            <input
              type="text"
              name="receiptNumber"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              placeholder="Receipt number"
              value={form.receiptNumber || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          {/* Receipt Date */}
          <div>
            <label className="block text-sm font-semibold mb-1">Receipt Date</label>
            <input
              type="date"
              name="receiptDate"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.receiptDate || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          {/* Bank Name */}
          <div>
            <label className="block text-sm font-semibold mb-1">Bank Name</label>
            <input
              type="text"
              name="bankName"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              placeholder="Bank name"
              value={form.bankName || ""}
              onChange={handleInputChange}
              required={form.paymentMode !== "Cash"}
              disabled={form.paymentMode === "Cash"}
            />
            <span className="text-xs text-gray-400">
              {form.paymentMode === "Cash" ? "Not required for Cash payments" : ""}
            </span>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded text-lg font-semibold hover:bg-gray-800 transition"
        >
          Save Now
        </button>
      </form>
    </section>
  );
};

export default PaymentScreen;
