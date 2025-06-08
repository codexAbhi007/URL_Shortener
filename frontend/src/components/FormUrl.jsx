import { useState, useRef } from "react";
import { FiCopy, FiExternalLink } from "react-icons/fi";
import { QRCodeCanvas } from "qrcode.react";
import { shortenUrl } from "../api/axios_api";
import toast from "react-hot-toast";


const FormUrl = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [shortUrl, setShortUrl] = useState("");
 
  const qrRef = useRef(null);

  const PORT = import.meta.env.VITE_PORT;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShortUrl("");
    try {
      const res = await shortenUrl({ originalUrl, customCode });
      console.log(res);
      const url = `http://localhost:${PORT}/shorten/${res.data.shortCode}`;
      setShortUrl(url);
      toast.success("Short URL created!");
    } catch (err) {
      console.log(err);
      if (err.response?.data?.message === "Unauthorized: No token") {
        toast.error("Login First to Shorten and View Links");
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Something Went Wrong!");
      }
    }
    setOriginalUrl("");
    setCustomCode("");
  };

  const handleCopy = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      toast.success("Copied to clipboard!");
    }
  };

  const handleDownloadQR = () => {
    const canvas = qrRef.current.querySelector("canvas");
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.png";
    a.click();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 mt-10 w-full max-w-md mx-auto"
    >
      {!shortUrl && (
        <>
          <input
            className="w-full p-2 border rounded"
            type="url"
            placeholder="Enter original URL"
            required
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
          />
          <input
            className="w-full p-2 border rounded"
            type="text"
            placeholder="Custom short code (optional)"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            Shorten
          </button>
        </>
      )}

      {shortUrl && (
        <div className="flex flex-col items-center gap-2 text-center mt-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="break-all font-medium text-blue-700">
              {shortUrl}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 rounded hover:bg-gray-100"
              title="Copy URL"
            >
              <FiCopy size={20} />
            </button>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded text-blue-600 hover:bg-blue-100"
              title="Visit URL"
            >
              <FiExternalLink size={20} />
            </a>
          </div>
          <div className="flex flex-col items-center mt-2" ref={qrRef}>
            <QRCodeCanvas value={shortUrl} size={128} />
            <button
              type="button"
              onClick={handleDownloadQR}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Download QR
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => {
                setOriginalUrl("");
                setCustomCode("");
                setShortUrl(""); // 👈 This clears the QR and shows the form
              }}
              className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
            >
              Shorten Another
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default FormUrl;
