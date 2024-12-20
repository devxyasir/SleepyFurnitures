import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faHeadset, faTags, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

export const WhyChooseUsSection = () => {
  const iconStyles = [
    {
      backgroundColor: "#E0F7FA", // Light cyan
      color: "#00ACC1", // Cyan for "Free Shipping"
    },
    {
      backgroundColor: "#FCE4EC", // Light pink
      color: "#E91E63", // Pink for "Customer Service"
    },
    {
      backgroundColor: "#E8F5E9", // Light green
      color: "#4CAF50", // Green for "Exclusive Offers"
    },
    {
      backgroundColor: "#FFF3E0", // Light orange
      color: "#FF9800", // Orange for "Secure Payment"
    },
  ];

  const sharedIconStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    fontSize: "28px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  return (
    <div className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {/* Free Shipping */}
          <div className="flex flex-col items-center">
            <div style={{ ...sharedIconStyle, ...iconStyles[0] }}>
              <FontAwesomeIcon icon={faTruck} />
            </div>
            <h4 className="text-lg font-semibold mt-4">Free Shipping</h4>
            <p className="text-gray-600 text-sm">
              Get your bed delivered at no extra cost, right to your doorstep.
            </p>
          </div>

          {/* Customer Service */}
          <div className="flex flex-col items-center">
            <div style={{ ...sharedIconStyle, ...iconStyles[1] }}>
              <FontAwesomeIcon icon={faHeadset} />
            </div>
            <h4 className="text-lg font-semibold mt-4">Customer Service</h4>
            <p className="text-gray-600 text-sm">
              We're here to ensure your complete satisfaction with every purchase.
            </p>
          </div>

          {/* Exclusive Offers */}
          <div className="flex flex-col items-center">
            <div style={{ ...sharedIconStyle, ...iconStyles[2] }}>
              <FontAwesomeIcon icon={faTags} />
            </div>
            <h4 className="text-lg font-semibold mt-4">Exclusive Offers</h4>
            <p className="text-gray-600 text-sm">
              Discover exclusive deals and discounts only for our valued customers.
            </p>
          </div>

          {/* Secure Payment */}
          <div className="flex flex-col items-center">
            <div style={{ ...sharedIconStyle, ...iconStyles[3] }}>
              <FontAwesomeIcon icon={faShieldAlt} />
            </div>
            <h4 className="text-lg font-semibold mt-4">Secure Payment</h4>
            <p className="text-gray-600 text-sm">
              Shop with confidence knowing your payment is secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
