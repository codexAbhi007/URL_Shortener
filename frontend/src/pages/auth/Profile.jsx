import React, { useEffect, useState, useContext } from "react";
import { getProfile, logoutUser } from "../../api/axios_api";
import Context from "../../Context";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Profile = () => {
  const [user, setUser] = useState(null);
  const { setIsAuthenticated, setUser: setGlobalUser } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        if (res.status === 200) {
          setUser(res.data.user);
          toast.success("Welcome to Profile Page", { id: "profile-toast" });
        }
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        toast.error("Please Login to Access", { id: "auth-error" });
        navigate("/app/login");
      } finally {
        setLoading(false);
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
      toast.success("Logged out successfully");
      navigate("/app/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Logout failed"
      );
    }
  };

  if (loading) {
    return (
      <div className="grid place-items-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="grid place-items-center min-h-[70vh] px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">👤 Your Profile</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-900 hover:cursor-pointer text-white text-sm px-4 py-2 rounded transition"
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
    </div>
  );
};

export default Profile;
