import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiSave } from "react-icons/fi";
import toast from "react-hot-toast";
import { updateShortCode } from "../api/axios_api";

const UpdateLink = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialOriginalUrl = searchParams.get("originalUrl") || "";
  const initialShortCode = searchParams.get("shortCode") || "";

  // State for form inputs
  const [originalUrl, setOriginalUrl] = useState(initialOriginalUrl);
  const [newCode, setNewCode] = useState(initialShortCode);
  const [isSaving, setIsSaving] = useState(false);

  // Validate URL format
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    // Validate inputs
    if (!newCode.trim()) {
      return toast.error("Short code cannot be empty");
    }
    if (!originalUrl.trim()) {
      return toast.error("Original URL cannot be empty");
    }
    if (!isValidUrl(originalUrl)) {
      return toast.error("Please enter a valid URL");
    }

    setIsSaving(true);
    try {
      const res = await updateShortCode(initialShortCode, {
        originalUrl: originalUrl.trim(),
        newCode: newCode.trim(),
      });
      console.log(res);
      toast.success("Short link updated successfully!");
      navigate("/shorten/view");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Update failed";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Update Short Link
        </h1>
        <form onSubmit={handleSave} className="space-y-5">
          {/* Original URL (editable) */}
          <div>
            <label htmlFor="originalUrl" className="block text-gray-700 mb-1">
              Original URL
            </label>
            <input
              id="originalUrl"
              type="url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter original URL"
              required
            />
          </div>

          {/* New Short Code */}
          <div>
            <label htmlFor="newCode" className="block text-gray-700 mb-1">
              New Short Code
            </label>
            <input
              id="newCode"
              type="text"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter new short code"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              type="submit"
              disabled={isSaving}
              className={`flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-900 transition ${
                isSaving ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <FiSave /> {isSaving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/shorten/view")}
              className="flex-1 text-center text-gray-600 underline p-3 rounded-lg hover:bg-red-700 hover:text-white transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateLink;