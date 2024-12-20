import React, { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseOutline } from "react-icons/io5";
import { FiHeart } from "react-icons/fi";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";
import { NavTabs } from "./navTabs";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { BiUser } from "react-icons/bi";
import { toast } from "react-toastify";
import logoDark from "../../logoDark.png";
import { motion, AnimatePresence } from "framer-motion";

export const Header = ({ setIsWishlistActive, setIsCartSectionActive, isLargeScreen }) => {
  const [displayVerticalNavBar, setDisplayVerticalNavBar] = useState(false);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [totalProductQuantityCart, setTotalProductQuantityCart] = useState(0);

  const { allProductsData, isLoading, loadingOrErrorMessage } = useSelector((state) => state.productsData);
  const { isLoggedIn } = useSelector((state) => state.userAuth);
  const { wishlist, cart } = useSelector((state) => state.wishlistAndCartSection);

  const navigate = useNavigate();
  const navigateToSearchPage = useNavigate();
  const location = useLocation();

  const handleSearching = (e) => {
    if (isLoading && loadingOrErrorMessage === "Loading") {
      toast("Hold on, while product is loading", {
        type: "warning",
        autoClose: 3000,
      });
    }
    if (isLoading && loadingOrErrorMessage !== "Loading") {
      toast("Products couldn’t be loaded", {
        type: "error",
        autoClose: 3000,
      });
    } else if (allProductsData.length > 0) {
      navigateToSearchPage(
        {
          pathname: "/search",
          search: `?searchedProduct=${e.currentTarget.previousElementSibling.value}`,
        },
        {
          state: location.pathname,
        }
      );
    }
  };

  useEffect(() => {
    setIsSearchClicked(false);
    setDisplayVerticalNavBar(false);
  }, [location.pathname]);

  useEffect(() => {
    isLargeScreen && setDisplayVerticalNavBar(false);
  }, [isLargeScreen]);

  useEffect(() => {
    let total = 0;
    for (let key of cart) {
      total += key.quantity;
    }
    setTotalProductQuantityCart(total);
  }, [cart]);

  const handleMyAccountClick = () => {
    navigate("/profilePage/accountInformation");
  };

  return (
    <header className="h-[70px] sticky top-0 z-[1000] bg-[#ffffff]">
      <nav className="w-[100%] h-[100%] font-Roboto px-[3%] flex items-center justify-between shadow-[0px_0px_3px_0px_rgba(14,19,24,0.5)]">
        {/* Logo */}
        <img
          src={logoDark}
          alt=""
          className="w-[20%] cursor-pointer h-auto max-w-[100px]"
          onClick={() => navigate("/")}
        />

        {/* Navigation Tabs and Icons */}
        <div className="flex items-center gap-3 md:gap-4">
          {isLargeScreen && <NavTabs {...{ handleMyAccountClick }} />}
          <div className="flex items-center gap-3">
            <div
              className="relative p-2 bg-neutralColor rounded-[10px] cursor-pointer"
              onClick={() => setIsSearchClicked(!isSearchClicked)}
            >
              <BiSearch className="w-4 h-4 stroke-secondaryColor" />
            </div>

            {/* {isLargeScreen && (
              <div
                className="relative p-2 bg-neutralColor rounded-[10px] cursor-pointer"
                onClick={handleMyAccountClick}
              >
                <BiUser className="w-4 h-4 stroke-secondaryColor" />
              </div>
            )} */}

            <div
              className="relative p-2 bg-neutralColor rounded-[10px] cursor-pointer"
              onClick={() => setIsWishlistActive(true)}
            >
              <FiHeart className="w-4 h-4 stroke-secondaryColor" />
              <span className="absolute text-[10px] top-[-2px] right-[-6px] bg-primaryColor text-white px-1 rounded-[50%]">
                {wishlist.length}
              </span>
            </div>

            <div
              className="relative p-2 bg-neutralColor rounded-[10px] cursor-pointer"
              onClick={() => setIsCartSectionActive(true)}
            >
              <AiOutlineShoppingCart className="w-4 h-4" />
              <span className="absolute text-[10px] top-[-2px] right-[-6px] bg-primaryColor text-white px-1 rounded-[50%]">
                {totalProductQuantityCart}
              </span>
            </div>

            <button
              className="p-2 bg-neutralColor md:hidden rounded-[10px]"
              onClick={() => setDisplayVerticalNavBar(!displayVerticalNavBar)}
            >
              {displayVerticalNavBar ? (
                <IoCloseOutline className="w-4 h-4" />
              ) : (
                <GiHamburgerMenu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Search Bar */}
      <AnimatePresence>
        {isSearchClicked && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 40 }}
            exit={{ height: 0, transition: { duration: 0.3, ease: "easeOut" } }}
            className="absolute top-[100%] left-[3%] w-[94%] bg-neutralColor flex justify-between items-center h-[40px] shadow-[0_3px_5px_-2px_rgba(0,0,0,0.2)]"
          >
            <input
              type="search"
              placeholder="search ..."
              className="w-[85%] h-[100%] pl-4 bg-neutralColor border-none outline-none text-[14px]"
            />
            <button
              className="w-[15%] h-[100%] bg-primaryColor flex items-center justify-center rounded-[10px]"
              onClick={(e) => handleSearching(e)}
            >
              <BiSearch className="w-5 h-5" fill="white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vertical Navigation */}
      <AnimatePresence>
        {displayVerticalNavBar && <NavTabs {...{ handleMyAccountClick }} />}
      </AnimatePresence>
    </header>
  );
};
