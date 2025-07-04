import { useState } from 'react';
import Navbar from './Navbar';
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 10;

const SOURCE_OPTIONS = [
  "Source",
  "Online",
  "Direct Sales",
  "Referral",
  "Broker"
];
const STATUS_OPTIONS = [
  "Status",
  "New",
  "Pending Documentation",
  "Approved",
  "Issued",
  "Rejected",
  "Expired",
  "Cancelled",
  "Follow-Up"
];

const InsurancePage = () => {
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
  const [deleteIndex, setDeleteIndex] = useState(null);

  const tabs = ['Overview'];

  // Example data (replace with API data as needed)
  const insuranceCases = [
    {
      clientInfo: {
        name: "Inshra Fatma",
        id: "987654356",
        email: "inshrafatma@gmail.com",
        address: "lajpat nagar, New Delhi",
        date: "2024-08-10"
      },
      vehicleInfo: {
        brand: "Maruti Suzuki",
        model: "HR87654678 - 201 model",
        type: "Used Car"
      },
      policyDetails: {
        policyNo: "8765435try",
        company: "Policy Bazar",
        dueDate: "2026-08-04",
        status: "Expired"
      },
      caseDetails: {
        source: "Broker",
        showroom: "Balaji Motors",
        assignedTo: "Riya"
      },
      caseUpdate: {
        status: "New",
        addedOn: "2024-09-12"
      },
      additionalDetails: "Customer prefers morning calls."
    },
    {
      clientInfo: {
        name: "Aisha Khan",
        id: "123456789",
        email: "aishakhan@example.com",
        address: "Greenwood Avenue, Mumbai",
        date: "2024-09-15"
      },
      vehicleInfo: {
        brand: "Honda Civic",
        model: "XYZ12345678 - 2020 model",
        type: "Used car"
      },
      policyDetails: {
        policyNo: "1234567abc",
        company: "Insurance Hub",
        dueDate: "2026-09-10",
        status: "Approved"
      },
      caseDetails: {
        source: "Online",
        showroom: "Star Motors",
        assignedTo: "Maya"
      },
      caseUpdate: {
        status: "Pending Documentation",
        addedOn: "2024-09-15"
      },
      additionalDetails: ""
    }
  ];

  // Duplicate cases for pagination demo
  const [allCases, setAllCases] = useState(() => {
    const arr = [];
    for (let i = 0; i < 30; i++) {
      arr.push({
        ...insuranceCases[i % insuranceCases.length],
        clientInfo: {
          ...insuranceCases[i % insuranceCases.length].clientInfo,
          name: insuranceCases[i % insuranceCases.length].clientInfo.name + ' ' + (i + 1)
        }
      });
    }
    return arr;
  });

  // Filtering logic
  const filteredCases = allCases.filter((c) => {
    const dealerSearch = filters.dealer.trim().toLowerCase();
    if (dealerSearch) {
      if (
        !(
          c.clientInfo.name.toLowerCase().includes(dealerSearch) ||
          c.clientInfo.id.toLowerCase().includes(dealerSearch)
        )
      ) return false;
    }
    if (filters.source !== 'Source' && c.caseDetails.source !== filters.source) return false;
    if (filters.status !== 'Status' && c.policyDetails.status !== filters.status && c.caseUpdate.status !== filters.status) return false;

    // Date range filter: check if caseUpdate.addedOn is between fromDate and toDate (inclusive)
    if (filters.fromDate && filters.toDate) {
      const issueDate = c.caseUpdate.addedOn;
      if (issueDate < filters.fromDate || issueDate > filters.toDate) return false;
    } else if (filters.fromDate) {
      if (c.caseUpdate.addedOn < filters.fromDate) return false;
    } else if (filters.toDate) {
      if (c.caseUpdate.addedOn > filters.toDate) return false;
    }
    return true;
  });

  const total = filteredCases.length;
  const pageCount = Math.ceil(total / PAGE_SIZE);
  const paginatedCases = filteredCases.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // UI handlers
  const handleDealerSearch = (e) => {
    setFilters({ ...filters, dealer: e.target.value });
    setPage(0);
  };

  const handleFilterDropdown = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value
    }));
    setPage(0);
  };

  // Date filter handlers
  const handleDateChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value
    }));
    setPage(0);
  };

  // View and Edit handlers: navigate to InsuranceModel
  const handleView = (caseItem) => {
    navigate('/dashboard/insurance/model', { state: { insuranceCase: caseItem, mode: 'view' } });
  };

  const handleEdit = (caseItem) => {
    navigate('/dashboard/insurance/model', { state: { insuranceCase: caseItem, mode: 'edit' } });
  };

  // Delete logic
  const handleDelete = (indexOnPage) => {
    setDeleteIndex(indexOnPage);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const globalIndex = allCases.findIndex((item) =>
      item.clientInfo.name === paginatedCases[deleteIndex].clientInfo.name &&
      item.clientInfo.id === paginatedCases[deleteIndex].clientInfo.id
    );
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
  };

  return (
    <div className="max-w-full bg-gray-50 min-h-screen">
      {Navbar && (
        <Navbar
          title="Insurance Management"
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
      <div className="p-6">
        {/* Filters and Add New Car Button */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div className="flex items-center flex-wrap gap-4">
            <input
              type="text"
              placeholder="Search by Dealer Name or Phone"
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
            {/* Date range filter group styled like the loan page */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-md ">
              <span className="text-sm text-gray-700">Issue Date:</span>
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
          <button onClick={() => navigate("/dashboard/insurance-case")}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            Add New Insurance
          </button>
        </div>
        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left align-top text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client Info
                </th>
                <th className="px-4 py-3 text-left align-top text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle Info
                </th>
                <th className="px-4 py-3 text-left align-top text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Policy Details
                </th>
                <th className="px-4 py-3 text-left align-top text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Case Details
                </th>
                <th className="px-4 py-3 text-left align-top text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedCases.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                    No insurance cases found.
                  </td>
                </tr>
              ) : (
                paginatedCases.map((caseItem, index) => (
                  <tr key={index} className="hover:bg-gray-50 align-top">
                    <td className="px-4 py-3 text-left align-top break-words">
                      <div className="text-sm font-medium text-gray-900">{caseItem.clientInfo.name}</div>
                      <div className="text-xs text-gray-500">{caseItem.clientInfo.id}</div>
                      <div className="text-xs text-gray-500">{caseItem.clientInfo.email}</div>
                      <div className="text-xs text-gray-500">{caseItem.clientInfo.address}</div>
                      <div className="text-xs text-gray-500">Login: {caseItem.clientInfo.date}</div>
                    </td>
                    <td className="px-4 py-3 text-left align-top break-words">
                      <div className="text-sm font-medium text-gray-900">{caseItem.vehicleInfo.brand}</div>
                      <div className="text-xs text-gray-500">{caseItem.vehicleInfo.model}</div>
                      <div className="text-xs text-gray-500">{caseItem.vehicleInfo.type}</div>
                    </td>
                    <td className="px-4 py-3 text-left align-top break-words">
                      <div className="text-xs text-gray-900">No: {caseItem.policyDetails.policyNo}</div>
                      <div className="text-xs text-gray-500">{caseItem.policyDetails.company}</div>
                      <div className="text-xs text-gray-500">Due: {caseItem.policyDetails.dueDate}</div>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          caseItem.policyDetails.status === 'Expired'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {caseItem.policyDetails.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-left align-top break-words">
                      <div className="text-xs text-gray-900">Source: {caseItem.caseDetails.source}</div>
                      <div className="text-xs text-gray-500">Showroom: {caseItem.caseDetails.showroom}</div>
                      <div className="text-xs text-gray-500">Assigned: {caseItem.caseDetails.assignedTo}</div>
                      <div className="text-xs text-gray-500">Issue: {caseItem.caseUpdate.addedOn}</div>
                      <div className="text-xs text-gray-500">Status: {caseItem.caseUpdate.status}</div>
                    </td>
                    <td className="px-4 py-3 text-left align-top">
                      <div className="flex flex-col gap-2">
                        <button
                          className="bg-white border border-gray-300 rounded px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
                          onClick={() => handleView(caseItem)}
                        >
                          View
                        </button>
                        <button
                          className="bg-blue-600 text-white rounded px-3 py-1 text-xs hover:bg-blue-700"
                          onClick={() => handleEdit(caseItem)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-600 text-white rounded px-3 py-1 text-xs hover:bg-red-700"
                          onClick={() => handleDelete(index)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-4 py-2">
            <div className="text-sm text-gray-600">
              Showing {paginatedCases.length > 0 ? page * PAGE_SIZE + 1 : 0} to {Math.min((page + 1) * PAGE_SIZE, total)} of {total} entries
            </div>
            <div className="flex gap-2">
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
