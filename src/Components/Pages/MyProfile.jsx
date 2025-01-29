import { useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import axios from "axios";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";

const MyProfile = () => {
    const { user } = useContext(AuthContext);
    const [agreement, setAgreement] = useState(null);
    console.log(user);

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
        <div className="max-w-7xl mx-auto px-4 py-6">
            <Helmet><title>My Profile | EstateEase</title></Helmet>
            <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">My Profile</h1>
            <div className="bg-white p-6 rounded-2xl shadow-xl max-w-lg mx-auto border border-gray-200">
                {/* Profile Info */}
                <div className="flex flex-col items-center mb-6 text-center">
                    <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-32 h-32 rounded-full border-4 border-primary shadow-md"
                    />
                    <div className="mt-4">
                        <h2 className="text-2xl font-semibold text-gray-700">{user.name}</h2>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                </div>

                <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">Agreement Information</h3>
                <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-inner">
                    <p className="text-gray-600"><strong className="text-gray-800">Floor:</strong> {agreement ? agreement.floorNo : "None"}</p>
                    <p className="text-gray-600"><strong className="text-gray-800">Block:</strong> {agreement ? agreement.blockName : "None"}</p>
                    <p className="text-gray-600"><strong className="text-gray-800">Apartment Number:</strong> {agreement ? agreement.apartmentNo : "None"}</p>
                    <p className="text-gray-600"><strong className="text-gray-800">Rent:</strong> {agreement ? `$${agreement.rent}` : "None"}</p>
                    <p className="text-gray-600"><strong className="text-gray-800">Status:</strong> {agreement ? agreement.status : "None"}</p>
                    <p className="text-gray-600"><strong className="text-gray-800">Agreement Accepted Date:</strong> {agreement ? agreement.acceptedDate : "None"}</p>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;