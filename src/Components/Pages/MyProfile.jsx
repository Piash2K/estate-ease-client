import { useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import axios from "axios";
import { useState, useEffect } from "react";

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
        <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-4xl font-bold mb-6 text-center">My Profile</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
                {/* Profile Info */}
                <div className="flex items-center mb-6">
                    <img
                        src={user.imageUrl || "https://via.placeholder.com/100"} // Default image if none provided
                        alt="Profile"
                        className="w-24 h-24 rounded-full border-2 border-gray-200"
                    />
                    <div className="ml-6">
                        <h2 className="text-2xl font-semibold">{user.name}</h2>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                </div>

                <h3 className="text-xl font-semibold mb-4">Agreement Information</h3>
                <div className="space-y-4">
                    <p><strong>Floor:</strong> {agreement ? agreement.floorNo : "None"}</p>
                    <p><strong>Block:</strong> {agreement ? agreement.blockName : "None"}</p>
                    <p><strong>Apartment Number:</strong> {agreement ? agreement.apartmentNo : "None"}</p>
                    <p><strong>Rent:</strong> {agreement ? `$${agreement.rent}` : "None"}</p>
                    <p><strong>Status:</strong> {agreement ? agreement.status : "None"}</p>
                    <p><strong>Agreement Accepted Date:</strong> {agreement ? agreement.acceptedDate : "None"}</p>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;