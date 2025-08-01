import "./App.css";
import Footer from "./client/Components/Footer";
import Navbar from "./client/Components/Navbar";
import Cards from "./client/Pages/Cards";
import FileUploader from "./client/Pages/FileUploader";


function App() {
  return (
    <>
   <Navbar/>
   <FileUploader/>
   <Cards/>
   <Footer/>
    </>
  );
}

export default App;
