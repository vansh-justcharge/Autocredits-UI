import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import CarForm from "../components/Sales/CarForm";
import LoanForm from "../components/Sales/LoanForm";
import InsuranceForm from "../components/Sales/InsuranceForm";

// Modal Component with improved UI
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-colors">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100 transition"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-4">{children}</div>
        <div className="px-6 py-3 border-t bg-gray-50 flex justify-end gap-2 rounded-b-2xl">
          <button
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold transition"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Edit Form Component
function EditForm({ transaction, onSave, onCancel }) {
  const [form, setForm] = useState({ ...transaction });
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSave(form);
      }}
      className="flex flex-col gap-2"
    >
      <label className="flex flex-col text-sm">
        Customer:
        <input
          className="border rounded p-2 mt-1"
          value={form.customer}
          onChange={e => setForm(f => ({ ...f, customer: e.target.value }))}
        />
      </label>
      <label className="flex flex-col text-sm">
        Date:
        <input
          className="border rounded p-2 mt-1"
          value={form.date}
          onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
        />
      </label>
      <label className="flex flex-col text-sm">
        Payment ID:
        <input
          className="border rounded p-2 mt-1"
          value={form.paymentId}
          onChange={e => setForm(f => ({ ...f, paymentId: e.target.value }))}
        />
      </label>
      <label className="flex flex-col text-sm">
        Type:
        <select
          className="border rounded p-2 mt-1"
          value={form.type}
          onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
        >
          <option>Car sale</option>
          <option>Loan</option>
          <option>Insurance</option>
        </select>
      </label>
      <label className="flex flex-col text-sm">
        Status:
        <input
          className="border rounded p-2 mt-1"
          value={form.status}
          onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
        />
      </label>
      <label className="flex flex-col text-sm">
        Amount:
        <input
          className="border rounded p-2 mt-1"
          value={form.amount}
          onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
        />
      </label>
      <div className="flex gap-2 mt-2">
        <ActionButton variant="edit" type="submit">Save</ActionButton>
        <ActionButton variant="secondary" type="button" onClick={onCancel}>Cancel</ActionButton>
      </div>
    </form>
  );
}

