import { useState, ChangeEvent } from 'react';

const InstrumentForm = () => {
  const [form, setForm] = useState({
    instrumentType: "",
    chequeNo: "",
    drawnFrom: "",
    accountNo: "",
    instrumentDate: "",
    amount: "",
    favouring: "",
    signedBy: ""
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-full mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-2">Instrument Details</h2>
      <hr className="mb-6" />
      <form>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {/* Instrument Type */}
          <div>
            <label className="block text-sm font-semibold mb-1">Instrument Type</label>
            <select
              name="instrumentType"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.instrumentType}
              onChange={handleChange}
            >
              <option value="">Select type</option>
              <option value="Cheque">Cheque</option>
              <option value="Demand Draft">Demand Draft</option>
              <option value="Banker's Cheque">Banker's Cheque</option>
            </select>
          </div>
          {/* Cheque No */}
          <div>
            <label className="block text-sm font-semibold mb-1">Cheque No</label>
            <input
              name="chequeNo"
              type="text"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.chequeNo}
              onChange={handleChange}
              placeholder="Enter cheque number"
            />
          </div>
          {/* Drawn From */}
          <div>
            <label className="block text-sm font-semibold mb-1">Drawn From</label>
            <input
              name="drawnFrom"
              type="text"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.drawnFrom}
              onChange={handleChange}
              placeholder="Enter drawn from"
            />
          </div>
          {/* Account No */}
          <div>
            <label className="block text-sm font-semibold mb-1">Account No</label>
            <input
              name="accountNo"
              type="text"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.accountNo}
              onChange={handleChange}
              placeholder="Enter account number"
            />
          </div>
          {/* Instrument Date */}
          <div>
            <label className="block text-sm font-semibold mb-1">Instrument Date</label>
            <input
              name="instrumentDate"
              type="date"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.instrumentDate}
              onChange={handleChange}
            />
          </div>
          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold mb-1">Amount</label>
            <input
              name="amount"
              type="number"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.amount}
              onChange={handleChange}
              placeholder="Enter amount"
            />
          </div>
          {/* Favouring */}
          <div>
            <label className="block text-sm font-semibold mb-1">Favouring</label>
            <input
              name="favouring"
              type="text"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.favouring}
              onChange={handleChange}
              placeholder="Enter favouring"
            />
          </div>
          {/* Signed By */}
          <div>
            <label className="block text-sm font-semibold mb-1">Signed By</label>
            <input
              name="signedBy"
              type="text"
              className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700"
              value={form.signedBy}
              onChange={handleChange}
              placeholder="Enter signed by"
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

export default InstrumentForm;
