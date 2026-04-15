import { useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../Provider/AuthProvider";
import { ThemeToggle } from "../DarkMode/ThemeToggle";
import Swal from "sweetalert2";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const handleMobileLinkClick = () => setMobileMenuOpen(false);
  const links = (
    <>
      <NavLink to="/" className={navLinkClass} onClick={handleMobileLinkClick}>Home</NavLink>
      <NavLink to="/apartment" className={navLinkClass} onClick={handleMobileLinkClick}>Apartments</NavLink>
      <NavLink to="/contacts" className={navLinkClass} onClick={handleMobileLinkClick}>Contact</NavLink>
      <NavLink to="/FAQ" className={navLinkClass} onClick={handleMobileLinkClick}>FAQ</NavLink>
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

        {/* User / Auth and Theme Toggle */}
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
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden flex items-center justify-center p-2 rounded-md text-[#A3A3A3] hover:text-white focus:outline-none"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}></div>
      )}
      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-64 bg-[#1A1A1A] shadow-lg transform transition-transform duration-200 lg:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ willChange: 'transform' }}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#0E9F9F]">
          <span className="text-2xl font-bold text-[#0E9F9F]">EstateEase</span>
          <button
            className="p-2 rounded-md text-[#A3A3A3] hover:text-white focus:outline-none"
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col space-y-2 px-4 py-6">
          {links}
          <div className="mt-4">
            {user ? (
              <>
                <div className="font-semibold text-white mb-2">{user.displayName}</div>
                <Link to="/dashboard" className="block px-4 py-2 hover:bg-[#0E9F9F] hover:text-white transition rounded-lg">Dashboard</Link>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full text-left px-4 py-2 hover:bg-red-600 hover:text-white transition disabled:cursor-not-allowed disabled:opacity-60 rounded-lg"
                >
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link to="/login" className="bg-[#0E9F9F] hover:bg-[#0a7f7f] text-white px-3 py-2 rounded-lg text-sm transition">Login</Link>
                <Link to="/register" className="border border-[#0E9F9F] text-[#0E9F9F] hover:bg-[#0E9F9F] hover:text-white px-3 py-2 rounded-lg text-sm transition">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;