import React from "react";
import PortalLayout from "../../components/PortalLayout/PortalLayout";

const ProfilePage = () => {
  return (
    <PortalLayout showHeader={true} isAuthenticated={true}>
      <h1 className="text-3xl font-bold text-araina-black mb-4 tracking-tight">
        My Profile
      </h1>
      <p className="text-araina-black/60 mb-8">
        Coming soon: Your profile information will appear here
      </p>
    </PortalLayout>
  );
};

export default ProfilePage;
