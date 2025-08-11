import Axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiX, FiDownload } from "react-icons/fi";
import { IoMdImages } from "react-icons/io";

const DownloadPage = () => {
  interface FileInfo {
    name: string;
    size: number;
    type: string;
  }
  const { filename } = useParams<{ filename: string }>();
  const navigate = useNavigate();
  const [fileInfo, setfileInfo] = useState<FileInfo | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!filename) {
      setError("Invalid filename");
      return;
    }

    const fetchInfo = async () => {
      try {
        const response = await Axios.get(
          `http://localhost:3001/file-info/${encodeURIComponent(filename)}`
        );
        setfileInfo(response.data);
      } catch (error: any) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 404) {
          setError("File not Found");
        } else {
          setError("Failed to Fetch Details");
        }
      }
    };
    fetchInfo();
  }, [filename]);

  //   const handleDownload = async () => {
  //     if (!fileInfo) return;

  //     try {
  //       const response = await Axios.get(
  //         `http://localhost:3001/files/${encodeURIComponent(fileInfo.name)}`,
  //         { responseType: "blob" } // <<-- important: tell Axios we want binary data
  //       );

  //       // Create a download link from the received blob and click it
  //       const url = window.URL.createObjectURL(response.data);
  //       const a = document.createElement("a");
  //       a.href = url;
  //       a.download = fileInfo.name; // force the filename when saving
  //       document.body.appendChild(a);
  //       a.click();
  //       a.remove();
  //       window.URL.revokeObjectURL(url); // cleanup
  //     } catch (err) {
  //       console.error("Error downloading file:", err);
  //     }
  //   };

  if (error) {
    return (
      <div className="min-h-screen px-4 flex flex-col items-center justify-center bg-gray-900 text-white">
        <p className="text-red-500 font-nunito text-lg">{error}</p>
        <button
          className="mt-4 py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-lg font-nunito"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    );
  }
  if (!fileInfo) {
    return (
      <div className="min-h-screen px-4 flex flex-col items-center justify-center bg-gray-900 text-white">
        <p className="font-nunito text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-6 ">
      <div className="space-y-10 max-w-md w-full">
        <div className="w-full rounded-md border-1 border-blue-500 bg-[#0c1221d9] p-4">
          <h1 className="text-white font-nunito text-2xl font-semibold">
            Congratulations!
          </h1>
          <div className="flex flex-row mt-1">
            <p className="text-white text-sm mr-2">
              You have Successfully Uploaded Your File
            </p>
            <img
              src="https://vercel.com/api/www/avatar?s=64&u=judahabraham15"
              alt="profile"
              className="w-5 h-5 rounded-full text-white"
            />
          </div>
          <div className="flex items-center justify-center font-nunito mt-10">
            <div className=" flex items-center justify-center w-20 h-20 bg-gradient-to-b
             from-green-500 via-green-500 to-blue-600   rounded-3xl rotate-5 hover:rotate-0">
              <h1 className="text-white text-sm bg-gradient-to-r from-black to-blue-500 px-2 py-1  font-bold rounded-full">
                {fileInfo.type}
              </h1>
            </div>
          </div>
          <h1 className="text-gray-400 text-center font-bold mt-5 text-2xl w-full max-w-2xl">
            {fileInfo.name}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
