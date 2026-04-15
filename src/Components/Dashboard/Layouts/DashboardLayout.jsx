/* eslint-disable no-unused-vars */
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../Provider/AuthProvider";
import { Helmet } from "react-helmet";
import {
  FaUser,
  FaBullhorn,
  FaCreditCard,
  FaHistory,
  FaUsers,
  FaBell,
  FaFileContract,
  FaTags,
  FaHome,
} from "react-icons/fa";
import { apiFetch } from "../../../api/apiClient";

const DashboardLayout = () => {
  const { user, userRole } = useContext(AuthContext);
  const [hasAgreement, setHasAgreement] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.email) {
      apiFetch(`/agreements/${user.email}`)
        .then(data => {
          if (data) setHasAgreement(true);
          else setHasAgreement(false);
        })
        .catch(error => {
          console.error('Error fetching agreement:', error);
          setHasAgreement(false);
        });
    }
  }, [user?.email]);

  const isAdmin = userRole === 'admin' || userRole === 'manager';
  const isMember = userRole === 'member';

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-base-200">
      <Helmet>
        <title>Dashboard | EstateEase</title>
      </Helmet>
      
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar - Fixed position for all devices */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-[#23252b] shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0`}
        style={{ willChange: 'transform' }}
        aria-label="Sidebar"
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-700 sticky top-0 bg-[#23252b] z-10">
          <h2 className="text-xl font-bold text-white">Dashboard Menu</h2>
          <button
            className="text-white text-2xl p-2 bg-[#4F46E5] rounded-lg hover:bg-[#6366F1] transition-all lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 px-4 space-y-2">
          {/* Links for Non-Admin and Non-Member Users */}
          {!isAdmin && !isMember && (
            <>
              <Link
                to="/dashboard/my-profile"
                className="flex items-center py-3 px-4 text-base font-medium text-white rounded-lg hover:bg-[#3B3F48] transition-all duration-200 group"
                onClick={() => setSidebarOpen(false)}
              >
                <FaUser className="mr-3 text-lg" /> My Profile
              </Link>
              <Link
                to="/dashboard/announcements"
                className="flex items-center py-3 px-4 text-base font-medium text-white rounded-lg hover:bg-[#3B3F48] transition-all duration-200 group"
                onClick={() => setSidebarOpen(false)}
              >
                <FaBullhorn className="mr-3 text-lg" /> Announcements
              </Link>
            </>
          )}

          {/* Links for Member Users */}
          {isMember && (
            <>
              <Link
                to="/dashboard/my-profile"
                className="flex items-center py-3 px-4 text-base font-medium text-white rounded-lg hover:bg-[#3B3F48] transition-all duration-200 group"
                onClick={() => setSidebarOpen(false)}
              >
                <FaUser className="mr-3 text-lg" /> My Profile
              </Link>
              <Link
                to="/dashboard/announcements"
                className="flex items-center py-3 px-4 text-base font-medium text-white rounded-lg hover:bg-[#3B3F48] transition-all duration-200 group"
                onClick={() => setSidebarOpen(false)}
              >
                <FaBullhorn className="mr-3 text-lg" /> Announcements
              </Link>
              <Link
                to="/dashboard/make-payment"
                className="flex items-center py-3 px-4 text-base font-medium text-white rounded-lg hover:bg-[#3B3F48] transition-all duration-200 group"
                onClick={() => setSidebarOpen(false)}
              >
                <FaCreditCard className="mr-3 text-lg" /> Make Payment
              </Link>
              <Link
                to="/dashboard/payment-history"
                className="flex items-center py-3 px-4 text-base font-medium text-white rounded-lg hover:bg-[#3B3F48] transition-all duration-200 group"
                onClick={() => setSidebarOpen(false)}
              >
                <FaHistory className="mr-3 text-lg" /> Payment History
              </Link>
            </>
          )}

          {/* Links for Admin Users */}
          {isAdmin && (
            <>
              <Link
                to="/dashboard/admin-profile"
                className="flex items-center py-3 px-4 text-base font-medium text-white rounded-lg hover:bg-[#3B3F48] transition-all duration-200 group"
                onClick={() => setSidebarOpen(false)}
              >
                <FaUser className="mr-3 text-lg" /> Admin Profile
              </Link>
              <Link
                to="/dashboard/manage-members"
                className="flex items-center py-3 px-4 text-base font-medium text-white rounded-lg hover:bg-[#3B3F48] transition-all duration-200 group"
                onClick={() => setSidebarOpen(false)}
              >
                <FaUsers className="mr-3 text-lg" /> Manage Members
              </Link>
              <Link
                to="/dashboard/make-announcement"
                className="flex items-center py-3 px-4 text-base font-medium text-white rounded-lg hover:bg-[#3B3F48] transition-all duration-200 group"
                onClick={() => setSidebarOpen(false)}
              >
                <FaBell className="mr-3 text-lg" /> Make Announcement
              </Link>
              <Link
                to="/dashboard/agrements-request"
                className="flex items-center py-3 px-4 text-base font-medium text-white rounded-lg hover:bg-[#3B3F48] transition-all duration-200 group"
                onClick={() => setSidebarOpen(false)}
              >
                <FaFileContract className="mr-3 text-lg" /> Agreement Requests
              </Link>
              <Link
                to="/dashboard/manage-coupons"
                className="flex items-center py-3 px-4 text-base font-medium text-white rounded-lg hover:bg-[#3B3F48] transition-all duration-200 group"
                onClick={() => setSidebarOpen(false)}
              >
                <FaTags className="mr-3 text-lg" /> Manage Coupons
              </Link>
            </>
          )}

          <div className="border-t border-gray-700 my-4"></div>

          {/* Home Link */}
          <Link
            to="/"
            className="flex items-center py-3 px-4 text-base font-medium text-white rounded-lg hover:bg-[#3B3F48] transition-all duration-200 group"
            onClick={() => setSidebarOpen(false)}
          >
            <FaHome className="mr-3 text-lg" /> Home
          </Link>
        </nav>
      </aside>

      {/* Main Content Area - with left margin on desktop to account for fixed sidebar */}
      <div className="flex-1 flex flex-col min-h-screen w-full lg:ml-72">
        {/* Topbar for sm and md */}
        <div className="lg:hidden sticky top-0 z-30 bg-[#2C2F36] shadow-lg">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              className="text-white p-2 bg-[#4F46E5] rounded-lg hover:bg-[#6366F1] transition-all"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-bold text-white">Dashboard</h1>
            <div className="w-8"></div> {/* Spacer for alignment */}
          </div>
        </div>

        {/* Page Content - no extra gaps */}
        <main className="flex-1 w-full bg-base-100">
          <div className="w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;