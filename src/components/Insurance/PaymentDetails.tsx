const PaymentScreen = () => {
  const handlePaymentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Process payment
  };

  return (
    <section className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Payment Details</h2>
      <form
        className="bg-gray-50 rounded-lg p-6  space-y-6"
        onSubmit={handlePaymentSubmit}
      >
        <div className="grid grid-cols-2 gap-6">
          {/* Cardholder Name */}
          <div>
            <label className="block text-sm font-semibold mb-1">Cardholder Name</label>
            <input
              type="text"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
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
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
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
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
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
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
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
  );
};

export default PaymentScreen;
