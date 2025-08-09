import Axios, { AxiosError }  from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {motion} from 'framer-motion'
import {FiX , FiDownload } from "react-icons/fi";

import { IoMdImages } from "react-icons/io";

const DownloadPage = () => {
    interface FileInfo  {
        name: string,
        size: number
    }
    const {filename} = useParams<{filename : string}>()
    const navigate = useNavigate()
    const [fileInfo , setfileInfo] = useState<FileInfo | null>(null)
    const [error, setError] = useState<string>('')

    useEffect(()=>{
        const fetchInfo = async () => {
            try{
                const response = await Axios.get(`http://localhost:3001/file-info/${filename}`)
                setfileInfo(response.data)
            }
            catch(error: any){
                 const axiosError = error as AxiosError
                 if(axiosError.response?.status === 404){
                    setError('File not Found')
                 }
                 else{
                    setError('Failed to Fetch Details')
                 }
            }
         }
         fetchInfo()
    } , [filename])


    const handleDownload = () => { 
        window.location.href = `http://localhost:3001/files/${filename}`
     }
    if(error){
        return(
           <div className="min-h-screen px-4 flex flex-col items-center justify-center bg-gray-900 text-white">
        <p className="text-red-500 font-nunito text-lg">{error}</p>
        <button
          className="mt-4 py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-lg font-nunito"
          onClick={() => navigate('/')}
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
    <div className="min-h-screen px-4 flex flex-col items-center justify-center bg-gray-900 text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 0.3,
          ease: 'easeOut',
          type: 'spring',
          stiffness: 120,
          damping: 20,
        }}
        className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-3xl bg-[#1e293b] rounded-lg p-4 sm:p-6"
      >
        <h1 className="text-white font-nunito font-semibold text-lg sm:text-xl mb-4">
          File Details
        </h1>
        <div className="bg-[#0f172a] flex justify-between items-center px-4 sm:px-6 py-4 sm:py-5 rounded-lg w-full">
          <div className="flex items-center gap-3 sm:gap-5">
            <IoMdImages size={20} className="text-blue-400" />
            <div className="flex flex-col">
              <p className="text-white text-base sm:text-lg font-medium truncate">
                {fileInfo.name}
              </p>
              <p className="text-slate-400 text-sm sm:text-[15px]">
                Size: {(fileInfo.size / (1024 * 1024)).toFixed(2)} MB
              </p>
             
            </div>
          </div>
          <button onClick={() => navigate('/')}>
            <FiX className="text-slate-400 hover:text-white" size={18} />
          </button>
        </div>
        <button
          className="mt-4 w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg flex items-center justify-center font-nunito"
          onClick={handleDownload}
        >
          <FiDownload size={18} className="mr-2" />
          Download File
        </button>
      </motion.div>
    </div>
  );
};

export default DownloadPage