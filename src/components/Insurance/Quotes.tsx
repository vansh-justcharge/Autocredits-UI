import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Car, ShieldCheck, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from "../../contexts/FormContext";

// List of features
const FEATURES_LIST = [
  'Cashless Garage',
  '24x7 Roadside Assistance',
  'Zero Depreciation',
  'Quick Claim Settlement',
  'Personal Accident Cover',
  'Engine Protect',
  'No Claim Bonus Saver',
  'Key Replacement',
];

const API_BASE = import.meta.env.VITE_BACKEND_API_BASE;

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[500px] max-w-full relative max-h-[90vh] overflow-y-auto">
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
  premium: string;
  coverage: string;
  ncb: string;
  features: string[];
  quoteInsuranceDuration: string;
  quoteIDV: string;
  quoteTotalPremium: string;
  pdfUrl?: string;
};

type ModalState =
  | { type: 'add'; quote: null }
  | { type: 'edit'; quote: Quote }
  | { type: 'view'; quote: Quote }
  | { type: 'delete'; quote: Quote }
  | { type: null; quote: null };

const Quotes: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [modal, setModal] = useState<ModalState>({ type: null, quote: null });
  const { updateForm } = useFormContext();
  const [selectedQuotes, setSelectedQuotes] = useState<number[]>([]);
  const [shareMode, setShareMode] = useState(false);
  const [form, setForm] = useState({
    insurer: '',
    premium: '',
    coverage: '',
    ncb: '',
    quoteInsuranceDuration: '',
    quoteIDV: '',
    quoteTotalPremium: '',
    features: [] as string[],
  });

  const navigate = useNavigate();

  // Fetch quotes from API on mount
  const fetchQuotes = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/get`);
      setQuotes(res.data);
    } catch (err) {
      console.error('Error fetching quotes', err);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  // Open modal helpers
  const openAdd = () => {
    setForm({
      insurer: '',
      premium: '',
      coverage: '',
      ncb: '',
      quoteInsuranceDuration: '',
      quoteIDV: '',
      quoteTotalPremium: '',
      features: [],
    });
    setModal({ type: 'add', quote: null });
  };
  const openEdit = (quote: Quote) => {
    setForm({
      insurer: quote.insurer,
      premium: quote.premium,
      coverage: quote.coverage,
      ncb: quote.ncb,
      quoteInsuranceDuration: quote.quoteInsuranceDuration,
      quoteIDV: quote.quoteIDV,
      quoteTotalPremium: quote.quoteTotalPremium,
      features: [...quote.features],
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

  // Handle feature checkbox changes
  const handleFeatureChange = (feature: string) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  // Validate form fields (all as strings, just check not empty)
  const validateForm = () => {
    return (
      form.insurer.trim() &&
      form.premium.trim() &&
      form.coverage.trim() &&
      form.ncb.trim() &&
      form.quoteInsuranceDuration.trim() &&
      form.quoteIDV.trim() &&
      form.quoteTotalPremium.trim()
    );
  };

  // Add quote (POST) - send all as string
  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      alert('Please fill all fields correctly.');
      return;
    }
    const newQuote = {
      insurer: form.insurer.trim(),
      premium: form.premium.trim(),
      coverage: form.coverage.trim(),
      ncb: form.ncb.trim(),
      features: form.features,
      quoteInsuranceDuration: form.quoteInsuranceDuration.trim(),
      quoteIDV: form.quoteIDV.trim(),
      quoteTotalPremium: form.quoteTotalPremium.trim(),
    };
    try {
      const res = await axios.post(`${API_BASE}/create`, newQuote);
      if (res.data && res.status !== 204) {
        setQuotes([res.data, ...quotes]);
      } else {
        await fetchQuotes();
      }
      closeModal();
    } catch (err) {
      console.error('Error adding quote', err);
      alert('Failed to add quote');
    }
  };

  // Edit quote (PUT) - send all as string
  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!modal.quote) return;
    if (!validateForm()) {
      alert('Please fill all fields correctly.');
      return;
    }
    const updatedQuote = {
      insurer: form.insurer.trim(),
      premium: form.premium.trim(),
      coverage: form.coverage.trim(),
      ncb: form.ncb.trim(),
      features: form.features,
      quoteInsuranceDuration: form.quoteInsuranceDuration.trim(),
      quoteIDV: form.quoteIDV.trim(),
      quoteTotalPremium: form.quoteTotalPremium.trim(),
    };
    try {
      const res = await axios.put(`${API_BASE}/update/${modal.quote.id}`, updatedQuote);
      if (res.data && res.status !== 204) {
        setQuotes(
          quotes.map((q) =>
            q.id === modal.quote!.id ? res.data : q
          )
        );
      } else {
        await fetchQuotes();
      }
      closeModal();
    } catch (err) {
      console.error('Error editing quote', err);
      alert('Failed to edit quote');
    }
  };

  // Delete quote (DELETE)
  const handleDelete = async () => {
    if (modal.quote) {
      try {
        await axios.delete(`${API_BASE}/delete/${modal.quote.id}`);
        setQuotes(quotes.filter((q) => q.id !== modal.quote?.id));
      } catch (err) {
        console.error('Error deleting quote', err);
        alert('Failed to delete quote');
      }
    }
    closeModal();
  };

  // Handle Buy Now
  const handleBuyNow = (quote: Quote) => {
    updateForm({
      insurer: quote.insurer,
      premium: quote.premium,
      coverage: quote.coverage,
      ncb: quote.ncb,
      features: quote.features,
      quoteInsuranceDuration: quote.quoteInsuranceDuration,
      quoteIDV: quote.quoteIDV,
      quoteTotalPremium: quote.quoteTotalPremium,
      newInsuranceCompany: quote.insurer,
      newNcbDiscount: quote.ncb,
      newInsuranceDuration: quote.quoteInsuranceDuration,
      idv: quote.quoteIDV,
      NewTotalPremium: quote.quoteTotalPremium,
    });
    navigate('/dashboard/insurance-case/New-Policy-Details');
  };

  // Handle Share Quotes button
  const handleShareQuotes = () => {
    setShareMode((prev) => {
      if (prev) setSelectedQuotes([]);
      return !prev;
    });
  };

  // Handle Copy Links
  const handleCopyLinks = () => {
    const links = quotes
      .filter((q) => selectedQuotes.includes(q.id))
      .map((q) => q.pdfUrl)
      .filter(Boolean)
      .join('\n');
    if (links) {
      navigator.clipboard.writeText(links);
      alert('PDF links copied to clipboard!');
    } else {
      alert('No quotes selected or missing PDF links.');
    }
  };

  return (
    <div className="max-w-full mx-auto p-6 mt-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Car className="w-8 h-8 text-black" /> Car Insurance Quotes
        </h1>
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-2">
            <button
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded font-semibold transition"
              onClick={openAdd}
              disabled={shareMode}
            >
              <Plus className="w-5 h-5" /> Add Quote
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded font-semibold transition ${shareMode ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}
              onClick={handleShareQuotes}
            >
               {shareMode ? 'Cancel Share' : 'Share Quotes'}
            </button>
          </div>
          {shareMode && (
            <button
              className="mt-2 bg-green-600 text-white px-4 py-2 rounded font-semibold"
              onClick={handleCopyLinks}
              disabled={selectedQuotes.length === 0}
            >
              Copy Selected Links
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
  {quotes.map((quote) => (
    <div
      key={quote.id}
      className="relative flex flex-col bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition group overflow-hidden"
    >
      {/* Checkbox for share mode */}
      {shareMode && (
        <div className="absolute top-4 right-5 z-10">
          <input
            type="checkbox"
            checked={selectedQuotes.includes(quote.id)}
            onChange={() => {
              setSelectedQuotes((prev) =>
                prev.includes(quote.id)
                  ? prev.filter((id) => id !== quote.id)
                  : [...prev, quote.id]
              );
            }}
            className="w-5 h-5 accent-violet-600 border-gray-300"
          />
        </div>
      )}

      {/* Card Header */}
      <div className="flex items-center gap-3 px-6 py-4  rounded">
        <ShieldCheck className="w-6 h-6 text-red-700" />
        <span className="text-red-black text-xl font-semibold tracking-wide">{quote.insurer}</span>
      </div>
      
      <hr className="border-t-2 border-red-500 my-4" />
      {/* Card Content */}
      <div className="px-6 py-2 flex-1 flex flex-col">
        <div className="flex flex-col gap-1 mb-2">
          <div className="flex items-center text-gray-700">
            <span className="font-medium w-32">Coverage:</span>
            <span className="ml-2">{quote.coverage}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <span className="font-medium w-32">NCB:</span>
            <span className="ml-2">{quote.ncb}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <span className="font-medium w-32">Duration:</span>
            <span className="ml-2">{quote.quoteInsuranceDuration}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <span className="font-medium w-32">IDV:</span>
            <span className="ml-2">{quote.quoteIDV}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <span className="font-medium w-32">Total Premium:</span>
            <span className="ml-2">{quote.quoteTotalPremium}</span>
          </div>
        </div>

        {/* Features */}
        <div className="mt-2">
          <span className="block text-sm font-semibold text-violet-700 mb-1">Features:</span>
          <ul className="text-sm text-gray-600 space-y-1 ml-2">
            {quote.features.map((f, idx) => (
              <li key={idx} className="flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-violet-500 mr-2"></span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-6 pb-5 pt-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="inline-block bg-violet-100 text-violet-700 px-3 py-1 rounded-full font-bold text-lg shadow">
            ₹{quote.premium}
            <span className="text-xs font-normal ml-1 text-gray-500">/year</span>
          </span>
          {!shareMode && (
            <div className="flex gap-2">
              <button
                className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold shadow transition"
                onClick={() => openView(quote)}
                title="View"
              >
                View
              </button>
              <button
                className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold shadow transition"
                onClick={() => openEdit(quote)}
                title="Edit"
              >
                Edit
              </button>
              <button
                className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold shadow transition"
                onClick={() => openDelete(quote)}
                title="Delete"
              >
                Delete
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          {quote.pdfUrl && !shareMode && (
            <a
              href={quote.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-blue-600 px-4 py-2 font-semibold  text-white rounded shadow hover:bg-blue-700 transition"
            >
              View PDF
            </a>
          )}
          {!shareMode && (
            <button
              className="bg-gradient-to-r from-red-700 to-red-600 rounded text-white px-6 py-2 font-semibold shadow  transition"
              onClick={() => handleBuyNow(quote)}
            >
              Buy Now
            </button>
          )}
        </div>
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
            <label className="block text-sm font-medium mb-1" htmlFor="add-insurer">
              Insurer
            </label>
            <select
              id="add-insurer"
              name="insurer"
              value={form.insurer}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 bg-white"
            >
              <option value="">Select Insurer</option>
              <option value="HDFC Ergo">HDFC Ergo</option>
              <option value="ICICI Lombard">ICICI Lombard</option>
              <option value="Bajaj Allianz">Bajaj Allianz</option>
              <option value="TATA AIG">TATA AIG</option>
              <option value="New India Assurance">New India Assurance</option>
              {/* Add more insurers here as needed */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="add-premium">
              Premium
            </label>
            <input
              id="add-premium"
              className="w-full border rounded px-3 py-2"
              name="premium"
              type="text"
              placeholder="Premium"
              value={form.premium}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="add-coverage">
              Coverage
            </label>
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
            <label className="block text-sm font-medium mb-1" htmlFor="add-ncb">
              NCB
            </label>
            <select
              id="add-ncb"
              name="ncb"
              className="w-full border rounded px-3 py-2"
              value={form.ncb}
              onChange={handleChange}
              required
            >
              <option value="0%">0%</option>
              <option value="20%">20%</option>
              <option value="25%">25%</option>
              <option value="35%">35%</option>
              <option value="50%">50%</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="add-duration">
              Insurance Duration
            </label>
            <input
              id="add-duration"
              className="w-full border rounded px-3 py-2"
              name="quoteInsuranceDuration"
              placeholder="e.g. 1 Year"
              value={form.quoteInsuranceDuration}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="add-idv">
              IDV
            </label>
            <input
              id="add-idv"
              className="w-full border rounded px-3 py-2"
              name="quoteIDV"
              placeholder="e.g. 5,00,000"
              value={form.quoteIDV}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="add-total-premium">
              Total Premium
            </label>
            <input
              id="add-total-premium"
              className="w-full border rounded px-3 py-2"
              name="quoteTotalPremium"
              placeholder="e.g. 7,500"
              value={form.quoteTotalPremium}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Features
            </label>
            <div className="flex flex-col gap-3">
              {FEATURES_LIST.map((feature) => (
                <label key={feature} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={form.features.includes(feature)}
                    onChange={() => handleFeatureChange(feature)}
                  />
                  {feature}
                </label>
              ))}
            </div>
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
            <label className="block text-sm font-medium mb-1" htmlFor="edit-insurer">
              Insurer
            </label>
            <select
              id="edit-insurer"
              name="insurer"
              value={form.insurer}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 bg-white"
            >
              <option value="">Select Insurer</option>
              <option value="HDFC Ergo">HDFC Ergo</option>
              <option value="ICICI Lombard">ICICI Lombard</option>
              <option value="Bajaj Allianz">Bajaj Allianz</option>
              <option value="TATA AIG">TATA AIG</option>
              <option value="New India Assurance">New India Assurance</option>
              {/* Add more insurers if needed */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="edit-premium">
              Premium
            </label>
            <input
              id="edit-premium"
              className="w-full border rounded px-3 py-2"
              name="premium"
              type="text"
              placeholder="Premium"
              value={form.premium}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="edit-coverage">
              Coverage
            </label>
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
            <label className="block text-sm font-medium mb-1" htmlFor="edit-ncb">
              NCB
            </label>
            <select
              id="edit-ncb"
              name="ncb"
              className="w-full border rounded px-3 py-2"
              value={form.ncb}
              onChange={handleChange}
              required
            >
              <option value="0%">0%</option>
              <option value="20%">20%</option>
              <option value="25%">25%</option>
              <option value="35%">35%</option>
              <option value="50%">50%</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="edit-duration">
              Insurance Duration
            </label>
            <input
              id="edit-duration"
              className="w-full border rounded px-3 py-2"
              name="quoteInsuranceDuration"
              placeholder="e.g. 1 Year"
              value={form.quoteInsuranceDuration}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="edit-idv">
              IDV
            </label>
            <input
              id="edit-idv"
              className="w-full border rounded px-3 py-2"
              name="quoteIDV"
              placeholder="e.g. 5,00,000"
              value={form.quoteIDV}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="edit-total-premium">
              Total Premium
            </label>
            <input
              id="edit-total-premium"
              className="w-full border rounded px-3 py-2"
              name="quoteTotalPremium"
              placeholder="e.g. 7,500"
              value={form.quoteTotalPremium}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Features
            </label>
            <div className="flex flex-col gap-3">
              {FEATURES_LIST.map((feature) => (
                <label key={feature} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={form.features.includes(feature)}
                    onChange={() => handleFeatureChange(feature)}
                  />
                  {feature}
                </label>
              ))}
            </div>
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
              <span className="font-medium">NCB:</span> {modal.quote.ncb}
            </div>
            <div>
              <span className="font-medium">Insurance Duration:</span> {modal.quote.quoteInsuranceDuration}
            </div>
            <div>
              <span className="font-medium">IDV:</span> {modal.quote.quoteIDV}
            </div>
            <div>
              <span className="font-medium">Total Premium:</span> {modal.quote.quoteTotalPremium}
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
