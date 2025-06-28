import { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import InsuranceOverview from "./InsuranceOverview";
import CustomerDetails from "../components/Insurance/CustomerDetails";
import NomineeReferenceDetails from "../components/Insurance/NomineeDetails";
import VehicleDetails from "../components/Insurance/VehicleDetails";
import PreviousPolicyDetails from "../components/Insurance/PreviousPolicy";
import NewPolicyDetails from "../components/Insurance/NewPolicy";
import PaymentDetails from "../components/Insurance/Document"; // <-- Add this

const tabs = [
  "Case-Details",
  "Customer-Details",
  "Nominee-Details",
  "Vehicle-Details",
  "Previous-Policy-Details",
  "New-Policy-Details",
  "Payment Details"
];

const InsuranceCasePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(() => {
    if (location.pathname.endsWith("/Payment-Details")) return "Payment Details";
    if (location.pathname.endsWith("/New-Policy-Details")) return "New-Policy-Details";
    if (location.pathname.endsWith("/Previous-Policy-Details")) return "Previous-Policy-Details";
    if (location.pathname.endsWith("/Vehicle-Details")) return "Vehicle-Details";
    if (location.pathname.endsWith("/Nominee-Details")) return "Nominee-Details";
    if (location.pathname.endsWith("/Customer-Details")) return "Customer-Details";
    return "Case-Details";
  });

  useEffect(() => {
    if (location.pathname.endsWith("/Payment-Details")) {
      setActiveTab("Payment Details");
    } else if (location.pathname.endsWith("/New-Policy-Details")) {
      setActiveTab("New-Policy-Details");
    } else if (location.pathname.endsWith("/Previous-Policy-Details")) {
      setActiveTab("Previous-Policy-Details");
    } else if (location.pathname.endsWith("/Vehicle-Details")) {
      setActiveTab("Vehicle-Details");
    } else if (location.pathname.endsWith("/Nominee-Details")) {
      setActiveTab("Nominee-Details");
    } else if (location.pathname.endsWith("/Customer-Details")) {
      setActiveTab("Customer-Details");
    } else {
      setActiveTab("Case-Details");
    }
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "Case-Details") navigate("/dashboard/insurance-case");
    else if (tab === "Customer-Details") navigate("/dashboard/insurance-case/Customer-Details");
    else if (tab === "Nominee-Details") navigate("/dashboard/insurance-case/Nominee-Details");
    else if (tab === "Vehicle-Details") navigate("/dashboard/insurance-case/Vehicle-Details");
    else if (tab === "Previous-Policy-Details") navigate("/dashboard/insurance-case/Previous-Policy-Details");
    else if (tab === "New-Policy-Details") navigate("/dashboard/insurance-case/New-Policy-Details");
    else if (tab === "Payment Details") navigate("/dashboard/insurance-case/Payment-Details");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        title="Insurance Case"
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />
      <Routes>
        <Route index element={<InsuranceOverview />} />
        <Route path="Customer-Details" element={<CustomerDetails />} />
        <Route path="Nominee-Details" element={<NomineeReferenceDetails />} />
        <Route path="Vehicle-Details" element={<VehicleDetails />} />
        <Route path="Previous-Policy-Details" element={<PreviousPolicyDetails />} />
        <Route path="New-Policy-Details" element={<NewPolicyDetails />} />
        <Route path="Payment-Details" element={<PaymentDetails />} /> {/* <-- Add this */}
      </Routes>
    </div>
  );
};

export default InsuranceCasePage;
