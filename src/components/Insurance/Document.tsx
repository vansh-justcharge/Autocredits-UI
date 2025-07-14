import React, { useRef, useState } from "react";
import { File } from "lucide-react";
import axios from "axios";
import { useFormContext } from "../../contexts/FormContext";
import { useNavigate } from "react-router-dom";

const DocumentUploadScreen = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const { form, updateForm, resetForm } = useFormContext();
  const navigate = useNavigate();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle submit
  const handleSubmit = async () => {
    try {
      setUploading(true);
      const urls: string[] = [];

      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_API_URL}/upload/file`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );


        urls.push(res.data.url);
      }

      updateForm({ documentUrls: urls });

      const apiUrl = `${import.meta.env.VITE_BACKEND_API_URL}/insurance/create`;
      const res = await axios.post(apiUrl, { ...form, documentUrls: urls });

      if (res.status === 200 || res.status === 201) {
        alert("All details submitted successfully!");
        resetForm();
        navigate("/dashboard/insurance");
        
      } else {
        alert("Submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Upload or submission failed:", error);
      alert("Upload or submission failed. See console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-full mx-auto mt-16 p-8 bg-white rounded-xl shadow-lg flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">Document Upload</h2>
      <div
        className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 mb-8 transition-colors hover:border-violet-600"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <File className="w-12 h-12 text-gray-400 mb-4" />
        <p className="mb-4 text-gray-600">Drop files here to upload</p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors font-medium"
        >
          Click here to upload
        </button>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {selectedFiles.length > 0 && (
        <table className="w-full mb-8 table-auto border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">File Name</th>
              <th className="px-4 py-2 border">Size</th>
              <th className="px-4 py-2 border">Remove</th>
            </tr>
          </thead>
          <tbody>
            {selectedFiles.map((file, idx) => (
              <tr key={idx}>
                <td className="px-4 py-2 border">{file.name}</td>
                <td className="px-4 py-2 border">{(file.size / 1024).toFixed(2)} KB</td>
                <td className="px-4 py-2 border">
                  <button onClick={() => removeFile(idx)} className="text-red-600">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        className="w-full bg-black text-white py-3 rounded-lg text-lg font-semibold transition-colors"
        onClick={handleSubmit}
        disabled={uploading || selectedFiles.length === 0}
      >
        {uploading ? "Uploading..." : "Submit"}
      </button>
    </div>
  );
};

export default DocumentUploadScreen;
