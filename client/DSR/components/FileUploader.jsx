import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import axios from "axios";

const FileUploader = ({ selectedDept, selectedLab, selectedSection }) => {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [enlargedUrl, setEnlargedUrl] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file.");

    try {
      const res = await axiosInstance.get("/preSignedUrl/");
      const { preSignedUrl, key } = res.data;

      await axios.put(preSignedUrl, file, {
        headers: { "Content-Type": file.type,
          "Content-Disposition": `attachment; filename="${file.name}"`
         },
      });

      await axiosInstance.post("/saveFileToDB", {
        selectedDept,
        selectedLab,
        selectedSection,
        key,
        fileName: file.name,
        contentType: file.type,
      });

      alert("File uploaded successfully!");
      setFile(null);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed.");
    }
  };

  const handleViewFiles = async () => {
    try {
      const res = await axiosInstance.get("/getFilesForSection", {
        params: { selectedDept, selectedLab, selectedSection },
      });
      setFiles(res.data.files || []);
      setModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch files", err);
    }
  };

  const handleDelete = async (fileKey) => {
    const confirm = window.prompt(
      `Type DELETE to confirm deletion of this file:\n${fileKey}`
    );
    if (confirm !== "DELETE") return;
    console.log("going");
    try {
      await axiosInstance.delete("/deleteFile", {
        data: {
          key: fileKey,
          selectedDept,
          selectedLab,
          selectedSection,
        },
      });

      // Update local state
      setFiles((prev) => prev.filter((f) => f.key !== fileKey));
      alert("File deleted successfully.");
    } catch (err) {
      console.error("Error deleting file", err);
      alert("Failed to delete file.");
    }
  };

  const isImage = (url) =>
    url.match(/\.(jpeg|jpg|png|gif|bmp|webp|svg)$/i);

  return (
    <div className="p-5 flex flex-col gap-4">
      <div className="flex">
        <input
          type="file"
          accept="*/*"
          onChange={handleFileChange}
          className="m-2"
        />
        <button
          onClick={handleUpload}
          disabled={!selectedDept || !selectedLab || !selectedSection || !file}
          className="bg-blue-500 text-white m-2 py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Upload
        </button>
        <button
          onClick={handleViewFiles}
          disabled={!selectedDept || !selectedLab || !selectedSection}
          className="bg-blue-500 text-white m-2 py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          View Files
        </button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Files</h2>
              <button
                onClick={() => {
                  setModalOpen(false);
                  setEnlargedUrl(null);
                }}
                className="text-red-500 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {files.length === 0 ? (
              <p>No files found for this section.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-2 bg-gray-50 p-3 rounded-lg shadow"
                  >
                    {isImage(file.url) ? (
                      <img
                        src={file.url}
                        alt={file.fileName}
                        className="w-full h-48 object-cover cursor-pointer rounded"
                        onClick={() => setEnlargedUrl(file.url)}
                      />
                    ) : (
                      <iframe
                        src={file.url}
                        className="w-full h-48 rounded border"
                        title={file.fileName}
                      ></iframe>
                    )}

                    <p className="text-sm text-center break-words max-w-full">
                      {file.fileName}
                    </p>

                    <div className="flex gap-2">
                      <a
                        href={file.url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Download
                      </a>
                      <button
                        onClick={() => handleDelete(file.key)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {enlargedUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
          onClick={() => setEnlargedUrl(null)}
        >
          <img
            src={enlargedUrl}
            alt="Enlarged"
            className="max-w-full max-h-full rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default FileUploader;