"use client"

import { useState, type ChangeEvent } from "react"
import { X, Edit2 } from "lucide-react"
import { carsAPI } from "../services/api"

interface AddCarProps {
  isOpen: boolean
  onClose: () => void
  onCarAdded: () => void
}

interface ImageData {
  url: string
  publicId?: string
  alt?: string
}

const MAX_IMAGES = 10

export default function AddCar({ isOpen, onClose, onCarAdded }: AddCarProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerContact: "",
    purchaseDate: "",
    paymentStatus: "Completed",
    Brand: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    color: "",
    carNumber: "",
    condition: "new",
    status: "available",
    vin: "",
    email: "",
  })

  const [error, setError] = useState<string | null>(null)

  // Image upload logic
  const [images, setImages] = useState<(ImageData | null)[]>([null, null])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const IMAGE_PRESET = import.meta.env.VITE_IMAGE_PRESET
  const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL

  // Handle single or multiple uploads in any box
  const handleImageUpload = async (index: number, event: ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const files = event.target.files
    if (!files || files.length === 0) return

    const currentImageCount = images.filter(Boolean).length
    const availableSlots = MAX_IMAGES - currentImageCount

    if (availableSlots <= 0) {
      setError(`You can upload a maximum of ${MAX_IMAGES} images.`)
      return
    }

    const filesToUpload = Array.from(files).slice(0, availableSlots)
    let newImages = [...images]

    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i]
      const formDataUp = new FormData()
      formDataUp.append("file", file)
      formDataUp.append("upload_preset", IMAGE_PRESET)
      try {
        const res = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: formDataUp,
        })
        const data = await res.json()
        const imageData: ImageData = {
          url: data.secure_url,
          publicId: data.public_id,
          alt: `Car image ${index + i + 1}`,
        }
        // If uploading into existing empty box, fill it, else add at end
        if (index + i < newImages.length) {
          newImages[index + i] = imageData
        } else {
          newImages.push(imageData)
        }
      } catch (error) {
        setError("Failed to upload image. Please try again.")
      }
    }

    // Always keep one extra empty box at the end, unless max reached
    const validCount = newImages.filter(Boolean).length
    if (validCount < MAX_IMAGES) {
      // Remove trailing nulls, then add one empty box
      newImages = newImages.filter((img, idx) => img !== null || idx < validCount)
      newImages.push(null)
    } else {
      // Remove all trailing nulls if max reached
      while (newImages.length > 0 && newImages[newImages.length - 1] === null) {
        newImages.pop()
      }
    }

    setImages(newImages)
  }

  // Remove image and maintain at least one empty box (unless max reached)
  const handleRemoveImage = (index: number) => {
    let newImages = [...images]
    newImages[index] = null
    // Remove trailing nulls except one at end (unless max reached)
    let validCount = newImages.filter(Boolean).length
    if (validCount < MAX_IMAGES) {
      // Remove trailing nulls except one at end
      while (newImages.length > 1 && newImages[newImages.length - 1] === null && newImages[newImages.length - 2] === null) {
        newImages.pop()
      }
      // Always ensure one empty box
      if (newImages.filter(Boolean).length === newImages.length) {
        newImages.push(null)
      }
    } else {
      // Remove all trailing nulls if max reached
      while (newImages.length > 0 && newImages[newImages.length - 1] === null) {
        newImages.pop()
      }
    }
    setImages(newImages)
  }

  const handleSubmit = async () => {
    try {
      const validImages = images.filter((img): img is ImageData => img !== null)
      const payload = {
        ...formData,
        year: Number.parseInt(formData.year, 10),
        price: Number.parseFloat(formData.price),
        mileage: Number.parseFloat(formData.mileage),
        images: validImages,
      }
      await carsAPI.createCar(payload)
      onCarAdded()
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add car. Please check the fields and try again.")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Add a new car</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>}

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Customer Details</h3>
            <div className="grid grid-cols-2 gap-6">
              <InputField
                label="Customer Name"
                value={formData.customerName}
                onChange={(e) => handleInputChange("customerName", e.target.value)}
              />
              <InputField
                label="Contact Number"
                value={formData.customerContact}
                maxLength={10}
                onChange={(e) => handleInputChange("customerContact", e.target.value)}
              />
              <InputField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              <InputField
                label="Purchase date"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => handleInputChange("purchaseDate", e.target.value)}
              />
              <SelectField
                label="Payment status"
                value={formData.paymentStatus}
                onChange={(e) => handleInputChange("paymentStatus", e.target.value)}
                options={["Completed", "Pending", "Failed"]}
              />
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Car Images <span className="text-xs text-gray-500">(Max {MAX_IMAGES})</span></h3>
            <div className="grid grid-cols-2 gap-6">
              {images.map((img, index) => (
                <div key={index} className="relative">
                  <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center relative overflow-hidden">
                    {img ? (
                      <>
                        <img
                          src={img.url || "/placeholder.svg"}
                          alt={img.alt || `Car image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      images.filter(Boolean).length < MAX_IMAGES && (
                        <>
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center mb-2">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <p className="text-gray-500 text-sm">Upload image(s)</p>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleImageUpload(index, e)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {images.filter(Boolean).length} / {MAX_IMAGES} images uploaded
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Car Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Brand"
                value={formData.Brand}
                onChange={(e) => handleInputChange("Brand", e.target.value)}
              />
              <InputField
                label="Model"
                value={formData.model}
                onChange={(e) => handleInputChange("model", e.target.value)}
              />
              <InputField
                label="Year"
                type="number"
                value={formData.year}
                onChange={(e) => handleInputChange("year", e.target.value)}
              />
              <InputField
                label="Price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
              />
              <InputField label="VIN" maxLength={17} minLength={17} value={formData.vin} onChange={(e) => handleInputChange("vin", e.target.value)} />
              <InputField
                label="Mileage"
                type="number"
                value={formData.mileage}
                onChange={(e) => handleInputChange("mileage", e.target.value)}
              />
              <InputField
                label="Color"
                value={formData.color}
                onChange={(e) => handleInputChange("color", e.target.value)}
              />
              <InputField
                label="Car Number"
                value={formData.carNumber}
                onChange={(e) => handleInputChange("carNumber", e.target.value)}
              />
              <SelectField
                label="Condition"
                value={formData.condition}
                onChange={(e) => handleInputChange("condition", e.target.value)}
                options={["new", "used"]}
              />
              <SelectField
                label="Status"
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                options={["available", "sold"]}
              />
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t mt-6">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md"
            >
              Add Car
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const InputField = ({
  label,
  onChange,
  ...props
}: { label: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void; [key: string]: any }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <input
        {...props}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 pr-10"
      />
      <Edit2 size={16} className="absolute right-3 top-3 text-gray-400" />
    </div>
  </div>
)

const SelectField = ({
  label,
  options,
  onChange,
  ...props
}: { label: string; options: string[]; onChange: (e: ChangeEvent<HTMLSelectElement>) => void; [key: string]: any }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <select
        {...props}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 pr-10 appearance-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>
      <Edit2 size={16} className="absolute right-3 top-3 text-gray-400" />
    </div>
  </div>
)
