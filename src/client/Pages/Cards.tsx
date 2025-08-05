import { FiUpload, FiLink, FiShield } from "react-icons/fi";

const cardContent = [
  {
    text: "Instant File Upload",
    icon: <FiUpload className="text-blue-400 w-8 h-8 " />,
    desc: "Upload files in seconds with a simple drag & drop interface.",
  },
  {
    text: "Shareable Secure Links",
    icon: <FiLink className="text-blue-400 w-8 h-8 " />,
    desc: "Generate unique links to share your files with anyone, anywhere.",
  },
  {
    text: "Privacy & Protection",
    icon: <FiShield className="text-blue-400 w-8 h-8 " />,
    desc: "Your files are protected and only accessible via your generated link.",
  },
];

const Cards = () => {
  return (
    <div className="flex flex-col w-full items-center justify-center min-h-[40vh] font-nunito mt-[4rem] p-4">
      <h1 className=" text-white text-3xl md:text-4xl font-bold mb-8">
        Key <span className="text-blue-500">Features</span>
      </h1>
      <div className=" sm:grid grid-cols-1 sm:gap-8 md:grid grid-cols-3 gap-10 w-full max-w-7xl">
        {cardContent.map(({ text, icon, desc }, index) => (
          <div
            key={index}
            className="bg-[#181c2f] border rounded-xl shadow-lg p-8 flex flex-col items-start transition hover:scale-105 hover:shadow-xl"
            style={{ borderColor: "rgba(59, 130, 246, 0.40)" }}
          >
            <span
              className=" mb-3 border-1 border-blue-500 p-3 rounded-full flex items-center justify-center w-13 h-13"
              style={{ background: "rgba(59, 130, 246, 0.15)" }}
            >
              {icon}
            </span>
            <h2 className="text-white text-xl font-bold mb-2">{text}</h2>
            <p className="text-slate-400 text-left">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;
