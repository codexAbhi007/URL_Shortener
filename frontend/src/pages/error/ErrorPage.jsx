import { Link } from "react-router-dom";
import { MdErrorOutline } from "react-icons/md";

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-100 via-white to-blue-100 px-4">
      <div className="flex flex-col items-center">
        <MdErrorOutline className="text-red-500 text-7xl mb-4 animate-bounce" />
        <h1 className="text-5xl font-extrabold text-gray-800 mb-2 drop-shadow-lg">Oops!</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Something went wrong</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg font-bold text-lg hover:bg-blue-700 transition"
        >
          Go Home
        </Link>
      </div>
      <div className="mt-12 opacity-60">
        <svg width="300" height="100" viewBox="0 0 300 100" fill="none">
          <ellipse cx="150" cy="80" rx="120" ry="18" fill="#e0e7ef" />
        </svg>
      </div>
    </div>
  );
};

export default ErrorPage;