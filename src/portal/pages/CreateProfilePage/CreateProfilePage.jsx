import React from "react";
import PortalLayout from "../../components/PortalLayout/PortalLayout";

const CreateProfilePage = () => {
  return (
    <PortalLayout showHeader={false} isAuthenticated={true}>
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-2xl w-full">
          <h1 className="text-3xl font-bold text-araina-black mb-4 tracking-tight">
            Complete Your Profile
          </h1>
          <p className="text-araina-black/60 mb-8">
            Coming soon: Profile creation form will appear here
          </p>
        </div>
      </div>
    </PortalLayout>
  );
};

export default CreateProfilePage;
