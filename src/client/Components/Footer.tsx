import { BsBriefcase } from "react-icons/bs";
import { motion } from "framer-motion";
const Footer = () => {
  return (
    <footer className="w-full  mt-16 py-6 border-t border-gray-600">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-400 text-base font-nunito ">
          © {new Date().getFullYear()} Jshare - By Judah Abraham.
        </p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a
            href="https://portfolios-nu-two.vercel.app/"
            className="text-gray-400 hover:text-white transition"
          >
            <motion.span
             whileHover={{ rotate: 10, scale: 1.2 }}
            transition={{ type: 'spring', stiffness: 200 }}
            style={{ display: "inline-block", verticalAlign: "middle" , marginRight: '2px' }}>
              <BsBriefcase  />
            </motion.span>{" "}
            PortFolio
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
