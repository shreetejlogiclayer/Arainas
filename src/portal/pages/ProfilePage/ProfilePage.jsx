import React from "react";
import ProfileForm from "../../components/ProfileForm/ProfileForm";
import ProfileManagement from "../../components/ProfileManagement/ProfileManagement";

const ProfilePage = () => (
  <ProfileForm mode="edit">
    <ProfileManagement />
  </ProfileForm>
);

export default ProfilePage;
