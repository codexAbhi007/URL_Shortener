import { useEffect, useState, useContext } from "react";
import { getProfile, logoutUser } from "../../api/axios_api";
import Context from "../../Context";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { MdModeEdit } from "react-icons/md";
import { IoKeySharp } from "react-icons/io5";
import { CgLogOut } from "react-icons/cg";
import { IoMail } from "react-icons/io5";
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
          console.log(res.data)
          toast.success("Welcome to Profile Page", { id: "profile-toast" });
        }
      } catch (err) {
        toast.error("Please Login to Access", { id: "auth-error" });
        navigate("/app/login");
        console.log(err);
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
    <div className="flex flex-col items-center bg-gray-100 px-4 py-10">
      <h1 className="text-3xl font-semibold text-center mb-4">Your Profile</h1>

      <div className="bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-lg p-6 max-w-md w-full text-center ring-1 ring-gray-200">
        <div className="rounded-full bg-blue-600 text-white w-16 h-16 mx-auto text-2xl flex items-center justify-center font-bold uppercase mb-4">
          {user.username[0]}
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-1">
          {user.username}
        </h2>
        <div>{user.verified == false ? "Not verified" : "Verified"}</div>
        <div className="flex w-full items-center justify-center gap-2">
          <IoMail size={18} />
          <p className="text-gray-600">{user.email}</p>
        </div>

        <p className="text-gray-500 text-sm mb-4">
          Member since {new Date(user.createdAt).toLocaleDateString()}
        </p>

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
