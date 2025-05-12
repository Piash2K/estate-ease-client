import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Provider/AuthProvider";
import { Helmet } from "react-helmet";
import Swal from 'sweetalert2';
import { Bars } from 'react-loader-spinner'; // Add the Bars spinner import

const Apartment = () => {
    const [apartments, setApartments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [apartmentsPerPage] = useState(6);
    const [minRent, setMinRent] = useState('');
    const [maxRent, setMaxRent] = useState('');
    const [filteredApartments, setFilteredApartments] = useState([]);
    const [sortCriteria, setSortCriteria] = useState('');
    const { user } = useContext(AuthContext);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true); // Added loading state

    useEffect(() => {
        axios.get('https://estate-ease-server.vercel.app/apartments')
            .then(response => {
                setApartments(response.data);
                setFilteredApartments(response.data);
                setLoading(false); // Set loading to false once data is fetched
            })
            .catch(error => {
                console.error('Error fetching apartments data:', error);
                setLoading(false); // Ensure loading is false even if there's an error
            });

        if (user) {
            axios.get(`https://estate-ease-server.vercel.app/users?email=${user.email}`)
                .then(response => {
                    const userData = response.data.find(u => u.email === user.email);
                    if (userData) {
                        setUserRole(userData.role);
                    }
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                });
        }
    }, [user]);

    const indexOfLastApartment = currentPage * apartmentsPerPage;
    const indexOfFirstApartment = indexOfLastApartment - apartmentsPerPage;
    const currentApartments = filteredApartments.slice(indexOfFirstApartment, indexOfLastApartment);

    const handleAgreementClick = (apartment) => {
        if (!user) {
            Swal.fire({
                icon: 'error',
                title: 'Please Log In',
                text: 'You need to log in to create an agreement.',
            });
            return;
        }

        if (userRole === 'admin') {
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
                    text: 'Each user is limited to one agreement. Please check your existing agreements.',
                });
                console.error(error);
            });
    };

    const handleSearch = () => {
        const filtered = apartments.filter(apt => {
            const rent = apt.rent;
            const isMinRentValid = minRent ? rent >= minRent : true;
            const isMaxRentValid = maxRent ? rent <= maxRent : true;
            return isMinRentValid && isMaxRentValid;
        });

        setFilteredApartments(filtered);
        setCurrentPage(1);
    };

    const handleSort = (criteria) => {
        setSortCriteria(criteria);

        const sorted = [...filteredApartments].sort((a, b) => {
            if (criteria === 'rentAsc') {
                return a.rent - b.rent;
            } else if (criteria === 'rentDesc') {
                return b.rent - a.rent;
            } else if (criteria === 'apartmentNoAsc') {
                return a.apartmentNo - b.apartmentNo;
            } else if (criteria === 'apartmentNoDesc') {
                return b.apartmentNo - a.apartmentNo;
            } else {
                return 0;
            }
        });

        setFilteredApartments(sorted);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filteredApartments.length / apartmentsPerPage);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Bars
                    height="80"
                    width="80"
                    color="#14B8A6"
                    ariaLabel="bars-loading"
                    wrapperStyle={{}}
                    visible={true}
                />
            </div>
        );
    }

    return (
        <div className="w-11/12 md:w-9/12 mx-auto py-8">
            <Helmet><title>Apartment | EstateEase </title></Helmet>
            <h1 className="text-4xl font-bold py-8 mb-6 text-center ">Apartments</h1>
            
            {/* Sorting controls */}
            <div className="mb-6 flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-4">
    <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto">
        <label className="mr-2 text-lg font-semibold">Sort by:</label>
        <select
            value={sortCriteria}
            onChange={(e) => handleSort(e.target.value)}
            className="p-2 border rounded w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-teal-500 "
        >
            <option value="" className="bg-black text-white">Select</option>
            <option value="rentAsc" className="bg-black text-white">Rent: Low to High</option>
            <option value="rentDesc" className="bg-black text-white">Rent: High to Low</option>
            <option value="apartmentNoAsc" className="bg-black text-white">Apartment No: Ascending</option>
            <option value="apartmentNoDesc" className="bg-black text-white">Apartment No: Descending</option>
        </select>
    </div>

    <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto">
        <label className="mr-2 text-lg font-semibold">Min Rent:</label>
        <input
            type="number"
            value={minRent}
            onChange={(e) => setMinRent(e.target.value)}
            placeholder="Min Rent"
            className="p-2 border rounded w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
    </div>

    <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto">
        <label className="mr-2 text-lg font-semibold">Max Rent:</label>
        <input
            type="number"
            value={maxRent}
            onChange={(e) => setMaxRent(e.target.value)}
            placeholder="Max Rent"
            className="p-2 border rounded w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
    </div>

    <button
        className="px-4 py-2 bg-teal-600 text-white font-bold rounded-md hover:bg-teal-700 transition-colors w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-teal-500"
        onClick={handleSearch}
    >
        Search
    </button>
</div>

            {currentApartments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentApartments.map((apt, index) => (
                        <div key={index} className=" p-6 rounded-xl shadow-xl hover:shadow-2xl transition-shadow transform hover:scale-105 border border-gray-100">
                            <img 
                                src={apt.image} 
                                alt={`Apartment ${apt.apartmentNo}`} 
                                className="w-full h-48 object-cover rounded-lg"
                            />
                            <div className="mt-4">
                                <h3 className="text-xl font-semibold text-gray-800">{apt.apartmentNo}</h3>
                                <p className="text-sm ">Floor: {apt.floorNo}</p>
                                <p className="text-sm ">Block: {apt.blockName}</p>
                                <p className="text-lg font-semibold text-teal-600 mt-2">Rent: ${apt.rent}</p>
                                <button
                                    className="mt-4 px-4 py-2 bg-teal-600 text-white font-bold rounded-md w-full hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    onClick={() => handleAgreementClick(apt)} >
                                    Agreement
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-600">No apartments match the search criteria.</p>
            )}

            <div className="mt-6 flex justify-center">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    className="px-4 py-2 mr-2 text-white bg-gray-600 rounded hover:bg-gray-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    disabled={currentPage === 1}>
                    Previous
                </button>
                {[...Array(totalPages)].map((_, index) => (
                    <button 
                        key={index} 
                        onClick={() => handlePageChange(index + 1)} 
                        className={`px-4 py-2 mx-1 text-white ${currentPage === index + 1 ? 'bg-teal-600' : 'bg-gray-600'} rounded hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500`}>
                        {index + 1}
                    </button>
                ))}
                <button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    className="px-4 py-2 ml-2 text-white bg-gray-600 rounded hover:bg-gray-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default Apartment;