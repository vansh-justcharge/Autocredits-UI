import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileTextIcon, ChevronDownIcon, MoreHorizontalIcon } from '../components/icons';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

// Source mapping
const sourceMap = {
  1: "Direct",
  2: "Reference Customer",
  3: "Indirect (reference)",
};

const LoanManagement = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const loanCase = state?.loanCase;

  const [userInfoExpanded, setUserInfoExpanded] = useState(true);
  const [vehicleInfoExpanded, setVehicleInfoExpanded] = useState(true);
  const [financeInfoExpanded, setFinanceInfoExpanded] = useState(true);
  const [justification, setJustification] = useState('');

  // Example chart and payment data, replace with real data as needed
  const chartData = [
    { month: 'Oct', value: 200 },
    { month: 'Nov', value: 300 },
    { month: 'Dec', value: 350 },
    { month: 'Jan', value: 320 },
    { month: 'Feb', value: 340 },
    { month: 'Mar', value: 300 },
  ];

  const paymentDates = [
    '01/11/2023',
    '02/11/2023',
    '03/11/2023',
    '04/11/2023',
    '05/11/2023',
    '06/11/2023',
  ];

  const handleLoanApproval = () => {
    console.log('Loan approved');
    // Add your approval logic here
  };

  const handleLoanRejection = () => {
    console.log('Loan rejected');
    // Add your rejection logic here, possibly using the justification state
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }, [])

  if (!loanCase) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-xl font-semibold text-gray-900">No Loan Case Data Found</h2>
          <p className="text-gray-600 mt-2">Please access this page via the loan list.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-2 py-2 bg-gray-300 rounded hover:bg-gray-400 flex items-center"
        >
          {/* Back icon from lucide */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 " fill="none" viewBox="0 0 24 24" stroke="white">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Loan Application Details */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Loan application details</h2>
          </div>
          <div className="bg-gray-100">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Phone Number</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Car Type</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-200">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {loanCase.clientInfo?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {loanCase.clientInfo?.email || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {loanCase.clientInfo?.phone || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {loanCase.vehicleInfo?.brand || 'N/A'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* User Basic Information */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div
            className="flex items-center justify-between p-6 cursor-pointer"
            onClick={() => setUserInfoExpanded(!userInfoExpanded)}
          >
            <h2 className="text-xl font-semibold text-gray-900">User Basic Information</h2>
            <ChevronDownIcon className={`transform transition-transform w-5 ${userInfoExpanded ? 'rotate-180' : ''}`} />
          </div>
          {userInfoExpanded && (
            <div className="px-6 pb-6">
              <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                {/* Row 1 */}
                <span className="text-gray-600">Customer Name - {loanCase.clientInfo?.name || 'N/A'}</span>
                <span className="text-gray-600">Case Type - {loanCase.vehicleInfo?.type || 'N/A'}</span>
                <span className="text-gray-600">Loan Amount - {loanCase.loanDetails?.netLoanAmount || 'N/A'}</span>
                {/* Row 2 */}
                <span className="text-gray-600">Finance Form - {loanCase.loanDetails?.financeForm || 'N/A'}</span>
                <span className="text-gray-600">DSA Code - {loanCase.loanDetails?.dsaCode || 'N/A'}</span>
                <span className="text-gray-600">Tenor - {loanCase.loanDetails?.tenor || 'N/A'}</span>
                {/* Row 3 */}
                <span className="text-gray-600">ROI - {loanCase.loanDetails?.roi || 'N/A'}</span>
                <span className="text-gray-600">Vehicle Model - {loanCase.vehicleInfo?.model || 'N/A'}</span>
                <span className="text-gray-600">Variant - {loanCase.vehicleInfo?.variant || 'N/A'}</span>
                {/* Row 4 */}
                <span className="text-gray-600">Reg. Number - {loanCase.vehicleInfo?.registrationNumber || 'N/A'}</span>
                <span className="text-gray-600">Ex-Showroom Price - {loanCase.vehicleInfo?.exShowroomPrice || 'N/A'}</span>
                <span className="text-gray-600">Login Date - {loanCase.loanDetails?.loginDate || 'N/A'}</span>
                {/* Row 5 */}
                <span className="text-gray-600">Time - {loanCase.loanDetails?.loginTime || 'N/A'}</span>
                <span className="text-gray-600">
                  Source - {sourceMap[loanCase.loanDetails?.source as keyof typeof sourceMap] || loanCase.loanDetails?.source || 'N/A'}
                </span>
                <span className="text-gray-600">Origin - {loanCase.loanDetails?.origin || 'N/A'}</span>
                {/* Row 6 */}
                <span className="text-gray-600">Dealt By - {loanCase.loanDetails?.dealtBy || 'N/A'}</span>
                <span className="text-gray-600">Closed By - {loanCase.loanDetails?.closedBy || 'N/A'}</span>
                <span className="text-gray-600">Pre Docs Prepared By - {loanCase.loanDetails?.preDocsPreparedBy || 'N/A'}</span>
                {/* Row 7 - EMI Details */}
                <span className="text-gray-600">EMI Type - {loanCase.loanDetails?.emiType || 'N/A'}</span>
                <span className="text-gray-600">Tenor Type - {loanCase.loanDetails?.tenorType || 'N/A'}</span>
                <span className="text-gray-600">EMI Start From - {loanCase.loanDetails?.emiStartDate || 'N/A'}</span>
              </div>
              {/* Address Section */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Address Details</h3>
                <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                  <span className="text-gray-600">Address - {loanCase.clientInfo?.address || 'N/A'}</span>
                  <span className="text-gray-600">
                    Address Proof (Aadhar) -{" "}
                    {loanCase.clientInfo?.aadharUrl ? (
                      <a href={loanCase.clientInfo.aadharUrl} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">View</a>
                    ) : (
                      "N/A"
                    )}
                  </span>
                  <span className="text-gray-600">Phone Number - {loanCase.clientInfo?.phone || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Finance Details */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div
            className="flex items-center justify-between p-6 cursor-pointer"
            onClick={() => setFinanceInfoExpanded(!financeInfoExpanded)}
          >
            <h2 className="text-xl font-semibold text-gray-900">Finance Details</h2>
            <ChevronDownIcon className={`transform transition-transform w-5 ${financeInfoExpanded ? 'rotate-180' : ''}`} />
          </div>
          {financeInfoExpanded && (
            <div className="px-6 pb-6">
              <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                <span className="text-gray-600">Case Type - {loanCase.vehicleInfo?.type || 'N/A'}</span>
                <span className="text-gray-600">Net Loan Amount - {loanCase.loanDetails?.netLoanAmount || 'N/A'}</span>
                <span className="text-gray-600">Insurance Finance - {loanCase.loanDetails?.insuranceFinance || 'N/A'}</span>
                <span className="text-gray-600">Gr. Loan Amount - {loanCase.loanDetails?.grLoanAmount || 'N/A'}</span>
                <span className="text-gray-600">ROI (Fixed/Floating) - {loanCase.loanDetails?.roiType || 'N/A'}</span>
                <span className="text-gray-600">EMI - {loanCase.loanDetails?.emi || 'AUTO'}</span>
                <span className="text-gray-600">Tenor - {loanCase.loanDetails?.tenor || 'N/A'}</span>
                <span className="text-gray-600">EMI Plan - {loanCase.loanDetails?.emiPlan || 'N/A'}</span>
                <span className="text-gray-600">EMI Starting Date - {loanCase.loanDetails?.emiStartDate || 'N/A'}</span>
                {/* Added Open and Close fields below */}
                <span className="text-gray-600">Open Amount - {loanCase.loanDetails?.open || 'N/A'}</span>
                <span className="text-gray-600">Close Amount - {loanCase.loanDetails?.close || 'N/A'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Vehicle Details Section */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div
            className="flex items-center justify-between p-6 cursor-pointer"
            onClick={() => setVehicleInfoExpanded(!vehicleInfoExpanded)}
          >
            <h2 className="text-xl font-semibold text-gray-900">Vehicle Information</h2>
            <ChevronDownIcon className={`transform transition-transform w-5 ${vehicleInfoExpanded ? 'rotate-180' : ''}`} />
          </div>
          {vehicleInfoExpanded && (
            <div className="px-6 pb-6">
              <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                <span className="text-gray-600">Make - {loanCase.vehicleInfo?.make || 'N/A'}</span>
                <span className="text-gray-600">Model - {loanCase.vehicleInfo?.model || 'N/A'}</span>
                <span className="text-gray-600">Ex Showroom Price - {loanCase.vehicleInfo?.exShowroomPrice || 'N/A'}</span>
                <span className="text-gray-600">Insurance Amount - {loanCase.vehicleInfo?.insuranceAmount || 'N/A'}</span>
                <span className="text-gray-600">Road Tax - {loanCase.vehicleInfo?.roadTax || 'N/A'}</span>
                <span className="text-gray-600">Finance From - {loanCase.vehicleInfo?.financeFrom || 'N/A'}</span>
                <span className="text-gray-600">DSA Code - {loanCase.vehicleInfo?.dsaCode || 'N/A'}</span>
                <span className="text-gray-600">Payment Favouring - {loanCase.vehicleInfo?.paymentFavouring || 'N/A'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Approval Buttons */}
        <div className="flex space-x-8 mb-6 w-full">
          <button
            onClick={handleLoanApproval}
            className="flex items-center space-x-2 px-6 py-3 bg-[#00000033] text-white rounded-lg hover:bg-[#00000033] transition-colors w-full"
          >
            <div className='p-2 bg-white rounded-md'>
              <FileTextIcon className='w-5 text-black' />
            </div>
            <span className='text-black text-[16px] font-semibold'>Loan Approved</span>
          </button>
          <button
            onClick={handleLoanRejection}
            className="flex items-center space-x-2 px-6 py-3 bg-[#00000033] text-white rounded-lg hover:bg-[#00000033] transition-colors w-full"
          >
            <div className='p-2 bg-white rounded-md'>
              <FileTextIcon className='w-5 text-black' />
            </div>
            <span className='text-black text-[16px] font-semibold'>Loan Reject</span>
          </button>
        </div>

        {/* Justification Text Area */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              type="text"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="write here justification for loan denial"
              className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>

        {/* Payment Tracking Cards */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Amount Paid</span>
              <MoreHorizontalIcon className="text-gray-400 w-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900">₹{loanCase.caseUpdate?.amountPaid || 'N/A'}</div>
            <div className="text-green-600 text-sm">{loanCase.caseUpdate?.amountPaidPercent || '+0%'}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Due Date</span>
              <MoreHorizontalIcon className="text-gray-400 w-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{loanCase.caseUpdate?.dueDate || 'N/A'}</div>
            <div className="text-gray-400 text-sm">N/A</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Payment Mode</span>
              <MoreHorizontalIcon className="text-gray-400 w-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{loanCase.caseUpdate?.paymentMode || 'N/A'}</div>
            <div className="text-gray-400 text-sm">N/A</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Pending EMIs</span>
              <MoreHorizontalIcon className="text-gray-400 w-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900">₹{loanCase.caseUpdate?.pendingEmi || 'N/A'}</div>
            <div className="text-red-600 text-sm">{loanCase.caseUpdate?.pendingEmiPercent || '-0%'}</div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-2 gap-6">
          {/* Overdue Payments Chart */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Overdue Payments</h3>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-2xl font-bold text-gray-900">₹{loanCase.caseUpdate?.overdueAmount || 'N/A'}</span>
                  <span className="text-green-600 text-sm">{loanCase.caseUpdate?.overduePercent || '-0%'}</span>
                </div>
              </div>
              <MoreHorizontalIcon className="text-gray-400 w-6" />
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Line type="monotone" dataKey="value" stroke="#6b7280" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Payment Table */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Payment Table</h3>
              <MoreHorizontalIcon className="text-gray-400 w-6" />
            </div>
            <div className="p-6">
              <div className="mb-4">
                <span className="text-sm text-gray-500">Date</span>
              </div>
              <div className="space-y-3">
                {(loanCase.caseUpdate?.paymentDates || paymentDates).map((date, index) => (
                  <div key={index} className="py-2 px-3 bg-gray-50 rounded text-sm text-gray-700">
                    {date}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoanManagement;
