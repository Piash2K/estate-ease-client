import { useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../Provider/AuthProvider";
import { ThemeToggle } from "../DarkMode/ThemeToggle";
import { FaChevronDown } from "react-icons/fa";
import Swal from "sweetalert2";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-white bg-[#0E9F9F] px-3 py-2 rounded-lg font-semibold transition-colors"
      : "text-[#A3A3A3] hover:text-white hover:bg-[#0E9F9F] px-3 py-2 rounded-lg transition-colors duration-300";

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Log out of EstateEase?',
      text: 'You will need to sign in again to access protected pages.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Logout',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) {
      return;
    }

    setIsLoggingOut(true);
    try {
      await logOut();
      setIsProfileDropdownOpen(false);
      navigate('/login', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const links = (
    <>
      <NavLink to="/" className={navLinkClass}>Home</NavLink>
      
      <div className="relative group">
        <button className="flex items-center text-[#A3A3A3] hover:text-white hover:bg-[#0E9F9F] px-3 py-2 rounded-lg transition-colors">
          Apartments <FaChevronDown className="ml-1 text-xs" />
        </button>
        <div className="hidden group-hover:block absolute left-0 mt-0 w-48 bg-[#2A2A2A] rounded-lg shadow-xl py-2 z-50">
          <NavLink to="/apartment" className="block px-4 py-2 hover:bg-[#0E9F9F] hover:text-white transition">All Apartments</NavLink>
          <a href="/apartment" className="block px-4 py-2 hover:bg-[#0E9F9F] hover:text-white transition text-sm">By Budget</a>
          <a href="/apartment" className="block px-4 py-2 hover:bg-[#0E9F9F] hover:text-white transition text-sm">By Location</a>
        </div>
      </div>

      <NavLink to="/contacts" className={navLinkClass}>Contact</NavLink>
      <NavLink to="/FAQ" className={navLinkClass}>FAQ</NavLink>
    </>
  );

  return (
    <nav className="bg-[#1A1A1A] shadow-lg sticky top-0 z-50 border-b border-[#0E9F9F]">
      <div className="px-4 md:px-8 py-3 flex items-center justify-between">
        {/* Logo/Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl md:text-3xl font-bold tracking-wide hidden sm:block">
            <span className="text-[#0E9F9F]">Estate</span><span className="text-white">Ease</span>
          </span>
          <span className="text-xl md:text-2xl font-bold text-[#0E9F9F] sm:hidden">EE</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex lg:space-x-2 items-center">{links}</div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <details className="dropdown dropdown-end">
            <summary className="text-[#A3A3A3] hover:text-white cursor-pointer">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </summary>
            <ul className="dropdown-content bg-[#2A2A2A] rounded-lg shadow-xl p-3 space-y-2 w-52">
              {links}
            </ul>
          </details>
        </div>

        {/* User / Auth */}
        <div className="flex items-center space-x-3">
          {user ? (
            <div className="relative">
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-10 h-10 rounded-full border-2 border-[#0E9F9F] cursor-pointer hover:border-white transition"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              />
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 bg-[#2A2A2A] rounded-lg shadow-xl w-48 py-2 z-50">
                  <div className="px-4 py-2 font-semibold text-white border-b border-[#0E9F9F]">{user.displayName}</div>
                  <Link to="/dashboard" className="block px-4 py-2 hover:bg-[#0E9F9F] hover:text-white transition">Dashboard</Link>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full text-left px-4 py-2 hover:bg-red-600 hover:text-white transition disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link to="/login" className="bg-[#0E9F9F] hover:bg-[#0a7f7f] text-white px-3 py-2 rounded-lg text-sm transition">Login</Link>
              <Link to="/register" className="border border-[#0E9F9F] text-[#0E9F9F] hover:bg-[#0E9F9F] hover:text-white px-3 py-2 rounded-lg text-sm transition">Sign Up</Link>
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;