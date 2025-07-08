import React, { useState } from "react";

const PAYMENT_MODES = ["Cash", "Cheque", "Online"];
const INHOUSE_TYPES = ["New Car Deal", "Used Car Deal", "Outstanding Payment"];

const PaymentScreen = () => {
  const [paymentBy, setPaymentBy] = useState<"Customer" | "AutoCredits">("Customer");
  const [paymentMode, setPaymentMode] = useState(PAYMENT_MODES[0]);
  const [inhouseType, setInhouseType] = useState(INHOUSE_TYPES[0]);
  const [form, setForm] = useState({
    paymentAmount: "",
    paymentDate: "",
    receiptNumber: "",
    receiptDate: "",
    bankName: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePaymentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Process payment here
    alert("Payment details submitted!");
  };

  return (
    <section className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Payment Details</h2>
      <form
        className="bg-gray-50 rounded-lg p-6 space-y-6"
        onSubmit={handlePaymentSubmit}
      >
        {/* Payment By */}
        <div>
          <label className="block text-sm font-semibold mb-2">Payment By</label>
          <div className="flex gap-6">
            <label
              className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer border transition ${
                paymentBy === "Customer"
                  ? "border-black bg-gray-200 font-bold"
                  : "border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="paymentBy"
                value="Customer"
                checked={paymentBy === "Customer"}
                onChange={() => setPaymentBy("Customer")}
                className="accent-black"
              />
              Customer
            </label>
            <label
              className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer border transition ${
                paymentBy === "AutoCredits"
                  ? "border-black bg-gray-200 font-bold"
                  : "border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="paymentBy"
                value="AutoCredits"
                checked={paymentBy === "AutoCredits"}
                onChange={() => setPaymentBy("AutoCredits")}
                className="accent-black"
              />
              AutoCredits
            </label>
          </div>
        </div>

        {/* If Customer, show payment details */}
        {paymentBy === "Customer" && (
          <>
            <div className="grid grid-cols-2 gap-6">
              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold mb-1">Amount</label>
                <input
                  type="number"
                  name="paymentAmount"
                  className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
                  placeholder="Enter amount"
                  value={form.paymentAmount}
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
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
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
                  value={form.paymentDate}
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
                  value={form.receiptNumber}
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
                  value={form.receiptDate}
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
                  value={form.bankName}
                  onChange={handleInputChange}
                  required={paymentMode !== "Cash"}
                  disabled={paymentMode === "Cash"}
                />
                <span className="text-xs text-gray-400">
                  {paymentMode === "Cash" ? "Not required for Cash payments" : ""}
                </span>
              </div>
            </div>
          </>
        )}

        {/* If AutoCredits, show deal type */}
        {paymentBy === "AutoCredits" && (
          <div>
            <label className="block text-sm font-semibold mb-1">Payment Type</label>
            <select
              name="inhouseType"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={inhouseType}
              onChange={(e) => setInhouseType(e.target.value)}
            >
              {INHOUSE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        )}

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
