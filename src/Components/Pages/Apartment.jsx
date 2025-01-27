import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Provider/AuthProvider";


const Apartment = () => {
    const [apartments, setApartments] = useState([]);
    const { user } = useContext(AuthContext);
    console.log(user)

    useEffect(() => {
        axios.get('http://localhost:5000/apartments')
            .then(response => {
                setApartments(response.data);
            })
            .catch(error => {
                console.error('Error fetching apartments data:', error);
            });
    }, []);

    const handleAgreementClick = (apartment) => {
        const agreementData = {
            userName: user.displayName, 
            userEmail: user.email,   
            floorNo: apartment.floorNo,
            blockName: apartment.blockName,
            apartmentNo: apartment.apartmentNo,
            rent: apartment.rent
        };

        axios.post('http://localhost:5000/agreements', agreementData)
            .then(response => {
                alert('Agreement created successfully');
                console.log(response.data);
            })
            .catch(error => {
                alert('There was an error creating the agreement');
                console.error(error);
            });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-4xl font-bold mb-6 text-center">Apartments</h1>
            {apartments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {apartments.map((apt, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
                            {/* Apartment Image */}
                            <img 
                                src={apt.imageUrl} 
                                alt={`Apartment ${apt.apartmentNo}`} 
                                className="w-full h-48 object-cover rounded-t-lg"
                            />
                            
                            {/* Apartment Details */}
                            <div className="mt-4">
                                <h3 className="text-xl font-semibold">{apt.apartmentNo}</h3>
                                <p className="text-sm text-gray-500">Floor: {apt.floorNo}</p>
                                <p className="text-sm text-gray-500">Block: {apt.blockName}</p>
                                <p className="text-lg font-semibold text-green-600 mt-2">Rent: ${apt.rent}</p>
                                
                                {/* Agreement Button */}
                                <button
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white font-bold rounded-md w-full hover:bg-blue-700 transition-colors"
                                    onClick={() => handleAgreementClick(apt)}>
                                    View Agreement
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center">Loading apartments...</p>
            )}
        </div>
    );
};

export default Apartment;
