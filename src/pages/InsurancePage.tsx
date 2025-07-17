import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useFormContext } from '../contexts/FormContext';

type FormData = {
  leadId?: number; // Added leadId to link insurance with a lead
  buyerName: string;
  mobileNumber: string;
  buyerType: string;
  insuranceCategory: string;
  source: string;
  status: string;
  followUp: string;
  assignTo: string;
  caseComment: string;
  email: string;
  address: string;
  city: string;
  pin: string;
  gender: string;
  maritalStatus: string;
  dob: string;
  occupation: string;
  annualIncome: string;
  pan: string;
  adhar: string;
  gst: string;
  nomineeName: string;
  nomineeAge: string;
  nomineeRelation: string;
  nomineeReferenceName: string;
  nomineeReferenceNumber: string;
  registerNumber: string;
  make: string;
  model: string;
  variant: string;
  engineNumber: string;
  chassiNumber: string;
  makeMonthYear: string;
  registerMonthYear: string;
  inspectionStatus: string;
  inspectionReferenceNo: string;
  inseptionComment: string;
  insuranceCompany: string;
  branch: string;
  policyType: string;
  policyNumber: string;
  issueDate: string;
  dueDate: string;
  ncbDiscount: string;
  claimLastYear: string;
  insurer: string;
  premium: string;
  coverage: string;
  ncb: string;
  quoteInsuranceDuration: string;
  quoteIDV: string;
  quoteTotalPremium: string;
  features: string[];
  policyIssued: string;
  newInsuranceCompany: string;
  newBranch: string;
  newPolicyType: string;
  newPolicyNumber: string;
  newIssueDate: string;
  newDueDate: string;
  newNcbDiscount: string;
  newInsuranceDuration: string;
  idv: string;
  NewTotalPremium: string;
  paymentAmount: string;
  paymentDate: string;
  receiptNumber: string;
  receiptDate: string;
  bankName: string;
  documentUrls: string[];
};

