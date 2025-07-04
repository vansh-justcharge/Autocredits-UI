import React, { useState } from "react";
import Navbar from "./Navbar";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import PaymentForm from "../components/Sales/PaymentForm";

// Modal Component
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100 transition"
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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

// Action Button
function ActionButton({ variant = "secondary", children, ...props }) {
  const base =
    "inline-flex items-center justify-center font-bold px-2 py-2 rounded-md text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 text-xs";
  const variants = {
    view: "bg-blue-500 hover:bg-blue-600 focus:ring-blue-300",
    edit: "bg-green-500 hover:bg-green-600 focus:ring-green-300",
    delete: "bg-red-500 hover:bg-red-600 focus:ring-red-300",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-300",
  };
  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}

// Edit Form for Payment
function EditForm({ payment, onSave, onCancel }) {
  const [form, setForm] = useState({ ...payment });
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSave(form);
      }}
      className="flex flex-col gap-2"
    >
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
        Customer:
        <input
          className="border rounded p-2 mt-1"
          value={form.customer}
          onChange={e => setForm(f => ({ ...f, customer: e.target.value }))}
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
      <label className="flex flex-col text-sm">
        Due Date:
        <input
          className="border rounded p-2 mt-1"
          value={form.dueDate}
          onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
        />
      </label>
      <label className="flex flex-col text-sm">
        Status:
        <select
          className="border rounded p-2 mt-1"
          value={form.status}
          onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
        >
          <option>Paid</option>
          <option>Pending</option>
          <option>Overdue</option>
        </select>
      </label>
      <div className="flex gap-2 mt-2">
        <ActionButton variant="edit" type="submit">Save</ActionButton>
        <ActionButton variant="secondary" type="button" onClick={onCancel}>Cancel</ActionButton>
      </div>
    </form>
  );
}

// Tabs
const TABS = [
  { label: "All Payment", filter: null },
  { label: "Car Payment", filter: "Car sale" },
  { label: "Loan EMI", filter: "Loan" },
  { label: "Insurance", filter: "Insurance" },
];

// Initial Payment Data
const initialPayments = [
  { paymentId: "1234-567", type: "Car sale", customer: "Arjun", amount: "₹8,00,000", dueDate: "March 15, 2020.", status: "Paid" },
  { paymentId: "2345-678", type: "Loan", customer: "Priya", amount: "₹7,50,000", dueDate: "June 22, 2019.", status: "Paid" },
  { paymentId: "3456-789", type: "Insurance", customer: "Rahul", amount: "₹9,00,000", dueDate: "January 10, 2023.", status: "Paid" },
  { paymentId: "4567-890", type: "Loan", customer: "Sneha", amount: "₹6,50,000", dueDate: "December 31, 2024.", status: "Paid" },
  { paymentId: "5678-901", type: "Insurance", customer: "Vikram", amount: "₹8,00,000", dueDate: "August 5, 2022.", status: "Overdue" },
  { paymentId: "6789-012", type: "Insurance", customer: "Anjali", amount: "₹9,00,000", dueDate: "April 1, 2022.", status: "Pending" },
  { paymentId: "7890-123", type: "Loan", customer: "Karan", amount: "₹7,50,000", dueDate: "February 14, 2023.", status: "Paid" },
  { paymentId: "8901-234", type: "Insurance", customer: "Neha", amount: "₹8,00,000", dueDate: "September 30, 2021.", status: "Paid" },
  { paymentId: "9012-345", type: "Insurance", customer: "Ravi", amount: "₹6,50,000", dueDate: "November 11, 2020.", status: "Paid" },
];

