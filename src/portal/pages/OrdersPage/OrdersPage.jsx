import React from "react";
import PortalLayout from "../../components/PortalLayout/PortalLayout";

const OrdersPage = () => {
  return (
    <PortalLayout showHeader={true} isAuthenticated={true}>
      <h1 className="text-3xl font-bold text-araina-black mb-4 tracking-tight">
        My Orders
      </h1>
      <p className="text-araina-black/60 mb-8">
        Coming soon: Your order history will appear here
      </p>
    </PortalLayout>
  );
};

export default OrdersPage;
