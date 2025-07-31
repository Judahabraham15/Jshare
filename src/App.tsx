import "./App.css";
import Navbar from "./client/Components/Navbar";
import Cards from "./client/Pages/Cards";
import FileUploader from "./client/Pages/FileUploader";


function App() {
  return (
    <>
   <Navbar/>
   <FileUploader/>
   <Cards/>
    </>
  );
}

export default App;
