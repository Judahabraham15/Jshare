//! import React from 'react'

import { FiCheck } from "react-icons/fi";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FileUploader = () => {
  const [selectedFiles, setSelectedFile] = useState<File | null>(null);
  const [showPopup, setshowPopup] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  // ? const btn  = document.querySelector("#file");
  const MAX_TOTAL_SIZE = 100 * 1024 * 1024;
  const UploadFile = () => {
    if (!selectedFiles) {
      return;
    }
    if (selectedFiles.size > MAX_TOTAL_SIZE) {
      setshowPopup(true);
      setTimeout(() => {
        setshowPopup(false);
      }, 3000);

      setSelectedFile(null);
      return;
    }

    console.log("FILE:", selectedFiles.name);
  };
  return (
    <div className="min-h-[100vh] flex flex-col items-center justify-center mt-[6.5rem]">
      <div
        className="flex flex-col items-center justify-center p-[20px]
       max-w-[700px] text-center font-nunito"
      >
        <h1 className="text-white text-5xl w-[800px] font-semibold leading-[3.2rem]">
          <span className="text-blue-400">Streamline your workflow </span>
          with rapid file sharing, globally accessible.
        </h1>
        <p className="text-slate-400 text-[18px] mt-[10px]">
          Upload files and generate a shareable link in mere seconds.
        </p>
      </div>
      <div
        className="flex  flex-col w-full max-w-3xl h-[18rem] px-4 py-6 mt-8
            text-white text-lg
            bg-transparent
            border-2 border-dotted border-blue-400
            rounded-lg
            cursor-pointer
            transition duration-200
            hover:border-blue-600 focus:outline-none
            items-center justify-center"
      >
        <label htmlFor="file_input">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-upload w-12 h-12 mx-auto mb-4 text-blue-500 cursor-pointer"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" x2="12" y1="3" y2="15"></line>
          </svg>
          <input
            type="file"
            id="file_input"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </label>
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-slate-400 text-[17px] mb-1">
            Drag & Drop files or choose them from your device.
          </h1>
          <p className="text-slate-400 text-[16px]">Maximum size: 100MB</p>
        </div>
      </div>
      <button
        className={`mt-6 px-[10rem] py-3 bg-blue-500 flex items-center justify-center
        hover:bg-blue-600 text-white font-semibold 
        rounded-lg shadow transition duration-200 
        disabled:opacity-50 font-nunito ${
          selectedFiles ? "cursor-pointer" : "cursor-not-allowed"
        }`}
        id="file"
        onClick={UploadFile}
        disabled={!selectedFiles}
      >
        <FiCheck
          style={{ verticalAlign: "middle" }}
          size={20}
          className="mr-2"
        />{" "}
        Upload File{" "}
        {selectedFiles
          ? (selectedFiles.size / (1024 * 1024)).toFixed(2)
          : "0.00"}{" "}z
        MB
      </button>
      {selectedFiles && (
        <div>
          <p className="text-blue-400 mt-4 text-[15px]">{selectedFiles.name}</p>
        </div>
      )}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed top-8 right-8 z-50 bg-blue-600 bg-opacity-95 border-1 border-blue-400 rounded-xl shadow-lg p-5 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
              type: "spring",
              stiffness: 120,
              damping: 20,
            }}
          >
            <p className="text-white font-nunito font-semibold">
              🚫 File exceeds the maximum size limit (100MB).
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploader;
