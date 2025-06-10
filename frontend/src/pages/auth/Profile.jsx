import { useEffect, useState, useContext } from "react";
import {
  generateEmailAfterLogin,
  getProfile,
  logoutUser,
} from "../../api/axios_api";
import Context from "../../Context";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { MdModeEdit } from "react-icons/md";
import { IoKeySharp, IoMail } from "react-icons/io5";
import { CgLogOut } from "react-icons/cg";
import { MdCheckCircle, MdCancel } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { CiCamera } from "react-icons/ci";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser: setGlobalUser } = useContext(Context);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        if (res.status === 200) {
          setUser(res.data.user);
          toast.success("Welcome to Profile Page", { id: "profile-toast" });
        }
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
      toast.error(err.response?.data?.message || err.message || "Logout failed");
    }
  };

  const handleVerify = async () => {
    try {
      const res = await generateEmailAfterLogin({ id: user.id, email: user.email });
      if (res.status === 200) {
        toast.success(res?.data?.message || "Verification code sent");
        navigate(`/app/email/verify?email=${user.email}&id=${user.id}`);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Request failed. Try again."
      );
    }
  };

  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      toast.success(`Selected file: ${file.name}`);
      // Upload logic goes here
    }
  };

  if (loading) {
    return (
      <div className="grid place-items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-gray-100 px-4 py-10">
      <h1 className="text-3xl font-semibold text-center mb-4">Your Profile</h1>

      <div className="bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-lg p-6 max-w-md w-full text-center ring-1 ring-gray-200">
        
        {/* Profile Image with Hover Overlay */}
        <div className="relative group w-20 h-20 mx-auto mb-4">
          <div className="rounded-full bg-blue-600 text-white w-full h-full text-2xl flex items-center justify-center font-bold uppercase">
            {user.username[0]}
          </div>

          {/* Hover Overlay */}
          <div
            className="absolute inset-0 rounded-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity duration-300"
            onClick={() => document.getElementById("profile-upload").click()}
          >
              <CiCamera className="text-white text-2xl" size={30} />
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            id="profile-upload"
            accept="image/*"
            className="hidden"
            onChange={handleProfileUpload}
          />
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-1">{user.username}</h2>

        {/* Email + Verified */}
        <div className="flex items-center justify-center gap-2">
          {user.verified === false ? (
            <div className="flex gap-4">
              <span className="text-red-800 font-medium flex items-center gap-1 bg-red-200 rounded-xl px-2">
                <MdCancel className="text-lg" />
                Not Verified
              </span>
              <button
                type="button"
                onClick={handleVerify}
                className="flex items-center justify-center gap-2 bg-blue-600 px-2 py-1 rounded-lg text-10px text-white hover:cursor-pointer hover:scale-101 transition-all ease-in-out "
              >
                <p>Verify Email</p>
                <IoMdSend size={18} />
              </button>
            </div>
          ) : (
            <span className="text-green-800 font-medium flex items-center gap-1 bg-green-200 rounded-xl px-2">
              <MdCheckCircle className="text-lg" />
              Verified
            </span>
          )}
        </div>

        {/* Email Display */}
        <div className="flex w-full items-center justify-center gap-2 mt-2">
          <IoMail size={18} />
          <p className="text-gray-600">{user.email}</p>
        </div>

        {/* Member Info */}
        <p className="text-gray-500 text-sm mb-4">
          Member since {new Date(user.createdAt).toLocaleDateString()}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-sm text-gray-700 mt-6 mb-4">
          <div>
            <p className="font-bold text-lg">{user.links || 0}</p>
            <p>Links Created</p>
          </div>
          <div>
            <p className="font-bold text-lg">0</p>
            <p>Total Clicks</p>
          </div>
          <div>
            <p className="font-bold text-lg">Today</p>
            <p>Last Active</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 mt-4">
          <button className="bg-blue-600 flex items-center justify-center gap-2 text-white py-2 px-4 rounded hover:bg-blue-800 hover:cursor-pointer hover:scale-101 hover:shadow-lg transition-all duration-300 ease-in-out">
            <MdModeEdit size={25} />
            Edit Profile
          </button>
          <button className="bg-yellow-500 flex items-center justify-center gap-2 text-white py-2 px-4 rounded hover:bg-yellow-600 hover:cursor-pointer hover:scale-101 hover:shadow-lg transition-all duration-300 ease-in-out">
            <IoKeySharp size={25} /> Change Password
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 flex items-center justify-center gap-2 text-white py-2 px-4 rounded hover:bg-red-700 hover:scale-101 hover:shadow-lg transition-all duration-300 ease-in-out"
          >
            <CgLogOut size={25} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
