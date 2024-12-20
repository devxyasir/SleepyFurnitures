import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { primaryBtnVariant } from "../../utils/animation";

export const NavTabs = ({ handleMyAccountClick }) => {
  return (
    <motion.ul
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      exit={{ y: -20, zIndex: -1, transition: { duration: 0.1, ease: "easeOut" } }}
      transition={{ type: "spring", stiffness: 100, dampness: 20 }}
      className="flex flex-col z-50 border-t-[1px] border-LightSecondaryColor absolute top-[100%] bg-white left-0 right-0 pt-[8px] pb-8 text-[16px] font-ui-sans-serif font-sans font-system-ui md:static md:bg-transparent md:border-none md:px-2 md:flex-row md:p-0 md:gap-3 lg:gap-4 "
    >
      <li className="md:hover:bg-transparent hover:bg-neutralColor py-[6px] md:py-0">
        <Link to="/" className="px-[3%] w-[100%] h-[100%] inline-block md:px-0">
          Home
        </Link>
      </li>
      <li className="md:hover:bg-transparent hover:bg-neutralColor py-[6px] md:py-0">
        <Link to="/shop" className="px-[3%] w-[100%] h-[100%] inline-block md:px-0">
          Shop
        </Link>
      </li>
      <li className="py-[6px] md:hover:bg-transparent hover:bg-neutralColor md:py-0">
        <Link to="/aboutUs" className="px-[3%] w-[100%] h-[100%] inline-block md:px-0">
          About Us
        </Link>
      </li>
      <li className="py-[6px] md:hover:bg-transparent hover:bg-neutralColor md:py-0">
        <Link to="/contactUs" className="px-[3%] w-[100%] h-[100%] inline-block md:px-0">
          Contact
        </Link>
      </li>

      <motion.button
        initial="initial"
        whileTap="click"
        variants={primaryBtnVariant}
        onClick={handleMyAccountClick}
        className="w-[120px] h-[36px] mt-[8px] mx-[3%] md:mx-0 block md:hidden rounded-sm text-[#ffffff] bg-primaryColor"
      >
        My Account
      </motion.button>
    </motion.ul>
  );
};
