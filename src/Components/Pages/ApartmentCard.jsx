const ApartmentCard = ({ apartment, onAgreementClick }) => {
    const title = apartment?.title || `Apartment ${apartment?.apartmentNo || ''}`;
    const shortDescription = apartment?.shortDescription || apartment?.overview || apartment?.description || 'Comfortable apartment with modern amenities.';

    const price = apartment?.meta?.price ?? apartment?.rent ?? 0;
    const rating = apartment?.meta?.rating ?? apartment?.rating ?? 0;
    const status = apartment?.meta?.status ?? apartment?.status ?? 'available';
    const location = apartment?.meta?.location ?? apartment?.location ?? 'N/A';
    const type = apartment?.meta?.type ?? apartment?.type ?? 'apartment';

    return (
        <div className="h-full rounded-xl border border-gray-100 p-6 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <img
                src={apartment?.image}
                alt={title}
                className="h-48 w-full rounded-lg object-cover"
            />
            <div className="mt-4 flex h-[calc(100%-12rem)] flex-col">
                <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-gray-600">{shortDescription}</p>

                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-700">
                    <p>Floor: {apartment?.floorNo || 'N/A'}</p>
                    <p>Block: {apartment?.blockName || 'N/A'}</p>
                    <p>Type: {String(type)}</p>
                    <p>Status: {String(status)}</p>
                    <p>Rating: {Number(rating).toFixed(1)}</p>
                    <p>Location: {String(location)}</p>
                </div>

                <p className="mt-3 text-lg font-semibold text-teal-600">Price: ${price}</p>

                <button
                    className="mt-4 w-full rounded-md bg-teal-600 px-4 py-2 font-bold text-white transition-colors hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    onClick={() => onAgreementClick(apartment)}
                >
                    Agreement
                </button>
            </div>
        </div>
    );
};

export default ApartmentCard;
