import { useState, useRef } from "react";
import axios from "axios";
import { FiCopy, FiExternalLink } from "react-icons/fi";
import { QRCodeCanvas } from "qrcode.react";

const FormUrl = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [shortUrl, setShortUrl] = useState(""); // Store the short URL
  const [copied, setCopied] = useState(false);
  const qrRef = useRef(null);

  const PORT = import.meta.env.VITE_PORT;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    setShortUrl("");
    try {
      const res = await axios.post(`http://localhost:${PORT}/shorten`, {
        originalUrl,
        customCode,
      });
      const url = `http://localhost:${PORT}/shorten/${res.data.shortCode}`;
      setMessage(`Short URL created: ${url}`);
      setMessageType("success");
      setShortUrl(url);
    } catch (err) {
      if (err.response) {
        if (err.response.data.message) {
          setMessage(err.response.data.message);
        } else if (err.response.data.errors && err.response.data.errors.length > 0) {
          setMessage(err.response.data.errors[0].message);
        } else {
          setMessage("An error occurred.");
        }
      } else {
        setMessage("Server not reachable.");
      }
      setMessageType("error");
    }
    setOriginalUrl("");
    setCustomCode("");
  };

  const handleCopy = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
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
    <form onSubmit={handleSubmit} className="space-y-8 mt-10 w-full max-w-md">
      {message && (
        <div
          className={`p-3 rounded text-center mb-2 flex flex-col items-center gap-2 ${
            messageType === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span>{message}</span>
            {messageType === "success" && shortUrl && (
              <>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="ml-2 p-1 rounded transition hover:cursor-pointer"
                  title="Copy URL"
                >
                  <FiCopy size={20} />
                </button>
                
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 p-1 rounded transition hover:cursor-pointer text-blue-600 hover:bg-blue-100"
                  title="Visit URL"
                >
                  <FiExternalLink size={20} />
                </a>
                {copied && (
                  <span className="ml-2 text-green-600 font-semibold animate-pulse">
                    Copied!
                  </span>
                )}
              </>
            )}
          </div>
          {messageType === "success" && shortUrl && (
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
          )}
        </div>
      )}
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
    </form>
  );
};

export default FormUrl;