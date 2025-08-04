
import "./App.css";
import Footer from "./client/Components/Footer";
import Navbar from "./client/Components/Navbar";
import FileUploader from "./client/Pages/FileUploader";
import Cards from "./client/Pages/Cards";




function App() {
  
  return (
    <>
      <Navbar />
      <FileUploader />
      <Cards />
    
      <Footer /> 
    </>
  );
}

export default App;
