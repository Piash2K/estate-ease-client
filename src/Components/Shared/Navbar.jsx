import { useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../Provider/AuthProvider";
import { ThemeToggle } from "../DarkMode/ThemeToggle";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const links = (
    <>
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive
            ? "text-white bg-[#0E9F9F] px-4 py-2 rounded-lg font-semibold shadow-md"
            : "text-[#A3A3A3] hover:text-white hover:bg-[#333333] px-4 py-2 rounded-lg transition-colors duration-300"
        }
      >
        Home
      </NavLink>
      <NavLink
        to="/appartment"
        className={({ isActive }) =>
          isActive
            ? "text-white bg-[#0E9F9F] px-4 py-2 rounded-lg font-semibold shadow-md"
            : "text-[#A3A3A3] hover:text-white hover:bg-[#333333] px-4 py-2 rounded-lg transition-colors duration-300"
        }
      >
        Apartment
      </NavLink>
      <NavLink
        to="/contacts"
        className={({ isActive }) =>
          isActive
            ? "text-white bg-[#0E9F9F] px-4 py-2 rounded-lg font-semibold shadow-md"
            : "text-[#A3A3A3] hover:text-white hover:bg-[#333333] px-4 py-2 rounded-lg transition-colors duration-300"
        }
      >
        Contacts
      </NavLink>
      <NavLink
        to="/FAQ"
        className={({ isActive }) =>
          isActive
            ? "text-white bg-[#0E9F9F] px-4 py-2 rounded-lg font-semibold shadow-md"
            : "text-[#A3A3A3] hover:text-white hover:bg-[#333333] px-4 py-2 rounded-lg transition-colors duration-300"
        }
      >
        FAQ
      </NavLink>
      
    </>
  );

  return (
    <nav className="py-6 bg-[#1A1A1A] shadow-lg sticky top-0 z-50">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Navbar Start */}
        <div className="flex items-center">
          <div className="dropdown lg:hidden relative z-50">
            <button
              tabIndex={0}
              className="text-[#A3A3A3] focus:outline-none"
              aria-label="Menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </button>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-[#1A1A1A] rounded-lg shadow-lg mt-3 w-52 space-y-2 p-3 absolute top-full left-0 z-50"
            >
              {links}
            </ul>
          </div>
          <Link
            to="/"
            className="text-3xl font-bold hidden lg:block tracking-wide"
          >
            <span className="text-[#A3A3A3]">Estate</span>
            <span className="text-white">Ease</span>
          </Link>
        </div>

        {/* Navbar Center */}
        <div className="hidden lg:flex lg:space-x-6">{links}</div>

        {/* Navbar End */}
        <div className="flex items-center space-x-4 relative">
          {user ? (
            <div className="relative z-50">
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-[#0E9F9F] shadow-sm cursor-pointer"
                onClick={handleDropdownToggle}
              />
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 bg-[#1A1A1A] text-[#A3A3A3] rounded-lg shadow-lg w-48 z-50">
                  <div className="p-4 border-b border-[#333333]">
                    <p className="text-sm font-semibold">{user.displayName}</p>
                  </div>
                  <ul className="space-y-2 py-2">
                    <li>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 hover:bg-[#333333] hover:text-white transition-colors"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={logOut}
                        className="w-full text-left px-4 py-2 hover:bg-[#333333] hover:text-white transition-colors"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="space-x-3">
              <Link
                to="/login"
                className="bg-[#0E9F9F] hover:bg-[#14B8B8] text-white px-4 py-2 rounded-lg shadow-md transition-all"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-[#0E9F9F] hover:bg-[#14B8B8] text-white px-4 py-2 rounded-lg shadow-md transition-all"
              >
                Register
              </Link>
            </div>
          )}
          <ThemeToggle></ThemeToggle>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;