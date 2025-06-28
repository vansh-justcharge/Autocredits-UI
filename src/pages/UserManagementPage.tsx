import { useState } from "react";
import Navbar from './Navbar';

const initialUsers = [
  { name: "Evelyn Harper", email: "evelyn@harper.com", role: "Viewer", view: true, approve: false, reject: true },
  { name: "Jasper Lin", email: "jasper@lin.com", role: "Approver", view: false, approve: true, reject: true },
  { name: "Lydia Quinn", email: "lydia@quinn.com", role: "Admin", view: true, approve: true, reject: false },
  { name: "Arjun Patel", email: "arjun@patel.com", role: "Viewer", view: true, approve: false, reject: false },
  { name: "Maya Chen", email: "maya@chen.com", role: "Approver", view: true, approve: true, reject: true },
  { name: "Noah Kim", email: "noah@kim.com", role: "Admin", view: true, approve: false, reject: false },
  { name: "Olivia Zhang", email: "olivia@zhang.com", role: "Viewer", view: true, approve: true, reject: true },
  { name: "Lucas Nguyen", email: "lucas@nguyen.com", role: "Approver", view: true, approve: true, reject: true },
  { name: "Sophia Garcia", email: "sophia@garcia.com", role: "Admin", view: true, approve: true, reject: true },
];

const roles = ["Admin", "Approver", "Viewer"];

const activities = [
  { name: "Evelyn Harper", action: "Approval 8978", timestamp: "2023-07-01 10:00 AM" },
  { name: "Jasper Lin", action: "Viewed loan 0977", timestamp: "2023-07-01 10:00 AM" },
];

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [users, setUsers] = useState(initialUsers);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: roles[0] });
  const [formError, setFormError] = useState("");
  const [revokeIndex, setRevokeIndex] = useState(null);

  // Form handlers
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError("");
  };

  const handleAddUser = () => {
    // Basic validation
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setFormError("Please fill all fields.");
      return;
    }
    if (users.some(u => u.email === form.email.trim())) {
      setFormError("User with this email already exists.");
      return;
    }
    setUsers([
      ...users,
      {
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        view: false,
        approve: false,
        reject: false,
      }
    ]);
    setForm({ name: "", email: "", password: "", role: roles[0] });
    setFormError("");
  };

  // Permission toggles
  const togglePermission = (index, perm) => {
    setUsers(users =>
      users.map((user, i) =>
        i === index ? { ...user, [perm]: !user[perm] } : user
      )
    );
  };

  // Revoke access
  const handleRevoke = (index) => setRevokeIndex(index);
  const confirmRevoke = () => {
    setUsers(users => users.filter((_, i) => i !== revokeIndex));
    setRevokeIndex(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <Navbar
        title="User Management"
        tabs={[]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="container mx-auto py-8 px-2 sm:px-6 lg:px-8 bg-white">
        {/* Add User Form */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-8">Add New User</h2>
          <div className="space-y-6 bg-white p-8 rounded-xl shadow max-w-full mx-auto">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleFormChange}
                placeholder="Enter full name"
                className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleFormChange}
                placeholder="Enter email address"
                className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleFormChange}
                placeholder="Enter password"
                className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Select Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleFormChange}
                className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 text-base"
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            {formError && <div className="text-red-500">{formError}</div>}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddUser}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-base"
              >
                Add User
              </button>
            </div>
          </div>
        </section>

        {/* User List */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-8">User List and Permissions</h2>
          <div className="overflow-x-auto bg-white rounded-xl shadow max-w-full mx-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="py-4 px-4 font-medium">Name</th>
                  <th className="py-4 px-4 font-medium">Email</th>
                  <th className="py-4 px-4 font-medium">Role</th>
                  <th className="py-4 px-4 font-medium">View</th>
                  <th className="py-4 px-4 font-medium">Approve</th>
                  <th className="py-4 px-4 font-medium">Reject</th>
                  <th className="py-4 px-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.role}</td>
                    <td className="py-3 px-4">
                      <button
                        className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${user.view ? "bg-green-500" : "bg-gray-300"}`}
                        onClick={() => togglePermission(index, "view")}
                        aria-label="Toggle View"
                      >
                        <span className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300 ${user.view ? "translate-x-5" : ""}`}></span>
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${user.approve ? "bg-green-500" : "bg-gray-300"}`}
                        onClick={() => togglePermission(index, "approve")}
                        aria-label="Toggle Approve"
                      >
                        <span className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300 ${user.approve ? "translate-x-5" : ""}`}></span>
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${user.reject ? "bg-green-500" : "bg-gray-300"}`}
                        onClick={() => togglePermission(index, "reject")}
                        aria-label="Toggle Reject"
                      >
                        <span className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300 ${user.reject ? "translate-x-5" : ""}`}></span>
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition"
                        onClick={() => handleRevoke(index)}
                      >
                        Revoke access
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Revoke confirmation modal */}
            {revokeIndex !== null && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-xs">
                  <h3 className="text-lg font-semibold mb-4">Confirm Revoke</h3>
                  <p>Are you sure you want to revoke access for <span className="font-bold">{users[revokeIndex].name}</span>?</p>
                  <div className="flex justify-end space-x-2 mt-6">
                    <button
                      className="px-4 py-2 bg-gray-200 rounded-lg"
                      onClick={() => setRevokeIndex(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded-lg"
                      onClick={confirmRevoke}
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* User Activity */}
        <section>
          <h2 className="text-2xl font-semibold mb-8">User Activity</h2>
          <div className="overflow-x-auto bg-white rounded-xl shadow max-w-full mx-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="py-4 px-4 font-medium">Name</th>
                  <th className="py-4 px-4 font-medium text-right">Action</th>
                  <th className="py-4 px-4 font-medium text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-3 px-4">{activity.name}</td>
                    <td className="py-3 px-4 text-right">{activity.action}</td>
                    <td className="py-3 px-4 text-right">{activity.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
