import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Navbar from './Navbar'; // Adjust the import path as needed

const InsuranceModel = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const insuranceCase = state?.insuranceCase;
  const mode = state?.mode || 'view';
  const onSave = state?.onSave;
  const index = state?.index;

  // Collapsible sections
  const [userInfoExpanded, setUserInfoExpanded] = useState(true);
  const [vehicleInfoExpanded, setVehicleInfoExpanded] = useState(true);
  const [policyInfoExpanded, setPolicyInfoExpanded] = useState(true);

  // New collapsible sections for new fields
  const [customerDetailsExpanded, setCustomerDetailsExpanded] = useState(true);
  const [nomineeDetailsExpanded, setNomineeDetailsExpanded] = useState(true);
  const [referenceDetailsExpanded, setReferenceDetailsExpanded] = useState(true);
  const [previousPolicyExpanded, setPreviousPolicyExpanded] = useState(true);
  const [newPolicyExpanded, setNewPolicyExpanded] = useState(true);
  const [documentExpanded, setDocumentExpanded] = useState(true);

  const [editForm, setEditForm] = useState(insuranceCase);

  useEffect(() => {
    setEditForm(insuranceCase);
  }, [insuranceCase, mode]);

  // Chart and payments data
  const chartData = [
    { month: 'Oct', value: 200 },
    { month: 'Nov', value: 300 },
    { month: 'Dec', value: 350 },
    { month: 'Jan', value: 320 },
    { month: 'Feb', value: 340 },
    { month: 'Mar', value: 300 },
  ];
  const paymentDates = [
    '01/01/2023',
    '01/02/2023',
    '01/03/2023',
    '01/04/2023',
    '01/05/2023',
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!insuranceCase) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-xl font-semibold text-gray-900">No Insurance Case Data Found</h2>
          <p className="text-gray-600 mt-2">Please access this page via the insurance list.</p>
        </div>
      </div>
    );
  }

  const handleChange = (section, field, value) => {
    setEditForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // For root-level fields (like additionalDetails)
  const handleRootChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // For file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEditForm(prev => ({
      ...prev,
      document: file
    }));
  };

  const handleSave = () => {
    if (onSave && typeof index === 'number') {
      onSave(editForm, index);
    }
    alert('Saved:\n' + JSON.stringify(editForm, null, 2));
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        title="Insurance Management System"
        tabs={[]}
        activeTab=""
        setActiveTab={() => {}}
      />

      <div className="p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-2 py-2 bg-gray-300 rounded hover:bg-gray-400 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Application Details */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Insurance Application Details</h2>
          </div>
          <div className="bg-gray-100">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Address</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-200">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {mode === 'edit'
                      ? <Input value={editForm?.clientInfo?.name} onChange={val => handleChange('clientInfo', 'name', val)} />
                      : insuranceCase.clientInfo?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {mode === 'edit'
                      ? <Input value={editForm?.clientInfo?.email} onChange={val => handleChange('clientInfo', 'email', val)} />
                      : insuranceCase.clientInfo?.email || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {mode === 'edit'
                      ? <Input value={editForm?.clientInfo?.id} onChange={val => handleChange('clientInfo', 'id', val)} />
                      : insuranceCase.clientInfo?.id || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {mode === 'edit'
                      ? <Input value={editForm?.clientInfo?.address} onChange={val => handleChange('clientInfo', 'address', val)} />
                      : insuranceCase.clientInfo?.address || 'N/A'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* User Basic Information */}
        <CollapsibleSection
          expanded={userInfoExpanded}
          onToggle={() => setUserInfoExpanded(e => !e)}
          title="User Basic Information"
        >
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <EditableField label="Case Type"
              value={mode === 'edit' ? editForm?.vehicleInfo?.type : insuranceCase.vehicleInfo?.type}
              editable={mode === 'edit'} onChange={val => handleChange('vehicleInfo', 'type', val)} />
            <EditableField label="Insurance Number"
              value={mode === 'edit' ? editForm?.policyDetails?.policyNo : insuranceCase.policyDetails?.policyNo}
              editable={mode === 'edit'} onChange={val => handleChange('policyDetails', 'policyNo', val)} />
            <EditableField label="EMI Start Date"
              type="date"
              value={mode === 'edit' ? editForm?.clientInfo?.date : insuranceCase.clientInfo?.date}
              editable={mode === 'edit'} onChange={val => handleChange('clientInfo', 'date', val)} />
            <EditableField label="Last Installment Date"
              type="date"
              value={mode === 'edit' ? editForm?.policyDetails?.dueDate : insuranceCase.policyDetails?.dueDate}
              editable={mode === 'edit'} onChange={val => handleChange('policyDetails', 'dueDate', val)} />
            <EditableField label="Net Insurance Amount"
              value={`₹${(mode === 'edit' ? editForm?.policyDetails?.policyNo : insuranceCase.policyDetails?.policyNo)?.slice(0, 4) || '0'}00`}
              editable={false} />
            <EditableField label="Policy Holder"
              value={mode === 'edit' ? editForm?.clientInfo?.name : insuranceCase.clientInfo?.name}
              editable={false} />
            <EditableField label="Status"
              value={mode === 'edit' ? editForm?.policyDetails?.status : insuranceCase.policyDetails?.status}
              editable={mode === 'edit'} onChange={val => handleChange('policyDetails', 'status', val)} />
            <EditableField label="Assigned To"
              value={mode === 'edit' ? editForm?.caseDetails?.assignedTo : insuranceCase.caseDetails?.assignedTo}
              editable={mode === 'edit'} onChange={val => handleChange('caseDetails', 'assignedTo', val)} />

            {/* --- NEW FIELDS: CASE DETAILS --- */}
            <EditableField label="Buyer Type"
              value={mode === 'edit' ? editForm?.caseDetails?.buyerType : insuranceCase.caseDetails?.buyerType}
              editable={mode === 'edit'} onChange={val => handleChange('caseDetails', 'buyerType', val)} />
            <EditableField label="Insurance Category"
              value={mode === 'edit' ? editForm?.caseDetails?.insuranceCategory : insuranceCase.caseDetails?.insuranceCategory}
              editable={mode === 'edit'} onChange={val => handleChange('caseDetails', 'insuranceCategory', val)} />
            <EditableField label="Follow Up"
              value={mode === 'edit' ? editForm?.caseDetails?.followUp : insuranceCase.caseDetails?.followUp}
              editable={mode === 'edit'} onChange={val => handleChange('caseDetails', 'followUp', val)} />
            <EditableField label="Comment"
              value={mode === 'edit' ? editForm?.caseDetails?.comment : insuranceCase.caseDetails?.comment}
              editable={mode === 'edit'} onChange={val => handleChange('caseDetails', 'comment', val)} />
          </div>
        </CollapsibleSection>

        {/* --- NEW SECTION: CUSTOMER DETAILS --- */}
        <CollapsibleSection
          expanded={customerDetailsExpanded}
          onToggle={() => setCustomerDetailsExpanded(e => !e)}
          title="Customer Details"
        >
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <EditableField label="City"
              value={mode === 'edit' ? editForm?.clientInfo?.city : insuranceCase.clientInfo?.city}
              editable={mode === 'edit'} onChange={val => handleChange('clientInfo', 'city', val)} />
            <EditableField label="Pin"
              value={mode === 'edit' ? editForm?.clientInfo?.pin : insuranceCase.clientInfo?.pin}
              editable={mode === 'edit'} onChange={val => handleChange('clientInfo', 'pin', val)} />
            <EditableField label="Gender"
              value={mode === 'edit' ? editForm?.clientInfo?.gender : insuranceCase.clientInfo?.gender}
              editable={mode === 'edit'} onChange={val => handleChange('clientInfo', 'gender', val)} />
            <EditableField label="Marital Status"
              value={mode === 'edit' ? editForm?.clientInfo?.maritalStatus : insuranceCase.clientInfo?.maritalStatus}
              editable={mode === 'edit'} onChange={val => handleChange('clientInfo', 'maritalStatus', val)} />
            <EditableField label="DOB"
              type="date"
              value={mode === 'edit' ? editForm?.clientInfo?.dob : insuranceCase.clientInfo?.dob}
              editable={mode === 'edit'} onChange={val => handleChange('clientInfo', 'dob', val)} />
            <EditableField label="Occupation"
              value={mode === 'edit' ? editForm?.clientInfo?.occupation : insuranceCase.clientInfo?.occupation}
              editable={mode === 'edit'} onChange={val => handleChange('clientInfo', 'occupation', val)} />
            <EditableField label="Annual Income"
              value={mode === 'edit' ? editForm?.clientInfo?.annualIncome : insuranceCase.clientInfo?.annualIncome}
              editable={mode === 'edit'} onChange={val => handleChange('clientInfo', 'annualIncome', val)} />
            <EditableField label="PAN"
              value={mode === 'edit' ? editForm?.clientInfo?.pan : insuranceCase.clientInfo?.pan}
              editable={mode === 'edit'} onChange={val => handleChange('clientInfo', 'pan', val)} />
            <EditableField label="Aadhar"
              value={mode === 'edit' ? editForm?.clientInfo?.aadhar : insuranceCase.clientInfo?.aadhar}
              editable={mode === 'edit'} onChange={val => handleChange('clientInfo', 'aadhar', val)} />
            <EditableField label="GST No"
              value={mode === 'edit' ? editForm?.clientInfo?.gstNo : insuranceCase.clientInfo?.gstNo}
              editable={mode === 'edit'} onChange={val => handleChange('clientInfo', 'gstNo', val)} />
          </div>
        </CollapsibleSection>

        {/* --- NEW SECTION: NOMINEE DETAILS --- */}
        <CollapsibleSection
          expanded={nomineeDetailsExpanded}
          onToggle={() => setNomineeDetailsExpanded(e => !e)}
          title="Nominee Details"
        >
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <EditableField label="Nominee Name"
              value={mode === 'edit' ? editForm?.nomineeInfo?.name : insuranceCase.nomineeInfo?.name}
              editable={mode === 'edit'} onChange={val => handleChange('nomineeInfo', 'name', val)} />
            <EditableField label="Age"
              value={mode === 'edit' ? editForm?.nomineeInfo?.age : insuranceCase.nomineeInfo?.age}
              editable={mode === 'edit'} onChange={val => handleChange('nomineeInfo', 'age', val)} />
            <EditableField label="Relation"
              value={mode === 'edit' ? editForm?.nomineeInfo?.relation : insuranceCase.nomineeInfo?.relation}
              editable={mode === 'edit'} onChange={val => handleChange('nomineeInfo', 'relation', val)} />
          </div>
        </CollapsibleSection>

        {/* --- NEW SECTION: REFERENCE DETAILS --- */}
        <CollapsibleSection
          expanded={referenceDetailsExpanded}
          onToggle={() => setReferenceDetailsExpanded(e => !e)}
          title="Reference Details"
        >
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <EditableField label="Reference Name"
              value={mode === 'edit' ? editForm?.referenceInfo?.name : insuranceCase.referenceInfo?.name}
              editable={mode === 'edit'} onChange={val => handleChange('referenceInfo', 'name', val)} />
            <EditableField label="Reference Number"
              value={mode === 'edit' ? editForm?.referenceInfo?.number : insuranceCase.referenceInfo?.number}
              editable={mode === 'edit'} onChange={val => handleChange('referenceInfo', 'number', val)} />
          </div>
        </CollapsibleSection>

        {/* Vehicle Information */}
        <CollapsibleSection
          expanded={vehicleInfoExpanded}
          onToggle={() => setVehicleInfoExpanded(e => !e)}
          title="Vehicle Information"
        >
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <EditableField label="Brand"
              value={mode === 'edit' ? editForm?.vehicleInfo?.brand : insuranceCase.vehicleInfo?.brand}
              editable={mode === 'edit'} onChange={val => handleChange('vehicleInfo', 'brand', val)} />
            <EditableField label="Model"
              value={mode === 'edit' ? editForm?.vehicleInfo?.model : insuranceCase.vehicleInfo?.model}
              editable={mode === 'edit'} onChange={val => handleChange('vehicleInfo', 'model', val)} />
            <EditableField label="Showroom"
              value={mode === 'edit' ? editForm?.caseDetails?.showroom : insuranceCase.caseDetails?.showroom}
              editable={mode === 'edit'} onChange={val => handleChange('caseDetails', 'showroom', val)} />
            <EditableField label="Source"
              value={mode === 'edit' ? editForm?.caseDetails?.source : insuranceCase.caseDetails?.source}
              editable={mode === 'edit'} onChange={val => handleChange('caseDetails', 'source', val)} />
            <EditableField label="Case Status"
              value={mode === 'edit' ? editForm?.caseUpdate?.status : insuranceCase.caseUpdate?.status}
              editable={mode === 'edit'} onChange={val => handleChange('caseUpdate', 'status', val)} />
            <EditableField label="Issue Date"
              type="date"
              value={mode === 'edit' ? editForm?.caseUpdate?.addedOn : insuranceCase.caseUpdate?.addedOn}
              editable={mode === 'edit'} onChange={val => handleChange('caseUpdate', 'addedOn', val)} />

            {/* --- NEW FIELDS: VEHICLE DETAILS --- */}
            <EditableField label="Register Number"
              value={mode === 'edit' ? editForm?.vehicleInfo?.registerNumber : insuranceCase.vehicleInfo?.registerNumber}
              editable={mode === 'edit'} onChange={val => handleChange('vehicleInfo', 'registerNumber', val)} />
            <EditableField label="Variant"
              value={mode === 'edit' ? editForm?.vehicleInfo?.variant : insuranceCase.vehicleInfo?.variant}
              editable={mode === 'edit'} onChange={val => handleChange('vehicleInfo', 'variant', val)} />
            <EditableField label="Engine Number"
              value={mode === 'edit' ? editForm?.vehicleInfo?.engineNumber : insuranceCase.vehicleInfo?.engineNumber}
              editable={mode === 'edit'} onChange={val => handleChange('vehicleInfo', 'engineNumber', val)} />
            <EditableField label="Chassi Number"
              value={mode === 'edit' ? editForm?.vehicleInfo?.chassiNumber : insuranceCase.vehicleInfo?.chassiNumber}
              editable={mode === 'edit'} onChange={val => handleChange('vehicleInfo', 'chassiNumber', val)} />
            <EditableField label="Make Month/Year"
              value={mode === 'edit' ? editForm?.vehicleInfo?.makeMonthYear : insuranceCase.vehicleInfo?.makeMonthYear}
              editable={mode === 'edit'} onChange={val => handleChange('vehicleInfo', 'makeMonthYear', val)} />
            <EditableField label="Register Month/Year"
              value={mode === 'edit' ? editForm?.vehicleInfo?.registerMonthYear : insuranceCase.vehicleInfo?.registerMonthYear}
              editable={mode === 'edit'} onChange={val => handleChange('vehicleInfo', 'registerMonthYear', val)} />
          </div>
        </CollapsibleSection>

        {/* --- NEW SECTION: PREVIOUS POLICY DETAILS --- */}
        <CollapsibleSection
          expanded={previousPolicyExpanded}
          onToggle={() => setPreviousPolicyExpanded(e => !e)}
          title="Previous Policy Details"
        >
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <EditableField label="Insurance Company"
              value={mode === 'edit' ? editForm?.previousPolicy?.insuranceCompany : insuranceCase.previousPolicy?.insuranceCompany}
              editable={mode === 'edit'} onChange={val => handleChange('previousPolicy', 'insuranceCompany', val)} />
            <EditableField label="Branch"
              value={mode === 'edit' ? editForm?.previousPolicy?.branch : insuranceCase.previousPolicy?.branch}
              editable={mode === 'edit'} onChange={val => handleChange('previousPolicy', 'branch', val)} />
            <EditableField label="Policy Type"
              value={mode === 'edit' ? editForm?.previousPolicy?.policyType : insuranceCase.previousPolicy?.policyType}
              editable={mode === 'edit'} onChange={val => handleChange('previousPolicy', 'policyType', val)} />
            <EditableField label="Policy Number"
              value={mode === 'edit' ? editForm?.previousPolicy?.policyNumber : insuranceCase.previousPolicy?.policyNumber}
              editable={mode === 'edit'} onChange={val => handleChange('previousPolicy', 'policyNumber', val)} />
            <EditableField label="Issue Date"
              type="date"
              value={mode === 'edit' ? editForm?.previousPolicy?.issueDate : insuranceCase.previousPolicy?.issueDate}
              editable={mode === 'edit'} onChange={val => handleChange('previousPolicy', 'issueDate', val)} />
            <EditableField label="Due Date"
              type="date"
              value={mode === 'edit' ? editForm?.previousPolicy?.dueDate : insuranceCase.previousPolicy?.dueDate}
              editable={mode === 'edit'} onChange={val => handleChange('previousPolicy', 'dueDate', val)} />
            <EditableField label="NCB Discount"
              value={mode === 'edit' ? editForm?.previousPolicy?.ncbDiscount : insuranceCase.previousPolicy?.ncbDiscount}
              editable={mode === 'edit'} onChange={val => handleChange('previousPolicy', 'ncbDiscount', val)} />
          </div>
        </CollapsibleSection>

        {/* --- NEW SECTION: NEW POLICY DETAILS --- */}
        <CollapsibleSection
          expanded={newPolicyExpanded}
          onToggle={() => setNewPolicyExpanded(e => !e)}
          title="New Policy Details"
        >
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <EditableField label="Insurance Company"
              value={mode === 'edit' ? editForm?.newPolicy?.insuranceCompany : insuranceCase.newPolicy?.insuranceCompany}
              editable={mode === 'edit'} onChange={val => handleChange('newPolicy', 'insuranceCompany', val)} />
            <EditableField label="Branch"
              value={mode === 'edit' ? editForm?.newPolicy?.branch : insuranceCase.newPolicy?.branch}
              editable={mode === 'edit'} onChange={val => handleChange('newPolicy', 'branch', val)} />
            <EditableField label="Policy Type"
              value={mode === 'edit' ? editForm?.newPolicy?.policyType : insuranceCase.newPolicy?.policyType}
              editable={mode === 'edit'} onChange={val => handleChange('newPolicy', 'policyType', val)} />
            <EditableField label="Policy Number"
              value={mode === 'edit' ? editForm?.newPolicy?.policyNumber : insuranceCase.newPolicy?.policyNumber}
              editable={mode === 'edit'} onChange={val => handleChange('newPolicy', 'policyNumber', val)} />
            <EditableField label="Issue Date"
              type="date"
              value={mode === 'edit' ? editForm?.newPolicy?.issueDate : insuranceCase.newPolicy?.issueDate}
              editable={mode === 'edit'} onChange={val => handleChange('newPolicy', 'issueDate', val)} />
            <EditableField label="Due Date"
              type="date"
              value={mode === 'edit' ? editForm?.newPolicy?.dueDate : insuranceCase.newPolicy?.dueDate}
              editable={mode === 'edit'} onChange={val => handleChange('newPolicy', 'dueDate', val)} />
            <EditableField label="NCB Discount"
              value={mode === 'edit' ? editForm?.newPolicy?.ncbDiscount : insuranceCase.newPolicy?.ncbDiscount}
              editable={mode === 'edit'} onChange={val => handleChange('newPolicy', 'ncbDiscount', val)} />
          </div>
        </CollapsibleSection>

        {/* --- NEW SECTION: DOCUMENT UPLOAD --- */}
        <CollapsibleSection
          expanded={documentExpanded}
          onToggle={() => setDocumentExpanded(e => !e)}
          title="Document Upload"
        >
          {mode === 'edit' ? (
            <input
              type="file"
              onChange={handleFileChange}
            />
          ) : (
            <span className="text-gray-700">{insuranceCase.document?.name || 'No document uploaded'}</span>
          )}
        </CollapsibleSection>

        {/* Policy Details */}
        <CollapsibleSection
          expanded={policyInfoExpanded}
          onToggle={() => setPolicyInfoExpanded(e => !e)}
          title="Policy Details"
        >
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <EditableField label="Policy No"
              value={mode === 'edit' ? editForm?.policyDetails?.policyNo : insuranceCase.policyDetails?.policyNo}
              editable={mode === 'edit'} onChange={val => handleChange('policyDetails', 'policyNo', val)} />
            <EditableField label="Company"
              value={mode === 'edit' ? editForm?.policyDetails?.company : insuranceCase.policyDetails?.company}
              editable={mode === 'edit'} onChange={val => handleChange('policyDetails', 'company', val)} />
            <EditableField label="Due Date"
              type="date"
              value={mode === 'edit' ? editForm?.policyDetails?.dueDate : insuranceCase.policyDetails?.dueDate}
              editable={mode === 'edit'} onChange={val => handleChange('policyDetails', 'dueDate', val)} />
            <EditableField label="Status"
              value={mode === 'edit' ? editForm?.policyDetails?.status : insuranceCase.policyDetails?.status}
              editable={mode === 'edit'} onChange={val => handleChange('policyDetails', 'status', val)} />
            {/* Additional Details as editable field */}
            <EditableField
              label="Additional Details"
              value={mode === 'edit' ? editForm?.additionalDetails : insuranceCase.additionalDetails}
              editable={mode === 'edit'}
              onChange={val => handleRootChange('additionalDetails', val)}
              type="text"
            />
          </div>
        </CollapsibleSection>

        {/* Payment Tracking Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <SummaryCard label="Amount Paid" value="₹3,500" color="green" />
          <SummaryCard label="Due Date" value={insuranceCase.policyDetails?.dueDate || "N/A"} color="gray" />
          <SummaryCard label="Payment Mode" value="Card" color="gray" />
          <SummaryCard label="Pending EMIs" value="₹1,200" color="red" />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overdue Payments Chart */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Overdue Payments</h3>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-2xl font-bold text-gray-900">₹500</span>
                  <span className="text-green-600 text-sm">+0%</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Payment Table */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Payment Table</h3>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <span className="text-sm text-gray-500">Date</span>
              </div>
              <div className="space-y-3">
                {paymentDates.map((date, index) => (
                  <div key={index} className="py-2 px-3 bg-gray-50 rounded text-sm text-gray-700">
                    {date}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Save/Cancel Buttons in Edit Mode */}
        {mode === 'edit' && (
          <div className="flex justify-end gap-3 mt-8">
            <button
              className="bg-gray-200 px-5 py-2 rounded hover:bg-gray-300"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Collapsible section helper
const CollapsibleSection = ({ expanded, onToggle, title, children }) => (
  <div className="bg-white rounded-lg shadow-sm mb-6">
    <div
      className="flex items-center justify-between p-6 cursor-pointer"
      onClick={onToggle}
    >
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <svg className={`w-5 h-5 transform transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
    {expanded && <div className="px-6 pb-6">{children}</div>}
  </div>
);

// Editable field helper
const EditableField = ({ label, value, editable, onChange, type = 'text' }) => {
  if (!editable) {
    return (
      <span className="text-gray-600">
        <strong>{label}:</strong> {value || '-'}
      </span>
    );
  }
  if (type === 'date') {
    return (
      <div>
        <label className="block font-semibold mb-1">{label}</label>
        <input
          type="date"
          className="border rounded px-2 py-1 w-full"
          value={value ? value.slice(0, 10) : ''}
          onChange={e => onChange(e.target.value)}
        />
      </div>
    );
  }
  return (
    <div>
      <label className="block font-semibold mb-1">{label}</label>
      <input
        type="text"
        className="border rounded px-2 py-1 w-full"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
};

// Simple input for table cells
const Input = ({ value, onChange }) => (
  <input
    className="border rounded px-2 py-1 w-full"
    value={value || ''}
    onChange={e => onChange(e.target.value)}
  />
);

const SummaryCard = ({ label, value, color }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center">
    <div className={`text-gray-600 text-sm mb-1`}>{label}</div>
    <div className={`text-2xl font-bold ${color === 'green' ? 'text-green-600' : color === 'red' ? 'text-red-600' : 'text-gray-900'}`}>{value}</div>
  </div>
);

export default InsuranceModel;
