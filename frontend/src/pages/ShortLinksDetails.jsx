import { useEffect, useState } from "react";
import { getAllShortLinks, deleteShortLink } from "../api/axios_api";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ShortLinksDetails = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllShortLinks()
      .then((res) => {
        setLinks(res.data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch short links.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleDelete = async (shortCode) => {
    if (!window.confirm("Are you sure you want to delete this link?")) {
      return;
    }
    try {
      await deleteShortLink(shortCode);
      setLinks((prev) => prev.filter((link) => link.shortCode !== shortCode));
      toast.success("Link deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete link.");
    }
  };

  const handleEdit = (link) => {
    // Navigate to Update page, passing along existing link data
    navigate(
      `/shorten/update?originalUrl=${link.originalUrl}&shortCode=${link.shortCode}`
    );
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md overflow-x-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        All Shortened Links
      </h2>
      <table className="w-full border text-sm md:text-base table-auto">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="py-3 px-4 border text-left">Original URL</th>
            <th className="py-3 px-4 border text-left">Short URL</th>
            <th className="py-3 px-4 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.length === 0 ? (
            <tr>
              <td colSpan={3} className="py-4 text-center text-gray-500">
                No links found.
              </td>
            </tr>
          ) : (
            links.map((link, index) => (
              <tr key={index} className="hover:bg-gray-50 transition">
                <td className="py-2 px-4 border break-all">
                  <a
                    href={link.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {link.originalUrl}
                  </a>
                </td>
                <td className="py-2 px-4 border break-all">
                  <a
                    href={`http://localhost:3000/shorten/${link.shortCode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {`/shorten/${link.shortCode}`}
                  </a>
                </td>
                <td className="py-2 px-4 border text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(link)}
                      className="text-yellow-600 hover:text-yellow-800 p-1 hover:cursor-pointer"
                      title="Edit"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(link.shortCode)}
                      className="text-red-600 hover:text-red-800 p-1 hover:cursor-pointer"
                      title="Delete"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ShortLinksDetails;
