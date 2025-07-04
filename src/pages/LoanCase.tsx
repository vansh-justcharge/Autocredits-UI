import { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

import CustomerForm from "../components/LoanForms/CustomerForm";
import AddressForm from "../components/LoanForms/AddressForm";
import FileForm from "../components/LoanForms/FileDispatch";
import VehicleForm from "../components/LoanForms/VehicleForm";
import CPVForm from "../components/LoanForms/CPVDetails";
import InstrumentForm from "../components/LoanForms/InstrumentForm";
// import ReviewAndSubmit from "../components/Loan/ReviewAndSubmit";

// ProgressBar component
const ProgressBar = ({ currentStep, totalSteps, labels = [] }) => {
  const percent = ((currentStep + 1) / totalSteps) * 95;

  return (
    <div className="relative w-full mb-10">
      {/* Progress Track */}
      <div className="absolute top-1/2 left-0 w-full h-3 -translate-y-1/2 bg-gray-200 rounded-full shadow-inner"></div>
      
      {/* Progress Fill with Gradient */}
      <div
        className="absolute top-1/2 left-0 h-3 -translate-y-1/2 rounded-full transition-all duration-500"
        style={{
          width: `${percent}%`,
          background: "linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)",
          boxShadow: "0 2px 8px 0 rgba(59,130,246,0.15)",
        }}
      ></div>

      {/* Step Dots */}
      <div className="relative flex justify-between items-center z-10">
        {Array.from({ length: totalSteps }).map((_, idx) => (
          <div key={idx} className="flex flex-col items-center w-1/12">
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold
                ${idx < currentStep
                  ? "bg-blue-500 border-blue-600 text-white shadow"
                  : idx === currentStep
                  ? "bg-white border-blue-500 text-blue-700 shadow-lg"
                  : "bg-white border-gray-300 text-gray-400"}
              `}
              style={{
                transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                zIndex: 20,
              }}
            >
              {idx + 1}
            </div>
            {/* Optional: Step label */}
            {labels.length > 0 && (
              <span
                className={`mt-2 text-xs text-center w-24 truncate
                  ${idx === currentStep ? "text-blue-600 font-semibold" : "text-gray-400"}
                `}
              >
                {labels[idx]}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Percentage Label */}
      <div className="absolute right-0 -top-8 text-blue-600 font-bold text-sm bg-white px-2 py-1 rounded shadow">
        {Math.round(percent)}%
      </div>
    </div>
  );
};

// Loan case tabs (updated to match form content)
const tabs = [
  "Customer-Details",
  "Address-Details",
  "File-Dispatch",
  "Vehicle-Details",
  "CPV-Details",
  "Instrument-Details",
  // "Review-Submit"
];

const LoanCasePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(() => {
    if (location.pathname.endsWith("/Review-Submit")) return "Review-Submit";
    if (location.pathname.endsWith("/Instrument-Details")) return "Instrument-Details";
    if (location.pathname.endsWith("/CPV-Details")) return "CPV-Details";
    if (location.pathname.endsWith("/Vehicle-Details")) return "Vehicle-Details";
    if (location.pathname.endsWith("/File-Dispatch")) return "File-Dispatch";
    if (location.pathname.endsWith("/Address-Details")) return "Address-Details";
    return "Customer-Details";
  });

  useEffect(() => {
    if (location.pathname.endsWith("/Review-Submit")) {
      setActiveTab("Review-Submit");
    } else if (location.pathname.endsWith("/Instrument-Details")) {
      setActiveTab("Instrument-Details");
    } else if (location.pathname.endsWith("/CPV-Details")) {
      setActiveTab("CPV-Details");
    } else if (location.pathname.endsWith("/Vehicle-Details")) {
      setActiveTab("Vehicle-Details");
    } else if (location.pathname.endsWith("/File-Dispatch")) {
      setActiveTab("File-Dispatch");
    } else if (location.pathname.endsWith("/Address-Details")) {
      setActiveTab("Address-Details");
    } else {
      setActiveTab("Customer-Details");
    }
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "Customer-Details") navigate("/dashboard/loan-case");
    else if (tab === "Address-Details") navigate("/dashboard/loan-case/Address-Details");
    else if (tab === "File-Dispatch") navigate("/dashboard/loan-case/File-Dispatch");
    else if (tab === "Vehicle-Details") navigate("/dashboard/loan-case/Vehicle-Details");
    else if (tab === "CPV-Details") navigate("/dashboard/loan-case/CPV-Details");
    else if (tab === "Instrument-Details") navigate("/dashboard/loan-case/Instrument-Details");
    else if (tab === "Review-Submit") navigate("/dashboard/loan-case/Review-Submit");
  };

  // Find the index of the active tab for the progress bar
  const currentStep = tabs.findIndex(tab => tab === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar and Routes */}
      <Navbar
        title="Loan Case"
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />
      <div className="max-w-full mx-auto pt-6 px-4 bg-white">
        <ProgressBar currentStep={currentStep} totalSteps={tabs.length} />
      </div>
      <Routes>
        <Route index element={<CustomerForm />} />
        <Route path="Address-Details" element={<AddressForm />} />
        <Route path="File-Dispatch" element={<FileForm />} />
        <Route path="Vehicle-Details" element={<VehicleForm />} />
        <Route path="CPV-Details" element={<CPVForm />} />
        <Route path="Instrument-Details" element={<InstrumentForm />} />
        {/* <Route path="Review-Submit" element={<ReviewAndSubmit />} /> */}
      </Routes>
    </div>
  );
};

export default LoanCasePage;
