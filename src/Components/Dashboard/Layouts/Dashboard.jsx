import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../Provider/AuthProvider";

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    // eslint-disable-next-line no-unused-vars
    const [hasAgreement, setHasAgreement] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isMember, setIsMember] = useState(false); // Added for clarity
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
                        setHasAgreement(true); // Agreement exists
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
                    if (data) {
                        if (data.role === "admin") {
                            setIsAdmin(true); // Admin detected
                        } else if (data.role === "member") {
                            setIsMember(true); // Member detected
                        }
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
                {!isAdmin && !isMember && (
                    <>
                        <Link to="/dashboard/my-profile">My Profile</Link>
                        <Link to="/dashboard/announcements">Announcements</Link>
                    </>
                )}
                {/* Links for Member Users */}
                {isMember && (
                    <>
                        <Link to="/dashboard/my-profile">My Profile</Link>
                        <Link to="/dashboard/announcements">Announcements</Link>
                        <Link to="/dashboard/make-payment">Make Payment</Link>
                        <Link to="/dashboard/payment-history">Payment History</Link>
                    </>
                )}

                {/* Links for Admin Users */}
                {isAdmin && (
                    <>
                        <Link to="/dashboard/admin-profile">Admin Profile</Link>
                        <Link to="/dashboard/manage-members">Manage Members</Link>
                        <Link to="/dashboard/make-announcement">Make Announcement</Link>
                        <Link to="/dashboard/agrements-request">Agreement Requests</Link>
                        <Link to="/dashboard/manage-coupons">Manage Coupons</Link>
                    </>
                )}
                <div className="divider"></div>
                <div>
                    <Link to="/">Home</Link>
                </div>
            </div>

            <div className="flex-1 p-4">
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default Dashboard;