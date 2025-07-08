import { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import InsuranceOverview from "./InsuranceOverview";
import CustomerDetails from "../components/Insurance/CustomerDetails";
import NomineeReferenceDetails from "../components/Insurance/NomineeDetails";
import VehicleDetails from "../components/Insurance/VehicleDetails";
import PreviousPolicyDetails from "../components/Insurance/PreviousPolicy";
import NewPolicyDetails from "../components/Insurance/NewPolicy";
import PaymentDetails from "../components/Insurance/PaymentDetails";
import Quotes from "../components/Insurance/Quotes";
import DocumentUploadScreen from "../components/Insurance/Document";
import Inspection from "../components/Insurance/Inspection";

// ProgressBar component
type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
};

const ProgressBar = ({ currentStep, totalSteps, labels = [] }: ProgressBarProps) => {
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


const tabs = [
  "Case-Details",
  "Customer-Details",
  "Nominee-Details",
  "Vehicle-Details",
  "Inspecation",
  "Previous-Policy-Details",
  "Quotes",
  "New-Policy-Details",
  "Payment Details",
  "Documents"
];

const InsuranceCasePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(() => {
    if (location.pathname.endsWith("/Payment-Details")) return "Payment Details";
    if (location.pathname.endsWith("/New-Policy-Details")) return "New-Policy-Details";
    if (location.pathname.endsWith("/Quotes")) return "Quotes";
    if (location.pathname.endsWith("/Documents")) return "Documents";
    if (location.pathname.endsWith("/Inspecation")) return "Inspecation";
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
    }
    else if (location.pathname.endsWith("/Inspecation")) {
      setActiveTab("Inspecation");
    }
    else if (location.pathname.endsWith("/Documents")) {
      setActiveTab("Documents");
    }
    else if(location.pathname.endsWith("/Quotes")){
      setActiveTab("Quotes")
    }else {
      setActiveTab("Case-Details");
    }
  }, [location.pathname]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "Case-Details") navigate("/dashboard/insurance-case");
    else if (tab === "Customer-Details") navigate("/dashboard/insurance-case/Customer-Details");
    else if (tab === "Nominee-Details") navigate("/dashboard/insurance-case/Nominee-Details");
    else if (tab === "Vehicle-Details") navigate("/dashboard/insurance-case/Vehicle-Details");
    else if (tab === "Inspecation") navigate("/dashboard/insurance-case/Inspecation");
    else if (tab === "Previous-Policy-Details") navigate("/dashboard/insurance-case/Previous-Policy-Details");
    else if (tab === "Quotes") navigate("/dashboard/insurance-case/Quotes");
    else if (tab === "Documents") navigate("/dashboard/insurance-case/Documents");
    else if (tab === "New-Policy-Details") navigate("/dashboard/insurance-case/New-Policy-Details");
    else if (tab === "Payment Details") navigate("/dashboard/insurance-case/Payment-Details");
  };

  // Find the index of the active tab for the progress bar
  const currentStep = tabs.findIndex(tab => tab === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar and Routes */}
      <Navbar
        title="Insurance Case"
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />
       <div className="max-w-full mx-auto pt-6 px-4 bg-white">
        <ProgressBar currentStep={currentStep} totalSteps={tabs.length} />
      </div>
      <Routes>
        <Route index element={<InsuranceOverview />} />
        <Route path="Customer-Details" element={<CustomerDetails />} />
        <Route path="Nominee-Details" element={<NomineeReferenceDetails />} />
        <Route path="Vehicle-Details" element={<VehicleDetails />} />
        <Route path="Previous-Policy-Details" element={<PreviousPolicyDetails />} />
        <Route path="Quotes" element={<Quotes></Quotes>} />
        <Route path="Inspecation" element={<Inspection></Inspection>} />
        <Route path="Documents" element={<DocumentUploadScreen onContinue={() => {}} />} />
        <Route path="New-Policy-Details" element={<NewPolicyDetails />} />
        <Route path="Payment-Details" element={<PaymentDetails />} />
      </Routes>
    </div>
  );
};

export default InsuranceCasePage;
