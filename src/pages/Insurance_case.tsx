import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import InsuranceOverview from "./InsuranceOverview";
// import InsuranceApproval from "./InsuranceApproval";
// import InsuranceManagement from "./InsuranceManagement";
// import InsuranceTracking from "./InsuranceTracking";

const tabs = ["CaseDetails", "Customer Details", "Previous pol. details", "Premeium Details","Document","Payment Details"];

const InsuranceCasePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(
    location.pathname.endsWith("/approval")
      ? "Approval"
      : location.pathname.endsWith("/management")
      ? "Management"
      : location.pathname.endsWith("/tracking")
      ? "Tracking"
      : "Overview"
  );

  useEffect(() => {
    if (location.pathname.endsWith("/approval")) setActiveTab("Approval");
    else if (location.pathname.endsWith("/management")) setActiveTab("Management");
    else if (location.pathname.endsWith("/tracking")) setActiveTab("Tracking");
    else setActiveTab("CaseDetails");
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "CaseDetails") navigate("/dashboard/insurance-case");
    else if (tab === "Approval") navigate("/dashboard/insurance-case/approval");
    else if (tab === "Management") navigate("/dashboard/insurance-case/management");
    else if (tab === "Tracking") navigate("/dashboard/insurance-case/tracking");
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
        {/* <Route path="approval" element={<InsuranceApproval />} />
        <Route path="management" element={<InsuranceManagement />} />
        <Route path="tracking" element={<InsuranceTracking />} /> */}
      </Routes>
    </div>
  );
};

export default InsuranceCasePage;
