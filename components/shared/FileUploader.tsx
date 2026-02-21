"use client";

import { useState, useRef } from "react";
import { Upload, FileText, X, Loader2 } from "lucide-react";

interface FileUploaderProps {
  initialFile?: string;
  onFileChange: (url: string) => void;
  folder?: string;
  accept?: string;
}

export default function FileUploader({
  initialFile,
  onFileChange,
  folder = "general",
  accept = "application/pdf,image/jpeg,image/png",
}: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError("");
    setFile(selectedFile);

    // Upload file
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await response.json();
      onFileChange(data.url);
    } catch (err: any) {
      setError(err.message);
      setFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    onFileChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {file || initialFile ? (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText size={20} className="text-purple-700" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {file ? file.name : "Uploaded document"}
              </p>
              {file && (
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(0)} KB
                </p>
              )}
            </div>
          </div>
          {!uploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 text-gray-400 hover:text-red-600 transition"
            >
              <X size={20} />
            </button>
          )}
          {uploading && (
            <Loader2 size={20} className="text-purple-700 animate-spin" />
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-purple-500 hover:bg-purple-50/50 transition"
        >
          {uploading ? (
            <>
              <Loader2 size={32} className="text-purple-700 animate-spin" />
              <p className="text-gray-600">Uploading...</p>
            </>
          ) : (
            <>
              <Upload size={32} className="text-gray-400" />
              <p className="text-gray-600 font-medium">Click to upload</p>
              <p className="text-sm text-gray-500">PDF, JPG, PNG up to 10MB</p>
            </>
          )}
        </button>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
