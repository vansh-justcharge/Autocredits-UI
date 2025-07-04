import React, { useState } from 'react';
import { Car, ShieldCheck, BadgePercent, Plus, Eye, Edit, Trash2 } from 'lucide-react';

// Modal component for Add, Edit, and View
type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[500px] max-w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-400"
          onClick={onClose}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

type Quote = {
  id: number;
  insurer: string;
  premium: number;
  coverage: string;
  ncb: number;
  features: string[];
};

type ModalState =
  | { type: 'add'; quote: null }
  | { type: 'edit'; quote: Quote }
  | { type: 'view'; quote: Quote }
  | { type: 'delete'; quote: Quote }
  | { type: null; quote: null };

const initialQuotes: Quote[] = [
  {
    id: 1,
    insurer: 'SafeDrive Insurance',
    premium: 7500,
    coverage: 'Comprehensive',
    ncb: 25,
    features: ['Cashless Garage', '24x7 Roadside Assistance', 'Zero Depreciation'],
  },
  {
    id: 2,
    insurer: 'SecureWheels',
    premium: 6900,
    coverage: 'Third Party',
    ncb: 20,
    features: ['Quick Claim Settlement', 'Personal Accident Cover'],
  },
  {
    id: 3,
    insurer: 'AutoCare Protect',
    premium: 8200,
    coverage: 'Comprehensive',
    ncb: 35,
    features: ['Engine Protect', 'No Claim Bonus Saver', 'Key Replacement'],
  },
];

const Quotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [modal, setModal] = useState<ModalState>({ type: null, quote: null });
  const [form, setForm] = useState({
    insurer: '',
    premium: '',
    coverage: '',
    ncb: '',
    features: '',
  });

  // Open modal helpers
  const openAdd = () => {
    setForm({ insurer: '', premium: '', coverage: '', ncb: '', features: '' });
    setModal({ type: 'add', quote: null });
  };
  const openEdit = (quote: Quote) => {
    setForm({
      insurer: quote.insurer,
      premium: quote.premium.toString(),
      coverage: quote.coverage,
      ncb: quote.ncb.toString(),
      features: quote.features.join(', '),
    });
    setModal({ type: 'edit', quote });
  };
  const openView = (quote: Quote) => setModal({ type: 'view', quote });
  const openDelete = (quote: Quote) => setModal({ type: 'delete', quote });

  // Close modal
  const closeModal = () => setModal({ type: null, quote: null });

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add quote
  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newQuote = {
      id: Date.now(),
      insurer: form.insurer,
      premium: Number(form.premium),
      coverage: form.coverage,
      ncb: Number(form.ncb),
      features: form.features.split(',').map(f => f.trim()).filter(Boolean),
    };
    setQuotes([newQuote, ...quotes]);
    closeModal();
  };

  // Edit quote
  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!modal.quote) return;
    setQuotes(quotes.map(q =>
      q.id === modal.quote!.id
        ? {
            ...q,
            insurer: form.insurer,
            premium: Number(form.premium),
            coverage: form.coverage,
            ncb: Number(form.ncb),
            features: form.features.split(',').map(f => f.trim()).filter(Boolean),
          }
        : q
    ));
    closeModal();
  };

  // Delete quote
  const handleDelete = () => {
    if (modal.quote) {
      setQuotes(quotes.filter(q => q.id !== modal.quote?.id));
    }
    closeModal();
  };

  return (
    <div className="max-w-full mx-auto p-6 mt-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Car className="w-8 h-8 text-black" /> Car Insurance Quotes
        </h1>
        <button
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded font-semibold transition"
          onClick={openAdd}
        >
          <Plus className="w-5 h-5" /> Add Quote
        </button>
      </div>

      <div className="space-y-6">
        {quotes.map((quote) => (
          <div
            key={quote.id}
            className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-gray-100 hover:shadow-lg transition"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <span className="font-semibold text-lg">{quote.insurer}</span>
              </div>
              <div className="text-gray-600 mb-1">
                <span className="font-medium">Coverage:</span> {quote.coverage}
              </div>
              <div className="text-gray-600 mb-1">
                <BadgePercent className="inline w-4 h-4 mr-1 text-blue-500" />
                <span className="font-medium">NCB:</span> {quote.ncb}%
              </div>
              <ul className="text-sm text-gray-500 list-disc ml-6 mt-1">
                {quote.features.map((f, idx) => (
                  <li key={idx}>{f}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-end gap-2">
                <div className="flex gap-2 mb-2">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition-colors"
                  onClick={() => openView(quote)}
                  title="View"
                > View
                </button>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs transition-colors"
                  onClick={() => openEdit(quote)}
                  title="Edit"
                > Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors"
                  onClick={() => openDelete(quote)}
                  title="Delete"
                >Delete
                </button>
              </div>
              <div className="text-2xl font-bold text-black mb-2">
                ₹{quote.premium.toLocaleString()}
                <span className="text-base font-normal text-gray-500 ml-1">/year</span>
              </div>
              <button className="bg-black text-white px-6 py-2 mt-4 font-semibold hover:bg-violet-700 transition">
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center text-gray-500 text-sm">
        <span>
          Quotes are for illustration only. Premiums may vary based on your car details and profile.
        </span>
      </div>

      {/* Add Modal */}
    <Modal open={modal.type === 'add'} onClose={closeModal}>
      <h2 className="text-xl font-bold mb-4">Add Quote</h2>
      <form onSubmit={handleAdd} className="space-y-3">
        <div>
        <label className="block text-sm font-medium mb-1" htmlFor="add-insurer">Insurer</label>
        <input
          id="add-insurer"
          className="w-full border rounded px-3 py-2"
          name="insurer"
          placeholder="Insurer"
          value={form.insurer}
          onChange={handleChange}
          required
        />
        </div>
        <div>
        <label className="block text-sm font-medium mb-1" htmlFor="add-premium">Premium</label>
        <input
          id="add-premium"
          className="w-full border rounded px-3 py-2"
          name="premium"
          type="number"
          placeholder="Premium"
          value={form.premium}
          onChange={handleChange}
          required
        />
        </div>
        <div>
        <label className="block text-sm font-medium mb-1" htmlFor="add-coverage">Coverage</label>
        <input
          id="add-coverage"
          className="w-full border rounded px-3 py-2"
          name="coverage"
          placeholder="Coverage"
          value={form.coverage}
          onChange={handleChange}
          required
        />
        </div>
        <div>
        <label className="block text-sm font-medium mb-1" htmlFor="add-ncb">NCB</label>
        <select
          id="add-ncb"
          className="w-full border rounded px-3 py-2"
          name="ncb"
          value={form.ncb}
          onChange={handleChange}
          required
        >
          <option value="0">0</option>
          <option value="20">20</option>
          <option value="25">25</option>
          <option value="35">35</option>
          <option value="50">50</option>
        </select>
        </div>
        <div>
        <label className="block text-sm font-medium mb-1" htmlFor="add-features">Features (comma separated)</label>
        <input
          id="add-features"
          className="w-full border rounded px-3 py-2"
          name="features"
          placeholder="Features (comma separated)"
          value={form.features}
          onChange={handleChange}
          required
        />
        </div>
        <div className="flex justify-end gap-2">
        <button
          type="button"
          className="px-4 py-2 bg-gray-200 rounded"
          onClick={closeModal}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-violet-600 text-white rounded font-semibold"
        >
          Add
        </button>
        </div>
      </form>
    </Modal>

    {/* Edit Modal */}
    <Modal open={modal.type === 'edit'} onClose={closeModal}>
      <h2 className="text-xl font-bold mb-4">Edit Quote</h2>
      <form onSubmit={handleEdit} className="space-y-3">
        <div>
        <label className="block text-sm font-medium mb-1" htmlFor="edit-insurer">Insurer</label>
        <input
          id="edit-insurer"
          className="w-full border rounded px-3 py-2"
          name="insurer"
          placeholder="Insurer"
          value={form.insurer}
          onChange={handleChange}
          required
        />
        </div>
        <div>
        <label className="block text-sm font-medium mb-1" htmlFor="edit-premium">Premium</label>
        <input
          id="edit-premium"
          className="w-full border rounded px-3 py-2"
          name="premium"
          type="number"
          placeholder="Premium"
          value={form.premium}
          onChange={handleChange}
          required
        />
        </div>
        <div>
        <label className="block text-sm font-medium mb-1" htmlFor="edit-coverage">Coverage</label>
        <input
          id="edit-coverage"
          className="w-full border rounded px-3 py-2"
          name="coverage"
          placeholder="Coverage"
          value={form.coverage}
          onChange={handleChange}
          required
        />
        </div>
        <div>
        <label className="block text-sm font-medium mb-1" htmlFor="edit-ncb">NCB</label>
        <select
          id="edit-ncb"
          className="w-full border rounded px-3 py-2"
          name="ncb"
          value={form.ncb}
          onChange={handleChange}
          required
        >
          <option value="0">0</option>
          <option value="20">20</option>
          <option value="25">25</option>
          <option value="35">35</option>
          <option value="50">50</option>
        </select>
        </div>
        <div>
        <label className="block text-sm font-medium mb-1" htmlFor="edit-features">Features (comma separated)</label>
        <input
          id="edit-features"
          className="w-full border rounded px-3 py-2"
          name="features"
          placeholder="Features (comma separated)"
          value={form.features}
          onChange={handleChange}
          required
        />
        </div>
        <div className="flex justify-end gap-2">
        <button
          type="button"
          className="px-4 py-2 bg-gray-200 rounded"
          onClick={closeModal}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-violet-600 text-white rounded font-semibold"
        >
          Save
        </button>
        </div>
      </form>
    </Modal>

    {/* View Modal */}
    <Modal open={modal.type === 'view'} onClose={closeModal}>
      <h2 className="text-xl font-bold mb-4">Quote Details</h2>
      {modal.quote && (
        <div className="space-y-2">
        <div>
          <span className="font-medium">Insurer:</span> {modal.quote.insurer}
        </div>
        <div>
          <span className="font-medium">Premium:</span> ₹{modal.quote.premium}
        </div>
        <div>
          <span className="font-medium">Coverage:</span> {modal.quote.coverage}
        </div>
        <div>
          <span className="font-medium">NCB:</span> {modal.quote.ncb}%
        </div>
        <div>
          <span className="font-medium">Features:</span>
          <ul className="list-disc ml-6">
            {modal.quote.features.map((f, idx) => (
            <li key={idx}>{f}</li>
            ))}
          </ul>
        </div>
        </div>
      )}
    </Modal>

      {/* Delete Modal */}
      <Modal open={modal.type === 'delete'} onClose={closeModal}>
        <h2 className="text-xl font-bold mb-4 text-red-600">Delete Quote</h2>
        <p>Are you sure you want to delete this quote?</p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded font-semibold"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Quotes;
