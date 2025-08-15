import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import Layout from "./client/Layout/Layout";
import FileUploader from "./client/Pages/FileUploader";
import DownloadPage from "./client/Pages/DownloadPage";
import Cards from "./client/Pages/Cards";
import RecentUploads from "./client/Components/RecentUploads";

const App = () => {
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [hasUploaded, setHasUploaded] = useState<boolean>(false);

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <div className="flex flex-col items-center min-h-screen px-4 bg-[#0f172a]">
                <FileUploader
                  setHasUploaded={setHasUploaded}
                  setRefreshKey={setRefreshKey}
                />
                <Cards />
                {hasUploaded && <RecentUploads refreshKey={refreshKey} />}
              </div>
            }
          />

          <Route path="download/:fileId" element={<DownloadPage />} />
        </Route>
      </Routes>

      <ToastContainer
        position="top-right"
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          backgroundColor: "#2563eb",
          border: "2px solid #60a5fa",
          borderRadius: "10px",
          fontFamily: "Nunito",
          fontWeight: "bold",
        }}
        closeButton={false}
      />
    </>
  );
};

export default App;
