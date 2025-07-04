// import React, { useState, useEffect, ChangeEvent } from 'react';
// import { X, Edit2 } from 'lucide-react';
// import { carsAPI } from '../services/api';

// interface ImageData {
//   url: string;
//   publicId?: string;
//   alt?: string;
// }

// interface Car {
//   _id: string;
//   Brand: string;
//   model: string;
//   year: number;
//   price: number;
//   mileage: number;
//   vin: string;
//   condition: 'new' | 'used';
//   status: 'available' | 'sold';
//   customerName?: string;
//   customerContact?: string;
//   email?: string;
//   purchaseDate?: string;
//   paymentStatus?: 'Completed' | 'Pending' | 'Failed';
//   color?: string;
//   carNumber?: string;
//   images?: ImageData[];
// }

// interface EditCarModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   car: Car;
//   onUpdate: (updatedCar: Car) => void;
// }

// const IMAGE_PRESET = import.meta.env.VITE_IMAGE_PRESET;
// const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
// const MAX_IMAGES = 10;

// export default function EditCarModal({ isOpen, onClose, car, onUpdate }: EditCarModalProps) {
//   const [formData, setFormData] = useState<Partial<Car>>(car);
//   const [error, setError] = useState<string | null>(null);

//   // --- Image state ---
//   const [images, setImages] = useState<(ImageData | null)[]>([]);

//   useEffect(() => {
//     setFormData(car);
//     setImages(car.images && car.images.length > 0 ? [...car.images] : []);
//   }, [car]);

//   const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   // --- Image upload handler ---
//   const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
//     setError(null);
//     const files = event.target.files;
//     if (!files || files.length === 0) return;

//     const currentCount = images.filter(Boolean).length;
//     const availableSlots = MAX_IMAGES - currentCount;
//     if (availableSlots <= 0) {
//       setError(`You can upload a maximum of ${MAX_IMAGES} images.`);
//       return;
//     }

//     const filesToUpload = Array.from(files).slice(0, availableSlots);
//     let uploaded: ImageData[] = [];

//     for (let i = 0; i < filesToUpload.length; i++) {
//       const file = filesToUpload[i];
//       const formDataUp = new FormData();
//       formDataUp.append("file", file);
//       formDataUp.append("upload_preset", IMAGE_PRESET);
//       try {
//         const res = await fetch(CLOUDINARY_URL, {
//           method: "POST",
//           body: formDataUp,
//         });
//         const data = await res.json();
//         uploaded.push({
//           url: data.secure_url,
//           publicId: data.public_id,
//           alt: `Car image ${currentCount + i + 1}`,
//         });
//       } catch (error) {
//         setError("Failed to upload image. Please try again.");
//       }
//     }

//     setImages(prev => {
//       const newImages = [...prev.filter(Boolean), ...uploaded];
//       return newImages.slice(0, MAX_IMAGES);
//     });
//   };

//   // --- Remove image handler ---
//   const handleRemoveImage = (index: number) => {
//     setImages(prev => {
//       const newImages = [...prev];
//       newImages.splice(index, 1);
//       return newImages;
//     });
//   };

//   // --- Submit handler ---
//   const handleSubmit = async () => {
//     try {
//       const validImages = images.filter((img): img is ImageData => img !== null);
//       const payload: Car = {
//         ...car,
//         ...formData,
//         year: parseInt(formData.year as unknown as string, 10),
//         price: parseFloat(formData.price as unknown as string),
//         mileage: parseFloat(formData.mileage as unknown as string),
//         images: validImages,
//       };
//       await carsAPI.updateCar(car._id, payload);
//       onUpdate(payload);
//       onClose();
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Failed to update car');
//     }
//   };

//   if (!isOpen) return null;

//   // --- UI for image boxes ---
//   const imageBoxes = images.map((img, index) => (
//     <div key={index} className="relative">
//       <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center relative overflow-hidden">
//         {img ? (
//           <>
//             <img
//               src={img.url || "/placeholder.svg"}
//               alt={img.alt || `Car image ${index + 1}`}
//               className="w-full h-full object-cover"
//             />
//             <button
//               type="button"
//               onClick={() => handleRemoveImage(index)}
//               className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
//             >
//               <X size={16} />
//             </button>
//           </>
//         ) : null}
//       </div>
//     </div>
//   ));

