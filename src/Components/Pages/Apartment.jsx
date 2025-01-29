import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Provider/AuthProvider";
import { Helmet } from "react-helmet";
import Swal from 'sweetalert2'; 

const Apartment = () => {
    const [apartments, setApartments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [apartmentsPerPage] = useState(6); 
    const [minRent, setMinRent] = useState('');
    const [maxRent, setMaxRent] = useState('');
    const [filteredApartments, setFilteredApartments] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        axios.get('https://estate-ease-server.vercel.app/apartments')
            .then(response => {
                setApartments(response.data);
                setFilteredApartments(response.data);
            })
            .catch(error => {
                console.error('Error fetching apartments data:', error);
            });
    }, []);

    // Logic to paginate apartments
    const indexOfLastApartment = currentPage * apartmentsPerPage;
    const indexOfFirstApartment = indexOfLastApartment - apartmentsPerPage;

    // Current apartments for the selected page after filtering
    const currentApartments = filteredApartments.slice(indexOfFirstApartment, indexOfLastApartment);

    const handleAgreementClick = (apartment) => {
        // Check if the user is admin
        if (user.role === 'admin') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Admins cannot create agreements',
            });
            return;
        }
    
        const agreementData = {
            userName: user.displayName, 
            userEmail: user.email,   
            floorNo: apartment.floorNo,
            blockName: apartment.blockName,
            apartmentNo: apartment.apartmentNo,
            rent: apartment.rent
        };
    
        axios.post('https://estate-ease-server.vercel.app/agreements', agreementData)
            .then(response => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Agreement created successfully',
                });
                console.log(response.data);
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an error creating the agreement',
                });
                console.error(error);
            });
    };

    const handleSearch = () => {
        // Filter apartments by rent range
        const filtered = apartments.filter(apt => {
            const rent = apt.rent;
            const isMinRentValid = minRent ? rent >= minRent : true;
            const isMaxRentValid = maxRent ? rent <= maxRent : true;
            return isMinRentValid && isMaxRentValid;
        });
        
        setFilteredApartments(filtered);
        setCurrentPage(1);
    };

    // Change page
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filteredApartments.length / apartmentsPerPage);

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <Helmet><title>Apartment | EstateEase </title></Helmet>
            <h1 className="text-4xl font-bold mb-6 text-center">Apartments</h1>

            {/* Rent Range Filters */}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center">
                    <label className="mr-2 text-lg font-semibold">Min Rent:</label>
                    <input 
                        type="number" 
                        value={minRent} 
                        onChange={(e) => setMinRent(e.target.value)} 
                        placeholder="Min Rent" 
                        className="p-2 border rounded w-full sm:w-auto" 
                    />
                </div>
                <div className="flex items-center">
                    <label className="mr-2 text-lg font-semibold">Max Rent:</label>
                    <input 
                        type="number" 
                        value={maxRent} 
                        onChange={(e) => setMaxRent(e.target.value)} 
                        placeholder="Max Rent" 
                        className="p-2 border rounded w-full sm:w-auto" 
                    />
                </div>
                {/* Search Button */}
                <button
                    className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto"
                    onClick={handleSearch}>
                    Search
                </button>
            </div>

            {currentApartments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentApartments.map((apt, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
                            {/* Apartment Image */}
                            <img 
                                src={apt.image} 
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
                                    onClick={() => handleAgreementClick(apt)} >
                                    Agreement
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center">No apartments match the search criteria.</p>
            )}

            {/* Pagination Controls */}
            <div className="mt-6 flex justify-center">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    className="px-4 py-2 mr-2 text-white bg-gray-600 rounded hover:bg-gray-700 disabled:opacity-50"
                    disabled={currentPage === 1}>
                    Previous
                </button>
                {[...Array(totalPages)].map((_, index) => (
                    <button 
                        key={index} 
                        onClick={() => handlePageChange(index + 1)} 
                        className={`px-4 py-2 mx-1 text-white ${currentPage === index + 1 ? 'bg-blue-600' : 'bg-gray-600'} rounded hover:bg-blue-700`}>
                        {index + 1}
                    </button>
                ))}
                <button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    className="px-4 py-2 ml-2 text-white bg-gray-600 rounded hover:bg-gray-700 disabled:opacity-50"
                    disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default Apartment;