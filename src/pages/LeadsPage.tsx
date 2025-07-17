
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

import React, { useEffect, useState } from "react";
import { Download, X, Plus } from "lucide-react";
import Navbar from "./Navbar";

const API_URL = `${import.meta.env.VITE_BACKEND_API_URL}/api/leads`;

const LeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState("All Sources");
  const [selectedService, setSelectedService] = useState("All Services");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletePopup, setDeletePopup] = useState<{ show: boolean; id: number | null }>({ show: false, id: null });
  const [modalError, setModalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newLead, setNewLead] = useState<Omit<Lead, "id">>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    source: "reference",
    service: "Car Loan",
    status: "new",
    assignedTo: "",
    lastContact: "",
    additionalDetails: "",
  });

  const demoUsers = [
    { id: "507f1f77bcf86cd799439014", name: "Not Assigned" },
  ];

  // Fetch all leads on mount
  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      setModalError("Failed to fetch leads");
    }
  };

  // Filtering
  const filteredLeads = leads.filter((lead) => {
    const fullName = `${lead.firstName} ${lead.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery);
    const matchesSource =
      selectedSource === "All Sources" || lead.source === selectedSource.toLowerCase().replace(" ", "-");
    const matchesService = selectedService === "All Services" || lead.service === selectedService;
    return matchesSearch && matchesSource && matchesService;
  });

  // CRUD Handlers
  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);  
    setIsDetailModalOpen(true);
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead({ ...lead });
    setIsEditModalOpen(true);
  };

  const handleDeleteLead = async (id: number | null) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setLeads(leads.filter((lead) => lead.id !== id));
      setDeletePopup({ show: false, id: null });
    } catch (err) {
      setModalError("Failed to delete lead");
    }
    setIsSubmitting(false);
  };

  const handleDeletePopup = () => {
    handleDeleteLead(deletePopup.id);
  };

  const handleUpdateLead = async () => {
    if (!editingLead) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/${editingLead.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingLead),
      });
      const updated = await res.json();
      setLeads(leads.map((lead) => (lead.id === updated.id ? updated : lead)));
      setIsEditModalOpen(false);
      setEditingLead(null);
    } catch (err) {
      setModalError("Failed to update lead");
    }
    setIsSubmitting(false);
  };

  const handleAddNewLead = async () => {
    setIsSubmitting(true);
    setModalError(null);
    if (!newLead.firstName || !newLead.lastName || !newLead.email || !newLead.phone) {
      setModalError("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(newLead.email)) {
      setModalError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(newLead.phone)) {
      setModalError("Phone number must be exactly 10 digits");
      setIsSubmitting(false);
      return;
    }
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLead),
      });
      const created = await res.json();
      setLeads([created, ...leads]);
      setIsAddModalOpen(false);
      resetNewLeadForm();
    } catch (err) {
      setModalError("Failed to add new lead");
    }
    setIsSubmitting(false);
  };

  const resetNewLeadForm = () => {
    setNewLead({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      source: "reference",
      service: "Car Loan",
      status: "new",
      assignedTo: "",
      lastContact: "",
      additionalDetails: "",
    });
    setModalError(null);
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Source", "Service", "Status", "Created Date"];
    const csvData = filteredLeads.map((lead) => [
      `${lead.firstName} ${lead.lastName}`,
      lead.email,
      lead.phone,
      lead.source,
      lead.service,
      lead.status,
      new Date(lead.createdAt || Date.now()).toLocaleDateString(),
    ]);
    const csvContent = [headers, ...csvData].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `leads-export-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const closeModal = () => {
    setIsDetailModalOpen(false);
    setSelectedLead(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingLead(null);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    resetNewLeadForm();
  };

  const handleInputChange = (field: keyof Lead, value: string) => {
    if (editingLead) {
      setEditingLead({
        ...editingLead,
        [field]: value,
      });
    }
  };

  const handleNewLeadInputChange = (field: keyof Lead, value: string) => {
    setNewLead({
      ...newLead,
      [field]: value,
    });
  };

  const getUserName = (userId: any): string => {
    if (!userId) return "Not assigned";
    if (typeof userId === "object" && userId !== null) {
      if (userId.name && typeof userId.name === "string") return userId.name;
      if (userId.firstName && typeof userId.firstName === "string") {
        const lastName = userId.lastName && typeof userId.lastName === "string" ? ` ${userId.lastName}` : "";
        return `${userId.firstName}${lastName}`;
      }
      const objectId = userId.id;
      if (objectId) {
        const user = demoUsers.find((u) => u.id === objectId.toString());
        if (user) return user.name;
      }
      return "Unknown User";
    }
    if (typeof userId === "string" && userId.trim() !== "") {
      const user = demoUsers.find((u) => u.id === userId.trim());
      if (user) return user.name;
      else return "Unknown User";
    }
    return "Not assigned";
  };

  // --- JSX below (UI unchanged except key/id usage) ---
  return (
    <div className="min-h-screen bg-white">
      <Navbar
        title="Lead Management System"
        tabs={[]} 
        activeTab="" 
        setActiveTab={() => {}} 
      />

      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All Sources">All Sources</option>
              <option value="reference">Reference</option>
              <option value="walk-in">Walk-in</option>
            </select>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All Services">All Services</option>
              <option value="Car Loan">Loan</option>
              <option value="Insurance">Insurance</option>
              <option value="Car Buy">Car Buy</option>
              <option value="Car Sell">Car Sell</option>
            </select>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2 text-white" />
              Add New Lead
            </button>
          </div>
          <div className="flex items-center">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <Download className="w-4 h-4 mr-2 text-white" />
              Export
            </button>
          </div>
        </div>

        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredLeads.length} of {leads.length} leads
          {searchQuery && <span className="ml-2">for "{searchQuery}"</span>}
          {(selectedSource !== "All Sources" || selectedService !== "All Services") && (
            <span className="ml-2">
              with filters: {selectedSource !== "All Sources" && `Source: ${selectedSource}`}
              {selectedSource !== "All Sources" && selectedService !== "All Services" && ", "}
              {selectedService !== "All Services" && `Service: ${selectedService}`}
            </span>
          )}
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    {searchQuery || selectedSource !== "All Sources" || selectedService !== "All Services"
                      ? "No leads match your search criteria"
                      : "No leads found"}
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {lead.firstName[0]}
                              {lead.lastName[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {lead.firstName} {lead.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.email}</div>
                      <div className="text-sm text-gray-500">{lead.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.service}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          lead.status === "new"
                            ? "bg-green-100 text-green-800"
                            : lead.status === "contacted"
                              ? "bg-blue-100 text-blue-800"
                              : lead.status === "qualified"
                                ? "bg-purple-100 text-purple-800"
                                : lead.status === "proposal"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : lead.status === "negotiation"
                                    ? "bg-orange-100 text-orange-800"
                                    : lead.status === "closed"
                                      ? "bg-gray-100 text-gray-800"
                                      : "bg-red-100 text-red-800"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition-colors"
                          onClick={() => handleViewDetails(lead)}
                        >
                          View
                        </button>
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs transition-colors"
                          onClick={() => handleEdit(lead)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors"
                          onClick={() => setDeletePopup({ show: true, id: lead.id })}
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
        </div>

        {/* Delete Confirmation Popup */}
        {deletePopup.show && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs text-center">
              <h2 className="text-lg font-bold mb-3">Confirm Delete</h2>
              <p className="mb-6">Are you sure you want to delete this</p>
              <div className="flex justify-center gap-4">
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                  onClick={() => setDeletePopup({ show: false, id: null })}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  onClick={handleDeletePopup}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add New Lead Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add New Lead</h2>
                <button onClick={closeAddModal} className="text-gray-500 hover:text-gray-700">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {modalError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{modalError}</div>
              )}
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newLead.firstName}
                      onChange={(e) => handleNewLeadInputChange("firstName", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-400 bg-slate-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newLead.lastName}
                      onChange={(e) => handleNewLeadInputChange("lastName", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-100 p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={newLead.email}
                      onChange={(e) => handleNewLeadInputChange("email", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-100 p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={newLead.phone}
                      maxLength={10}
                      onChange={(e) => handleNewLeadInputChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="e.g: 8954288547"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-100 p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Source</label>
                    <select
                      value={newLead.source}
                      onChange={(e) => handleNewLeadInputChange("source", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-100 p-2"
                    >
                      <option value="reference">Reference</option>
                      <option value="walk-in">Walk-in</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Service</label>
                    <select
                      value={newLead.service}
                      onChange={(e) => handleNewLeadInputChange("service", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-100 p-2"
                    >
                      <option value="Car Loan">Loan</option>
                      <option value="Car Buy">Car Buy</option>
                      <option value="Car Sell">Car Sell</option>
                      <option value="Insurance">Insurance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={newLead.status}
                      onChange={(e) => handleNewLeadInputChange("status", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-100 p-2"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="follow-up">Follow-up</option>
                      <option value="closed">Closed</option>
                      <option value="converted">Converted</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                    <select
                      value={newLead.assignedTo}
                      onChange={(e) => handleNewLeadInputChange("assignedTo", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-100 p-2"
                    >
                      <option value="">Select User</option>
                      {demoUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Contact</label>
                    <input
                      type="date"
                      value={newLead.lastContact}
                      max={new Date().toISOString().split("T")[0]}
                      onChange={(e) => handleNewLeadInputChange("lastContact", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-100 p-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Additional Details</label>
                  <input
                    type="text"
                    value={newLead.additionalDetails}
                    onChange={(e) => handleNewLeadInputChange("additionalDetails", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-100 p-2"
                  />
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={closeAddModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddNewLead}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Adding..." : "Add Lead"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {isDetailModalOpen && selectedLead && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Lead Details</h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1">
                      {selectedLead.firstName} {selectedLead.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1">{selectedLead.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1">{selectedLead.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Source</label>
                    <p className="mt-1">{selectedLead.source}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Service</label>
                    <p className="mt-1">{selectedLead.service}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <p className="mt-1">{selectedLead.status}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                    <p
                      className={`mt-1 ${selectedLead.assignedTo ? "text-gray-900 font-medium" : "text-gray-400 italic"}`}
                    >
                      {getUserName(selectedLead.assignedTo)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Contact</label>
                    <p className="mt-1">
                      {selectedLead.lastContact
                        ? new Date(selectedLead.lastContact).toLocaleDateString()
                        : "No contact recorded"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Additional Details</label>
                    <p className="mt-1">{selectedLead.additionalDetails || "None"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && editingLead && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Lead</h2>
                <button onClick={closeEditModal} className="text-gray-500 hover:text-gray-700">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {modalError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{modalError}</div>
              )}
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      value={editingLead.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-100 p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      value={editingLead.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-100 p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={editingLead.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-100 p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      value={editingLead.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-100 p-2"
                      maxLength={10}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Source</label>
                    <select
                      value={editingLead.source}
                      onChange={(e) => handleInputChange("source", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-100 p-2"
                    >
                      <option value="reference">Reference</option>
                      <option value="walk-in">Walk-in</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Service</label>
                    <select
                      value={editingLead.service}
                      onChange={(e) => handleInputChange("service", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-100 p-2"
                    >
                      <option value="Car Loan">Loan</option>
                      <option value="Car Buy">Car Buy</option>
                      <option value="Car Sell">Car Sell</option>
                      <option value="Insurance">Insurance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={editingLead.status}
                      onChange={(e) => handleInputChange("status", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-100 p-2"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="follow-up">Follow-up</option>
                      <option value="closed">Closed</option>
                      <option value="converted">Converted</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                    <select
                      value={editingLead.assignedTo || ""}
                      onChange={(e) => handleInputChange("assignedTo", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-100 p-2"
                    >
                      <option value="">Select User</option>
                      {demoUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Contact</label>
                    <input
                      type="date"
                      value={editingLead.lastContact ? new Date(editingLead.lastContact).toISOString().split("T")[0] : ""}
                      onChange={(e) => handleInputChange("lastContact", e.target.value)}
                      max={new Date().toISOString().split("T")[0]}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-100 p-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Additional Details</label>
                  <input
                    type="text"
                    value={editingLead.additionalDetails || ""}
                    onChange={(e) => handleInputChange("additionalDetails", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-100 p-2"
                  />
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={closeEditModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateLead}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsPage;
