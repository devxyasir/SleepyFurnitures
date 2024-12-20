import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import FooterSection from "../components/footerSection";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { handleCartModification } from "../utils/handleCartModification";
import { handleWishlistModification } from "../utils/handleWishlistModification";
import { isProductInCartFn, isProductInWishlistFn } from "../utils/isSpecificProductInCartAndWishlist.js";
import { ProductLoader } from "../components/loaders/productLoader";
import { motion } from "framer-motion";
import { primaryBtnVariant } from "../utils/animation";

export const ProductDetailsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { allProductsData, isLoading } = useSelector((state) => state.productsData);
  const { wishlist, cart } = useSelector((state) => state.wishlistAndCartSection);

  const [productQuantityInCart, setProductQuantityInCart] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isProductInCart, setIsProductInCart] = useState(false);
  const [shippingOption, setShippingOption] = useState("free");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedStorage, setSelectedStorage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedMattress, setSelectedMattress] = useState("");

  const { productId } = useParams();
  const currentProduct = allProductsData.find((product) => product._id === productId);
  const { _id, title, price, image, discountPercent, categories, stock, type, description } = currentProduct || {
    _id: "",
    title: "",
    price: "",
    image: "",
    discountPercent: "",
    stock: "",
    type: "",
  };

  let subCategoriesArr = [];
  for (let key in categories) {
    if (categories[key].length > 0) subCategoriesArr.push(...categories[key]);
  }

  const handleAddAndRemoveItemInCartFn = () => {
    if (productQuantityInCart < 1) {
      alert("Product can't be less than 1");
    } else if (!isProductInCart) {
      handleCartModification(_id, dispatch, productQuantityInCart, isProductInCart);
      setProductQuantityInCart(1);
    } else {
      handleCartModification(_id, dispatch, null, isProductInCart);
    }
  };

  useEffect(() => {
    isProductInWishlistFn(_id, setIsWishlisted, wishlist);
  }, [wishlist, _id]);

  useEffect(() => {
    isProductInCartFn(_id, setIsProductInCart, cart);
  }, [cart, _id]);

  const buyNowFn = () => {
    if (productQuantityInCart < 1) {
      alert("Product can't be less than 1");
    } else if (isProductInCart) {
      handleCartModification(_id, dispatch, productQuantityInCart, isProductInCart);
      navigate("/checkout");
    } else {
      handleCartModification(_id, dispatch, productQuantityInCart, isProductInCart);
      navigate("/checkout");
    }
  };

  let discountedPrice = price - (price * discountPercent) / 100;
  if (isLoading) {
    return <ProductLoader />;
  }

  return (
    <motion.div
      initial={{ scale: 0 }}
      exit={{ scale: 0, rotate: 360, transition: { ease: "easeIn", duration: 0.5 } }}
      animate={{ scale: 1, rotate: 360, transition: { duration: 0.5, ease: "easeOut" } }}
      className="w-[100%] bg-gray-50"
    >
      <div className="mt-12 w-[100%] h-[54px] bg-neutralColor text-secondaryColor xl:px-[4%] px-[4%] lg:px-[2%] flex items-center justify-between font-bold tablet:px-[6%] font-RobotoCondensed lg:col-span-full lg:row-span-1">
        <div className="flex gap-[4px] items-center text-base">
          <IoIosArrowBack />
          <li onClick={() => navigate("/")} className="hover:underline capitalize">
            Home
          </li>
          <IoIosArrowBack />
          <li onClick={() => navigate("/shop")} className="hover:underline capitalize">
            Shop
          </li>
          <IoIosArrowBack />
          <span className="capitalize">{title}</span>
        </div>
      </div>

      <section className="my-20 mb-32 w-[92%] mx-auto gap-6 flex flex-col lg:flex-row lg:gap-2 md:justify-between tablet:w-[88%] lg:w-[96%]">
        <div className="w-[100%] lg:mx-0 lg:basis-[50%] lg:h-max min-h-[320px] tablet:min-h-[450px] md:min-h-[500px] h-auto mx-auto bg-neutralColor relative flex justify-center items-center">
          <img src={image} alt="" className="w-auto max-w-[99%] h-auto object-cover rounded-lg shadow-xl" />
          <div
            className={`absolute p-3 bg-[#ffffff] shadow-[0px_2px_8px_0px_#00000085] ease-in transition-colors cursor-pointer duration-300 rounded-[50%] top-[5%] right-[5%] z-[100] ${
              isWishlisted && "bg-primaryColor"
            }`}
          >
            <FiHeart
              className={`w-6 h-6 ${
                isWishlisted && "fill-primaryColor duration-200 ease-linear transition-colors stroke-white"
              }`}
              onClick={() => handleWishlistModification(_id, dispatch)}
            />
          </div>
        </div>

        <div className="lg:basis-[40%] mt-16 lg:mt-0 flex flex-col gap-6">
          <h2 className="text-[28px] font-bold tracking-[0.5px] capitalize text-gray-800">{title}</h2>

          {discountPercent > 0 ? (
            <div className="flex gap-2">
              <h3 className="font-bold text-[24px] md:text-[28px] tracking-[1px] text-primaryColor">
                ${discountedPrice.toFixed(2)} USD
              </h3>
              <h3 className="line-through tracking-[1px] text-[20px] md:text-[24px] text-gray-500"> ${price.toFixed(2)} USD</h3>
            </div>
          ) : (
            <h3 className="font-bold text-[24px] md:text-[28px] tracking-[1px]">${price.toFixed(2)} USD</h3>
          )}

          <div className="flex gap-1 items-end">
            <h3 className="font-bold tracking-[0.5px] text-[20px]">Availability :</h3>
            <span className="text-primaryColor tracking-[0.7px] text-[18px] ">
              {stock < 0 ? "Out of stock" : <strong>{stock}</strong>}
              {stock >= 0 && " left in stock"}
            </span>
          </div>

          {/* Conditional rendering based on product type */}
          {type === "mattress" ? (
            <div>
              <h3 className="font-bold text-[20px] tracking-[0.5px]">Size :</h3>
              <select
                className="w-[100%] border-[1px] border-secondaryColor rounded-sm px-4 py-3 text-lg focus:ring-2 focus:ring-primaryColor transition duration-300"
                onChange={(e) => setSelectedSize(e.target.value)}
                value={selectedSize}
              >
                <option value="single">Single</option>
                <option value="queen">Queen</option>
                <option value="king">King</option>
              </select>
            </div>
          ) : (
            <div>
              <h3 className="font-bold text-[20px] tracking-[0.5px]">Size :</h3>
              <select
                className="w-[100%] border-[1px] border-secondaryColor rounded-sm px-4 py-3 text-lg focus:ring-2 focus:ring-primaryColor transition duration-300"
                onChange={(e) => setSelectedSize(e.target.value)}
                value={selectedSize}
              >
                <option value="single">Single</option>
                <option value="queen">Queen</option>
                <option value="king">King</option>
              </select>

              <h3 className="font-bold text-[20px] tracking-[0.5px] mt-4">Storage :</h3>
              <select
                className="w-[100%] border-[1px] border-secondaryColor rounded-sm px-4 py-3 text-lg focus:ring-2 focus:ring-primaryColor transition duration-300"
                onChange={(e) => setSelectedStorage(e.target.value)}
                value={selectedStorage}
              >
                <option value="noStorage">No Storage</option>
                <option value="withStorage">With Storage</option>
              </select>

              <h3 className="font-bold text-[20px] tracking-[0.5px] mt-4">Color :</h3>
              <select
                className="w-[100%] border-[1px] border-secondaryColor rounded-sm px-4 py-3 text-lg focus:ring-2 focus:ring-primaryColor transition duration-300"
                onChange={(e) => setSelectedColor(e.target.value)}
                value={selectedColor}
              >
                <option value="white">White</option>
                <option value="black">Black</option>
                <option value="brown">Brown</option>
              </select>

              <h3 className="font-bold text-[20px] tracking-[0.5px] mt-4">Mattress :</h3>
              <select
                className="w-[100%] border-[1px] border-secondaryColor rounded-sm px-4 py-3 text-lg focus:ring-2 focus:ring-primaryColor transition duration-300"
                onChange={(e) => setSelectedMattress(e.target.value)}
                value={selectedMattress}
              >
                <option value="memoryFoam">Memory Foam</option>
                <option value="spring">Spring</option>
              </select>
            </div>
          )}

          {/* Shipping and Additional Features */}
          <div className="flex flex-col gap-4 mt-6">
            <h3 className="font-bold text-[20px] tracking-[0.5px]">Shipping Options :</h3>
            <select
              className="w-[100%] border-[1px] border-secondaryColor rounded-sm px-4 py-3 text-lg focus:ring-2 focus:ring-primaryColor transition duration-300"
              onChange={(e) => setShippingOption(e.target.value)}
              value={shippingOption}
            >
              <option value="free">Free</option>
              <option value="recommended">Recommended (Fast)</option>
            </select>

            <h3 className="font-bold text-[20px] tracking-[0.5px] mt-4">Additional Features :</h3>
            <label className="text-lg">
              <input type="checkbox" className="mr-2" /> Bed Assembling (+$50)
            </label>
          </div>

          {/* Sale Countdown */}
          <div className="mt-6">
            <h3 className="text-[20px] font-semibold">Sale ends in:</h3>
            <div className="countdown-timer text-xl font-semibold">03:24:15</div>
          </div>

          {/* Product Description */}
          <div className="mt-6">
            <h3 className="text-[20px] font-bold">Product Description:</h3>
            <p className="text-lg text-gray-700">{description}</p>
          </div>

          {/* Add to Cart and Buy Now Buttons */}
          <div className="flex gap-4 mt-8">
            <motion.button
              onClick={handleAddAndRemoveItemInCartFn}
              variants={primaryBtnVariant}
              className="px-6 py-3 bg-primaryColor text-white rounded-md transition duration-300 hover:bg-primaryColorDark"
            >
              {isProductInCart ? "Remove from Cart" : "Add to Cart"}
            </motion.button>
            <motion.button
              onClick={buyNowFn}
              variants={primaryBtnVariant}
              className="px-6 py-3 bg-primaryColor text-white rounded-md transition duration-300 hover:bg-primaryColorDark"
            >
              Buy Now
            </motion.button>

            

          </div>
        </div>
      </section>

      <FooterSection />
    </motion.div>
  );
};
