import { useEffect, useState } from "react";
import { getAllShortLinks } from "../api/axios_api";

const ShortLinksDetails = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllShortLinks()
      .then((res) => {
        setLinks(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch short links.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-600">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-white rounded shadow overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">All Shorten Links</h2>
      <table className="w-full border text-sm md:text-base">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-2 md:px-4 border">Short Code</th>
            <th className="py-2 px-2 md:px-4 border">Original URL</th>
            <th className="py-2 px-2 md:px-4 border">Short URL</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <tr key={link._id} className="hover:bg-gray-50">
              <td className="py-2 px-2 md:px-4 border break-all">{link.shortCode}</td>
              <td className="py-2 px-2 md:px-4 border break-all">
                <a
                  href={`http://localhost:3000/shorten/${link.shortCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-all"
                >
                 {link.originalUrl}
                </a></td>
              <td className="py-2 px-2 md:px-4 border break-all">
                <a
                  href={`http://localhost:3000/shorten/${link.shortCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-all"
                >
                  {`/shorten/${link.shortCode}`}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShortLinksDetails;