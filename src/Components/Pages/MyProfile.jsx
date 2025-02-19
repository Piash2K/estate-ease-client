import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import axios from "axios";
import { Helmet } from "react-helmet";

const MyProfile = () => {
    const { user } = useContext(AuthContext);
    const [agreement, setAgreement] = useState(null);

    useEffect(() => {
        axios.get(`https://estate-ease-server.vercel.app/agreements/${user.email}`)
            .then(response => {
                if (response.data) {
                    setAgreement(response.data);
                }
            })
            .catch(error => {
                console.error("Error fetching agreement data:", error);
            });
    }, [user.email]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-6">
            <Helmet><title>My Profile | EstateEase</title></Helmet>
            
            <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-2xl border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex flex-col items-center text-center bg-gray-50 p-6 sm:p-8 rounded-2xl shadow-md">
                    <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-primary shadow-lg"
                    />
                    <div className="mt-4">
                        <h2 className="text-2xl sm:text-4xl font-bold text-gray-700">{user.displayName}</h2>
                        <p className="text-base sm:text-lg text-gray-500">{user.email}</p>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-md">
                    <h3 className="text-2xl sm:text-3xl font-semibold mb-6 text-center text-gray-800">Agreement Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-base sm:text-lg text-gray-600">
                        <p><strong className="text-gray-800">Floor:</strong> {agreement ? agreement.floorNo : "None"}</p>
                        <p><strong className="text-gray-800">Block:</strong> {agreement ? agreement.blockName : "None"}</p>
                        <p><strong className="text-gray-800">Apartment:</strong> {agreement ? agreement.apartmentNo : "None"}</p>
                        <p><strong className="text-gray-800">Rent:</strong> {agreement ? `$${agreement.rent}` : "None"}</p>
                        <p><strong className="text-gray-800">Status:</strong> {agreement ? agreement.status : "None"}</p>
                        <p><strong className="text-gray-800">Accepted Date:</strong> {agreement ? agreement.acceptedDate : "None"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;