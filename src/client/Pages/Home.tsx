// import React from 'react'

const Home = () => {
  return (
    <div className="min-h-[100vh] flex flex-col items-center justify-center mt-[4rem]">
      <div
        className="flex flex-col items-center justify-center p-[20px]
       max-w-[700px] text-center font-nunito"
      >
        <h1 className="text-white text-5xl w-[800px] font-semibold leading-[3.2rem]">
          <span className="text-blue-400">Streamline your workflow </span>
          with rapid file sharing, globally accessible.
        </h1>
        <p className="text-slate-400 text-[18px] mt-[10px]">
          Upload files and generate a shareable link in mere seconds.
        </p>
      </div>
      <div
        className="flex  flex-col w-full max-w-3xl h-[18rem] px-4 py-6 mt-8
            text-white text-lg
            bg-transparent
            border-2 border-dotted border-blue-400
            rounded-lg
            cursor-pointer
            transition duration-200
            hover:border-blue-500 focus:outline-none
            items-center justify-center"
      >
        <label htmlFor="file_input">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-upload w-12 h-12 mx-auto mb-4 text-blue-500"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" x2="12" y1="3" y2="15"></line>
          </svg>
          <input type="file" id="file_input" style={{ display: "none" }} />
        </label>
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-slate-400 text-[17px] mb-1">
            Drag & Drop files or choose them from your device.
          </h1>
          <p className="text-slate-400 text-[16px]">Maximum size: 100MB</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
