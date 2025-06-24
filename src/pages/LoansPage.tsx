import type React from "react"
import { useState, useEffect } from "react"
import { Routes, Route, useLocation, useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import LoanApproval from "./LoanApproval"
import PaymentTracking from "./PaymentTracking"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { loanCasesAPI, type LoanCase } from "../services/api"

function Modal({
  show,
  onClose,
  title,
  children,
}: { show: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!show) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-2xl text-gray-500 hover:text-gray-800">
            &times;
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  )
}

const SOURCE_OPTIONS = ["Dealer", "Online Application", "Referral", "Direct", "Retailer"]
const STATUS_OPTIONS = [
  "New",
  "Pending Approval",
  "Approved",
  "Rejected",
  "Disbursed",
  "Cancelled",
  "Documents Pending",
  "Inactive",
]
const CASE_TYPE_OPTIONS = ["New Car Loan", "Used Car Loan", "Loan Against Car", "Loan Transfer", "Used car"]
const PAGE_SIZE = 10

const LoanCaseTab = () => {
  const [loanCases, setLoanCases] = useState<LoanCase[]>([])
  const [filters, setFilters] = useState<{
    name: string
    source: string
    status: string
    fromDate: Date | null
    toDate: Date | null
    caseType: string
  }>({
    name: "",
    source: "",
    status: "",
    fromDate: null,
    toDate: null,
    caseType: "",
  })

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [viewCase, setViewCase] = useState<LoanCase | null>(null)
  const [editCase, setEditCase] = useState<LoanCase | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // New loan case form state
  const [newLoanCase, setNewLoanCase] = useState<Omit<LoanCase, "_id" | "createdAt" | "updatedAt">>({
    clientInfo: { name: "", phone: "", email: "", address: "", date: "" },
    vehicleInfo: { brand: "", model: "", year: "", type: "" },
    loanDetails: { bank: "", interestRate: "", tenure: "" },
    caseDetails: { source: "", showroom: "", assignedTo: "" },
    caseUpdate: { status: "New", addedOn: "" },
  })

  // Edit loan case form state
  const [editLoanCase, setEditLoanCase] = useState<LoanCase | null>(null)

  // Validation functions
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\d{10}$/
    return phoneRegex.test(phone)
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = (loanCase: any): string | null => {
    // Client Info validation
    if (!loanCase.clientInfo.name.trim()) return "Client name is required"
    if (!loanCase.clientInfo.phone.toString().trim()) return "Phone number is required"
    if (!validatePhone(loanCase.clientInfo.phone.toString())) return "Phone number must be exactly 10 digits"
    if (!loanCase.clientInfo.email.trim()) return "Email is required"
    if (!validateEmail(loanCase.clientInfo.email)) return "Please enter a valid email address"
    if (!loanCase.clientInfo.address.trim()) return "Address is required"

    // Vehicle Info validation
    if (!loanCase.vehicleInfo.brand.trim()) return "Vehicle brand is required"
    if (!loanCase.vehicleInfo.model.trim()) return "Vehicle model is required"
    if (!loanCase.vehicleInfo.year.toString().trim()) return "Vehicle year is required"
    if (!loanCase.vehicleInfo.type.trim()) return "Vehicle type is required"

    // Loan Details validation
    if (!loanCase.loanDetails.bank.trim()) return "Bank name is required"
    if (!loanCase.loanDetails.interestRate.trim()) return "Interest rate is required"
    if (!loanCase.loanDetails.tenure.trim()) return "Loan tenure is required"

    // Case Details validation
    if (!loanCase.caseDetails.source.trim()) return "Source is required"
    if (!loanCase.caseDetails.showroom.trim()) return "Showroom is required"
    if (!loanCase.caseDetails.assignedTo.trim()) return "Assigned to field is required"

    // Case Update validation
    if (!loanCase.caseUpdate.status.trim()) return "Status is required"

    return null
  }

  const handlePhoneChange = (value: string, isEdit = false) => {
    // Only allow digits and limit to 10 characters
    const digitsOnly = value.replace(/\D/g, "").slice(0, 10)
    if (isEdit && editLoanCase) {
      setEditLoanCase((n) => ({
        ...n!,
        clientInfo: { ...n!.clientInfo, phone: digitsOnly },
      }))
    } else {
      setNewLoanCase((n) => ({ ...n, clientInfo: { ...n.clientInfo, phone: digitsOnly } }))
    }
  }

  // Fetch loan cases from API
  const fetchLoanCases = async () => {
    setLoading(true)
    setError(null)
    try {
      const params: any = {
        page,
        limit: PAGE_SIZE,
      }

      // Handle name/phone search in the same field
      if (filters.name) {
        // Check if the input is a phone number (only digits)
        const isPhoneNumber = /^\d+$/.test(filters.name.trim())
        if (isPhoneNumber) {
          params.phone = filters.name
        } else {
          params.name = filters.name
        }
      }

      if (filters.source) params.source = filters.source
      if (filters.status) params.status = filters.status
      if (filters.caseType) params.caseType = filters.caseType
      if (filters.fromDate) params.fromDate = filters.fromDate.toISOString().slice(0, 10)
      if (filters.toDate) params.toDate = filters.toDate.toISOString().slice(0, 10)

      const response = await loanCasesAPI.getLoanCases(params)
      if (response.status === "success") {
        setLoanCases(response.data.loanCases || [])
        setPageCount(response.data.pageCount || 1)
        setTotal(response.data.total || 0)
      } else {
        setLoanCases([])
        setPageCount(1)
        setTotal(0)
        setError("Failed to fetch loan cases")
      }
    } catch (error: any) {
      console.error("Fetch loan cases error:", error)
      setError(error.response?.data?.message || "Error fetching loan cases")
      setLoanCases([])
      setPageCount(1)
      setTotal(0)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchLoanCases()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page])

  // Handlers for filters
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters((f) => ({ ...f, [name]: value }))
    setPage(0)
  }

  const handleDateChange = (date: Date | null, field: "fromDate" | "toDate") => {
    setFilters((f) => ({ ...f, [field]: date }))
    setPage(0)
  }

  const handleReset = () => {
    setFilters({
      name: "",
      source: "",
      status: "",
      fromDate: null,
      toDate: null,
      caseType: "",
    })
    setPage(0)
  }

  // Add new loan case with proper validation
  const handleAddLoanCase = async () => {
    try {
      // Validate form
      const validationError = validateForm(newLoanCase)
      if (validationError) {
        alert(validationError)
        return
      }

      // Set default dates if not provided
      const loanCaseToSubmit = {
        ...newLoanCase,
        clientInfo: {
          ...newLoanCase.clientInfo,
          date: new Date().toISOString().slice(0, 10),
        },
        caseUpdate: {
          ...newLoanCase.caseUpdate,
          addedOn: new Date().toISOString().slice(0, 10),
        },
      }

      const response = await loanCasesAPI.createLoanCase(loanCaseToSubmit)
      if (response.status === "success") {
        setShowAddModal(false)
        setNewLoanCase({
          clientInfo: { name: "", phone: "", email: "", address: "", date: "" },
          vehicleInfo: { brand: "", model: "", year: "", type: "" },
          loanDetails: { bank: "", interestRate: "", tenure: "" },
          caseDetails: { source: "", showroom: "", assignedTo: "" },
          caseUpdate: { status: "New", addedOn: "" },
        })
        setError(null)
        fetchLoanCases()
        alert("Loan case added successfully!")
      } else {
        alert("Failed to add loan case")
      }
    } catch (error: any) {
      console.error("Add loan case error:", error)
      alert(error.response?.data?.message || "Error adding loan case")
    }
  }

  // Edit loan case
  const handleEditLoanCase = async () => {
    if (!editLoanCase) return
    try {
      // Validate form
      const validationError = validateForm(editLoanCase)
      if (validationError) {
        alert(validationError)
        return
      }

      const response = await loanCasesAPI.updateLoanCase(editLoanCase._id, editLoanCase)
      if (response.status === "success") {
        setShowEditModal(false)
        setEditLoanCase(null)
        setError(null)
        fetchLoanCases()
        alert("Loan case updated successfully!")
      } else {
        alert("Failed to update loan case")
      }
    } catch (error: any) {
      console.error("Update loan case error:", error)
      alert(error.response?.data?.message || "Error updating loan case")
    }
  }

  // Delete loan case
  const handleDeleteCase = async () => {
    if (!deleteTargetId) return
    try {
      await loanCasesAPI.deleteLoanCase(deleteTargetId)
      setShowDeleteModal(false)
      setShowViewModal(false)
      setViewCase(null)
      setDeleteTargetId(null)
      setError(null)
      fetchLoanCases()
    } catch (error: any) {
      console.error("Delete loan case error:", error)
      setError(error.response?.data?.message || "Error deleting loan case")
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-6 mt-4">
          <span className="block sm:inline">{error}</span>
          <button className="float-right text-red-700 hover:text-red-900" onClick={() => setError(null)}>
            ×
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-nowrap items-center gap-3 overflow-x-auto">
          <input
            type="text"
            name="name"
            placeholder="Client Name or Phone"
            className="border border-gray-300 rounded px-3 py-2 text-sm w-40"
            value={filters.name}
            onChange={handleFilterChange}
          />
          <select
            name="source"
            className="border border-gray-300 rounded px-3 py-2 text-sm w-32"
            value={filters.source}
            onChange={handleFilterChange}
          >
            <option value="">Source</option>
            {SOURCE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <select
            name="status"
            className="border border-gray-300 rounded px-3 py-2 text-sm w-32"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">Status</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <DatePicker
            selected={filters.fromDate}
            onChange={(date) => handleDateChange(date, "fromDate")}
            placeholderText="From"
            className="border border-gray-300 rounded px-2 py-2 text-sm w-28"
            dateFormat="yyyy-MM-dd"
            isClearable
          />
          <DatePicker
            selected={filters.toDate}
            onChange={(date) => handleDateChange(date, "toDate")}
            placeholderText="To"
            className="border border-gray-300 rounded px-2 py-2 text-sm w-28"
            dateFormat="yyyy-MM-dd"
            isClearable
          />
          <select
            name="caseType"
            className="border border-gray-300 rounded px-3 py-2 text-sm w-40"
            value={filters.caseType}
            onChange={handleFilterChange}
          >
            <option value="">Case Type</option>
            {CASE_TYPE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <button
            className="bg-gray-200 text-gray-700 rounded px-4 py-2 text-sm font-medium hover:bg-gray-300"
            onClick={handleReset}
          >
            Reset
          </button>
          <div className="ml-auto">
            <button
              className="bg-gray-700 hover:bg-gray-800 text-white rounded px-4 py-2 text-sm font-medium"
              onClick={() => setShowAddModal(true)}
            >
              Add New Loan Case
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="px-6 py-4">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client Information</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle Information</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loan Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Case Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Case Update</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              )}
              {!loading && loanCases.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No loan cases found.
                  </td>
                </tr>
              )}
              {!loading &&
                loanCases.map((loanCase) => (
                  <tr key={loanCase._id} className={loanCase.caseUpdate?.inactive ? "bg-gray-50" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{loanCase.clientInfo?.name}</div>
                        <div className="text-gray-500">{loanCase.clientInfo?.phone}</div>
                        <div className="text-gray-500">{loanCase.clientInfo?.email}</div>
                        <div className="text-gray-500">{loanCase.clientInfo?.address}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{loanCase.vehicleInfo?.brand}</div>
                        <div className="text-gray-500">{loanCase.vehicleInfo?.model}</div>
                        <div className="text-gray-500">{loanCase.vehicleInfo?.year}</div>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {loanCase.vehicleInfo?.type}
                          </span>
                          {loanCase.caseUpdate?.inactive && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                              Inactive
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="text-gray-900">{loanCase.loanDetails?.bank}</div>
                        <div className="text-gray-500">Interest Rate - {loanCase.loanDetails?.interestRate}</div>
                        <div className="text-gray-500">Loan tenure - {loanCase.loanDetails?.tenure}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="text-gray-500">Source - {loanCase.caseDetails?.source}</div>
                        <div className="text-gray-500">Showroom - {loanCase.caseDetails?.showroom}</div>
                        <div className="text-gray-500">Assigned to {loanCase.caseDetails?.assignedTo}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="text-gray-500">Status - {loanCase.caseUpdate?.status}</div>
                        <div className="text-gray-500">Added on {formatDate(loanCase.caseUpdate?.addedOn)}</div>
                        {loanCase.caseUpdate?.documents && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              {loanCase.caseUpdate.documents}
                            </span>
                          </div>
                        )}
                        {loanCase.caseUpdate?.inactive && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                              Inactive
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-2">
                        <button
                          className="bg-white border border-gray-300 rounded px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
                          onClick={() => {
                            setViewCase(loanCase)
                            setShowViewModal(true)
                          }}
                        >
                          View
                        </button>
                        <button
                          className="bg-blue-600 text-white rounded px-3 py-1 text-xs hover:bg-blue-700"
                          onClick={() => {
                            setEditLoanCase(loanCase)
                            setShowEditModal(true)
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-600 text-white rounded px-3 py-1 text-xs hover:bg-red-700"
                          onClick={() => {
                            setDeleteTargetId(loanCase._id)
                            setShowDeleteModal(true)
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-2">
            <div className="text-sm text-gray-600">
              Showing {loanCases.length > 0 ? page * PAGE_SIZE + 1 : 0} to {Math.min((page + 1) * PAGE_SIZE, total)} of{" "}
              {total} entries
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

      {/* Add New Loan Case Modal */}
      <Modal show={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Loan Case">
        <div className="overflow-y-auto max-h-[70vh]">
          <div className="text-lg font-semibold mb-4">Client & Vehicle Details</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Client Info */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Client Name <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                placeholder="Enter name"
                value={newLoanCase.clientInfo.name}
                onChange={(e) =>
                  setNewLoanCase((n) => ({ ...n, clientInfo: { ...n.clientInfo, name: e.target.value } }))
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                placeholder="Enter 10-digit phone number"
                value={newLoanCase.clientInfo.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                maxLength={10}
                pattern="[0-9]{10}"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                placeholder="Enter email"
                value={newLoanCase.clientInfo.email}
                onChange={(e) =>
                  setNewLoanCase((n) => ({ ...n, clientInfo: { ...n.clientInfo, email: e.target.value } }))
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                placeholder="Enter address"
                value={newLoanCase.clientInfo.address}
                onChange={(e) =>
                  setNewLoanCase((n) => ({ ...n, clientInfo: { ...n.clientInfo, address: e.target.value } }))
                }
                required
              />
            </div>

            {/* Vehicle Info */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Brand <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                placeholder="Vehicle brand"
                value={newLoanCase.vehicleInfo.brand}
                onChange={(e) =>
                  setNewLoanCase((n) => ({ ...n, vehicleInfo: { ...n.vehicleInfo, brand: e.target.value } }))
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Model <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                placeholder="Vehicle model"
                value={newLoanCase.vehicleInfo.model}
                onChange={(e) =>
                  setNewLoanCase((n) => ({ ...n, vehicleInfo: { ...n.vehicleInfo, model: e.target.value } }))
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1900"
                max={new Date().getFullYear() + 1}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                placeholder="Vehicle year"
                value={newLoanCase.vehicleInfo.year}
                onChange={(e) =>
                  setNewLoanCase((n) => ({ ...n, vehicleInfo: { ...n.vehicleInfo, year: e.target.value } }))
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                value={newLoanCase.vehicleInfo.type}
                onChange={(e) =>
                  setNewLoanCase((n) => ({ ...n, vehicleInfo: { ...n.vehicleInfo, type: e.target.value } }))
                }
                required
              >
                <option value="">Select Vehicle Type</option>
                {CASE_TYPE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Loan Details */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Bank <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                placeholder="Bank name"
                value={newLoanCase.loanDetails.bank}
                onChange={(e) =>
                  setNewLoanCase((n) => ({ ...n, loanDetails: { ...n.loanDetails, bank: e.target.value } }))
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Interest Rate <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                placeholder="e.g., 8.5% or 8.5"
                value={newLoanCase.loanDetails.interestRate}
                onChange={(e) =>
                  setNewLoanCase((n) => ({ ...n, loanDetails: { ...n.loanDetails, interestRate: e.target.value } }))
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Tenure <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                placeholder="e.g., 5 years or 60 months"
                value={newLoanCase.loanDetails.tenure}
                onChange={(e) =>
                  setNewLoanCase((n) => ({ ...n, loanDetails: { ...n.loanDetails, tenure: e.target.value } }))
                }
                required
              />
            </div>

            {/* Case Details */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Source <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                value={newLoanCase.caseDetails.source}
                onChange={(e) =>
                  setNewLoanCase((n) => ({ ...n, caseDetails: { ...n.caseDetails, source: e.target.value } }))
                }
                required
              >
                <option value="">Select Source</option>
                {SOURCE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Showroom <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                placeholder="Showroom name"
                value={newLoanCase.caseDetails.showroom}
                onChange={(e) =>
                  setNewLoanCase((n) => ({ ...n, caseDetails: { ...n.caseDetails, showroom: e.target.value } }))
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Assigned To <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                placeholder="Assigned person name"
                value={newLoanCase.caseDetails.assignedTo}
                onChange={(e) =>
                  setNewLoanCase((n) => ({ ...n, caseDetails: { ...n.caseDetails, assignedTo: e.target.value } }))
                }
                required
              />
            </div>

            {/* Case Update - Status */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                value={newLoanCase.caseUpdate.status}
                onChange={(e) =>
                  setNewLoanCase((n) => ({ ...n, caseUpdate: { ...n.caseUpdate, status: e.target.value } }))
                }
                required
              >
                <option value="">Select Status</option>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              <span className="text-red-500">*</span> indicates required fields
            </p>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              className="bg-gray-200 px-5 py-2 rounded hover:bg-gray-300"
              onClick={() => {
                setShowAddModal(false)
                setError(null)
              }}
            >
              Cancel
            </button>
            <button className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700" onClick={handleAddLoanCase}>
              Add Loan Case
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Loan Case Modal */}
      <Modal show={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Loan Case">
        {editLoanCase && (
          <div className="overflow-y-auto max-h-[70vh]">
            <div className="text-lg font-semibold mb-4">Client & Vehicle Details</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Client Info */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Client Name <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                  placeholder="Enter name"
                  value={editLoanCase.clientInfo.name}
                  onChange={(e) =>
                    setEditLoanCase((n) => ({
                      ...n!,
                      clientInfo: { ...n!.clientInfo, name: e.target.value },
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                  placeholder="Enter 10-digit phone number"
                  value={editLoanCase.clientInfo.phone}
                  onChange={(e) => handlePhoneChange(e.target.value, true)}
                  maxLength={10}
                  pattern="[0-9]{10}"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                  placeholder="Enter email"
                  value={editLoanCase.clientInfo.email}
                  onChange={(e) =>
                    setEditLoanCase((n) => ({
                      ...n!,
                      clientInfo: { ...n!.clientInfo, email: e.target.value },
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                  placeholder="Enter address"
                  value={editLoanCase.clientInfo.address}
                  onChange={(e) =>
                    setEditLoanCase((n) => ({
                      ...n!,
                      clientInfo: { ...n!.clientInfo, address: e.target.value },
                    }))
                  }
                  required
                />
              </div>

              {/* Vehicle Info */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Brand <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                  placeholder="Vehicle brand"
                  value={editLoanCase.vehicleInfo.brand}
                  onChange={(e) =>
                    setEditLoanCase((n) => ({
                      ...n!,
                      vehicleInfo: { ...n!.vehicleInfo, brand: e.target.value },
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Model <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                  placeholder="Vehicle model"
                  value={editLoanCase.vehicleInfo.model}
                  onChange={(e) =>
                    setEditLoanCase((n) => ({
                      ...n!,
                      vehicleInfo: { ...n!.vehicleInfo, model: e.target.value },
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                  placeholder="Vehicle year"
                  value={editLoanCase.vehicleInfo.year}
                  onChange={(e) =>
                    setEditLoanCase((n) => ({
                      ...n!,
                      vehicleInfo: { ...n!.vehicleInfo, year: e.target.value },
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                  value={editLoanCase.vehicleInfo.type}
                  onChange={(e) =>
                    setEditLoanCase((n) => ({
                      ...n!,
                      vehicleInfo: { ...n!.vehicleInfo, type: e.target.value },
                    }))
                  }
                  required
                >
                  <option value="">Select Vehicle Type</option>
                  {CASE_TYPE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Loan Details */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Bank <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                  placeholder="Bank name"
                  value={editLoanCase.loanDetails.bank}
                  onChange={(e) =>
                    setEditLoanCase((n) => ({
                      ...n!,
                      loanDetails: { ...n!.loanDetails, bank: e.target.value },
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Interest Rate <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                  placeholder="e.g., 8.5% or 8.5"
                  value={editLoanCase.loanDetails.interestRate}
                  onChange={(e) =>
                    setEditLoanCase((n) => ({
                      ...n!,
                      loanDetails: { ...n!.loanDetails, interestRate: e.target.value },
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tenure <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                  placeholder="e.g., 5 years or 60 months"
                  value={editLoanCase.loanDetails.tenure}
                  onChange={(e) =>
                    setEditLoanCase((n) => ({
                      ...n!,
                      loanDetails: { ...n!.loanDetails, tenure: e.target.value },
                    }))
                  }
                  required
                />
              </div>

              {/* Case Details */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Source <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                  value={editLoanCase.caseDetails.source}
                  onChange={(e) =>
                    setEditLoanCase((n) => ({
                      ...n!,
                      caseDetails: { ...n!.caseDetails, source: e.target.value },
                    }))
                  }
                  required
                >
                  <option value="">Select Source</option>
                  {SOURCE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Showroom <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                  placeholder="Showroom name"
                  value={editLoanCase.caseDetails.showroom}
                  onChange={(e) =>
                    setEditLoanCase((n) => ({
                      ...n!,
                      caseDetails: { ...n!.caseDetails, showroom: e.target.value },
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Assigned To <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                  placeholder="Assigned person name"
                  value={editLoanCase.caseDetails.assignedTo}
                  onChange={(e) =>
                    setEditLoanCase((n) => ({
                      ...n!,
                      caseDetails: { ...n!.caseDetails, assignedTo: e.target.value },
                    }))
                  }
                  required
                />
              </div>

              {/* Case Update - Status */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                  value={editLoanCase.caseUpdate.status}
                  onChange={(e) =>
                    setEditLoanCase((n) => ({
                      ...n!,
                      caseUpdate: { ...n!.caseUpdate, status: e.target.value },
                    }))
                  }
                  required
                >
                  <option value="">Select Status</option>
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                <span className="text-red-500">*</span> indicates required fields
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="bg-gray-200 px-5 py-2 rounded hover:bg-gray-300"
                onClick={() => {
                  setShowEditModal(false)
                  setEditLoanCase(null)
                  setError(null)
                }}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                onClick={handleEditLoanCase}
              >
                Update Loan Case
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* View Modal */}
      <Modal show={showViewModal} onClose={() => setShowViewModal(false)} title="Loan Case Details">
        {viewCase && (
          <div className="overflow-y-auto max-h-[70vh]">
            <div className="text-lg font-semibold mb-4">Client & Vehicle Details</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Client Name</label>
                <div className="border px-3 py-2 rounded bg-gray-50">{viewCase.clientInfo.name}</div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <div className="border px-3 py-2 rounded bg-gray-50">{viewCase.clientInfo.phone}</div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <div className="border px-3 py-2 rounded bg-gray-50">{viewCase.clientInfo.email}</div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <div className="border px-3 py-2 rounded bg-gray-50">{viewCase.clientInfo.address}</div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <div className="border px-3 py-2 rounded bg-gray-50">{formatDate(viewCase.clientInfo.date)}</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Brand</label>
                <div className="border px-3 py-2 rounded bg-gray-50">{viewCase.vehicleInfo.brand}</div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Model</label>
                <div className="border px-3 py-2 rounded bg-gray-50">{viewCase.vehicleInfo.model}</div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Year</label>
                <div className="border px-3 py-2 rounded bg-gray-50">{viewCase.vehicleInfo.year}</div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <div className="border px-3 py-2 rounded bg-gray-50">{viewCase.vehicleInfo.type}</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bank</label>
                <div className="border px-3 py-2 rounded bg-gray-50">{viewCase.loanDetails.bank}</div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Interest Rate</label>
                <div className="border px-3 py-2 rounded bg-gray-50">{viewCase.loanDetails.interestRate}</div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tenure</label>
                <div className="border px-3 py-2 rounded bg-gray-50">{viewCase.loanDetails.tenure}</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Source</label>
                <div className="border px-3 py-2 rounded bg-gray-50">{viewCase.caseDetails.source}</div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Showroom</label>
                <div className="border px-3 py-2 rounded bg-gray-50">{viewCase.caseDetails.showroom}</div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Assigned To</label>
                <div className="border px-3 py-2 rounded bg-gray-50">{viewCase.caseDetails.assignedTo}</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <div className="border px-3 py-2 rounded bg-gray-50">{viewCase.caseUpdate.status}</div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Added On</label>
                <div className="border px-3 py-2 rounded bg-gray-50">{formatDate(viewCase.caseUpdate.addedOn)}</div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="bg-gray-200 px-5 py-2 rounded hover:bg-gray-300"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Loan Case">
        <div className="text-center py-4">
          <div className="mb-4 text-lg">Are you sure you want to delete this loan case?</div>
          <div className="flex justify-center gap-4">
            <button
              className="bg-gray-200 px-5 py-2 rounded hover:bg-gray-300"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
            <button className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700" onClick={handleDeleteCase}>
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

const LoanCasePage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const tabs = ["Overview", "Loan Approval", "Payment Tracking"]

  const [activeTab, setActiveTab] = useState(
    location.pathname.endsWith("/approval")
      ? "Loan Approval"
      : location.pathname.endsWith("/tracking")
        ? "Payment Tracking"
        : "Overview",
  )

  useEffect(() => {
    if (location.pathname.endsWith("/approval")) {
      setActiveTab("Loan Approval")
    } else if (location.pathname.endsWith("/tracking")) {
      setActiveTab("Payment Tracking")
    } else {
      setActiveTab("Overview")
    }
  }, [location.pathname])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    if (tab === "Overview") {
      navigate("/dashboard/loans")
    } else if (tab === "Loan Approval") {
      navigate("/dashboard/loans/approval")
    } else if (tab === "Payment Tracking") {
      navigate("/dashboard/loans/tracking")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Loan Management System" tabs={tabs} activeTab={activeTab} setActiveTab={handleTabChange} />
      <Routes>
        <Route index element={<LoanCaseTab />} />
        <Route path="approval" element={<LoanApproval />} />
        <Route path="tracking" element={<PaymentTracking />} />
      </Routes>
    </div>
  )
}

export default LoanCasePage
