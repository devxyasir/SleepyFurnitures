import React from "react";
import { BsArrowRight } from "react-icons/bs";
import bedsCategoryImg from "../../../assets/bedsCategoryImg.jpg";
import mattressesCategoryImg from "../../../assets/mattressesCategory.jpg";
import { useNavigate } from "react-router-dom";

export const FeaturedCategories = () => {
  const navigateShop = useNavigate();

  const categoriesArr = [
    { title: "Shop Beds", src: bedsCategoryImg },
    { title: "Shop Mattresses", src: mattressesCategoryImg },
  ];

  return (
    <section className="my-20">
      <h2 className="text-[36px] text-left mb-10 font-bold ml-8">Explore Our Categories</h2>
      <div className="flex flex-col md:flex-row items-center justify-start gap-8 md:w-[92%] mx-auto md:ml-8">
        {categoriesArr.map((category, index) => (
          <article
            key={index}
            className="relative w-[250px] h-[250px] rounded-lg overflow-hidden shadow-md group"
          >
            <div
              style={{
                backgroundImage: `url(${category.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="w-full h-full transition-transform duration-300 group-hover:scale-110"
            ></div>
            <button
              onClick={() => navigateShop("/shop")}
              className="absolute bottom-0 left-0 w-full bg-purple-600 text-white text-center py-3 flex items-center justify-center gap-2 font-semibold"
            >
              {category.title} <BsArrowRight />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
};
