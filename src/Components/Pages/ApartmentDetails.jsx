import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { apiFetch } from '../../api/apiClient';

const ApartmentDetails = () => {
    const { id } = useParams();
    const [apartmentData, setApartmentData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApartmentDetails = async () => {
            try {
                const response = await apiFetch(`/apartments/${id}`, { skipAuth: true });
                setApartmentData(response || null);
            } catch (error) {
                setApartmentData(null);
                console.error('Failed to load apartment details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchApartmentDetails();
    }, [id]);

    const apartment = apartmentData?.item;

    if (loading) {
        return (
            <div className="mx-auto w-11/12 py-10 md:w-9/12">
                <div className="h-10 w-64 rounded bg-gray-200 animate-pulse" />
                <div className="mt-6 h-72 w-full rounded-xl bg-gray-200 animate-pulse" />
                <div className="mt-6 h-6 w-2/3 rounded bg-gray-200 animate-pulse" />
                <div className="mt-3 h-6 w-1/2 rounded bg-gray-200 animate-pulse" />
                <div className="mt-3 h-20 w-full rounded bg-gray-200 animate-pulse" />
            </div>
        );
    }

    if (!apartment) {
        return (
            <div className="mx-auto w-11/12 py-12 text-center md:w-9/12">
                <h2 className="text-3xl font-bold">Apartment not found</h2>
                <Link to="/apartment" className="mt-6 inline-block rounded-md bg-teal-600 px-5 py-2 font-semibold text-white hover:bg-teal-700">
                    Back to Apartments
                </Link>
            </div>
        );
    }

    const title = apartment?.title || `Apartment ${apartment?.apartmentNo || ''}`;
    const image = apartment?.image;
    const overview = apartmentData?.sections?.overview || apartment?.overview || apartment?.description || 'No overview available.';
    const price = apartment?.meta?.price ?? apartment?.rent ?? 0;
    const rating = apartment?.meta?.rating ?? apartment?.rating ?? 0;
    const status = apartment?.meta?.status ?? apartment?.status ?? 'available';
    const location = apartment?.meta?.location ?? apartment?.location ?? 'N/A';
    const type = apartment?.meta?.type ?? apartment?.type ?? 'apartment';

    return (
        <div className="mx-auto w-11/12 py-10 md:w-9/12">
            <Helmet><title>{title} | EstateEase</title></Helmet>

            <Link to="/apartment" className="mb-6 inline-block rounded-md border border-teal-600 px-4 py-2 font-semibold text-teal-600 hover:bg-teal-50">
                Back to Apartments
            </Link>

            <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                <img src={image} alt={title} className="h-80 w-full object-cover" />
                <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                    <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-gray-700 sm:grid-cols-2 lg:grid-cols-3">
                        <p>Floor: {apartment?.floorNo || 'N/A'}</p>
                        <p>Block: {apartment?.blockName || 'N/A'}</p>
                        <p>Status: {String(status)}</p>
                        <p>Type: {String(type)}</p>
                        <p>Location: {String(location)}</p>
                        <p>Rating: {Number(rating).toFixed(1)}</p>
                    </div>
                    <p className="mt-4 text-2xl font-bold text-teal-600">Price: ${price}</p>
                    <p className="mt-4 leading-7 text-gray-700">{overview}</p>
                </div>
            </div>
        </div>
    );
};

export default ApartmentDetails;
