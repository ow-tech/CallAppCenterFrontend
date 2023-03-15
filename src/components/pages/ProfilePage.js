import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./ProfilePage.css";

const ProfilePage = () => {
  const history = useNavigate();

  const [profileData, setProfileData] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      history("/login");
    }
    const fetchProfileData = async () => {
      let config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      try {
        const { data } = await axios.get("/api/profile", config);
        setProfileData(data.data);
      } catch (error) {
        setError("there was an error");
      }
    };

    fetchProfileData();
  }, [history]);
  return profileData ? (
    <div className="profile-page">
      <div><b>id:</b> {profileData._id}</div>
      <div><b>kind:</b> {profileData.kind}</div>
      <div><b>username:</b> {profileData.username}</div>
      <div><b>email:</b> {profileData.email}</div>
    </div>
  ) : (
    <div>{error}</div>
  );
};

export default ProfilePage;
