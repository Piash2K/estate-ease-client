import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { apiFetch } from '../../api/apiClient';

const ApartmentDetails = () => {
    const { id } = useParams();
    const [apartmentData, setApartmentData] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [detailsError, setDetailsError] = useState('');
    const [reviewError, setReviewError] = useState('');
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewForm, setReviewForm] = useState({
        userName: '',
        userEmail: '',
        rating: '5',
        comment: '',
    });

    useEffect(() => {
        const fetchApartmentDetails = async () => {
            if (!id) {
                setApartmentData(null);
                setDetailsError('Invalid apartment id');
                setLoading(false);
                return;
            }

            try {
                const response = await apiFetch(`/apartments/${id}`, { skipAuth: true });
                setApartmentData(response?.item ? response : null);
                setDetailsError('');
            } catch (error) {
                setApartmentData(null);
                setDetailsError(error?.message || 'Failed to load apartment details');
                console.error('Failed to load apartment details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchApartmentDetails();
    }, [id]);

    useEffect(() => {
        const fetchReviews = async () => {
            if (!id) return;

            try {
                const response = await apiFetch(`/apartments/${id}/reviews`, { skipAuth: true });
                const reviewList = Array.isArray(response) ? response : Array.isArray(response?.data) ? response.data : [];
                setReviews(reviewList);
                setReviewError('');
            } catch (error) {
                setReviews([]);
                setReviewError(error?.message || 'Failed to load reviews');
            }
        };

        fetchReviews();
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
                {detailsError ? <p className="mt-3 text-gray-600">{detailsError}</p> : null}
                <Link to="/apartment" className="mt-6 inline-block rounded-md bg-teal-600 px-5 py-2 font-semibold text-white hover:bg-teal-700">
                    Back to Apartments
                </Link>
            </div>
        );
    }

    const title = apartment?.title || `Apartment ${apartment?.apartmentNo || ''}`;
    const image = apartment?.image;
    const mediaItems = Array.isArray(apartmentData?.sections?.media) ? apartmentData.sections.media : [];
    const mediaImages = mediaItems
        .map((item) => {
            if (typeof item === 'string') return item;
            if (item && typeof item === 'object') return item.url || item.image || item.src || '';
            return '';
        })
        .filter(Boolean);
    const galleryImages = mediaImages.length > 0 ? mediaImages : [image].filter(Boolean);
    const overview = apartmentData?.sections?.overview || apartment?.overview || apartment?.description || 'No overview available.';
    const keyInformation = Array.isArray(apartmentData?.sections?.keyInformation) ? apartmentData.sections.keyInformation : [];
    const specs = Array.isArray(apartmentData?.sections?.specs) ? apartmentData.sections.specs : [];
    const rules = Array.isArray(apartmentData?.sections?.rules) ? apartmentData.sections.rules : [];
    const price = apartment?.meta?.price ?? apartment?.rent ?? 0;
    const rating = apartment?.meta?.rating ?? apartment?.rating ?? 0;
    const status = apartment?.meta?.status ?? apartment?.status ?? 'available';
    const location = apartment?.meta?.location ?? apartment?.location ?? 'N/A';
    const type = apartment?.meta?.type ?? apartment?.type ?? 'apartment';

    const renderListItems = (items) =>
        items.map((item, index) => {
            if (typeof item === 'string') {
                return <li key={`${item}-${index}`}>{item}</li>;
            }

            if (item && typeof item === 'object') {
                const objectValue = item.label || item.name || item.title || item.key;
                const objectDetail = item.value || item.detail || item.description;
                if (objectValue && objectDetail) {
                    return <li key={`${objectValue}-${index}`}><span className="font-semibold">{objectValue}:</span> {objectDetail}</li>;
                }
                if (objectValue) {
                    return <li key={`${objectValue}-${index}`}>{objectValue}</li>;
                }
            }

            return null;
        });

    const handleReviewInputChange = (event) => {
        const { name, value } = event.target;
        setReviewForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleReviewSubmit = async (event) => {
        event.preventDefault();

        if (!reviewForm.comment.trim()) {
            setReviewError('Comment is required');
            return;
        }

        setReviewSubmitting(true);
        try {
            await apiFetch(`/apartments/${id}/reviews`, {
                method: 'POST',
                skipAuth: true,
                body: JSON.stringify({
                    userName: reviewForm.userName,
                    userEmail: reviewForm.userEmail,
                    rating: Number(reviewForm.rating),
                    comment: reviewForm.comment,
                }),
            });

            const response = await apiFetch(`/apartments/${id}/reviews`, { skipAuth: true });
            const reviewList = Array.isArray(response) ? response : Array.isArray(response?.data) ? response.data : [];
            setReviews(reviewList);
            setReviewForm({ userName: '', userEmail: '', rating: '5', comment: '' });
            setReviewError('');
        } catch (error) {
            setReviewError(error?.message || 'Failed to submit review');
        } finally {
            setReviewSubmitting(false);
        }
    };

    return (
        <div className="mx-auto w-11/12 py-10 md:w-9/12">
            <Helmet><title>{title} | EstateEase</title></Helmet>

            <Link to="/apartment" className="mb-6 inline-block rounded-md border border-teal-600 px-4 py-2 font-semibold text-teal-600 hover:bg-teal-50">
                Back to Apartments
            </Link>

            <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                {galleryImages.length > 1 ? (
                    <Carousel showArrows showStatus={false} showThumbs={false} infiniteLoop swipeable>
                        {galleryImages.map((mediaUrl, index) => (
                            <div key={`${mediaUrl}-${index}`} className="h-80">
                                <img src={mediaUrl} alt={`${title} ${index + 1}`} className="h-full w-full object-cover" />
                            </div>
                        ))}
                    </Carousel>
                ) : (
                    <img src={galleryImages[0] || image} alt={title} className="h-80 w-full object-cover" />
                )}
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

                    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="rounded-lg border border-gray-100 p-5">
                            <h2 className="text-xl font-bold text-gray-900">Key Information</h2>
                            {keyInformation.length > 0 ? (
                                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
                                    {renderListItems(keyInformation)}
                                </ul>
                            ) : (
                                <p className="mt-3 text-sm text-gray-600">No key information provided.</p>
                            )}
                        </div>

                        <div className="rounded-lg border border-gray-100 p-5">
                            <h2 className="text-xl font-bold text-gray-900">Specs</h2>
                            {specs.length > 0 ? (
                                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
                                    {renderListItems(specs)}
                                </ul>
                            ) : (
                                <p className="mt-3 text-sm text-gray-600">No specs provided.</p>
                            )}
                        </div>

                        <div className="rounded-lg border border-gray-100 p-5">
                            <h2 className="text-xl font-bold text-gray-900">Rules</h2>
                            {rules.length > 0 ? (
                                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
                                    {renderListItems(rules)}
                                </ul>
                            ) : (
                                <p className="mt-3 text-sm text-gray-600">No rules provided.</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-10 rounded-lg border border-gray-100 p-5">
                        <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>

                        {reviews.length > 0 ? (
                            <div className="mt-4 space-y-4">
                                {reviews.map((review, index) => (
                                    <div key={`${review?._id || review?.createdAt || 'review'}-${index}`} className="rounded-lg border border-gray-100 p-4">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <p className="font-semibold text-gray-900">{review?.userName || 'Anonymous'}</p>
                                            <p className="text-sm text-gray-600">Rating: {Number(review?.rating || 0).toFixed(1)}</p>
                                        </div>
                                        <p className="mt-2 text-gray-700">{review?.comment}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-4 text-sm text-gray-600">No reviews yet.</p>
                        )}

                        <form onSubmit={handleReviewSubmit} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <input
                                type="text"
                                name="userName"
                                value={reviewForm.userName}
                                onChange={handleReviewInputChange}
                                placeholder="Your name"
                                className="rounded-md border p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                            <input
                                type="email"
                                name="userEmail"
                                value={reviewForm.userEmail}
                                onChange={handleReviewInputChange}
                                placeholder="Your email"
                                className="rounded-md border p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                            <select
                                name="rating"
                                value={reviewForm.rating}
                                onChange={handleReviewInputChange}
                                className="rounded-md border p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                                <option value="5">5</option>
                                <option value="4">4</option>
                                <option value="3">3</option>
                                <option value="2">2</option>
                                <option value="1">1</option>
                            </select>
                            <div className="md:col-span-2">
                                <textarea
                                    name="comment"
                                    value={reviewForm.comment}
                                    onChange={handleReviewInputChange}
                                    placeholder="Write your review"
                                    rows={4}
                                    className="w-full rounded-md border p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            {reviewError ? <p className="md:col-span-2 text-sm text-red-600">{reviewError}</p> : null}

                            <button
                                type="submit"
                                disabled={reviewSubmitting}
                                className="md:col-span-2 rounded-md bg-teal-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-60"
                            >
                                {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApartmentDetails;
