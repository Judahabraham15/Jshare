
import "./App.css";

import FileUploader from "./client/Pages/FileUploader";
import Cards from "./client/Pages/Cards";
import RecentUploads from "./client/Components/RecentUploads";




function App() {
  
  return (
    <>
      
      <FileUploader />
      <Cards />
      <RecentUploads/>
     
    </>
  );
}

export default App;
