/* eslint-disable no-unused-vars */
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../Provider/AuthProvider";
import { Helmet } from "react-helmet";

const Dashboard = () => {
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
            <Helmet><title>Dashboard | EstateEase </title></Helmet>
            {/* Sidebar */}
            <div className="flex flex-col bg-amber-300 w-full md:w-64 min-h-screen p-4 shadow-lg">
                <div className="flex justify-between items-center mb-4 md:hidden">
                    <button className="text-white text-xl p-2 bg-amber-500 rounded-lg" onClick={() => { /* Handle sidebar toggle */ }}>
                        <i className="fas fa-bars"></i>
                    </button>
                </div>

                {/* Links for Non-Admin and Non-Member Users */}
                {!isAdmin && !isMember && (
                    <>
                        <Link to="/dashboard/my-profile" className="py-2 px-4 mb-2 text-lg font-medium rounded hover:bg-amber-400 transition duration-200">My Profile</Link>
                        <Link to="/dashboard/announcements" className="py-2 px-4 mb-2 text-lg font-medium rounded hover:bg-amber-400 transition duration-200">Announcements</Link>
                    </>
                )}

                {/* Links for Member Users */}
                {isMember && (
                    <>
                        <Link to="/dashboard/my-profile" className="py-2 px-4 mb-2 text-lg font-medium rounded hover:bg-amber-400 transition duration-200">My Profile</Link>
                        <Link to="/dashboard/announcements" className="py-2 px-4 mb-2 text-lg font-medium rounded hover:bg-amber-400 transition duration-200">Announcements</Link>
                        <Link to="/dashboard/make-payment" className="py-2 px-4 mb-2 text-lg font-medium rounded hover:bg-amber-400 transition duration-200">Make Payment</Link>
                        <Link to="/dashboard/payment-history" className="py-2 px-4 mb-2 text-lg font-medium rounded hover:bg-amber-400 transition duration-200">Payment History</Link>
                    </>
                )}

                {/* Links for Admin Users */}
                {isAdmin && (
                    <>
                        <Link to="/dashboard/admin-profile" className="py-2 px-4 mb-2 text-lg font-medium rounded hover:bg-amber-400 transition duration-200">Admin Profile</Link>
                        <Link to="/dashboard/manage-members" className="py-2 px-4 mb-2 text-lg font-medium rounded hover:bg-amber-400 transition duration-200">Manage Members</Link>
                        <Link to="/dashboard/make-announcement" className="py-2 px-4 mb-2 text-lg font-medium rounded hover:bg-amber-400 transition duration-200">Make Announcement</Link>
                        <Link to="/dashboard/agrements-request" className="py-2 px-4 mb-2 text-lg font-medium rounded hover:bg-amber-400 transition duration-200">Agreement Requests</Link>
                        <Link to="/dashboard/manage-coupons" className="py-2 px-4 mb-2 text-lg font-medium rounded hover:bg-amber-400 transition duration-200">Manage Coupons</Link>
                    </>
                )}

                <div className="divider"></div>

                {/* Home Link */}
                <Link to="/" className="py-2 px-4 text-lg font-medium rounded hover:bg-amber-400 transition duration-200">Home</Link>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4">
                <Outlet />
            </div>
        </div>
    );
};

export default Dashboard;