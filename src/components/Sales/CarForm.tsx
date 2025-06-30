import React, { useState } from "react";

interface CarFormProps {
  onClose: () => void;
}

const BRANDS = [
  "Tesla",
  "Ford",
  "Chevrolet",
  "BMW",
  "Audi",
  "Honda",
  "Toyota",
  "Nissan",
  "Subaru",
];

const CAR_TYPES = ["New", "Used"];
const PAYMENT_STATUSES = ["Paid", "Pending", "Financing"];

const initialForm = {
  carId: "",
  carType: "",
  brand: "",
  model: "",
  year: "",
  price: "",
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  paymentStatus: "",
  notes: "",
};

type FormErrors = Partial<Record<keyof typeof initialForm, string>>;

const requiredFields: (keyof typeof initialForm)[] = [
  "carId",
  "carType",
  "brand",
  "model",
  "year",
  "price",
  "customerName",
  "customerEmail",
  "customerPhone",
  "paymentStatus",
];

const CarForm: React.FC<CarFormProps> = ({ onClose }) => {
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
    if (form.customerEmail && !/^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(form.customerEmail))
      newErrors.customerEmail = "Invalid email address";

    // Phone validation (10 digits)
    if (form.customerPhone && !/^\d{10}$/.test(form.customerPhone))
      newErrors.customerPhone = "Enter a valid 10-digit phone number";

    // Year validation (4 digits, reasonable range)
    if (
      form.year &&
      (!/^\d{4}$/.test(form.year) ||
        +form.year < 1980 ||
        +form.year > new Date().getFullYear() + 1)
    )
      newErrors.year = "Enter a valid year";

    // Price validation (should be a positive number)
    if (form.price && !/^\d+(\.\d{1,2})?$/.test(form.price))
      newErrors.price = "Enter a valid price";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      {requiredFields.includes(field) && <span className="text-red-600 ml-1">*</span>}
    </label>
  );

  const inputClass =
    "w-full p-2 rounded bg-gray-200 border border-gray-300 placeholder-gray-500";
  const errorClass = "text-xs text-red-600 mt-1";

  return (
    <form
      className="bg-white p-6 mt-4  max-w-full mx-auto"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[220px]">
          {label("Car ID", "carId")}
          <input
            className={inputClass}
            name="carId"
            placeholder="Enter Car ID"
            value={form.carId}
            onChange={handleChange}
          />
          {errors.carId && <div className={errorClass}>{errors.carId}</div>}
        </div>
        <div className="flex-1 min-w-[220px]">
          {label("Car Type", "carType")}
          <select
            className={inputClass}
            name="carType"
            value={form.carType}
            onChange={handleChange}
          >
            <option value="">Select Type</option>
            {CAR_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.carType && <div className={errorClass}>{errors.carType}</div>}
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[220px]">
          {label("Make (Brand)", "brand")}
          <select
            className={inputClass}
            name="brand"
            value={form.brand}
            onChange={handleChange}
          >
            <option value="">Select Brand</option>
            {BRANDS.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
          {errors.brand && <div className={errorClass}>{errors.brand}</div>}
        </div>
        <div className="flex-1 min-w-[220px]">
          {label("Model", "model")}
          <input
            className={inputClass}
            name="model"
            placeholder="Enter Model"
            value={form.model}
            onChange={handleChange}
          />
          {errors.model && <div className={errorClass}>{errors.model}</div>}
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[220px]">
          {label("Year", "year")}
          <input
            className={inputClass}
            name="year"
            placeholder="e.g. 2024"
            value={form.year}
            onChange={handleChange}
            type="number"
            min={1980}
            max={new Date().getFullYear() + 1}
          />
          {errors.year && <div className={errorClass}>{errors.year}</div>}
        </div>
        <div className="flex-1 min-w-[220px]">
          {label("Price", "price")}
          <input
            className={inputClass}
            name="price"
            placeholder="e.g. 800000"
            value={form.price}
            onChange={handleChange}
            type="number"
            min={0}
          />
          {errors.price && <div className={errorClass}>{errors.price}</div>}
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[220px]">
          {label("Customer Name", "customerName")}
          <input
            className={inputClass}
            name="customerName"
            placeholder="Enter Customer Name"
            value={form.customerName}
            onChange={handleChange}
          />
          {errors.customerName && <div className={errorClass}>{errors.customerName}</div>}
        </div>
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
          {errors.customerEmail && <div className={errorClass}>{errors.customerEmail}</div>}
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[220px]">
          {label("Customer Phone", "customerPhone")}
          <input
            className={inputClass}
            name="customerPhone"
            placeholder="10-digit Phone"
            value={form.customerPhone}
            onChange={handleChange}
            type="tel"
            maxLength={10}
          />
          {errors.customerPhone && <div className={errorClass}>{errors.customerPhone}</div>}
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
          {errors.paymentStatus && <div className={errorClass}>{errors.paymentStatus}</div>}
        </div>
      </div>
      <div className="mb-4">
        {label("Additional Notes", "notes")}
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

export default CarForm;
