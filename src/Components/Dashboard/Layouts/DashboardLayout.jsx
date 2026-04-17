import { Link, NavLink, Outlet } from "react-router-dom";
import { useContext, useEffect, useMemo, useState } from "react";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user?.email) {
      setHasAgreement(false);
      return;
    }

    apiFetch(`/agreements/${user.email}`, { allowNotFound: true })
      .then((data) => {
        setHasAgreement(Boolean(data));
      })
      .catch((error) => {
        console.error("Error fetching agreement:", error);
        setHasAgreement(false);
      });
  }, [user?.email]);

  const isAdmin = userRole === "admin" || userRole === "manager";
  const isMember = userRole === "member";
  const isRegularUser = !isAdmin && !isMember;
  const roleLabel = isAdmin ? "Admin" : isMember ? "Member" : "User";

  const navLinkClassName = ({ isActive }) =>
    `flex items-center rounded-lg px-4 py-3 text-base font-medium text-white transition-all duration-200 ${
      isActive ? "bg-[#4F46E5]" : "hover:bg-[#3B3F48]"
    }`;

  const menuItems = useMemo(() => {
    if (isAdmin) {
      return [
        { to: "/dashboard/admin-profile", label: "Admin Profile", icon: FaUser },
        { to: "/dashboard/manage-members", label: "Manage Members", icon: FaUsers },
        { to: "/dashboard/make-announcement", label: "Make Announcement", icon: FaBell },
        { to: "/dashboard/agrements-request", label: "Agreement Requests", icon: FaFileContract },
        { to: "/dashboard/manage-coupons", label: "Manage Coupons", icon: FaTags },
      ];
    }

    if (isMember) {
      return [
        { to: "/dashboard/my-profile", label: "My Profile", icon: FaUser },
        { to: "/dashboard/announcements", label: "Announcements", icon: FaBullhorn },
        { to: "/dashboard/make-payment", label: "Make Payment", icon: FaCreditCard },
        { to: "/dashboard/payment-history", label: "Payment History", icon: FaHistory },
      ];
    }

    return [
      { to: "/dashboard/my-profile", label: "My Profile", icon: FaUser },
      { to: "/dashboard/announcements", label: "Announcements", icon: FaBullhorn },
    ];
  }, [isAdmin, isMember]);

  return (
    <div className="flex min-h-screen w-full bg-base-200">
      <Helmet>
        <title>Dashboard | EstateEase</title>
      </Helmet>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 overflow-y-auto bg-[#23252b] shadow-2xl transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        style={{ willChange: "transform" }}
        aria-label="Sidebar"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-700 bg-[#23252b] p-5">
          <div>
            <h2 className="text-xl font-bold text-white">Dashboard Menu</h2>
            <p className="mt-1 text-sm text-gray-300">{roleLabel} account</p>
          </div>
          <button
            className="rounded-lg bg-[#4F46E5] p-2 text-2xl text-white transition-all hover:bg-[#6366F1] lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="space-y-2 px-4 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={navLinkClassName}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="mr-3 text-lg" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {isRegularUser && hasAgreement && (
            <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
              Your agreement request is on file. Member tools will appear after admin approval.
            </div>
          )}

          <div className="my-4 border-t border-gray-700"></div>

          <Link
            to="/"
            className="flex items-center rounded-lg px-4 py-3 text-base font-medium text-white transition-all duration-200 hover:bg-[#3B3F48]"
            onClick={() => setSidebarOpen(false)}
          >
            <FaHome className="mr-3 text-lg" /> Home
          </Link>
        </nav>
      </aside>

      <div className="flex min-h-screen w-full flex-1 flex-col lg:ml-72">
        <div className="sticky top-0 z-30 bg-[#2C2F36] shadow-lg lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              className="rounded-lg bg-[#4F46E5] p-2 text-white transition-all hover:bg-[#6366F1]"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-bold text-white">Dashboard</h1>
            <div className="w-8"></div>
          </div>
        </div>

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
