import { React, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";

export const AddNewProduct = ({ isAddNewProductClicked, setIsAddNewProductClicked }) => {
  const [imgUrl, setImgUrl] = useState("");
  const [productTitle, setProductTitle] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productStock, setProductStock] = useState(0);
  const [productDiscountPercentValue, setProductDiscountPercent] = useState(0);
  const [productType, setProductType] = useState("");
  const [categories, setCategories] = useState({
    "Featured Categories": [],
    location: [],
    features: [],
    others: [],
  });

  const imgRef = useRef(null);
 
const createProduct = async (e) => {
  e.preventDefault();

  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

  if (!imgUrl) {
    toast.error("Product image is required!");
    return;
  }

  const formData = {
    title: productTitle,
    price: productPrice,
    stock: productStock,
    discountPercent: productDiscountPercentValue,
    image: imgUrl,  
    productType,
  };

  const asyncCreateProductToastId = toast.loading("Product data upload in progress");

  try {
    const LoginToken = JSON.parse(localStorage.getItem("UserData")).loginToken || " ";
    const data = await axios.post(`${serverUrl}/api/v1/products`, formData, {
      headers: {
        authorization: `Bearer ${LoginToken}`,
        "Content-Type": "application/json",
      },
    });

    // Resetting form data to default after submit
    imgRef.current.value = null;
    setProductTitle("");
    setProductPrice("");
    setProductStock(0);
    setProductDiscountPercent(0);
    setImgUrl("");
    setProductType("");

    toast.update(asyncCreateProductToastId, {
      render: "Product data has been successfully uploaded",
      type: "success",
      isLoading: false,
      autoClose: 3000,
    });
  } catch (error) {
    let errMessage = error.response?.data?.message || error.message;
    toast.update(asyncCreateProductToastId, {
      render: `${errMessage}: Product data upload failed`,
      type: "error",
      isLoading: false,
      autoClose: 5000,
    });
  }
};


  const handleImageUpload = async (e) => {
    const imageFile = e.currentTarget.files[0];
    const formData = new FormData();
    formData.append("image", imageFile);

    imgRef.current.nextElementSibling.style.display = "block";
    imgRef.current.nextElementSibling.textContent = "Uploading image ...";
    const asyncImgUploadToastId = toast.loading("Please wait, product image is being uploaded");

    try {
      const LoginToken = JSON.parse(localStorage.getItem("UserData")).loginToken || " ";
      const { data } = await axios.post("http://localhost:5000/api/v1/products/upload", formData, {
        headers: {
          authorization: `Bearer ${LoginToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      const { image } = data;
      setImgUrl(image.src);
      toast.update(asyncImgUploadToastId, {
        render: "Product image has been successfully uploaded",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      imgRef.current.nextElementSibling.textContent = "Uploaded";
    } catch (error) {
      setImgUrl("");
      let errMessage = error.response?.data?.message || error.message;
      toast.update(asyncImgUploadToastId, {
        render: `${errMessage}: Product image upload failed`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      imgRef.current.nextElementSibling.textContent = "Image upload failed";
    }
  };

  return (
    <div
      className={`fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 flex items-center justify-center overflow-y-auto h-[100vh] z-[3000] translate-y-[100%] ${isAddNewProductClicked && "translate-y-0"}`}
    >
      <div className="fixed inset-0 transition-opacity">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <div className="bg-white rounded-lg px-4 pt-5 pb-4 overflow-y-auto w-[99%] h-[98%] shadow-xl transform transition-all sm:max-w-lg sm:w-full">
        <h2 className="text-xl sm:text-2xl font-bold text-center">Create a New Product</h2>
        <AiOutlineClose
          className="w-9 h-9 fill-primaryColor absolute right-5 cursor-pointer top-5"
          onClick={() => setIsAddNewProductClicked(false)}
        />
        <form action="" className="pt-8" onSubmit={createProduct}>
          <div className="mb-6">
            <label className="block font-medium mb-2">Title</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={productTitle}
              onChange={(e) => setProductTitle(e.currentTarget.value)}
            />
          </div>

          {/* Price, Stock, Discount */}
          <div className="mb-6 flex gap-[2%] items-end justify-between">
            <div className="w-1/3">
              <label htmlFor="price" className="font-bold">Price</label>
              <input
                type="text"
                id="price"
                value={productPrice}
                onChange={(e) => setProductPrice(e.currentTarget.value)}
                className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="w-1/3">
              <label htmlFor="stock" className="font-bold">Stock</label>
              <input
                type="number"
                id="stock"
                value={productStock}
                onChange={(e) => setProductStock(e.currentTarget.value)}
                className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="w-1/3">
              <label htmlFor="discount" className="font-bold">Discount (%)</label>
              <input
                type="number"
                id="discount"
                value={productDiscountPercentValue}
                onChange={(e) => setProductDiscountPercent(e.currentTarget.value)}
                className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block font-medium mb-2">Image</label>
            <input
              type="file"
              ref={imgRef}
              onChange={handleImageUpload}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <span ref={imgRef.nextElementSibling} className="text-sm text-gray-500"></span>
          </div>

          {/* Product Type */}
          <div className="mb-6">
            <label className="block font-medium mb-2">Product Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="productType"
                  value="Bed"
                  checked={productType === "Bed"}
                  onChange={(e) => setProductType(e.currentTarget.value)}
                />
                Bed
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="productType"
                  value="Mattress"
                  checked={productType === "Mattress"}
                  onChange={(e) => setProductType(e.currentTarget.value)}
                />
                Mattress
              </label>
            </div>
          </div>

          <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded-lg">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};
