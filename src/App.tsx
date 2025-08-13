
import "./App.css";

import FileUploader from "./client/Pages/FileUploader";
import Cards from "./client/Pages/Cards";
import RecentUploads from "./client/Components/RecentUploads";
import  { useState } from "react";
import { ToastContainer } from "react-toastify";



const App = () => {
  const [refreshKey , setRefreshKey] = useState<number>(0)
  const [hasUploaded , setHasUploaded] = useState<boolean>(false)
  return (
       <div className="flex flex-col items-center min-h-screen px-4 bg-[#0f172a]">
      <FileUploader setHasUploaded={setHasUploaded} setRefreshKey={setRefreshKey} />
      <Cards/>
      <RecentUploads refreshKey={refreshKey} />
         <ToastContainer
        position="top-right"
        // autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick = {false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          backgroundColor: "#2563eb",
          border: "2px  solid #60a5fa",
          borderRadius: "10px",
          fontFamily: 'Nunito' ,
          fontWeight: 'bold'
        }}
        closeButton={false}
        
        
      />
    </div>

  );
}

export default App;