//   // Add one empty upload box if images < MAX_IMAGES
//   if (images.length < MAX_IMAGES) {
//     imageBoxes.push(
//       <div key="upload" className="relative">
//         <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center relative overflow-hidden">
//           <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center mb-2">
//             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5v-8m0 0L8.25 8.25M12 8.5l3.75-3.75m-7.5 7.5h8.25m0 0l-3.75 3.75m3.75-3.75l-3.75-3.75" />
//             </svg>
//           </div>
//           <p className="text-gray-500 text-sm">Upload image(s)</p>
//           <input
//             type="file"
//             accept="image/*"
//             multiple
//             onChange={handleImageUpload}
//             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//           />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between p-6 border-b">
//           <h2 className="text-xl font-semibold">Edit Car</h2>
//           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
//             <X size={16} />
//           </button>
//         </div>

//         <div className="p-6">
//           {error && (
//             <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
//               {error}
//             </div>
//           )}

//           {/* --- Image section --- */}
//           <div className="mb-8">
//             <h3 className="text-lg font-medium mb-4">Car Images <span className="text-xs text-gray-500">(Max {MAX_IMAGES})</span></h3>
//             <div className="grid grid-cols-2 gap-6">
//               {imageBoxes}
//             </div>
//             <div className="mt-2 text-xs text-gray-500">
//               {images.length} / {MAX_IMAGES} images uploaded
//             </div>
//           </div>
//           {/* --- Customer Details --- */}
//           <div className="mb-8">
//             <h3 className="text-lg font-medium mb-4">Customer Details</h3>
//             <div className="grid grid-cols-2 gap-6">
//               <InputField label="Customer Name" name="customerName" value={formData.customerName} onChange={handleInputChange} />
//               <InputField label="Contact Number" name="customerContact" value={formData.customerContact} onChange={handleInputChange} />
//               <InputField label="Email" name="email" value={formData.email} onChange={handleInputChange} />
//               <InputField label="Purchase date" name="purchaseDate" type="date" value={formData.purchaseDate} onChange={handleInputChange} />
//               <SelectField label="Payment status" name="paymentStatus" value={formData.paymentStatus} onChange={handleInputChange} options={['Completed', 'Pending', 'Failed']} />
//             </div>
//           </div>

//           {/* --- Car Details --- */}
//           <div className="mb-6">
//             <h3 className="text-lg font-medium mb-2">Car Details</h3>
//             <div className="grid grid-cols-2 gap-6">
//               <InputField label="Brand" name="Brand" value={formData.Brand} onChange={handleInputChange} />
//               <InputField label="Model" name="model" value={formData.model} onChange={handleInputChange} />
//               <InputField label="Year" name="year" type="number" value={formData.year} onChange={handleInputChange} />
//               <InputField label="Price" name="price" type="number" value={formData.price} onChange={handleInputChange} />
//               <InputField label="Mileage" name="mileage" type="number" value={formData.mileage} onChange={handleInputChange} />
//               <InputField label="Color" name="color" value={formData.color} onChange={handleInputChange} />
//               <InputField label="Car Number" name="carNumber" value={formData.carNumber} onChange={handleInputChange} />
//               <SelectField label="Condition" name="condition" value={formData.condition} onChange={handleInputChange} options={['new', 'used']} />
//               <SelectField label="Status" name="status" value={formData.status} onChange={handleInputChange} options={['available', 'sold']} />
//             </div>
//           </div>

//           <div className="flex justify-end pt-6 border-t mt-6">
//             <button
//               type="button"
//               onClick={handleSubmit}
//               className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md"
//             >
//               Save Changes
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// const InputField = ({ label, ...props }: { label: string, [key: string]: any }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
//     <div className="relative">
//       <input {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 pr-10" />
//       <Edit2 size={16} className="absolute right-3 top-3 text-gray-400" />
//     </div>
//   </div>
// );

// const SelectField = ({ label, options, ...props }: { label: string, options: string[], [key: string]: any }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
//     <div className="relative">
//       <select {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 pr-10 appearance-none">
//         {options.map(option => <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>)}
//       </select>
//       <Edit2 size={16} className="absolute right-3 top-3 text-gray-400" />
//     </div>
//   </div>
// );


import React, { useState, useEffect, ChangeEvent } from 'react';
import { X, Edit2 } from 'lucide-react';

interface ImageData {
  url: string;
  alt?: string;
}

interface Car {
  _id: string;
  Brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  vin: string;
  condition: 'new' | 'used';
  status: 'available' | 'sold';
  customerName?: string;
  customerContact?: string;
  email?: string;
  purchaseDate?: string;
  paymentStatus?: 'Completed' | 'Pending' | 'Failed';
  color?: string;
  carNumber?: string;
  images?: ImageData[];
}

interface EditCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: Car;
  onUpdate: (updatedCar: Car) => void;
}

const MAX_IMAGES = 10;

