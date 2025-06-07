import React, { useEffect, useState, useContext } from "react";
import { getProfile, logoutUser } from "../../api/axios_api";
import Context from "../../Context";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const { setIsAuthenticated, setUser: setGlobalUser } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setUser(res.data.user);
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Failed to fetch profile"
        );
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setGlobalUser(null);
      setIsAuthenticated(false);
      navigate("/app/login");
    } catch (err) {
      alert("Logout failed: " + (err.response?.data?.message || err.message));
    }
  };

  if (error)
    return <p className="text-red-500 text-center mt-8 text-lg">{error}</p>;
  if (!user) return <p className="text-center mt-8 text-lg">Loading profile...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-xl rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">👤 Your Profile</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded transition"
        >
          Logout
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <p className="text-gray-600 text-sm">Username</p>
          <p className="text-lg font-medium text-gray-900">{user.username}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Email</p>
          <p className="text-lg font-medium text-gray-900">{user.email}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">User ID</p>
          <p className="text-lg font-medium text-gray-900">{user.id}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
