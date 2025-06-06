import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
       
      try {
        const res = await axios.get("http://localhost:3000/app/profile");
        console.log(res)
        setUser(res.data.user);
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Failed to fetch profile"
        );
      }
    };
    fetchProfile();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="p-4 rounded-md bg-gray-100 shadow-md w-fit mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-2">👤 Profile</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>ID:</strong> {user.id}</p>
    </div>
  );
};

export default Profile;