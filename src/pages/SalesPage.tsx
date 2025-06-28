import React, { useState } from 'react';
import Navbar from './Navbar';

const ITEMS_PER_PAGE = 10;

const Sales = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const tabs = ['All', 'Car sales', 'loan', 'Insurance'];

  const transactions = [
    { date: 'March 15, 2020.', customer: 'Arjun', paymentId: '1234-567', type: 'Car sale', status: 'Approved', amount: '₹8,00,000' },
    { date: 'June 22, 2019.', customer: 'Priya', paymentId: '2345-678', type: 'Loan', status: 'Approved', amount: '₹7,50,000' },
    { date: 'January 10, 2023.', customer: 'Rahul', paymentId: '3456-789', type: 'Insurance', status: 'Approved', amount: '₹9,00,000' },
    { date: 'December 31, 2024.', customer: 'Sneha', paymentId: '4567-890', type: 'Loan', status: 'Approved', amount: '₹6,50,000' },
    { date: 'August 5, 2022.', customer: 'Vikram', paymentId: '5678-901', type: 'Insurance', status: 'Approved', amount: '₹8,00,000' },
    { date: 'April 1, 2020.', customer: 'Anjali', paymentId: '6789-012', type: 'Insurance', status: 'Approved', amount: '₹9,00,000' },
    { date: 'February 14, 2023.', customer: 'Karan', paymentId: '7890-123', type: 'Loan', status: 'Approved', amount: '₹7,50,000' },
    { date: 'September 30, 2021.', customer: 'Neha', paymentId: '8901-234', type: 'Insurance', status: 'Approved', amount: '₹8,00,000' },
    { date: 'November 11, 2020.', customer: 'Ravi', paymentId: '9012-345', type: 'Insurance', status: 'Approved', amount: '₹6,50,000' },
    { date: 'March 15, 2020.', customer: 'Arjun', paymentId: '1234-567', type: 'Car sale', status: 'Approved', amount: '₹8,00,000' },
    { date: 'June 22, 2019.', customer: 'Priya', paymentId: '2345-678', type: 'Loan', status: 'Approved', amount: '₹7,50,000' },
    { date: 'January 10, 2023.', customer: 'Rahul', paymentId: '3456-789', type: 'Insurance', status: 'Approved', amount: '₹9,00,000' },
    { date: 'December 31, 2024.', customer: 'Sneha', paymentId: '4567-890', type: 'Loan', status: 'Approved', amount: '₹6,50,000' },
    { date: 'August 5, 2022.', customer: 'Vikram', paymentId: '5678-901', type: 'Insurance', status: 'Approved', amount: '₹8,00,000' },
    { date: 'April 1, 2020.', customer: 'Anjali', paymentId: '6789-012', type: 'Insurance', status: 'Approved', amount: '₹9,00,000' },
    { date: 'February 14, 2023.', customer: 'Karan', paymentId: '7890-123', type: 'Loan', status: 'Approved', amount: '₹7,50,000' },
    { date: 'September 30, 2021.', customer: 'Neha', paymentId: '8901-234', type: 'Insurance', status: 'Approved', amount: '₹8,00,000' },
    { date: 'November 11, 2020.', customer: 'Ravi', paymentId: '9012-345', type: 'Insurance', status: 'Approved', amount: '₹6,50,000' }
  ];

  // Filter transactions by active tab and search term
  const filteredTransactions = transactions.filter(transaction => {
    const matchesTab = activeTab === 'All' || transaction.type.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch = transaction.customer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Reset to first page when search or tab changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <Navbar
        title="Sales and Finance"
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="mb-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Sale Transaction</h2>
          <button className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 font-medium">
            Add Transactions
          </button>
        </div>

        {/* Search bar */}
        <div className="mb-4 w-[250px]">
          <input
            type="text"
            placeholder="Search by customer name"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>

        {/* Table Heading */}
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
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-400">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((transaction, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 text-gray-800">{transaction.customer}</td>
                    <td className="py-4 text-gray-800">{transaction.date}</td>
                    <td className="py-4 text-gray-800">{transaction.paymentId}</td>
                    <td className="py-4 text-gray-800">{transaction.type}</td>
                    <td className="py-4 text-gray-800">{transaction.status}</td>
                    <td className="py-4 text-gray-800">{transaction.amount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-between px-1 py-2 mt-4">
          <div className="text-sm text-gray-600">
            Showing {filteredTransactions.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}
            {" "}
            to {Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} of {filteredTransactions.length} entries
          </div>
          <div className="flex gap-2">
            <button
              className="px-2 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              className="px-2 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span className="px-2 py-1">
              {currentPage} / {totalPages || 1}
            </span>
            <button
              className="px-2 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </button>
            <button
              className="px-2 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
