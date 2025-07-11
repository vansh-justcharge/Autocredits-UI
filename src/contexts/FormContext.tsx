import React, { createContext, useContext, useState, useEffect } from "react";

type FormData = {
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

const defaultFormData: FormData = {
  buyerName: "",
  mobileNumber: "",
  buyerType: "Individual",
  insuranceCategory: "",
  source: "",
  status: "",
  followUp: "",
  assignTo: "",
  caseComment: "",
  email: "",
  address: "",
  city: "",
  pin: "",
  gender: "Male",
  maritalStatus: "Single",
  dob: "",
  occupation: "",
  annualIncome: "",
  pan: "",
  adhar: "",
  gst: "",
  nomineeName: "",
  nomineeAge: "",
  nomineeRelation: "",
  nomineeReferenceName: "",
  nomineeReferenceNumber: "",
  registerNumber: "",
  make: "",
  model: "",
  variant: "",
  engineNumber: "",
  chassiNumber: "",
  makeMonthYear: "",
  registerMonthYear: "",
  inspectionStatus: "",
  inspectionReferenceNo: "",
  inseptionComment: "",
  insuranceCompany: "",
  branch: "",
  policyType: "",
  policyNumber: "",
  issueDate: "",
  dueDate: "",
  ncbDiscount: "",
  claimLastYear: "",
  insurer: "",
  premium: "",
  coverage: "",
  ncb: "",
  quoteInsuranceDuration: "",
  quoteIDV: "",
  quoteTotalPremium: "",
  features: [],
  policyIssued: "",
  newInsuranceCompany: "",
  newBranch: "",
  newPolicyType: "",
  newPolicyNumber: "",
  newIssueDate: "",
  newDueDate: "",
  newNcbDiscount: "",
  newInsuranceDuration: "",
  idv: "",
  NewTotalPremium: "",
  paymentAmount: "",
  paymentDate: "",
  receiptNumber: "",
  receiptDate: "",
  bankName: "",
  documentUrls: [],
};

const FormContext = createContext<{
  form: FormData;
  updateForm: (data: Partial<FormData>) => void;
  resetForm: () => void;
} | null>(null);

export const FormProvider = ({ children }) => {
  const [form, setForm] = useState<FormData>(() => {
    const saved = localStorage.getItem("insuranceForm");
    return saved ? JSON.parse(saved) : defaultFormData;
  });

  useEffect(() => {
    localStorage.setItem("insuranceForm", JSON.stringify(form));
  }, [form]);

  const updateForm = (data: Partial<FormData>) => {
    setForm((prev) => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    localStorage.removeItem("insuranceForm");
    setForm(defaultFormData);
  };

  return (
    <FormContext.Provider value={{ form, updateForm, resetForm }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) throw new Error("useFormContext must be used inside FormProvider");
  return context;
};
