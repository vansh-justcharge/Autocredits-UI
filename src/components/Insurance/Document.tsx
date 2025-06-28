import React, { useRef } from "react";
import { File } from "lucide-react"; // <-- Lucide icon

const PaymentDetails = () => {
  const fileInputRef = useRef();

  // Document Upload Handlers
  const handleDrop = (e) => {
    e.preventDefault();
    // Handle dropped files here
    alert("File(s) dropped!");
  };

  const handleFileChange = (e) => {
    // Handle selected files here
    alert("File(s) selected!");
  };

  // Payment Submission Handler
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    alert("Payment submitted!");
  };

  return (
    <div className="max-w-full mx-auto p-8 bg-white rounded shadow space-y-12">
      {/* DOCUMENT UPLOAD */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Document Upload</h2>
        <div
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <File className="w-16 h-16 text-gray-400 mb-4" /> {/* Lucide icon */}
          <p className="mb-4 text-gray-600">Drop files here to upload</p>
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Click here to upload
          </button>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </section>

      {/* PAYMENT DETAILS */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
        <form
          className="bg-gray-50 rounded-lg p-6 shadow-inner space-y-6"
          onSubmit={handlePaymentSubmit}
        >
          <div className="grid grid-cols-2 gap-6">
            {/* Cardholder Name */}
            <div>
              <label className="block text-sm font-semibold mb-1">Cardholder Name</label>
              <input
                type="text"
                className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-gray-700"
                placeholder="Name on card"
                required
              />
            </div>
            {/* Card Number */}
            <div>
              <label className="block text-sm font-semibold mb-1">Card Number</label>
              <input
                type="text"
                maxLength={19}
                className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-gray-700"
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>
            {/* Expiry */}
            <div>
              <label className="block text-sm font-semibold mb-1">Expiry Date</label>
              <input
                type="text"
                maxLength={5}
                className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-gray-700"
                placeholder="MM/YY"
                required
              />
            </div>
            {/* CVV */}
            <div>
              <label className="block text-sm font-semibold mb-1">CVV</label>
              <input
                type="password"
                maxLength={4}
                className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-gray-700"
                placeholder="CVV"
                required
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="saveCard" className="accent-black" />
            <label htmlFor="saveCard" className="text-sm text-gray-600">
              Save card for future payments
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded text-lg font-semibold hover:bg-gray-800 transition"
          >
            Save Now
          </button>
        </form>
      </section>
    </div>
  );
};

export default PaymentDetails;
