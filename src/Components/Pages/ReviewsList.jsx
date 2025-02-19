import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const ReviewsList = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            setError(null);

            axios.get('https://estate-ease-server.vercel.app/reviews')
                .then(response => {
                    setReviews(response.data);
                    setLoading(false);
                })
                .catch(() => {
                    setError('Failed to fetch reviews');
                    setLoading(false);
                });
        };

        fetchReviews();
    }, []);

    if (loading) return <div>Loading reviews...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">User Reviews</h2>
            <div className="mt-4">
                {reviews.length > 0 ? (
                    <Swiper
                        spaceBetween={30}
                        slidesPerView={3}
                        loop={true}
                        pagination={{ clickable: true }}
                        navigation
                        autoplay={{ delay: 3000 }} 
                    >
                        {reviews.map((review) => (
                            <SwiperSlide key={review._id}>
                                <div className=" p-4 rounded-md shadow-md h-full flex flex-col justify-between">
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={review.userImage}
                                            alt={review.userName}
                                            className="w-12 h-12 rounded-full"
                                        />
                                        <div>
                                            <h3 className="font-semibold">{review.userName}</h3>
                                            <p className="text-sm ">{new Date(review.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex-grow">
                                        <p>{review.comment}</p>
                                    </div>
                                    <div className="mt-2 flex items-center">
                                        <span className="text-yellow-500">
                                            {'★'.repeat(review.rating)}
                                            {'☆'.repeat(5 - review.rating)}
                                        </span>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <p>No reviews available</p>
                )}
            </div>
        </div>
    );
};

export default ReviewsList;