interface InsuranceCase {
  id: number;
  buyerName: string;
  mobileNumber: string;
  buyerType: string;
  insuranceCategory: string;
  source: string;
  status: string;
  followUp: string;
  assignTo: string;
  caseComment: string;
  email: string;
  address: string;
  city: string;
  pin: string;
  gender: string;
  maritalStatus: string;
  dob: string;
  occupation: string;
  annualIncome: string;
  pan: string;
  adhar: string;
  gst: string;
  nomineeName: string;
  nomineeAge: string;
  nomineeRelation: string;
  nomineeReferenceName: string;
  nomineeReferenceNumber: string;
  registerNumber: string;
  make: string;
  model: string;
  variant: string;
  engineNumber: string;
  chassiNumber: string;
  makeMonthYear: string;
  registerMonthYear: string;
  inspectionStatus: string;
  inspectionReferenceNo: string;
  inseptionComment: string;
  insuranceCompany: string;
  branch: string;
  policyType: string;
  policyNumber: string;
  issueDate: string;
  dueDate: string;
  ncbDiscount: string;
  claimLastYear: string;
  insurer: string;
  premium: string;
  coverage: string;
  ncb: string;
  quoteInsuranceDuration: string;
  quoteIDV: string;
  quoteTotalPremium: string;
  features: string[];
  policyIssued: string;
  newInsuranceCompany: string;
  newBranch: string;
  newPolicyType: string;
  newPolicyNumber: string;
  newIssueDate: string;
  newDueDate: string;
  newNcbDiscount: string;
  newInsuranceDuration: string;
  idv: string;
  NewTotalPremium: string;
  paymentAmount: string;
  paymentDate: string;
  receiptNumber: string;
  receiptDate: string;
  bankName: string;
  paymentMode: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Lead {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: string;
  service: string;
  status: string;
  assignedTo: string;
  lastContact: string;
  additionalDetails: string;
  createdAt?: string;
}

// Map Lead to FormData including leadId for linking
function mapLeadToFormData(lead: Lead): Partial<FormData> {
  return {
    leadId: lead.id,
    buyerName: `${lead.firstName} ${lead.lastName}`,
    mobileNumber: lead.phone,
    email: lead.email,
    source: lead.source,
  };
}

const PAGE_SIZE = 10;
const SOURCE_OPTIONS = [
  "Source",
  "Online",
  "Dealer",
  "Referral"
];
const STATUS_OPTIONS = [
  "Status",
  "Pending",
  "Follow Up",
  "Closed"
];

type TableRow = { type: 'case', data: InsuranceCase } | { type: 'lead', data: Lead };

const InsurancePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [filters, setFilters] = useState({
    dealer: '',
    source: 'Source',
    status: 'Status',
    fromDate: '',
    toDate: ''
  });
  const [page, setPage] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const { updateForm, resetForm } = useFormContext();
  const [allCases, setAllCases] = useState<InsuranceCase[]>([]);
  const [insuranceLeads, setInsuranceLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const casesRes = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/insurance/get`);
        setAllCases(casesRes.data || []);
        const leadsRes = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/leads?service=Insurance`);
        setInsuranceLeads(leadsRes.data || []);
      } catch (err) {
        setAllCases([]);
        setInsuranceLeads([]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);
  
  const insuranceCaseLeadIds = new Set(allCases.map(c => c.leadId));
  const insuranceLeadsOnly = insuranceLeads.filter(
    lead => !insuranceCaseLeadIds.has(lead.id)
  );


  // Merge for display
  const mergedRows: TableRow[] = [
    ...allCases.map(c => ({ type: 'case', data: c })),
    ...insuranceLeadsOnly.map(l => ({ type: 'lead', data: l }))
  ];

  // Filtering logic for both cases and leads
  const filteredRows = mergedRows.filter((row) => {
  const dealerSearch = filters.dealer.trim().toLowerCase();
  const statusFilter = filters.status !== 'Status';
  const sourceFilter = filters.source !== 'Source';

  if (row.type === 'case') {
    const c = row.data;

    // Dealer search
    if (dealerSearch) {
      if (
        !(c.buyerName?.toLowerCase().includes(dealerSearch) ||
          c.mobileNumber?.toLowerCase().includes(dealerSearch))
      ) return false;
    }

    // Source filter
    if (sourceFilter && c.source !== filters.source) return false;

    // Status filter
    if (statusFilter && c.status !== filters.status) return false;

    // Date filters
    const created = c.createdAt?.slice(0, 10) || '';
    if (filters.fromDate && created < filters.fromDate) return false;
    if (filters.toDate && created > filters.toDate) return false;

    return true;

  } else {
    const l = row.data;

    // Dealer search
    if (dealerSearch) {
      if (
        !((`${l.firstName} ${l.lastName}`)?.toLowerCase().includes(dealerSearch) ||
          l.phone?.toLowerCase().includes(dealerSearch))
      ) return false;
    }

    // Source filter
    if (sourceFilter && l.source !== filters.source) return false;

    // ✅ Add missing Status filter for non-case rows
    if (statusFilter && l.status !== filters.status) return false;

    // Date filters
    const created = l.createdAt?.slice(0, 10) || '';
    if (filters.fromDate && created < filters.fromDate) return false;
    if (filters.toDate && created > filters.toDate) return false;

    return true;
  }
});


  const total = filteredRows.length;
  const pageCount = Math.ceil(total / PAGE_SIZE);
  const paginatedRows = filteredRows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Handlers for filters and pagination
  const handleDealerSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, dealer: e.target.value });
    setPage(0);
  };

  const handleFilterDropdown = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value
    }));
    setPage(0);
  };

  const handleDateChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value
    }));
    setPage(0);
  };

  // Navigation handlers for insurance cases
  const handleView = (caseItem: InsuranceCase) => {
    navigate('/dashboard/insurance/model', { state: { insuranceCase: caseItem, mode: 'view' } });
  };

  const handleEdit = (caseItem: InsuranceCase) => {
    navigate('/dashboard/insurance/model', { state: { insuranceCase: caseItem, mode: 'edit' } });
  };

  // Delete handlers
  const handleDelete = (indexOnPage: number) => {
    setDeleteIndex(indexOnPage);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteIndex === null) return;
    const row = paginatedRows[deleteIndex];
    if (!row || row.type !== 'case') {
      setShowDeleteModal(false);
      setDeleteIndex(null);
      return;
    }
    const caseToDelete = row.data;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_API_URL}/api/insurance/delete/${caseToDelete.id}`);
      const globalIndex = allCases.findIndex((item) => item.id === caseToDelete.id);
      if (globalIndex !== -1) {
        const newCases = [...allCases];
        newCases.splice(globalIndex, 1);
        setAllCases(newCases);
        if ((page > 0) && ((newCases.length - page * PAGE_SIZE) <= 0)) {
          setPage(page - 1);
        }
      }
      setShowDeleteModal(false);
      setDeleteIndex(null);
    } catch (err) {
      alert('Failed to delete insurance case from server.');
      setShowDeleteModal(false);
      setDeleteIndex(null);
    }
  };

  // Add insurance from lead: reset form, update with lead data including leadId, navigate to form
  const handleAddInsuranceFromLead = (lead: Lead) => {
    resetForm();
    updateForm(mapLeadToFormData(lead));
    navigate('/dashboard/insurance-case');
  };

  return (
    <div className="max-w-full bg-gray-50 min-h-screen">
      {Navbar && (
        <Navbar
          title="Insurance Management"
          tabs={['Overview']}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
      <div className="p-4 md:p-6">
        {/* Filters and Add New Insurance Button */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-2">
          <div className="flex flex-wrap items-center gap-4">
            <input
              type="text"
              placeholder="Search by Buyer Name or Mobile"
              value={filters.dealer}
              onChange={handleDealerSearch}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-64"
            />
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm min-w-32"
              value={filters.source}
              onChange={e => handleFilterDropdown('source', e.target.value)}
            >
              {SOURCE_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm min-w-32"
              value={filters.status}
              onChange={e => handleFilterDropdown('status', e.target.value)}
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <div className="flex items-center gap-2 px-3 py-2 rounded-md">
              <span className="text-sm text-gray-700">Created:</span>
              <input
                type="date"
                value={filters.fromDate}
                onChange={e => handleDateChange('fromDate', e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                placeholder="From"
                max={filters.toDate || undefined}
              />
              <span className="mx-1 text-gray-500">to</span>
              <input
                type="date"
                value={filters.toDate}
                onChange={e => handleDateChange('toDate', e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                placeholder="To"
                min={filters.fromDate || undefined}
              />
            </div>
            <button
              className="ml-2 px-3 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-100"
              onClick={() => {
                setFilters({
                  dealer: '',
                  source: 'Source',
                  status: 'Status',
                  fromDate: '',
                  toDate: ''
                });
                setPage(0);
              }}
            >
              Reset
            </button>
          </div>
          <button
            onClick={() => navigate("/dashboard/insurance-case")}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Add New Insurance
          </button>
        </div>
        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading insurance cases...</div>
          ) : (
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-3 md:px-4 py-3 text-left align-top text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Buyer Info
                </th>
                <th className="px-3 md:px-4 py-3 text-left align-top text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle Info
                </th>
                <th className="px-3 md:px-4 py-3 text-left align-top text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Policy Details
                </th>
                <th className="px-3 md:px-4 py-3 text-left align-top text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status & Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                    No insurance cases or leads found.
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row, index) => {
                  if (row.type === 'case') {
                    const caseItem = row.data;
                    return (
                      <tr key={`case-${caseItem.id}`} className="hover:bg-gray-50 align-top">
                        <td className="px-3 md:px-4 py-3 text-left align-top break-words min-w-[180px]">
                          <div className="font-semibold text-gray-900">{caseItem.buyerName}</div>
                          <div className="text-xs text-gray-500">{caseItem.mobileNumber}</div>
                          <div className="text-xs text-gray-500">{caseItem.email}</div>
                          <div className="text-xs text-gray-500">{caseItem.address}, {caseItem.city}</div>
                          <div className="text-xs text-gray-500">Created: {caseItem.createdAt?.slice(0,10)}</div>
                        </td>
                        <td className="px-3 md:px-4 py-3 text-left align-top break-words min-w-[180px]">
                          <div className="font-semibold text-gray-900">{caseItem.make} {caseItem.model} ({caseItem.variant})</div>
                          <div className="text-xs text-gray-500">Reg: {caseItem.registerNumber}</div>
                          <div className="text-xs text-gray-500">Year: {caseItem.makeMonthYear}</div>
                        </td>
                        <td className="px-3 md:px-4 py-3 text-left align-top break-words min-w-[180px]">
                          <div className="text-xs font-semibold text-gray-900">No: {caseItem.policyNumber}</div>
                          <div className="text-xs text-gray-500">{caseItem.insuranceCompany}</div>
                          <div className="text-xs text-gray-500">Due: {caseItem.dueDate}</div>
                          <div className="mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              caseItem.status === 'Expired'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {caseItem.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 md:px-4 py-3 text-left align-top min-w-[130px]">
                          <div className="flex flex-row flex-wrap gap-2 md:flex-col md:gap-2">
                            <button
                              className="bg-white border border-gray-300 rounded px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 min-w-[54px]"
                              onClick={() => handleView(caseItem)}
                            >
                              View
                            </button>
                            <button
                              className="bg-blue-600 text-white rounded px-2 py-1 text-xs hover:bg-blue-700 min-w-[54px]"
                              onClick={() => handleEdit(caseItem)}
                            >
                              Edit
                            </button>
                            <button
                              className="bg-red-600 text-white rounded px-2 py-1 text-xs hover:bg-red-700 min-w-[54px]"
                              onClick={() => handleDelete(index)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  } else {
                    const lead = row.data;
                    return (
                      <tr key={`lead-${lead.id}`} className="hover:bg-gray-50 align-top ">
                        <td className="px-3 md:px-4 py-3 text-left align-top break-words min-w-[180px]">
                          <div className="font-semibold text-gray-900">{lead.firstName} {lead.lastName}</div>
                          <div className="text-xs text-gray-500">{lead.phone}</div>
                          <div className="text-xs text-gray-500">{lead.email}</div>
                          <div className="text-xs text-gray-500">Created: {lead.createdAt?.slice(0,10)}</div>
                        </td>
                        <td colSpan={2} className="px-3 md:px-4 py-3 text-left align-top break-words min-w-[180px]">
                          <span className="text-xs text-gray-400">No insurance data yet</span>
                        </td>
                        <td className="px-3 md:px-4 py-3 text-left align-top min-w-[130px]">
                          <button
                            className="bg-green-600 text-white rounded px-2 py-1 text-xs hover:bg-green-700 min-w-full "
                            onClick={() => handleAddInsuranceFromLead(lead)}
                          >
                            Add Insurance
                          </button>
                        </td>
                      </tr>
                    );
                  }
                })
              )}
            </tbody>
          </table>
          )}
          {/* Pagination Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between px-4 py-2 gap-2">
            <div className="text-sm text-gray-600">
              Showing {paginatedRows.length > 0 ? page * PAGE_SIZE + 1 : 0} to {Math.min((page + 1) * PAGE_SIZE, total)} of {total} entries
            </div>
            <div className="flex gap-1 flex-wrap">
              <button
                className="px-2 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
                onClick={() => setPage(0)}
                disabled={page === 0}
              >
                First
              </button>
              <button
                className="px-2 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                Prev
              </button>
              <span className="px-2 py-1">
                {page + 1} / {pageCount || 1}
              </span>
              <button
                className="px-2 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                disabled={page >= pageCount - 1}
              >
                Next
              </button>
              <button
                className="px-2 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
                onClick={() => setPage(pageCount - 1)}
                disabled={page >= pageCount - 1}
              >
                Last
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-xl font-semibold">Delete Insurance Case</h2>
              <button onClick={() => setShowDeleteModal(false)} className="text-2xl text-gray-500 hover:text-gray-800">
                &times;
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4 text-lg">Are you sure you want to delete this insurance case?</div>
              <div className="flex justify-end gap-4">
                <button
                  className="bg-gray-200 px-5 py-2 rounded hover:bg-gray-300"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel  
                </button>
                <button className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700" onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsurancePage;
