import { useEffect, useState } from "react";
import { RiFolderVideoLine } from "react-icons/ri";
import { FaFileWord, FaRegFilePdf } from "react-icons/fa6";
import { IoImageOutline } from "react-icons/io5";
import { CiFileOn } from "react-icons/ci";
import Axios from "axios";
import { FaCheckCircle, FaFileAlt } from "react-icons/fa";
import { BsTrash3 } from "react-icons/bs";
import { FiCopy } from "react-icons/fi";
import { FiExternalLink } from "react-icons/fi";
import { toast } from "react-toastify";

interface FileMedtaData {
  originalname: string;
  link: string;
  type: string;
}

interface RecentUploadProps {
  refreshKey: number;
}

const RecentUploads = ({ refreshKey }: RecentUploadProps) => {
  const [recentUploads, setrecentUploads] = useState<FileMedtaData[]>([]);

  useEffect(() => {
    const FetchUploads = async () => {
      try {
        const response = await Axios.get(
          "http://localhost:3001/recent-Uploads"
        );
        setrecentUploads(response.data);
      } catch (error) {
        //! toast.error("❌ Failed to Fetch Recent Uploads", {
        //!   position: "top-right",
        //!   autoClose: 3000,
        //!   icon: false,
        //!   className:
        //!     " text-white font-nunito text-md sm:text-base md:text-lg max-w-[90%] sm:max-w-[400px] mx-2 sm:mx-4",
        //! });
      }
    };

    FetchUploads();
  }, [refreshKey]);

  const FileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <IoImageOutline size={20} className="text-blue-400" />;
      case "pdf":
        return <FaRegFilePdf size={20} className="text-blue-400" />;
      case "mp4":
        return <RiFolderVideoLine size={20} className="text-blue-400" />;
      case "doc":
        return <FaFileWord size={20} className="text-blue-400" />;
      case "docx":
        return <FaFileWord size={20} className="text-blue-400" />;
      case "txt":
        return <FaFileAlt size={20} className="text-blue-400" />;
      default:
        return <CiFileOn size={20} className="text-blue-400" />;
    }
  };
  const copyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success(" Link Copied to Clipboard", {
        position: "top-right",
        autoClose: 3000,
        icon: (
          <FaCheckCircle
            size={20}
            className="text-green-500"
            style={{ verticalAlign: "middle" }}
          />
        ),
        className:
          " text-white font-nunito text-md  sm:text-base md:text-lg max-w-[90%] sm:max-w-[400px] mx-2 sm:mx-4",
        // progressStyle: { background: "rgba(59, 130, 246, 0.4)" },
      });
    } catch (error) {
      toast.error(" Failed to copy link.", {
        autoClose: 3000,
        position: "top-right",
        className:
          " text-white font-nunito text-md  sm:text-base md:text-lg max-w-[90%] sm:max-w-[400px] mx-2 sm:mx-4",
      });
    }
  };
  const deleteFile = async (filename: string, idx: number) => {
    try {
      await Axios.delete(`http://localhost:3001/files/${filename}`);
      setrecentUploads((prev) => prev.filter((_, index) => index !== idx));
      toast.success("🗑️ File deleted successfully", {
        icon: false,
        position: "top-right",
        autoClose: 3000,
        className:
          " text-white font-nunito text-md sm:text-base md:text-lg max-w-[90%] sm:max-w-[400px] mx-2 sm:mx-4",
      });
    } catch (error) {
      toast.error("❌ Failed to delete file.", {
        icon: false,
        position: "top-right",
        autoClose: 3000,
        className:
          "text-white font-nunito text-md sm:text-base md:text-lg max-w-[90%] sm:max-w-[400px] mx-2 sm:mx-4",
      });
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center   px-4 sm:px-6 mt-10">
      <h1 className=" text-white font-nunito font-bold text-2xl sm:text-3xl mb-8 ">
        Recent <span className="text-blue-500">Uploads</span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 md:gap-8 w-full max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-7xl">
        {recentUploads.map(({ originalname, link, type }, idx) => (
          <div
            className="bg-[#181c2f] border rounded-xl shadow-lg px-5 p-4 sm:p-6 md:p-8 flex flex-col items-start transition-transform hover:scale-105 hover:shadow-xl"
            style={{ borderColor: "rgba(59, 130, 246, 0.40)" }}
            key={idx}
          >
            <span
              className="mb-2 sm:mb-3 border border-blue-500 p-2.5 sm:p-3 rounded-full flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-13 md:h-13"
              style={{ background: "rgba(59, 130, 246, 0.15)" }}
            >
              {FileIcon(type)}
            </span>
            <p className="text-white font-nunito font-bold text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2">
              {originalname.charAt(0).toUpperCase() + originalname.slice(1)}
            </p>

            <p className="text-slate-400 font-nunito  text-sm sm:text-base md:text-lg text-left truncate max-w-full">
              {link}
            </p>
            <div className="flex flex-row gap-3 mt-3">
              <a href={`/download/${link.split("/files/")[1]}`}>
                <button
                  className=" cursor-pointer mb-2 sm:mb-3 b p-2.5 sm:p-3 rounded-full flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-13 md:h-13"
                  style={{ background: "rgba(59, 130, 247, 0.15)" }}
                  // onClick={externalLink}
                >
                  <FiExternalLink size={20} className="text-blue-400" />
                </button>
              </a>

              <button
                className=" cursor-pointer mb-2 sm:mb-3 b p-2.5 sm:p-3 rounded-full flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-13 md:h-13"
                style={{ background: "rgba(59, 130, 247, 0.15)" }}
                onClick={() => copyLink(link)}
              >
                <FiCopy size={20} className="text-blue-400" />
              </button>
              <button
                onClick={() => deleteFile(originalname, idx)}
                className=" cursor-pointer mb-2 sm:mb-3 bg-white p-2.5 sm:p-3 rounded-full flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-13 md:h-13"
              >
                <BsTrash3 className="text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentUploads;
