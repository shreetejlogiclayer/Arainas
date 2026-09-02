import React from "react";
import PortalLayout from "../../components/PortalLayout/PortalLayout";

const ReferralsPage = () => {
  return (
    <PortalLayout showHeader={true} isAuthenticated={true}>
      <h1 className="text-3xl font-bold text-araina-black mb-4 tracking-tight">
        Referrals
      </h1>
      <p className="text-araina-black/60 mb-8">
        Coming soon: Your referral information will appear here
      </p>
    </PortalLayout>
  );
};

export default ReferralsPage;