const PaymentTrack = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].label);
  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState("");
  const [viewRow, setViewRow] = useState(null);
  const [editRowIdx, setEditRowIdx] = useState(null);
  const [deleteRowIdx, setDeleteRowIdx] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Filter payments by tab and search
  const filteredPayments = payments.filter((p) => {
    const tabFilter = TABS.find((t) => t.label === activeTab).filter;
    const matchesTab = tabFilter ? p.type === tabFilter : true;
    const matchesSearch = p.customer.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Edit handler
  const handleSaveEdit = (updated) => {
    setPayments((ps) =>
      ps.map((p, idx) => (idx === editRowIdx ? updated : p))
    );
    setEditRowIdx(null);
  };

  // Handle new payment navigation
  const handleNewPayment = () => {
    navigate("Payment-form");
  };

  // Delete handler
  const handleDelete = (idx) => {
    setPayments((ps) => ps.filter((_, i) => i !== idx));
    setDeleteRowIdx(null);
  };

  // Only show Navbar and PaymentForm on the form route
  const isFormRoute = location.pathname.endsWith("/Payment-form");

  return (
    <>
      <div className="bg-gray-50 min-h-screen p-4">
        <Navbar
          title="Sales and Finance"
          tabs={TABS.map((t) => t.label)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        {isFormRoute ? (
          <PaymentForm onClose={() => navigate(-1)} />
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Payment Tracking</h2>
              <button onClick={handleNewPayment}
                className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-300 transition">
                Add New Payment
              </button>
            </div>
            <div className="mb-4 w-[250px]">
              <input
                type="text"
                placeholder="Search by customer name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 text-left text-gray-500 font-medium text-sm">Payment ID</th>
                    <th className="py-3 text-left text-gray-500 font-medium text-sm">Type</th>
                    <th className="py-3 text-left text-gray-500 font-medium text-sm">Customer name</th>
                    <th className="py-3 text-left text-gray-500 font-medium text-sm">Amount</th>
                    <th className="py-3 text-left text-gray-500 font-medium text-sm">Due Date</th>
                    <th className="py-3 text-left text-gray-500 font-medium text-sm">Status</th>
                    <th className="py-3 text-center text-gray-500 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-4 text-center text-gray-400">
                        No payments found.
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((p, idx) => {
                      const globalIdx = payments.findIndex(
                        (pay) => pay.paymentId === p.paymentId && pay.customer === p.customer
                      );
                      return (
                        <tr key={p.paymentId + p.customer} className="border-b border-gray-100">
                          <td className="py-4 text-gray-800">{p.paymentId}</td>
                          <td className="py-4 text-gray-800">{p.type}</td>
                          <td className="py-4 text-gray-800">{p.customer}</td>
                          <td className="py-4 text-gray-800">{p.amount}</td>
                          <td className="py-4 text-gray-800">{p.dueDate}</td>
                          <td className="py-4 text-gray-800">{p.status}</td>
                          <td className="py-4">
                            <div className="flex items-center justify-center gap-3">
                              <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition-colors"
                          onClick={() => setViewRow(p)}
                        >
                          View
                        </button>
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs transition-colors"
                          onClick={() => setEditRowIdx(globalIdx)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors"
                          onClick={() => setDeleteRowIdx(globalIdx)}
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
            {/* View Modal */}
            <Modal open={!!viewRow} onClose={() => setViewRow(null)} title="Payment Details">
              {viewRow && (
                <div className="space-y-2 text-gray-700">
                  <div><b>Payment ID:</b> {viewRow.paymentId}</div>
                  <div><b>Type:</b> {viewRow.type}</div>
                  <div><b>Customer:</b> {viewRow.customer}</div>
                  <div><b>Amount:</b> {viewRow.amount}</div>
                  <div><b>Due Date:</b> {viewRow.dueDate}</div>
                  <div><b>Status:</b> {viewRow.status}</div>
                </div>
              )}
            </Modal>
            {/* Edit Modal */}
            <Modal open={editRowIdx !== null} onClose={() => setEditRowIdx(null)} title="Edit Payment">
              {editRowIdx !== null && (
                <EditForm
                  payment={payments[editRowIdx]}
                  onSave={handleSaveEdit}
                  onCancel={() => setEditRowIdx(null)}
                />
              )}
            </Modal>
            {/* Delete Confirmation Modal */}
            <Modal open={deleteRowIdx !== null} onClose={() => setDeleteRowIdx(null)} title="Delete Payment">
              <div className="text-gray-700 mb-4">
                Are you sure you want to delete this payment?
              </div>
              <div className="flex gap-2">
                <ActionButton variant="delete" onClick={() => handleDelete(deleteRowIdx)}>
                  Delete
                </ActionButton>
                <ActionButton variant="secondary" onClick={() => setDeleteRowIdx(null)}>
                  Cancel
                </ActionButton>
              </div>
            </Modal>
          </>
        )}
      </div>
    </>
  );
};

export default PaymentTrack;
