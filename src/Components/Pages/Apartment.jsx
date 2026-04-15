import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import { Helmet } from "react-helmet";
import Swal from 'sweetalert2';
import { apiFetch } from '../../api/apiClient';
import ApartmentCard from './ApartmentCard';

const Apartment = () => {
    const [apartments, setApartments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [apartmentsPerPage] = useState(6);
    const [searchTerm, setSearchTerm] = useState('');
    const [minRent, setMinRent] = useState('');
    const [maxRent, setMaxRent] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedRating, setSelectedRating] = useState('');
    const [filteredApartments, setFilteredApartments] = useState([]);
    const [sortCriteria, setSortCriteria] = useState('');
    const [filterOptions, setFilterOptions] = useState({ statuses: [], locations: [], types: [] });
    const { user } = useContext(AuthContext);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true); // Added loading state

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [data, optionsData] = await Promise.all([
                    apiFetch('/apartments', { skipAuth: true }),
                    apiFetch('/apartments/filters/options', { skipAuth: true }),
                ]);
                const apartmentsArray = Array.isArray(data?.data) ? data.data : [];
                setApartments(apartmentsArray);
                setFilteredApartments(apartmentsArray);
                setFilterOptions({
                    statuses: optionsData?.statuses || [],
                    locations: optionsData?.locations || [],
                    types: optionsData?.types || [],
                });
                setLoading(false);
            } catch (error) {
                setApartments([]);
                setFilteredApartments([]);
                setFilterOptions({ statuses: [], locations: [], types: [] });
                console.error('Error fetching apartments:', error);
                setLoading(false);
            }
        };
        fetchData();

        if (user?.email) {
            apiFetch(`/users/${user.email}`).then(userData => {
                if (userData) setUserRole(userData.role);
            }).catch(error => console.error('Error fetching user:', error));
        }
    }, [user]);

    const indexOfLastApartment = currentPage * apartmentsPerPage;
    const indexOfFirstApartment = indexOfLastApartment - apartmentsPerPage;
    const currentApartments = filteredApartments.slice(indexOfFirstApartment, indexOfLastApartment);

    const sortApartments = (list, criteria) => {
        const getPrice = (item) => Number(item.rent ?? item?.meta?.price ?? 0);
        const getRating = (item) => Number(item.rating ?? item?.meta?.rating ?? 0);
        const getDate = (item) => new Date(item.createdAt ?? item?.meta?.date ?? 0).getTime();
        const getTitle = (item) => String(item.title ?? item.apartmentNo ?? '').toLowerCase();

        return [...list].sort((a, b) => {
            if (criteria === 'priceAsc') return getPrice(a) - getPrice(b);
            if (criteria === 'priceDesc') return getPrice(b) - getPrice(a);
            if (criteria === 'ratingDesc') return getRating(b) - getRating(a);
            if (criteria === 'dateDesc') return getDate(b) - getDate(a);
            if (criteria === 'dateAsc') return getDate(a) - getDate(b);
            if (criteria === 'titleAsc') return getTitle(a).localeCompare(getTitle(b));
            if (criteria === 'titleDesc') return getTitle(b).localeCompare(getTitle(a));
            return 0;
        });
    };

    const applyFilters = () => {
        const searchValue = searchTerm.trim().toLowerCase();
        const filtered = apartments.filter((apt) => {
            const titleMatch = searchValue
                ? [apt.apartmentNo, apt.blockName, apt.floorNo, apt.rent]
                    .some(value => String(value).toLowerCase().includes(searchValue))
                : true;

            const rent = Number(apt.rent) || 0;
            const isMinRentValid = minRent ? rent >= Number(minRent) : true;
            const isMaxRentValid = maxRent ? rent <= Number(maxRent) : true;
            const statusMatch = selectedStatus ? String(apt.status || apt?.meta?.status || '').toLowerCase() === selectedStatus.toLowerCase() : true;
            const locationMatch = selectedLocation ? String(apt.location || apt?.meta?.location || '').toLowerCase() === selectedLocation.toLowerCase() : true;
            const typeMatch = selectedType ? String(apt.type || apt?.meta?.type || '').toLowerCase() === selectedType.toLowerCase() : true;
            const ratingValue = Number(apt.rating || apt?.meta?.rating || 0);
            const ratingMatch = selectedRating ? ratingValue >= Number(selectedRating) : true;

            return titleMatch && isMinRentValid && isMaxRentValid && statusMatch && locationMatch && typeMatch && ratingMatch;
        });

        const sortedFiltered = sortApartments(filtered, sortCriteria);
        setFilteredApartments(sortedFiltered);
        setCurrentPage(1);
    };

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

        apiFetch('/agreements', {
            method: 'POST',
            body: JSON.stringify(agreementData)
        })
            .then(response => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Agreement created successfully',
                });
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'Each user is limited to one agreement. Please check your existing agreements.',
                });
            });
    };

    const handleSearch = () => {
        applyFilters();
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setMinRent('');
        setMaxRent('');
        setSelectedStatus('');
        setSelectedLocation('');
        setSelectedType('');
        setSelectedRating('');
        setSortCriteria('');
        setFilteredApartments(apartments);
        setCurrentPage(1);
    };

    const handleSort = (criteria) => {
        setSortCriteria(criteria);
        const sorted = sortApartments(filteredApartments, criteria);

        setFilteredApartments(sorted);
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filteredApartments.length / apartmentsPerPage);

    const uniqueStatusOptions = filterOptions.statuses.length > 0 ? filterOptions.statuses : ['available', 'pending', 'sold'];
    const uniqueLocationOptions = filterOptions.locations.length > 0 ? filterOptions.locations : [];
    const uniqueTypeOptions = filterOptions.types.length > 0 ? filterOptions.types : [];

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-base-100 text-base-content py-8">
                <div className="h-10 w-56 mx-auto rounded bg-gray-200 animate-pulse" />
                <div className="mt-8 mb-6 h-12 rounded bg-gray-200 animate-pulse" />
                <div className="mb-6 grid grid-cols-1 gap-4 rounded-xl border border-gray-200 p-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="h-12 rounded bg-gray-200 animate-pulse" />
                    <div className="h-12 rounded bg-gray-200 animate-pulse" />
                    <div className="h-12 rounded bg-gray-200 animate-pulse" />
                    <div className="h-12 rounded bg-gray-200 animate-pulse" />
                </div>
                <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                    <div className="h-11 flex-1 rounded bg-gray-200 animate-pulse" />
                    <div className="h-11 w-full rounded bg-gray-200 animate-pulse sm:w-40" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="rounded-xl border border-gray-100 p-6 shadow-sm">
                            <div className="h-48 w-full rounded-lg bg-gray-200 animate-pulse" />
                            <div className="mt-4 h-6 w-3/4 rounded bg-gray-200 animate-pulse" />
                            <div className="mt-3 space-y-2">
                                <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
                                <div className="h-4 w-5/6 rounded bg-gray-200 animate-pulse" />
                                <div className="h-4 w-2/3 rounded bg-gray-200 animate-pulse" />
                            </div>
                            <div className="mt-4 h-10 w-full rounded bg-gray-200 animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-base-100 text-base-content px-2 sm:px-4 md:px-8 max-w-screen-2xl mx-auto">
            <Helmet><title>Apartment | EstateEase </title></Helmet>
            <h1 className="text-4xl font-bold py-2 mb-2 text-center ">Apartments</h1>
            
            {/* Search bar */}
            <div className="mb-6">
                <label className="mb-2 block text-lg font-semibold">Search Apartments</label>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by apartment no, block, floor, or rent"
                    className="w-full rounded border p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
            </div>

            {/* Filters */}
            <div className="mb-6 rounded-xl border border-base-300 bg-base-200 p-4">
                <div className="mb-4 flex items-center justify-between gap-4 flex-wrap">
                    <h2 className="text-xl font-bold">Filters</h2>
                    <button
                        type="button"
                        onClick={handleResetFilters}
                        className="rounded-md border border-teal-600 px-4 py-2 text-sm font-semibold text-teal-600 transition-colors hover:bg-teal-50"
                    >
                        Reset Filters
                    </button>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                        <label className="mb-2 block text-sm font-semibold">Status</label>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            <option value="">All Status</option>
                            {uniqueStatusOptions.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-semibold">Location</label>
                        <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            <option value="">All Locations</option>
                            {uniqueLocationOptions.map((location) => (
                                <option key={location} value={location}>
                                    {location}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-semibold">Type</label>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            <option value="">All Types</option>
                            {uniqueTypeOptions.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-semibold">Minimum Rating</label>
                        <select
                            value={selectedRating}
                            onChange={(e) => setSelectedRating(e.target.value)}
                            className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            <option value="">Any Rating</option>
                            <option value="1">1+</option>
                            <option value="2">2+</option>
                            <option value="3">3+</option>
                            <option value="4">4+</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <button
                        type="button"
                        onClick={handleSearch}
                        className="rounded-md bg-teal-600 px-5 py-2 font-semibold text-white transition-colors hover:bg-teal-700"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>

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
            <option value="priceAsc" className="bg-black text-white">Price: Low to High</option>
            <option value="priceDesc" className="bg-black text-white">Price: High to Low</option>
            <option value="ratingDesc" className="bg-black text-white">Rating: High to Low</option>
            <option value="dateDesc" className="bg-black text-white">Date: Newest First</option>
            <option value="dateAsc" className="bg-black text-white">Date: Oldest First</option>
            <option value="titleAsc" className="bg-black text-white">Title: A to Z</option>
            <option value="titleDesc" className="bg-black text-white">Title: Z to A</option>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {currentApartments.map((apt, index) => (
                        <ApartmentCard
                            key={apt._id || index}
                            apartment={apt}
                            onAgreementClick={handleAgreementClick}
                        />
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