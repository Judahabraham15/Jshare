//! import React from 'react'

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Axios, { AxiosError } from "axios";
import { FiCheckCircle, FiCopy, FiX } from "react-icons/fi";
import { PiLinkSimpleHorizontalDuotone } from "react-icons/pi";
import { IoMdImages } from "react-icons/io";

const FileUploader = () => {
  const [selectedFiles, setSelectedFile] = useState<File | null>(null);
  const [showPopup, setshowPopup] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [status, setStatus] = useState<fileStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  type fileStatus= "idle" | "Successful" | "Failed";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (error) {
      setErrorMessage("❌ Failed to copy link.");
    }
  };
  const handleFileChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
      setLink("");
    }
  };
  // ? const btn  = document.querySelector("#file");
  const MAX_TOTAL_SIZE = 100 * 1024 * 1024;
  const uploadFile: () => Promise<void> = async () => {
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
    setUploading(true);
    // console.log("FILE:", selectedFiles.name);

    //* Creating the FormData for organisation.https://api.escuelajs.co/api/v1/files/upload

    const formData: FormData = new FormData();
    formData.append("file", selectedFiles);
    try {
      const response = await Axios.post(
        "http://localhost:5174/upload",
        formData
      );
      if (response.status === 200) {
        setStatus("Successful");
        setLink(response.data.link || "No Link Provided!");
        setTimeout(() => {
          setStatus("idle");
          console.log(response.data.link || "No link provided");
        }, 3000);
        console.log("Upload successful:", response.data);
      } else {
        setStatus("Failed");
        setLink("");
        setErrorMessage(" ❌ Upload failed. Please try again.");
        setTimeout(() => {
          setStatus("idle");
        }, 3000);
        console.error(
          "Upload Failed: Server responded with status",
          response.status
        );
      }
      setSelectedFile(null);
    } catch (error) {
      setStatus("Failed");
      const axiosError = error as AxiosError;
      if (axiosError.code === "ERR_NETWORK") {
        setErrorMessage(
          "❌ No internet connection. Please check your network."
        );
      } else if (axiosError.response?.status === 413) {
        setErrorMessage("❌ File too large for the server.");
      } else if (axiosError.response?.status === 400) {
        setErrorMessage("❌ Invalid file format.");
      } else {
        setErrorMessage("❌ Upload failed. Something went wrong!");
      }
      setTimeout(() => {
        setStatus("idle");
      }, 3000);
      console.error("Upload Failed:", error);
    } finally {
      setUploading(false);
    }

    //? const res = formData.get("file");
    //? console.log(res);
  };
  return (
    <div className="min-h-screen px-4 flex flex-col items-center justify-center mt-16 sm:mt-20 md:mt-24">
      <div className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 max-w-full sm:max-w-md md:max-w-lg lg:max-w-2xl text-center font-nunito">
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight sm:leading-snug md:leading-[3.2rem] w-full sm:w-[550px] md:w-[600px] lg:w-[700px]">
          <span className="text-blue-400">Streamline your workflow </span>
          with rapid file sharing, globally accessible.
        </h1>
        <p className="text-slate-400 text-base sm:text-lg mt-2 sm:mt-3">
          Upload files and generate a shareable link in mere seconds.
        </p>
      </div>
      <div className="flex flex-col  w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl h-48 sm:h-56 md:h-64 px-4 sm:px-6 py-6 mt-6 sm:mt-8 text-white text-base sm:text-lg bg-transparent border-2 border-dotted border-blue-400 rounded-lg cursor-pointer transition duration-200 hover:border-blue-600 focus:outline-none items-center justify-center">
        <label htmlFor="file_input">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-upload w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-blue-500 cursor-pointer"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" x2="12" y1="3" y2="15"></line>
          </svg>
          <input
            type="file"
            id="file_input"
            style={{ display: "none" }}
            onChange={handleFileChanged}
          />
        </label>
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-slate-400 text-center mb-3 text-sm sm:text-base">
            Drag & Drop files or choose them from your device.
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Maximum size: 100MB
          </p>
        </div>
      </div>
      <button
        className={`mt-4 sm:mt-6 w-full max-w-xs sm:max-w-md md:max-w-lg py-3 bg-blue-500 flex items-center justify-center hover:bg-blue-600 text-white font-semibold rounded-lg shadow transition duration-200 disabled:opacity-50 font-nunito ${
          selectedFiles ? "cursor-pointer" : "cursor-not-allowed"
        }`}
        id="file"
        onClick={uploadFile}
        disabled={!selectedFiles || uploading}
      >
        <FiCheckCircle
          style={{ verticalAlign: "middle" }}
          size={16}
          className="mr-2 sm:mr-3"
        />
        {uploading ? "Uploading File" : "Upload File"}{" "}
        {selectedFiles
          ? (selectedFiles.size / (1024 * 1024)).toFixed(2)
          : "0.00"}{" "}
        MB
      </button>
      {link && (
        <div className="mt-4 sm:mt-6 flex items-center justify-between py-3 px-4 sm:px-6 md:px-8 bg-slate-400 rounded-lg w-full max-w-xs sm:max-w-md md:max-w-lg">
          <PiLinkSimpleHorizontalDuotone
            size={18}
            className="mr-2 sm:mr-3"
            style={{ verticalAlign: "middle" }}
          />
          <p className="font-semibold text-sm sm:text-base underline cursor-pointer truncate">
            File Link: {link}
          </p>
          <button onClick={copyLink}>
            <FiCopy
              size={18}
              style={{ verticalAlign: "middle" }}
              className="ml-3 sm:ml-5 cursor-pointer"
            />
          </button>
        </div>
      )}
      {selectedFiles && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
            type: "spring",
            stiffness: 120,
            damping: 20,
          }}
          className="mt-4 sm:mt-6 min-h-[8rem] sm:min-h-[9rem] flex flex-col items-center justify-start px-4 sm:px-6 pt-4 sm:pt-6 pb-6 bg-[#1e293b] rounded-lg w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-3xl"
        >
          <h1 className="text-white font-nunito font-semibold text-lg sm:text-xl self-start">
            Selected File
          </h1>
          <div className="bg-[#0f172a] flex justify-between items-center px-4 sm:px-6 py-4 sm:py-5 rounded-lg mt-3 sm:mt-4 w-full">
            <div className="flex items-center gap-3 sm:gap-5">
              <IoMdImages size={20} className="text-blue-400" />
              <div className="flex flex-col">
                <p className="text-white text-base sm:text-lg font-medium truncate">
                  {selectedFiles.name}
                </p>
                <p className="text-slate-400 text-sm sm:text-[15px]">
                  {(selectedFiles.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button onClick={() => setSelectedFile(null)}>
              <FiX className="text-slate-400 hover:text-white" size={18} />
            </button>
          </div>
        </motion.div>
      )}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed top-4 sm:top-8 right-4 sm:right-8 z-50 bg-blue-600 bg-opacity-95 border border-blue-400 rounded-xl shadow-lg p-3 sm:p-5 flex items-center justify-center max-w-[90%] sm:max-w-md"
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
            <p className="text-white font-nunito font-semibold text-sm sm:text-base">
              🚫 File exceeds the maximum size limit (100MB).
            </p>
          </motion.div>
        )}
        {status === "Successful" && (
          <motion.div
            className="fixed top-4 sm:top-8 right-4 sm:right-8 z-50 bg-blue-600 bg-opacity-95 border border-blue-400 rounded-xl shadow-lg p-3 sm:p-5 flex items-center justify-center max-w-[90%] sm:max-w-md"
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
            <p className="text-white font-semibold font-nunito text-sm sm:text-base">
              ✅ File Uploaded Successfully
            </p>
          </motion.div>
        )}
        {status === "Failed" && (
          <motion.div
            className="fixed top-4 sm:top-8 right-4 sm:right-8 z-50 bg-blue-600 bg-opacity-95 border border-blue-400 rounded-xl shadow-lg p-3 sm:p-5 flex items-center justify-center max-w-[90%] sm:max-w-md"
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
            <p className="text-white font-semibold font-nunito text-center text-sm sm:text-base">
              {errorMessage}
            </p>
          </motion.div>
        )}
        {copied && (
          <motion.div
            className="fixed top-4 sm:top-8 right-4 sm:right-8 z-50 bg-blue-600 bg-opacity-95 border border-blue-400 rounded-xl shadow-lg p-3 sm:p-5 flex items-center justify-center max-w-[90%] sm:max-w-md"
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
            <p className="text-white font-semibold font-nunito text-sm sm:text-base">
              ✅ Link Copied to Clipboard
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploader;
