import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../Provider/AuthProvider";

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [hasAgreement, setHasAgreement] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (user?.email) {
            // Check if the user has an agreement
            fetch(`http://localhost:5000/agreements/${user.email}`)
                .then((response) => {
                    if (!response.ok) {
                        return null;
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data) {
                        setHasAgreement(true); // If agreement exists
                    } else {
                        setHasAgreement(false);
                        navigate("/dashboard/my-profile"); // Redirect if no agreement
                    }
                })
                .catch((error) => {
                    console.error("Error fetching agreement:", error);
                });

            // Check user role dynamically from the backend
            fetch(`http://localhost:5000/users/${user.email}`)
                .then((response) => {
                    if (!response.ok) {
                        return null;
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data && data.role === "admin") {
                        setIsAdmin(true); // Admin detected
                    } else {
                        setIsAdmin(false); // Not an admin
                    }
                })
                .catch((error) => {
                    console.error("Error fetching user role:", error);
                });
        }
    }, [user?.email, navigate]);

    return (
        <div className="flex">
            <div className="flex flex-col bg-amber-300 w-2/12 min-h-screen">
                {/* Links always shown */}
                <Link to='/dashboard/my-profile'>My Profile</Link>
                <Link to='/dashboard/announcements'>Announcements</Link>

                {/* Member-specific Links */}
                {hasAgreement && (
                    <>
                        <Link to='/dashboard/make-payment'>Make Payment</Link>
                        <Link to='/dashboard/payment-history'>Payment History</Link>
                    </>
                )}

                {/* Admin-specific Links */}
                {isAdmin && (
                    <>
                        <Link to='/dashboard/admin-profile'>Admin Profile</Link>
                        <Link to='/dashboard/manage-members'>Manage Members</Link>
                        <Link to='/dashboard/make-announcement'>Make Announcement</Link>
                        <Link to='/dashboard/agrements-request'>Agreement Requests</Link>
                        <Link to='/dashboard/manage-coupons'>Manage Coupons</Link>
                    </>
                )}
            </div>

            <div className="flex-1 p-4">
                <Outlet />
            </div>
        </div>
    );
};

export default Dashboard;