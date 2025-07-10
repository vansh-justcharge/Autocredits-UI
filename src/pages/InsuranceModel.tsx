import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';

const InsuranceModel = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const insuranceCase = state?.insuranceCase;
  const mode = state?.mode || 'view';

  const [userInfoExpanded, setUserInfoExpanded] = useState(true);
  const [vehicleInfoExpanded, setVehicleInfoExpanded] = useState(true);
  const [policyInfoExpanded, setPolicyInfoExpanded] = useState(true);
  const [nomineeInfoExpanded, setNomineeInfoExpanded] = useState(true);
  const [quoteInfoExpanded, setQuoteInfoExpanded] = useState(true);
  const [newPolicyExpanded, setNewPolicyExpanded] = useState(true);
  const [paymentInfoExpanded, setPaymentInfoExpanded] = useState(true);

  const [editForm, setEditForm] = useState(insuranceCase);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEditForm(insuranceCase);
  }, [insuranceCase, mode]);

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

  const handleRootChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value.split(',').map(v => v.trim())
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_API_URL}/insurance/update/${editForm.id}`,
        editForm
      );

      alert('Insurance case updated successfully!');
      navigate(-1);
    } catch (err) {
      alert('Failed to update insurance case.');
    }
    setSaving(false);
  };

  // Helper for date fields
  const dateInput = (val, onChange) => (
    <input
      type="date"
      className="border rounded px-2 py-1 w-full"
      value={val ? val.slice(0, 10) : ''}
      onChange={e => onChange(e.target.value)}
    />
  );

  // DropDown Option
  const DROPDOWN_OPTIONS = {
    buyerTypes: ['Individual', 'Corporate'],
    genders: ['Male', 'Female', 'Other'],
    maritalStatuses: ['Single', 'Married', 'Divorced', 'Widowed'],
    paymentModes: ['Cash', 'Cheque', 'Online Transfer', 'UPI'],
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Insurance Management System" tabs={[]} activeTab="" setActiveTab={() => {}} />

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
                      ? <Input value={editForm?.buyerName} onChange={val => handleRootChange('buyerName', val)} />
                      : insuranceCase.buyerName || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {mode === 'edit'
                      ? <Input value={editForm?.email} onChange={val => handleRootChange('email', val)} />
                      : insuranceCase.email || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {mode === 'edit'
                      ? <Input value={editForm?.mobileNumber} onChange={val => handleRootChange('mobileNumber', val)} />
                      : insuranceCase.mobileNumber || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {mode === 'edit'
                      ? <Input value={editForm?.address} onChange={val => handleRootChange('address', val)} />
                      : insuranceCase.address || 'N/A'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* User Basic Information */}
        <CollapsibleSection expanded={userInfoExpanded} onToggle={() => setUserInfoExpanded(e => !e)} title="User Basic Information">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <EditableField label="Buyer Type" value={editForm?.buyerType} editable={mode === 'edit'} onChange={val => handleRootChange('buyerType', val)} />
            <EditableField label="Insurance Category" value={editForm?.insuranceCategory} editable={mode === 'edit'} onChange={val => handleRootChange('insuranceCategory', val)} />
            <EditableField label="Source" value={editForm?.source} editable={mode === 'edit'} onChange={val => handleRootChange('source', val)} />
            <EditableField label="Status" value={editForm?.status} editable={mode === 'edit'} onChange={val => handleRootChange('status', val)} />
            <EditableField label="Follow Up" value={editForm?.followUp} editable={mode === 'edit'} onChange={val => handleRootChange('followUp', val)} type="date" />
            <EditableField label="Assign To" value={editForm?.assignTo} editable={mode === 'edit'} onChange={val => handleRootChange('assignTo', val)} />
            <EditableField label="Case Comment" value={editForm?.caseComment} editable={mode === 'edit'} onChange={val => handleRootChange('caseComment', val)} />
            <EditableField label="City" value={editForm?.city} editable={mode === 'edit'} onChange={val => handleRootChange('city', val)} />
            <EditableField label="Pin" value={editForm?.pin} editable={mode === 'edit'} onChange={val => handleRootChange('pin', val)} />
            <EditableField
              label="Gender"
              value={editForm?.gender}
              editable={mode === 'edit'}
              onChange={val => handleRootChange('gender', val)}
              options={DROPDOWN_OPTIONS.genders}
            />

            <EditableField label="Marital Status" value={editForm?.maritalStatus} editable={mode === 'edit'} onChange={val => handleRootChange('maritalStatus', val)} />
            <EditableField label="DOB" value={editForm?.dob} editable={mode === 'edit'} onChange={val => handleRootChange('dob', val)} type="date" />
            <EditableField label="Occupation" value={editForm?.occupation} editable={mode === 'edit'} onChange={val => handleRootChange('occupation', val)} />
            <EditableField label="Annual Income" value={editForm?.annualIncome} editable={mode === 'edit'} onChange={val => handleRootChange('annualIncome', val)} />
            <EditableField label="PAN" value={editForm?.pan} editable={mode === 'edit'} onChange={val => handleRootChange('pan', val)} />
            <EditableField label="Aadhar" value={editForm?.adhar} editable={mode === 'edit'} onChange={val => handleRootChange('adhar', val)} />
            <EditableField label="GST" value={editForm?.gst} editable={mode === 'edit'} onChange={val => handleRootChange('gst', val)} />
          </div>
        </CollapsibleSection>

        {/* Nominee Details */}
        <CollapsibleSection expanded={nomineeInfoExpanded} onToggle={() => setNomineeInfoExpanded(e => !e)} title="Nominee & Reference Details">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <EditableField label="Nominee Name" value={editForm?.nomineeName} editable={mode === 'edit'} onChange={val => handleRootChange('nomineeName', val)} />
            <EditableField label="Nominee Age" value={editForm?.nomineeAge} editable={mode === 'edit'} onChange={val => handleRootChange('nomineeAge', val)} />
            <EditableField label="Nominee Relation" value={editForm?.nomineeRelation} editable={mode === 'edit'} onChange={val => handleRootChange('nomineeRelation', val)} />
            <EditableField label="Reference Name" value={editForm?.nomineeReferenceName} editable={mode === 'edit'} onChange={val => handleRootChange('nomineeReferenceName', val)} />
            <EditableField label="Reference Number" value={editForm?.nomineeReferenceNumber} editable={mode === 'edit'} onChange={val => handleRootChange('nomineeReferenceNumber', val)} />
          </div>
        </CollapsibleSection>

        {/* Vehicle Information */}
        <CollapsibleSection expanded={vehicleInfoExpanded} onToggle={() => setVehicleInfoExpanded(e => !e)} title="Vehicle Information">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <EditableField label="Register Number" value={editForm?.registerNumber} editable={mode === 'edit'} onChange={val => handleRootChange('registerNumber', val)} />
            <EditableField label="Make" value={editForm?.make} editable={mode === 'edit'} onChange={val => handleRootChange('make', val)} />
            <EditableField label="Model" value={editForm?.model} editable={mode === 'edit'} onChange={val => handleRootChange('model', val)} />
            <EditableField label="Variant" value={editForm?.variant} editable={mode === 'edit'} onChange={val => handleRootChange('variant', val)} />
            <EditableField label="Engine Number" value={editForm?.engineNumber} editable={mode === 'edit'} onChange={val => handleRootChange('engineNumber', val)} />
            <EditableField label="Chassi Number" value={editForm?.chassiNumber} editable={mode === 'edit'} onChange={val => handleRootChange('chassiNumber', val)} />
            <EditableField label="Make Month/Year" value={editForm?.makeMonthYear} editable={mode === 'edit'} onChange={val => handleRootChange('makeMonthYear', val)} />
            <EditableField label="Register Month/Year" value={editForm?.registerMonthYear} editable={mode === 'edit'} onChange={val => handleRootChange('registerMonthYear', val)} />
            <EditableField label="Inspection Status" value={editForm?.inspectionStatus} editable={mode === 'edit'} onChange={val => handleRootChange('inspectionStatus', val)} />
            <EditableField label="Inspection Reference No" value={editForm?.inspectionReferenceNo} editable={mode === 'edit'} onChange={val => handleRootChange('inspectionReferenceNo', val)} />
            <EditableField label="Inspection Comment" value={editForm?.inseptionComment} editable={mode === 'edit'} onChange={val => handleRootChange('inseptionComment', val)} />
          </div>
        </CollapsibleSection>

        {/* Policy Details */}
        <CollapsibleSection expanded={policyInfoExpanded} onToggle={() => setPolicyInfoExpanded(e => !e)} title="Policy Details">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <EditableField label="Insurance Company" value={editForm?.insuranceCompany} editable={mode === 'edit'} onChange={val => handleRootChange('insuranceCompany', val)} />
            <EditableField label="Branch" value={editForm?.branch} editable={mode === 'edit'} onChange={val => handleRootChange('branch', val)} />
            <EditableField label="Policy Type" value={editForm?.policyType} editable={mode === 'edit'} onChange={val => handleRootChange('policyType', val)} />
            <EditableField label="Policy Number" value={editForm?.policyNumber} editable={mode === 'edit'} onChange={val => handleRootChange('policyNumber', val)} />
            <EditableField label="Issue Date" value={editForm?.issueDate} editable={mode === 'edit'} onChange={val => handleRootChange('issueDate', val)} type="date" />
            <EditableField label="Due Date" value={editForm?.dueDate} editable={mode === 'edit'} onChange={val => handleRootChange('dueDate', val)} type="date" />
            <EditableField label="NCB Discount" value={editForm?.ncbDiscount} editable={mode === 'edit'} onChange={val => handleRootChange('ncbDiscount', val)} />
            <EditableField label="Claim Last Year" value={editForm?.claimLastYear} editable={mode === 'edit'} onChange={val => handleRootChange('claimLastYear', val)} />
          </div>
        </CollapsibleSection>

        {/* Quote Details */}
        <CollapsibleSection expanded={quoteInfoExpanded} onToggle={() => setQuoteInfoExpanded(e => !e)} title="Quote Details">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <EditableField label="Insurer" value={editForm?.insurer} editable={mode === 'edit'} onChange={val => handleRootChange('insurer', val)} />
            <EditableField label="Premium" value={editForm?.premium} editable={mode === 'edit'} onChange={val => handleRootChange('premium', val)} />
            <EditableField label="Coverage" value={editForm?.coverage} editable={mode === 'edit'} onChange={val => handleRootChange('coverage', val)} />
            <EditableField label="NCB" value={editForm?.ncb} editable={mode === 'edit'} onChange={val => handleRootChange('ncb', val)} />
            <EditableField label="Quote Insurance Duration" value={editForm?.quoteInsuranceDuration} editable={mode === 'edit'} onChange={val => handleRootChange('quoteInsuranceDuration', val)} />
            <EditableField label="Quote IDV" value={editForm?.quoteIDV} editable={mode === 'edit'} onChange={val => handleRootChange('quoteIDV', val)} />
            <EditableField label="Quote Total Premium" value={editForm?.quoteTotalPremium} editable={mode === 'edit'} onChange={val => handleRootChange('quoteTotalPremium', val)} />
            <EditableField label="Features" value={editForm?.features?.join(', ')} editable={mode === 'edit'} onChange={val => handleArrayChange('features', val)} />
          </div>
        </CollapsibleSection>

        {/* New Policy Details */}
        <CollapsibleSection expanded={newPolicyExpanded} onToggle={() => setNewPolicyExpanded(e => !e)} title="New Policy Details">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <EditableField label="Policy Issued" value={editForm?.policyIssued} editable={mode === 'edit'} onChange={val => handleRootChange('policyIssued', val)} />
            <EditableField label="New Insurance Company" value={editForm?.newInsuranceCompany} editable={mode === 'edit'} onChange={val => handleRootChange('newInsuranceCompany', val)} />
            <EditableField label="New Branch" value={editForm?.newBranch} editable={mode === 'edit'} onChange={val => handleRootChange('newBranch', val)} />
            <EditableField label="New Policy Type" value={editForm?.newPolicyType} editable={mode === 'edit'} onChange={val => handleRootChange('newPolicyType', val)} />
            <EditableField label="New Policy Number" value={editForm?.newPolicyNumber} editable={mode === 'edit'} onChange={val => handleRootChange('newPolicyNumber', val)} />
            <EditableField label="New Issue Date" value={editForm?.newIssueDate} editable={mode === 'edit'} onChange={val => handleRootChange('newIssueDate', val)} type="date" />
            <EditableField label="New Due Date" value={editForm?.newDueDate} editable={mode === 'edit'} onChange={val => handleRootChange('newDueDate', val)} type="date" />
            <EditableField label="New NCB Discount" value={editForm?.newNcbDiscount} editable={mode === 'edit'} onChange={val => handleRootChange('newNcbDiscount', val)} />
            <EditableField label="New Insurance Duration" value={editForm?.newInsuranceDuration} editable={mode === 'edit'} onChange={val => handleRootChange('newInsuranceDuration', val)} />
            <EditableField label="IDV" value={editForm?.idv} editable={mode === 'edit'} onChange={val => handleRootChange('idv', val)} />
            <EditableField label="New Total Premium" value={editForm?.NewTotalPremium} editable={mode === 'edit'} onChange={val => handleRootChange('NewTotalPremium', val)} />
          </div>
        </CollapsibleSection>

        {/* Payment Details */}
        <CollapsibleSection expanded={paymentInfoExpanded} onToggle={() => setPaymentInfoExpanded(e => !e)} title="Payment Details">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <EditableField label="Payment Amount" value={editForm?.paymentAmount} editable={mode === 'edit'} onChange={val => handleRootChange('paymentAmount', val)} />
            <EditableField label="Payment Date" value={editForm?.paymentDate} editable={mode === 'edit'} onChange={val => handleRootChange('paymentDate', val)} type="date" />
            <EditableField label="Receipt Number" value={editForm?.receiptNumber} editable={mode === 'edit'} onChange={val => handleRootChange('receiptNumber', val)} />
            <EditableField label="Receipt Date" value={editForm?.receiptDate} editable={mode === 'edit'} onChange={val => handleRootChange('receiptDate', val)} type="date" />
            <EditableField label="Bank Name" value={editForm?.bankName} editable={mode === 'edit'} onChange={val => handleRootChange('bankName', val)} />
            <EditableField label="Payment Mode" value={editForm?.paymentMode || ''} editable={mode === 'edit'} onChange={val => handleRootChange('paymentMode', val)} />
          </div>
        </CollapsibleSection>

        {/* Save/Cancel Buttons in Edit Mode */}
        {mode === 'edit' && (
          <div className="flex justify-end gap-3 mt-8">
            <button className="bg-gray-200 px-5 py-2 rounded hover:bg-gray-300" onClick={() => navigate(-1)} disabled={saving}>
              Cancel
            </button>
            <button className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
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
    <div className="flex items-center justify-between p-6 cursor-pointer" onClick={onToggle}>
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <svg className={`w-5 h-5 transform transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
    {expanded && <div className="px-6 pb-6">{children}</div>}
  </div>
);

const EditableField = ({ label, value, editable, onChange, type = 'text', options }) => {
  if (!editable) {
    return (
      <span className="text-gray-600">
        <strong>{label}:</strong> {value || '-'}
      </span>
    );
  }

  return (
    <div>
      <label className="block font-semibold mb-1">{label}</label>

      {options ? (
        <select
          className="border rounded px-2 py-1 w-full"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
        >
          <option value="">Select {label}</option>
          {options.map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          className="border rounded px-2 py-1 w-full"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
        />
      )}
    </div>
  );
};


const Input = ({ value, onChange }) => (
  <input className="border rounded px-2 py-1 w-full" value={value || ''} onChange={e => onChange(e.target.value)} />
);

export default InsuranceModel;
