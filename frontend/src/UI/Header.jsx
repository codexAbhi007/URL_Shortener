import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import Context from "../Context";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated } = useContext(Context);

  return (
    <header className="bg-gray-800 text-white p-4 md:px-8 flex items-center justify-between relative">
      <span className="text-2xl tracking-wider font-bold">URL Shortener</span>

      {/* Hamburger Icon */}
      <button
        className="md:hidden flex flex-col justify-center items-center w-10 h-10"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        <span
          className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
            menuOpen ? "rotate-45 translate-y-2" : ""
          }`}
        ></span>
        <span
          className={`block h-0.5 w-6 bg-white my-1 transition-all duration-300 ${
            menuOpen ? "opacity-0" : ""
          }`}
        ></span>
        <span
          className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
            menuOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        ></span>
      </button>

      {/* Desktop Nav */}
      <nav className="hidden md:flex gap-4">
        <Link
          to="/"
          className="text-white text-lg px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          Home
        </Link>
        <Link
          to="/shorten/view"
          className="text-white text-lg px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          Views
        </Link>

        {!isAuthenticated ? (
          <>
            <Link
              to="/app/register"
              className="text-white text-lg px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              Sign Up
            </Link>
            <Link
              to="/app/login"
              className="text-white text-lg px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              Sign In
            </Link>
          </>
        ) : (
          <Link
            to="/app/profile"
            className="text-white text-lg px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            My Profile
          </Link>
        )}
      </nav>

      {/* Mobile Nav */}
      <nav
        className={`md:hidden absolute top-full left-0 w-full bg-gray-800 z-50 transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ boxShadow: menuOpen ? "0 4px 12px rgba(0,0,0,0.15)" : "none" }}
      >
        <div className="flex flex-col gap-2 py-2 px-4">
          <Link
            to="/"
            className="text-white text-lg px-4 py-2 rounded hover:bg-gray-700 transition"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/shorten/view"
            className="text-white text-lg px-4 py-2 rounded hover:bg-gray-700 transition"
            onClick={() => setMenuOpen(false)}
          >
            Views
          </Link>

          {!isAuthenticated ? (
            <>
              <Link
                to="/app/register"
                className="text-white text-lg px-4 py-2 rounded hover:bg-gray-700 transition"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
              <Link
                to="/app/login"
                className="text-white text-lg px-4 py-2 rounded hover:bg-gray-700 transition"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
            </>
          ) : (
            <Link
              to="/app/profile"
              className="text-white text-lg px-4 py-2 rounded hover:bg-gray-700 transition"
              onClick={() => setMenuOpen(false)}
            >
              My Profile
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
