
import "./App.css";

import FileUploader from "./client/Pages/FileUploader";
import Cards from "./client/Pages/Cards";
import RecentUploads from "./client/Components/RecentUploads";
import  { useState } from "react";




const App = () => {
  const [refreshKey , setRefreshKey] = useState<number>(0)
  const [hasUploaded , setHasUploaded] = useState<boolean>(false)
  return (
       <div className="flex flex-col items-center min-h-screen px-4 bg-[#0f172a]">
      <FileUploader setHasUploaded={setHasUploaded} setRefreshKey={setRefreshKey} />
      <Cards/>
      <RecentUploads refreshKey={refreshKey} />
    </div>

  );
}

export default App;