export default function EditCarModal({ isOpen, onClose, car, onUpdate }: EditCarModalProps) {
  const [formData, setFormData] = useState<Partial<Car>>(car);
  const [error, setError] = useState<string | null>(null);

  // --- Image state ---
  const [images, setImages] = useState<(ImageData | null)[]>([]);

  useEffect(() => {
    setFormData(car);
    setImages(car.images && car.images.length > 0 ? [...car.images] : []);
  }, [car]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- Image upload handler (demo: use local object URLs) ---
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const currentCount = images.filter(Boolean).length;
    const availableSlots = MAX_IMAGES - currentCount;
    if (availableSlots <= 0) {
      setError(`You can upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, availableSlots);
    let uploaded: ImageData[] = [];

    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      const url = URL.createObjectURL(file);
      uploaded.push({
        url,
        alt: `Car image ${currentCount + i + 1}`,
      });
    }

    setImages(prev => {
      const newImages = [...prev.filter(Boolean), ...uploaded];
      return newImages.slice(0, MAX_IMAGES);
    });
  };

  // --- Remove image handler ---
  const handleRemoveImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  // --- Submit handler (demo: just call onUpdate) ---
  const handleSubmit = () => {
    const validImages = images.filter((img): img is ImageData => img !== null);
    const payload: Car = {
      ...car,
      ...formData,
      year: parseInt(formData.year as unknown as string, 10),
      price: parseFloat(formData.price as unknown as string),
      mileage: parseFloat(formData.mileage as unknown as string),
      images: validImages,
    };
    onUpdate(payload);
    onClose();
  };

  if (!isOpen) return null;

  // --- UI for image boxes ---
  const imageBoxes = images.map((img, index) => (
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
        ) : null}
      </div>
    </div>
  ));

  // Add one empty upload box if images < MAX_IMAGES
  if (images.length < MAX_IMAGES) {
    imageBoxes.push(
      <div key="upload" className="relative">
        <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5v-8m0 0L8.25 8.25M12 8.5l3.75-3.75m-7.5 7.5h8.25m0 0l-3.75 3.75m3.75-3.75l-3.75-3.75" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">Upload image(s)</p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Edit Car</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X size={16} />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* --- Image section --- */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Car Images <span className="text-xs text-gray-500">(Max {MAX_IMAGES})</span></h3>
            <div className="grid grid-cols-2 gap-6">
              {imageBoxes}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {images.length} / {MAX_IMAGES} images uploaded
            </div>
          </div>
          {/* --- Customer Details --- */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Customer Details</h3>
            <div className="grid grid-cols-2 gap-6">
              <InputField label="Customer Name" name="customerName" value={formData.customerName} onChange={handleInputChange} />
              <InputField label="Contact Number" name="customerContact" value={formData.customerContact} onChange={handleInputChange} />
              <InputField label="Email" name="email" value={formData.email} onChange={handleInputChange} />
              <InputField label="Purchase date" name="purchaseDate" type="date" value={formData.purchaseDate} onChange={handleInputChange} />
              <SelectField label="Payment status" name="paymentStatus" value={formData.paymentStatus} onChange={handleInputChange} options={['Completed', 'Pending', 'Failed']} />
            </div>
          </div>
          {/* --- Car Details --- */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Car Details</h3>
            <div className="grid grid-cols-2 gap-6">
              <InputField label="Brand" name="Brand" value={formData.Brand} onChange={handleInputChange} />
              <InputField label="Model" name="model" value={formData.model} onChange={handleInputChange} />
              <InputField label="Year" name="year" type="number" value={formData.year} onChange={handleInputChange} />
              <InputField label="Price" name="price" type="number" value={formData.price} onChange={handleInputChange} />
              <InputField label="Mileage" name="mileage" type="number" value={formData.mileage} onChange={handleInputChange} />
              <InputField label="Color" name="color" value={formData.color} onChange={handleInputChange} />
              <InputField label="Car Number" name="carNumber" value={formData.carNumber} onChange={handleInputChange} />
              <SelectField label="Condition" name="condition" value={formData.condition} onChange={handleInputChange} options={['new', 'used']} />
              <SelectField label="Status" name="status" value={formData.status} onChange={handleInputChange} options={['available', 'sold']} />
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t mt-6">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const InputField = ({ label, ...props }: { label: string, [key: string]: any }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <input {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 pr-10" />
      <Edit2 size={16} className="absolute right-3 top-3 text-gray-400" />
    </div>
  </div>
);

const SelectField = ({ label, options, ...props }: { label: string, options: string[], [key: string]: any }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <select {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 pr-10 appearance-none">
        {options.map(option => <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>)}
      </select>
      <Edit2 size={16} className="absolute right-3 top-3 text-gray-400" />
    </div>
  </div>
);