// Tab Content Component
function SalesTab({ type, transactions, setTransactions }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [viewRow, setViewRow] = useState(null);
  const [editRowIdx, setEditRowIdx] = useState(null);

  // Pagination
  const ITEMS_PER_PAGE = 10;
  const filtered = transactions.filter((t) => {
    const matchesTab = !type || t.type.toLowerCase() === type.toLowerCase();
    const matchesSearch = t.customer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, type]);

  // Delete handler
  const handleDelete = idx => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      setTransactions(ts => ts.filter((_, i) => i !== idx));
    }
  };

  // Edit handler
  const handleSaveEdit = (updated) => {
    setTransactions(ts =>
      ts.map((t, idx) => (idx === editRowIdx ? updated : t))
    );
    setEditRowIdx(null);
  };

  return (
    <div>
      <div className="mb-4 w-[250px]">
        <input
          type="text"
          placeholder="Search by customer name"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full"
        />
      </div>
      <h3 className="text-xl font-semibold mb-2">Sales Transactions Table</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 text-left text-gray-500 font-medium text-sm">Customer</th>
              <th className="py-3 text-left text-gray-500 font-medium text-sm">Date</th>
              <th className="py-3 text-left text-gray-500 font-medium text-sm">Payment ID</th>
              <th className="py-3 text-left text-gray-500 font-medium text-sm">Type</th>
              <th className="py-3 text-left text-gray-500 font-medium text-sm">Status</th>
              <th className="py-3 text-left text-gray-500 font-medium text-sm">Amount</th>
              <th className="py-3 text-center text-gray-500 font-medium text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-4 text-center text-gray-400">
                  No transactions found.
                </td>
              </tr>
            ) : (
              paginated.map((transaction, index) => {
                const globalIdx = (currentPage - 1) * ITEMS_PER_PAGE + index;
                return (
                  <tr key={globalIdx} className="border-b border-gray-100">
                    <td className="py-4 text-gray-800">{transaction.customer}</td>
                    <td className="py-4 text-gray-800">{transaction.date}</td>
                    <td className="py-4 text-gray-800">{transaction.paymentId}</td>
                    <td className="py-4 text-gray-800">{transaction.type}</td>
                    <td className="py-4 text-gray-800">{transaction.status}</td>
                    <td className="py-4 text-gray-800">{transaction.amount}</td>
                    <td className="py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition-colors"
                          onClick={() => setViewRow(transaction)}
                        >
                          View
                        </button>
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs transition-colors"
                          onClick={() => setViewRow(transaction)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors"
                          onClick={() => handleDelete(globalIdx)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between px-1 py-2 mt-4">
        <div className="text-sm text-gray-600">
          Showing {filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}
          {" "}to {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} entries
        </div>
        <div className="flex gap-2">
          <button
            className="px-2 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            First
          </button>
          <button
            className="px-2 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="px-2 py-1">
            {currentPage} / {totalPages || 1}
          </span>
          <button
            className="px-2 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </button>
          <button
            className="px-2 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Last
          </button>
        </div>
      </div>
      {/* View Modal */}
      <Modal open={!!viewRow} onClose={() => setViewRow(null)} title="Transaction Details">
        {viewRow && (
          <div className="space-y-2 text-gray-700">
            <div><b>Customer:</b> {viewRow.customer}</div>
            <div><b>Date:</b> {viewRow.date}</div>
            <div><b>Payment ID:</b> {viewRow.paymentId}</div>
            <div><b>Type:</b> {viewRow.type}</div>
            <div><b>Status:</b> {viewRow.status}</div>
            <div><b>Amount:</b> {viewRow.amount}</div>
          </div>
        )}
      </Modal>
      {/* Edit Modal */}
      <Modal open={editRowIdx !== null} onClose={() => setEditRowIdx(null)} title="Edit Transaction">
        {editRowIdx !== null && (
          <EditForm
            transaction={transactions[editRowIdx]}
            onSave={handleSaveEdit}
            onCancel={() => setEditRowIdx(null)}
          />
        )}
      </Modal>
    </div>
  );
}

const initialTransactions = [
  { date: 'March 15, 2020.', customer: 'Arjun', paymentId: '1234-567', type: 'Car sale', status: 'Approved', amount: '₹8,00,000' },
  { date: 'June 22, 2019.', customer: 'Priya', paymentId: '2345-678', type: 'Loan', status: 'Approved', amount: '₹7,50,000' },
  { date: 'January 10, 2023.', customer: 'Rahul', paymentId: '3456-789', type: 'Insurance', status: 'Approved', amount: '₹9,00,000' },
];

const TABS = [
  { label: "All", path: "/dashboard/sales" },
  { label: "Car sales", path: "/dashboard/sales/car" },
  { label: "Loan", path: "/dashboard/sales/loan" },
  { label: "Insurance", path: "/dashboard/sales/insurance" }
];

const dropdownBtn =
  "px-4 py-2 bg-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-300 transition";
const dropdownMenu =
  "absolute mt-2 left-0 bg-white rounded-xl shadow-lg flex flex-col w-44 z-10 border";
const dropdownItem = (active) =>
  `px-4 py-2 m-1 rounded-lg text-center text-gray-700 font-medium cursor-pointer transition ${
    active ? "bg-gray-400 text-white" : "hover:bg-gray-100"
  }`;

const SalesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Transactions state
  const [transactions, setTransactions] = useState(initialTransactions);

  // Tabs
  const getActiveTab = () => {
    if (location.pathname.endsWith("/car")) return "Car sales";
    if (location.pathname.endsWith("/loan")) return "Loan";
    if (location.pathname.endsWith("/insurance")) return "Insurance";
    return "All";
  };
  const [activeTab, setActiveTab] = useState(getActiveTab());
  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [location.pathname]);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const tabObj = TABS.find((t) => t.label === tab);
    if (tabObj) navigate(tabObj.path);
  };

  // Dropdown: use navigate to route to the correct form
  const handleDropdownSelect = (type) => {
    setDropdownOpen(false);
    if (type === "car") {
      navigate("/dashboard/sales/car-form");
    } else if (type === "loan") {
      navigate("/dashboard/sales/loan-form");
    } else if (type === "insurance") {
      navigate("/dashboard/sales/insurance-form");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <Navbar
        title="Sales and Finance"
        tabs={TABS.map((t) => t.label)}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Sale Transaction</h2>
        <div className="relative">
          <button
            className={dropdownBtn}
            onClick={() => setDropdownOpen((open) => !open)}
          >
            Add Transactions
          </button>
          {dropdownOpen && (
            <div className={dropdownMenu}>
              <div
                className={dropdownItem(false)}
                onClick={() => handleDropdownSelect("car")}
              >
                Car Sales
              </div>
              <div
                className={dropdownItem(false)}
                onClick={() => handleDropdownSelect("loan")}
              >
                Loan
              </div>
              <div
                className={dropdownItem(false)}
                onClick={() => handleDropdownSelect("insurance")}
              >
                Insurance
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tab Routes */}
      <Routes>
        <Route index element={<SalesTab type={null} transactions={transactions} setTransactions={setTransactions} />} />
        <Route path="car" element={<SalesTab type="Car sale" transactions={transactions} setTransactions={setTransactions} />} />
        <Route path="loan" element={<SalesTab type="Loan" transactions={transactions} setTransactions={setTransactions} />} />
        <Route path="insurance" element={<SalesTab type="Insurance" transactions={transactions} setTransactions={setTransactions} />} />

        {/* Form Routes: Only Navbar and Form visible */}
        <Route
          path="car-form"
          element={<CarForm onClose={() => navigate(-1)} />}
        />
        <Route
          path="loan-form"
          element={<LoanForm onClose={() => navigate(-1)} />}
        />
        <Route
          path="insurance-form"
          element={<InsuranceForm onClose={() => navigate(-1)} />}
        />
      </Routes>
    </div>
  );
};

export default SalesPage;
