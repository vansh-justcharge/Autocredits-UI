import React, { useState } from 'react';

const LoanApprovalProcess = () => {
  const [comment, setComment] = useState('');

  // Dummy data for demonstration
  const pendingApplications = [
    {
      customerId: 'C12345',
      loanId: 'L98765',
      amount: '₹1,12,500',
      dueDate: '10/15/2023',
    },
  ];

  const auditTrail = [
    {
      action: 'Application Submitted',
      user: 'John Doe',
      timestamp: '2023-06-01 10:00 AM',
    },
    {
      action: 'Document Verification',
      user: 'Jane Smith',
      timestamp: '2023-06-02 11:30 AM',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">


      {/* Pending Loan Applications */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Pending Loan Applications</h2>
        <table className="w-full bg-white rounded-lg shadow-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 uppercase">
              <th className="px-4 py-2">Customer ID</th>
              <th className="px-4 py-2">Loan ID</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Due Date</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingApplications.map((app, idx) => (
              <tr key={idx} className="bg-gray-100">
                <td className="px-4 py-2">{app.customerId}</td>
                <td className="px-4 py-2">{app.loanId}</td>
                <td className="px-4 py-2">{app.amount}</td>
                <td className="px-4 py-2">{app.dueDate}</td>
                <td className="px-4 py-2 text-blue-600 cursor-pointer">Review</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Loan Application Details */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="font-semibold mb-2">Loan application details</h3>
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>Application ID: LA987</div>
          <div>Customer Name: Inshra Fatma</div>
          <div>Loan Amount: 25000</div>
          <div>Car Details: 2022 Toyota</div>
        </div>
        <h4 className="font-semibold mt-4 mb-2">Eligibility Criteria</h4>
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>Credit Score: 200200</div>
          <div>Annual Income: 7,658,576</div>
        </div>
      </div>

      {/* Approval Action */}
      <div className="flex space-x-4 mb-4">
        <button className="flex-1 py-3 bg-gray-200 rounded-lg font-semibold">Loan Approved</button>
        <button className="flex-1 py-3 bg-gray-200 rounded-lg font-semibold">Loan Reject</button>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <input
          className="w-full border border-gray-300 rounded-lg p-2"
          placeholder="Add your comment here..."
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <button className="mt-2 px-4 py-2 bg-gray-800 text-white rounded-lg">Submit Comment</button>
      </div>
      <div className="mb-4">
        <span className="text-gray-600">Current status - <span className="font-semibold">pending</span></span>
      </div>

      {/* Audit Trail */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h4 className="font-semibold mb-2">Audit Trail</h4>
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-500 uppercase">
              <th className="px-4 py-2">Action</th>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {auditTrail.map((row, idx) => (
              <tr key={idx} className="bg-gray-100">
                <td className="px-4 py-2">{row.action}</td>
                <td className="px-4 py-2">{row.user}</td>
                <td className="px-4 py-2">{row.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoanApprovalProcess;
