
import "./App.css";

import FileUploader from "./client/Pages/FileUploader";
import Cards from "./client/Pages/Cards";
import RecentUploads from "./client/Components/RecentUploads";
import  { useState } from "react";




const App = () => {
  const [refreshKey , setRefreshKey] = useState<number>(0)
  const [hasUploaded , setHasUploaded] = useState<boolean>(false)
  return (
    <div>
        <FileUploader setHasUploaded={setHasUploaded} setRefreshKey={setRefreshKey} />
      <Cards />
       {hasUploaded && <RecentUploads refreshKey={refreshKey} />}
     
    </div>
  );
}

export default App;
