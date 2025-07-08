import React, { useRef, useState } from "react";
import { File } from "lucide-react";

interface DocumentUploadScreenProps {
  onContinue: () => void;
}

const DocumentUploadScreen: React.FC<DocumentUploadScreenProps> = ({ onContinue }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
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
                  <button onClick={() => removeFile(idx)} className="text-red-600">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button
        className="w-full bg-black text-white py-3 rounded-lg text-lg font-semibold transition-colors"
        onClick={onContinue}
      >
        Submit
      </button>
    </div>
  );
};

export default DocumentUploadScreen;
