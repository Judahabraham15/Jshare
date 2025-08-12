import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Axios from "axios";

interface FileMedtaData {
  originalname: string;
  size: number;
  link: string;
}

interface RecentUploadProps {
  refreshKey: number;
}
const RecentUploads = ({refreshKey}  : RecentUploadProps) => {
  const [recentuploads, setrecentUploads] = useState<FileMedtaData[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const FetchUploads = async () => {
      setError("");
      try {
        const response = await Axios.get(
          "http://localhost:3001/recent-uploads"
        );
        setrecentUploads(response.data);
      } catch (error) {
        setError("Failed to Fetch recent Uploads");
      }
    };
     useEffect(() => {
    FetchUploads();
  }, [refreshKey]);
  }, []);
 

  return (
    <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl px-4 sm:px-6 mt-8">
      <h1 className="text-white font-nunito font-semibold text-lg sm:text-xl mb-4">
        Recent Uploads
      </h1>
      <motion.div
        className="min-h-[8rem] sm:min-h-[9rem] flex flex-col items-center justify-start px-4 sm:px-6 pt-4 sm:pt-6 pb-6 bg-[#1e293b] rounded-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
          type: "spring",
          stiffness: 120,
          damping: 20,
        }}
      >
        {recentuploads.length === 0 ? (
          <p className="text-slate-400 font-nunito text-base sm:text-lg">
            No recent uploads
          </p>
        ) : (
          <AnimatePresence>
            <ul className="w-full space-y-3">
              {recentuploads.map(({ originalname, size, link }, idx) => (
                <motion.li
                  key={idx}
                  className="bg-[#0f172a] flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 rounded-lg transition duration-200 hover:bg-[#1e293b]"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <div className="flex items-center gap-3 sm:gap-5">
                    <p className="text-white font-nunito font-medium text-base sm:text-lg truncate max-w-[200px] sm:max-w-[300px]">
                      {originalname}
                    </p>
                    <p className="text-slate-400 font-nunito text-sm sm:text-[15px]">
                      {(size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <a
                    href={link}
                    className="text-blue-400 font-nunito text-sm sm:text-base underline hover:text-blue-500 transition duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </a>
                </motion.li>
              ))}
            </ul>
          </AnimatePresence>
        )}
        {error && <p>{error}</p>}
      </motion.div>
    </div>
  );
};

export default RecentUploads;
