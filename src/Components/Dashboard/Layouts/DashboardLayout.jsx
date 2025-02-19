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

const DashboardLayout = () => {
  const { user } = useContext(AuthContext);
  const [hasAgreement, setHasAgreement] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.email) {
      fetch(`https://estate-ease-server.vercel.app/agreements/${user.email}`)
        .then((response) => {
          if (!response.ok) {
            return null;
          }
          return response.json();
        })
        .then((data) => {
          if (data) {
            setHasAgreement(true);
          } else {
            setHasAgreement(false);
            // navigate("/dashboard");
          }
        })
        .catch((error) => {
          console.error("Error fetching agreement:", error);
        });

      fetch(`https://estate-ease-server.vercel.app/users/${user.email}`)
        .then((response) => {
          if (!response.ok) {
            return null;
          }
          return response.json();
        })
        .then((data) => {
          if (data) {
            if (data.role === "admin") {
              setIsAdmin(true);
            } else if (data.role === "member") {
              setIsMember(true);
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching user role:", error);
        });
    }
  }, [user?.email, navigate]);

  return (
    <div className="flex flex-col md:flex-row">
      <Helmet>
        <title>Dashboard | EstateEase </title>
      </Helmet>
      {/* Sidebar */}
      <div className="fixed top-0 flex flex-col bg-[#2C2F36] w-full md:w-72 min-h-screen p-4 shadow-lg">
        <div className="flex justify-between items-center mb-4 md:hidden">
          <button
            className="text-white text-xl p-2 bg-[#4F46E5] rounded-lg"
            onClick={() => { /* Handle sidebar toggle */ }}
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>

        {/* Links for Non-Admin and Non-Member Users */}
        {!isAdmin && !isMember && (
          <>
            <Link
              to="/dashboard/my-profile"
              className="flex items-center py-2 px-4 mb-2 text-lg font-medium text-white rounded hover:bg-[#3B3F48] transition duration-200"
            >
              <FaUser className="mr-2" /> My Profile
            </Link>
            <Link
              to="/dashboard/announcements"
              className="flex items-center py-2 px-4 mb-2 text-lg font-medium text-white rounded hover:bg-[#3B3F48] transition duration-200"
            >
              <FaBullhorn className="mr-2" /> Announcements
            </Link>
          </>
        )}

        {/* Links for Member Users */}
        {isMember && (
          <>
            <Link
              to="/dashboard/my-profile"
              className="flex items-center py-2 px-4 mb-2 text-lg font-medium text-white rounded hover:bg-[#3B3F48] transition duration-200"
            >
              <FaUser className="mr-2" /> My Profile
            </Link>
            <Link
              to="/dashboard/announcements"
              className="flex items-center py-2 px-4 mb-2 text-lg font-medium text-white rounded hover:bg-[#3B3F48] transition duration-200"
            >
              <FaBullhorn className="mr-2" /> Announcements
            </Link>
            <Link
              to="/dashboard/make-payment"
              className="flex items-center py-2 px-4 mb-2 text-lg font-medium text-white rounded hover:bg-[#3B3F48] transition duration-200"
            >
              <FaCreditCard className="mr-2" /> Make Payment
            </Link>
            <Link
              to="/dashboard/payment-history"
              className="flex items-center py-2 px-4 mb-2 text-lg font-medium text-white rounded hover:bg-[#3B3F48] transition duration-200"
            >
              <FaHistory className="mr-2" /> Payment History
            </Link>
          </>
        )}

        {/* Links for Admin Users */}
        {isAdmin && (
          <>
            <Link
              to="/dashboard/admin-profile"
              className="flex items-center py-2 px-4 mb-2 text-lg font-medium text-white rounded hover:bg-[#3B3F48] transition duration-200"
            >
              <FaUser className="mr-2" /> Admin Profile
            </Link>
            <Link
              to="/dashboard/manage-members"
              className="flex items-center py-2 px-4 mb-2 text-lg font-medium text-white rounded hover:bg-[#3B3F48] transition duration-200"
            >
              <FaUsers className="mr-2" /> Manage Members
            </Link>
            <Link
              to="/dashboard/make-announcement"
              className="flex items-center py-2 px-4 mb-2 text-lg font-medium text-white rounded hover:bg-[#3B3F48] transition duration-200"
            >
              <FaBell className="mr-2" /> Make Announcement
            </Link>
            <Link
              to="/dashboard/agrements-request"
              className="flex items-center py-2 px-4 mb-2 text-lg font-medium text-white rounded hover:bg-[#3B3F48] transition duration-200"
            >
              <FaFileContract className="mr-2" /> Agreement Requests
            </Link>
            <Link
              to="/dashboard/manage-coupons"
              className="flex items-center py-2 px-4 mb-2 text-lg font-medium text-white rounded hover:bg-[#3B3F48] transition duration-200"
            >
              <FaTags className="mr-2" /> Manage Coupons
            </Link>
          </>
        )}

        <div className="divider"></div>

        {/* Home Link */}
        <Link
          to="/"
          className="flex items-center py-2 px-4 text-lg font-medium text-white rounded hover:bg-[#3B3F48] transition duration-200"
        >
          <FaHome className="mr-2" /> Home
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-72 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;