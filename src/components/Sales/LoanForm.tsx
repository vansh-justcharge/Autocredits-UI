import React, { useState } from "react";

interface LoanFormProps {
  onClose: () => void;
}

const PAYMENT_STATUSES = ["Approved", "Processing", "Pending", "Rejected"];

const initialForm = {
  loanId: "",
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  loanAmount: "",
  emiAmount: "",
  tenure: "",
  interestRate: "",
  startDate: "",
  endDate: "",
  emiDate: "",
  paymentStatus: "",
  notes: "",
};

type FormErrors = Partial<Record<keyof typeof initialForm, string>>;

const requiredFields: (keyof typeof initialForm)[] = [
  "loanId",
  "customerName",
  "customerEmail",
  "customerPhone",
  "loanAmount",
  "emiAmount",
  "tenure",
  "interestRate",
  "startDate",
  "endDate",
  "emiDate",
  "paymentStatus",
];

const LoanForm: React.FC<LoanFormProps> = ({ onClose }) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = () => {
    const newErrors: FormErrors = {};

    requiredFields.forEach((field) => {
      if (!form[field]) {
        newErrors[field] = "This field is required";
      }
    });

    // Email validation
    if (
      form.customerEmail &&
      !/^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(form.customerEmail)
    )
      newErrors.customerEmail = "Invalid email address";

    // Phone validation (10 digits)
    if (form.customerPhone && !/^\d{10}$/.test(form.customerPhone))
      newErrors.customerPhone = "Enter a valid 10-digit phone number";

    // Amounts validation (positive number)
    if (form.loanAmount && !/^\d+(\.\d{1,2})?$/.test(form.loanAmount))
      newErrors.loanAmount = "Enter a valid amount";
    if (form.emiAmount && !/^\d+(\.\d{1,2})?$/.test(form.emiAmount))
      newErrors.emiAmount = "Enter a valid amount";

    // Tenure validation (positive integer)
    if (form.tenure && (!/^\d+$/.test(form.tenure) || +form.tenure <= 0))
      newErrors.tenure = "Enter a valid tenure in months";

    // Interest Rate validation (0-100)
    if (
      form.interestRate &&
      (!/^\d+(\.\d{1,2})?$/.test(form.interestRate) ||
        +form.interestRate < 0 ||
        +form.interestRate > 100)
    )
      newErrors.interestRate = "Enter a valid interest rate (%)";

    // Dates validation (start before end)
    if (
      form.startDate &&
      form.endDate &&
      new Date(form.startDate) > new Date(form.endDate)
    )
      newErrors.endDate = "End date must be after start date";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      alert("Form submitted:\n" + JSON.stringify(form, null, 2));
      onClose();
    }
  };

  const label = (text: string, field: keyof typeof initialForm) => (
    <label className="block mb-1 text-sm text-gray-700 font-medium">
      {text}
      {requiredFields.includes(field) && (
        <span className="text-red-600 ml-1">*</span>
      )}
    </label>
  );

  const inputClass =
    "w-full p-2 rounded bg-gray-200 border border-gray-300 placeholder-gray-500";
  const errorClass = "text-xs text-red-600 mt-1";

  return (
    <form
      className="bg-white  p-6 mt-4  max-w-full mx-auto"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[220px]">
          {label("Loan ID", "loanId")}
          <input
            className={inputClass}
            name="loanId"
            placeholder="Enter Loan ID"
            value={form.loanId}
            onChange={handleChange}
          />
          {errors.loanId && <div className={errorClass}>{errors.loanId}</div>}
        </div>
        <div className="flex-1 min-w-[220px]">
          {label("Customer Name", "customerName")}
          <input
            className={inputClass}
            name="customerName"
            placeholder="Enter Customer Name"
            value={form.customerName}
            onChange={handleChange}
          />
          {errors.customerName && (
            <div className={errorClass}>{errors.customerName}</div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[220px]">
          {label("Customer Email", "customerEmail")}
          <input
            className={inputClass}
            name="customerEmail"
            placeholder="Enter Customer Email"
            value={form.customerEmail}
            onChange={handleChange}
            type="email"
          />
          {errors.customerEmail && (
            <div className={errorClass}>{errors.customerEmail}</div>
          )}
        </div>
        <div className="flex-1 min-w-[220px]">
          {label("Customer Phone", "customerPhone")}
          <input
            className={inputClass}
            name="customerPhone"
            placeholder="Enter Customer Phone"
            value={form.customerPhone}
            onChange={handleChange}
            type="tel"
            maxLength={10}
          />
          {errors.customerPhone && (
            <div className={errorClass}>{errors.customerPhone}</div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[220px]">
          {label("Loan Amount", "loanAmount")}
          <input
            className={inputClass}
            name="loanAmount"
            placeholder="Enter Loan Amount"
            value={form.loanAmount}
            onChange={handleChange}
            type="number"
            min={0}
          />
          {errors.loanAmount && (
            <div className={errorClass}>{errors.loanAmount}</div>
          )}
        </div>
        <div className="flex-1 min-w-[220px]">
          {label("EMI Amount", "emiAmount")}
          <input
            className={inputClass}
            name="emiAmount"
            placeholder="Enter EMI Amount"
            value={form.emiAmount}
            onChange={handleChange}
            type="number"
            min={0}
          />
          {errors.emiAmount && (
            <div className={errorClass}>{errors.emiAmount}</div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[220px]">
          {label("Tenure (months)", "tenure")}
          <input
            className={inputClass}
            name="tenure"
            placeholder="Enter Tenure"
            value={form.tenure}
            onChange={handleChange}
            type="number"
            min={1}
          />
          {errors.tenure && (
            <div className={errorClass}>{errors.tenure}</div>
          )}
        </div>
        <div className="flex-1 min-w-[220px]">
          {label("Interest Rate (%)", "interestRate")}
          <input
            className={inputClass}
            name="interestRate"
            placeholder="Enter Interest Rate (%)"
            value={form.interestRate}
            onChange={handleChange}
            type="number"
            min={0}
            max={100}
            step="0.01"
          />
          {errors.interestRate && (
            <div className={errorClass}>{errors.interestRate}</div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[220px]">
          {label("Start Date", "startDate")}
          <input
            className={inputClass}
            name="startDate"
            placeholder="Enter Start Date"
            value={form.startDate}
            onChange={handleChange}
            type="date"
          />
          {errors.startDate && (
            <div className={errorClass}>{errors.startDate}</div>
          )}
        </div>
        <div className="flex-1 min-w-[220px]">
          {label("End Date", "endDate")}
          <input
            className={inputClass}
            name="endDate"
            placeholder="Enter End Date"
            value={form.endDate}
            onChange={handleChange}
            type="date"
          />
          {errors.endDate && (
            <div className={errorClass}>{errors.endDate}</div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[220px]">
          {label("EMI Date", "emiDate")}
          <input
            className={inputClass}
            name="emiDate"
            placeholder="Enter EMI Date"
            value={form.emiDate}
            onChange={handleChange}
            type="date"
          />
          {errors.emiDate && (
            <div className={errorClass}>{errors.emiDate}</div>
          )}
        </div>
        <div className="flex-1 min-w-[220px]">
          {label("Payment Status", "paymentStatus")}
          <select
            className={inputClass}
            name="paymentStatus"
            value={form.paymentStatus}
            onChange={handleChange}
          >
            <option value="">Select Status</option>
            {PAYMENT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          {errors.paymentStatus && (
            <div className={errorClass}>{errors.paymentStatus}</div>
          )}
        </div>
      </div>
      <div className="mb-4">
        {label("Additional Note", "notes")}
        <textarea
          className={inputClass}
          name="notes"
          placeholder="Enter additional notes here"
          value={form.notes}
          onChange={handleChange}
        />
      </div>
      <button
        type="submit"
        className="px-6 py-2 bg-black text-white rounded-lg font-medium"
      >
        Submit
      </button>
      <button
        type="button"
        className="ml-4 px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium"
        onClick={onClose}
      >
        Cancel
      </button>
    </form>
  );
};

export default LoanForm;
