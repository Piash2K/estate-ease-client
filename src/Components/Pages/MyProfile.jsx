import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import axios from "axios";
import { Helmet } from "react-helmet";
import { apiFetch } from "../../api/apiClient";

const MyProfile = () => {
    const { user } = useContext(AuthContext);
    const [agreement, setAgreement] = useState(null);
    const [loading, setLoading] = useState(true);  // Loading state

    useEffect(() => {
        if (user?.email) {
            apiFetch(`/agreements/${user.email}`)
                .then(data => {
                    setAgreement(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching agreement:', error);
                    setLoading(false);
                });
        }
    }, [user?.email]);

    if (loading) {
        return (
            <div className="min-h-screen p-6">
                <div className="grid grid-cols-1 gap-8 rounded-3xl border border-gray-200 p-6 shadow-2xl sm:grid-cols-2 sm:p-10">
                    <div className="rounded-2xl p-6 shadow-md sm:p-8">
                        <div className="mx-auto h-32 w-32 animate-pulse rounded-full bg-gray-200 sm:h-40 sm:w-40" />
                        <div className="mx-auto mt-4 h-7 w-2/3 animate-pulse rounded bg-gray-200" />
                        <div className="mx-auto mt-3 h-5 w-1/2 animate-pulse rounded bg-gray-200" />
                    </div>
                    <div className="rounded-2xl p-6 shadow-md sm:p-8">
                        <div className="h-8 w-2/3 animate-pulse rounded bg-gray-200" />
                        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="h-5 animate-pulse rounded bg-gray-200" />
                            <div className="h-5 animate-pulse rounded bg-gray-200" />
                            <div className="h-5 animate-pulse rounded bg-gray-200" />
                            <div className="h-5 animate-pulse rounded bg-gray-200" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br p-6">
            <Helmet><title>My Profile | EstateEase</title></Helmet>
            
            <div className="p-6 sm:p-10 rounded-3xl shadow-2xl border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex flex-col items-center text-center  p-6 sm:p-8 rounded-2xl shadow-md">
                    <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-primary shadow-lg"
                    />
                    <div className="mt-4">
                        <h2 className="text-2xl sm:text-4xl font-bold ">{user.displayName}</h2>
                        <p className="text-base sm:text-lg">{user.email}</p>
                    </div>
                </div>

                <div className="p-6 sm:p-8 rounded-2xl shadow-md">
                    <h3 className="text-2xl sm:text-3xl font-semibold mb-6 text-center ">Agreement Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-base sm:text-lg ">
                        <p><strong>Floor:</strong> {agreement ? agreement.floorNo : "None"}</p>
                        <p><strong >Block:</strong> {agreement ? agreement.blockName : "None"}</p>
                        <p><strong >Apartment:</strong> {agreement ? agreement.apartmentNo : "None"}</p>
                        <p><strong >Rent:</strong> {agreement ? `$${agreement.rent}` : "None"}</p>
                        <p><strong >Status:</strong> {agreement ? agreement.status : "None"}</p>
                        <p><strong >Accepted Date:</strong> {agreement ? agreement.acceptedDate : "None"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;