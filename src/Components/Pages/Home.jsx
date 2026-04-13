import { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // For carousel styling
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import Banner1 from './../../assets/Banner1.jpeg'
import Banner2 from './../../assets/Banner-2.jpg'
import Banner3 from './../../assets/Banner3.jpeg'
import { Helmet } from 'react-helmet';
import { FaDumbbell, FaParking, FaShieldAlt, FaUmbrellaBeach, FaWifi, FaBuilding, FaKey, FaCreditCard, FaBullhorn, FaPaperPlane } from 'react-icons/fa';
import Swal from 'sweetalert2';
import ReviewsList from './ReviewsList';
import { apiFetch } from '../../api/apiClient';

const Home = () => {
    const [coupons, setCoupons] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [apartments, setApartments] = useState([]);
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [dashboardOverview, setDashboardOverview] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const apartmentLocationIcon = new Icon({
        iconUrl: markerIcon,
        iconRetinaUrl: markerIcon2x,
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    const bannerImages = [
        Banner1,
        Banner2,
        Banner3,
    ];

    // Fetch data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [couponsData, announcementsData, apartmentsData, reviewsData, blogsData] = await Promise.all([
                    apiFetch('/coupons', { skipAuth: true }),
                    apiFetch('/announcements', { skipAuth: true }),
                    apiFetch('/apartments', { skipAuth: true }),
                    apiFetch('/reviews', { skipAuth: true }),
                    apiFetch('/blogs?limit=3', { skipAuth: true }),
                ]);
                const filterOptionsData = await apiFetch('/apartments/filters/options', { skipAuth: true });
                const overviewData = await apiFetch('/public/overview', { skipAuth: true });

                const apartmentsResult = Array.isArray(apartmentsData?.data) ? apartmentsData.data : [];
                const blogsResult = Array.isArray(blogsData?.data) ? blogsData.data : [];

                setCoupons(Array.isArray(couponsData) ? couponsData : []);
                setAnnouncements(Array.isArray(announcementsData) ? announcementsData : []);
                setApartments(apartmentsResult);
                setReviews(Array.isArray(reviewsData) ? reviewsData : []);
                setBlogs(blogsResult);
                setPropertyTypes(Array.isArray(filterOptionsData?.types) ? filterOptionsData.types : []);
                setDashboardOverview(overviewData || null);
            } catch (error) {
                setCoupons([]);
                setAnnouncements([]);
                setApartments([]);
                setReviews([]);
                setBlogs([]);
                setPropertyTypes([]);
                setDashboardOverview(null);
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    // Automatic slider feature
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
        }, 5000); // Change image every 5 seconds
        return () => clearInterval(interval);
    }, [bannerImages.length]);

    const handleNewsletterSubscribe = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailPattern.test(newsletterEmail.trim())) {
            Swal.fire({
                icon: 'success',
                title: 'Subscribed Successfully!',
                text: 'You will receive apartment updates and announcements.',
                confirmButtonColor: '#0E9F9F',
            });
            setNewsletterEmail('');
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Email!',
                text: 'Please enter a valid email address.',
                confirmButtonColor: '#FF4C4C',
            });
        }
    };

    return (
        <div>
            <Helmet><title>Home | EstateEase </title></Helmet>
            {/* Fancy Banner */}
            <section className="relative">
    <div className="carousel-wrapper">
        <Carousel
            selectedItem={currentImageIndex}
            autoPlay
            interval={5000}
            infiniteLoop
            showArrows={false}
            showStatus={false}
            showThumbs={false}
        >
            {bannerImages.map((image, index) => (
                <div key={index} className="w-full h-[300px] sm:h-[450px] lg:h-[760px]">
                    <img src={image} alt={`banner-${index}`} className="w-full h-full object-fill" />
                </div>
            ))}
        </Carousel>
    </div>
</section>


            <div className='w-11/12 md:w-9/12 mx-auto'>
                {/* About the Building */}
                <section className="w-full py-20">
                    <div>
                        <h2 className="text-4xl font-bold  text-center mb-8">
                            About the Building
                        </h2>
                        <p className="text-xl font-medium leading-relaxed max-w-2xl mx-auto text-center">
                            A premium living experience blending modern luxury with cutting-edge design. Our building offers residents top-tier amenities
                            and spacious, thoughtfully crafted apartments, designed to maximize comfort and style.
                        </p>
                        <p className="mt-8 text-2xl font-light italic text-center max-w-2xl mx-auto">
                            “Where modern design meets timeless comfort.”
                        </p>
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className=" p-8 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-300">
                                <FaShieldAlt className="text-5xl text-[#0E9F9F] mb-6" />
                                <h3 className="text-2xl font-bold mb-4">24/7 Security</h3>
                                <p className="text-lg">
                                    State-of-the-art surveillance and security systems to ensure your safety at all times.
                                </p>
                            </div>
                            <div className="p-8 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-300">
                                <FaDumbbell className="text-5xl text-[#0E9F9F] mb-6" /> {/* Teal */}
                                <h3 className="text-2xl font-bold mb-4">Fitness Center</h3>
                                <p className="text-lg ">
                                    A fully-equipped modern gym to help you stay fit and healthy.
                                </p>
                            </div>

                            {/* Rooftop Lounge */}
                            <div className="p-8 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-300">
                                <FaUmbrellaBeach className="text-5xl text-[#0E9F9F] mb-6" />
                                <h3 className="text-2xl font-bold  mb-4">Rooftop Lounge</h3>
                                <p className="text-lg ">
                                    A serene rooftop space to relax and enjoy stunning views of the city.
                                </p>
                            </div>
                            <div className="p-8 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-300">
                                <FaWifi className="text-5xl text-[#0E9F9F] mb-6" /> 
                                <h3 className="text-2xl font-bold  mb-4">High-Speed Internet</h3>
                                <p className="text-lg ">
                                    Seamless connectivity with high-speed Wi-Fi and smart home integration.
                                </p>
                            </div>

                            {/* Spacious Parking */}
                            <div className="p-8 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-300">
                                <FaParking className="text-5xl text-[#0E9F9F] mb-6" /> {/* Teal */}
                                <h3 className="text-2xl font-bold mb-4">Spacious Parking</h3>
                                <p className="text-lg">
                                    Ample parking space for residents and guests, ensuring convenience.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Platform Highlights */}
                <section className="w-full py-20">
                    <div>
                        <h2 className="text-4xl font-bold text-center mb-8">
                            Why Choose EstateEase
                        </h2>
                        <p className="text-xl font-medium leading-relaxed max-w-2xl mx-auto text-center">
                            Everything is set up to make apartment browsing, booking, and living easier for residents, members, and administrators.
                        </p>
                        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="p-8 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-300">
                                <FaBuilding className="text-5xl text-[#0E9F9F] mb-6" />
                                <h3 className="text-2xl font-bold mb-4">Apartment Listings</h3>
                                <p className="text-lg">
                                    Browse available apartments with a simple, responsive listing experience.
                                </p>
                            </div>
                            <div className="p-8 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-300">
                                <FaKey className="text-5xl text-[#0E9F9F] mb-6" />
                                <h3 className="text-2xl font-bold mb-4">Rental Agreements</h3>
                                <p className="text-lg">
                                    Request apartments through a clear agreement flow handled inside the app.
                                </p>
                            </div>
                            <div className="p-8 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-300">
                                <FaCreditCard className="text-5xl text-[#0E9F9F] mb-6" />
                                <h3 className="text-2xl font-bold mb-4">Secure Payments</h3>
                                <p className="text-lg">
                                    Pay rent with Stripe and apply coupons for a smoother checkout experience.
                                </p>
                            </div>
                            <div className="p-8 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-300">
                                <FaBullhorn className="text-5xl text-[#0E9F9F] mb-6" />
                                <h3 className="text-2xl font-bold mb-4">Announcements</h3>
                                <p className="text-lg">
                                    Stay updated with notices and important messages shared by the admin team.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Trust Section */}
                <section className="w-full pb-20">
                    <div className="rounded-2xl border border-[#0E9F9F]/20 bg-[#0E9F9F]/5 px-6 py-10 sm:px-10">
                        <h2 className="text-4xl font-bold text-center mb-4">
                            Built for a Better Resident Experience
                        </h2>
                        <p className="text-xl font-medium leading-relaxed max-w-2xl mx-auto text-center">
                            A clean booking flow, secure payment handling, and timely updates keep everything organized in one place.
                        </p>
                        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-xl bg-white/70 p-6 text-center shadow-sm">
                                <p className="text-4xl font-bold text-[#0E9F9F]">24/7</p>
                                <p className="mt-2 text-lg font-semibold">Building Security</p>
                            </div>
                            <div className="rounded-xl bg-white/70 p-6 text-center shadow-sm">
                                <p className="text-4xl font-bold text-[#0E9F9F]">100%</p>
                                <p className="mt-2 text-lg font-semibold">Online Requests</p>
                            </div>
                            <div className="rounded-xl bg-white/70 p-6 text-center shadow-sm">
                                <p className="text-4xl font-bold text-[#0E9F9F]">Stripe</p>
                                <p className="mt-2 text-lg font-semibold">Secure Checkout</p>
                            </div>
                            <div className="rounded-xl bg-white/70 p-6 text-center shadow-sm">
                                <p className="text-4xl font-bold text-[#0E9F9F]">Live</p>
                                <p className="mt-2 text-lg font-semibold">Announcements</p>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Featured Apartments */}
                <section className="w-full pb-20">
                    <div>
                        <h2 className="text-4xl font-bold text-center mb-4">
                            Featured Apartments
                        </h2>
                        <p className="text-xl font-medium leading-relaxed max-w-2xl mx-auto text-center">
                            A quick look at some available units so visitors can move from browsing to booking faster.
                        </p>
                        {apartments.length > 0 ? (
                            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {apartments.slice(0, 3).map((apartment, index) => (
                                    <div key={apartment._id || index} className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                                        <img
                                            src={apartment.image}
                                            alt={`Apartment ${apartment.apartmentNo}`}
                                            className="h-56 w-full object-cover"
                                        />
                                        <div className="p-6">
                                            <h3 className="text-2xl font-semibold text-gray-900">Apartment {apartment.apartmentNo}</h3>
                                            <p className="mt-2 text-lg text-gray-700">Floor: {apartment.floorNo}</p>
                                            <p className="text-lg text-gray-700">Block: {apartment.blockName}</p>
                                            <p className="mt-4 text-2xl font-bold text-[#0E9F9F]">${apartment.rent}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                        <div className="mt-8 flex justify-center">
                            <Link to="/apartment" className="inline-flex items-center rounded-lg bg-[#0E9F9F] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#14B8B8]">
                                View All Apartments
                            </Link>
                        </div>
                    </div>
                </section>
                {/* Property Categories */}
                <section className="w-full pb-20">
                    <div>
                        <h2 className="text-4xl font-bold text-center mb-4">
                            Property Categories
                        </h2>
                        <p className="text-xl font-medium leading-relaxed max-w-2xl mx-auto text-center">
                            Explore apartment types available in the building so visitors can quickly find the option that fits their needs.
                        </p>
                        {propertyTypes.length > 0 ? (
                            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {propertyTypes.slice(0, 8).map((type, index) => {
                                    const typeName = String(type || 'apartment');
                                    const displayName = typeName.charAt(0).toUpperCase() + typeName.slice(1);

                                    return (
                                        <div
                                            key={`${typeName}-${index}`}
                                            className="rounded-2xl border border-gray-100 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                                        >
                                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#0E9F9F]/10 text-[#0E9F9F]">
                                                <FaBuilding className="text-2xl" />
                                            </div>
                                            <h3 className="text-2xl font-semibold mb-3">{displayName}</h3>
                                            <p className="text-lg text-gray-700">
                                                Browse {displayName.toLowerCase()} options available for residents and new applicants.
                                            </p>
                                            <div className="mt-5">
                                                <Link
                                                    to="/apartment"
                                                    className="inline-flex items-center rounded-lg bg-[#0E9F9F] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#14B8B8]"
                                                >
                                                    Explore
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="mt-10 rounded-2xl border border-dashed border-gray-200 p-8 text-center text-lg text-gray-600">
                                Property categories will appear here once apartment type data is available.
                            </div>
                        )}
                    </div>
                </section>
                {/* Live Statistics */}
                <section className="w-full pb-20">
                    <div className="rounded-2xl border border-gray-100 bg-white px-6 py-10 shadow-sm sm:px-10">
                        <h2 className="text-4xl font-bold text-center mb-4">
                            Live Statistics
                        </h2>
                        <p className="text-xl font-medium leading-relaxed max-w-2xl mx-auto text-center">
                            Real-time numbers that reflect current apartments, community activity, and booking updates.
                        </p>
                        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-xl border border-gray-100 p-6 text-center">
                                <p className="text-4xl font-bold text-[#0E9F9F]">{dashboardOverview?.totalApartments ?? apartments.length}</p>
                                <p className="mt-2 text-lg font-semibold">Available Apartments</p>
                            </div>
                            <div className="rounded-xl border border-gray-100 p-6 text-center">
                                <p className="text-4xl font-bold text-[#0E9F9F]">{dashboardOverview?.totalAnnouncements ?? announcements.length}</p>
                                <p className="mt-2 text-lg font-semibold">Announcements</p>
                            </div>
                            <div className="rounded-xl border border-gray-100 p-6 text-center">
                                <p className="text-4xl font-bold text-[#0E9F9F]">{dashboardOverview?.totalPublishedBlogs ?? blogs.length}</p>
                                <p className="mt-2 text-lg font-semibold">Published Blogs</p>
                            </div>
                            <div className="rounded-xl border border-gray-100 p-6 text-center">
                                <p className="text-4xl font-bold text-[#0E9F9F]">{Number(dashboardOverview?.averageRating ?? 0).toFixed(1)}</p>
                                <p className="mt-2 text-lg font-semibold">Average Rating</p>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Coupons Section */}
                <section className="w-full pb-20">
                    <h2 className="text-4xl font-bold text-center mb-12">
                        Exclusive Coupons
                    </h2>
                    <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {coupons.map((coupon, index) => (
                                <div
                                    key={index}
                                    className="relative  p-8 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 group"
                                >
                                    {/* Coupon Code */}
                                    <div className="absolute top-4 right-4 bg-[#0E9F9F] px-3 py-1 rounded-full text-sm font-semibold">
                                        {coupon.code}
                                    </div>

                                    {/* Discount */}
                                    <p className="text-4xl font-bold text-[#0E9F9F] mb-4">
                                        {coupon.discount}% OFF
                                    </p>

                                    {/* Description */}
                                    <p className="text-lg mb-6">
                                        {coupon.description}
                                    </p>

                                    {/* CTA Button */}
                                    <button
                                        className="w-full bg-[#0E9F9F]  py-3 rounded-lg font-semibold hover:bg-[#14B8B8] transition-colors duration-300"
                                        onClick={() => {
                                            navigator.clipboard.writeText(coupon.code); // Copy coupon code
                                            Swal.fire({
                                                icon: 'success',
                                                title: 'Coupon Copied!',
                                                text: `Your coupon code "${coupon.code}" has been copied.`,
                                                showConfirmButton: false,
                                                timer: 1500, // Auto-close after 1.5 seconds
                                            });
                                        }}
                                    >
                                        Get Coupon
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                {/* Announcements Section */}
                <section >
                    <h2 className="text-4xl font-bold  text-center">Latest Announcements</h2>
                    <div className="mt-8">
                        {announcements.map((announcement, index) => (
                            <div key={index} className=" p-8 rounded-xl shadow-lg mb-8">
                                <h3 className="text-2xl font-semibold ">{announcement.title}</h3>
                                <p className=" mt-4">{announcement.description}</p>
                                <p className="text-sm mt-2">Posted on: {new Date(announcement.createdAt).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </section>
                {/* Blog Highlights */}
                <section className="w-full py-20">
                    <div>
                        <h2 className="text-4xl font-bold text-center mb-4">
                            Blog Highlights
                        </h2>
                        <p className="text-xl font-medium leading-relaxed max-w-2xl mx-auto text-center">
                            A few short updates and helpful articles to keep residents and visitors informed.
                        </p>
                        {blogs.length > 0 ? (
                            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
                                {blogs.map((blog, index) => (
                                    <article
                                        key={blog._id || index}
                                        className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        {blog.coverImage ? (
                                            <img
                                                src={blog.coverImage}
                                                alt={blog.title || 'Blog post'}
                                                className="h-52 w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-52 w-full items-center justify-center bg-[#0E9F9F]/10 text-2xl font-bold text-[#0E9F9F]">
                                                EstateEase Blog
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <p className="text-sm font-semibold uppercase tracking-wide text-[#0E9F9F]">
                                                {blog.tags?.[0] || 'Update'}
                                            </p>
                                            <h3 className="mt-3 text-2xl font-semibold text-gray-900">
                                                {blog.title}
                                            </h3>
                                            <p className="mt-3 text-lg text-gray-700">
                                                {blog.summary}
                                            </p>
                                            <p className="mt-4 text-sm text-gray-500">
                                                {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ''}
                                            </p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="mt-10 rounded-2xl border border-dashed border-gray-200 p-8 text-center text-lg text-gray-600">
                                Blog highlights will appear here once published posts are available.
                            </div>
                        )}
                    </div>
                </section>
                {/* Dynamic Image Gallery Section */}
                <section className="w-full py-20">
                    <div>
                        <h2 className="text-4xl font-bold text-center mb-12">
                            Explore Our Spaces
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="relative group overflow-hidden rounded-xl">
                                <img
                                    src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/fee32764396391.5ad0ac68a1360.jpg"
                                    alt="Lobby"
                                    className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <p className="text-white text-2xl font-semibold">Modern Lobby</p>
                                </div>
                            </div>
                            <div className="relative group overflow-hidden rounded-xl">
                                <img
                                    src="https://static1.squarespace.com/static/58471a2329687f12c60955a3/t/65dfb6c5b67ebd6a9a88f0a2/1709160133386/fitness-center-design.jpg?format=1500w"
                                    alt="Fitness Center"
                                    className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <p className="text-white text-2xl font-semibold">Fitness Center</p>
                                </div>
                            </div>
                            <div className="relative group overflow-hidden rounded-xl">
                                <img
                                    src="https://assets.simpleviewinc.com/simpleview/image/upload/crm/dublinoh/AC_CMHAC_VasoRooftop0-699662e95056a36_69966607-5056-a36a-078b761588b538ed.jpg"
                                    alt="Rooftop Lounge"
                                    className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <p className="text-white text-2xl font-semibold">Rooftop Lounge</p>
                                </div>
                            </div>
                            <div className="relative group overflow-hidden rounded-xl">
                                <img
                                    src="https://cdn11.bigcommerce.com/s-64cbb/product_images/uploaded_images/tgtechnicalservices-246300-parking-garage-safer-blogbanner1.jpg"
                                    alt="Parking"
                                    className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <p className="text-white text-2xl font-semibold">Spacious Parking</p>
                                </div>
                            </div>
                            <div className="relative group overflow-hidden rounded-xl">
                                <img
                                    src="https://leisurepoolsusa.com/wp-content/uploads/2022/05/best-type-of-swimming-pool-for-my-home.webp"
                                    alt="Pool"
                                    className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <p className="text-white text-2xl font-semibold">Infinity Pool</p>
                                </div>
                            </div>
                            <div className="relative group overflow-hidden rounded-xl">
                                <img
                                    src="https://thumbs.dreamstime.com/b/moscow-region-aug-landscape-design-patio-residential-house-taken-above-beautiful-landscaping-home-garden-summer-169060331.jpg"
                                    alt="Garden"
                                    className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <p className="text-white text-2xl font-semibold">Landscaped Garden</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Apartment Location Map Section */}
                <section className="relative ">
                    <div>
                        <h2 className="text-4xl font-bold  text-center">
                            Apartment Location
                        </h2>
                        <div className="mt-8 relative z-0">
                            <MapContainer
                                center={[51.505, -0.09]}
                                zoom={13}
                                style={{ height: "400px", width: "100%" }}
                                className="shadow-lg"
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://maps.app.goo.gl/AfG7U9F3umxGAGnx6">Google Maps</a>'
                                />
                                <Marker
                                    position={[51.505, -0.09]}
                                    icon={apartmentLocationIcon}
                                >
                                    <Popup>Apartment Location</Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                    </div>
                </section>
                <section className="w-full py-20">
                    <h2 className="text-4xl font-bold  text-center mb-8">
                        Community Guidelines
                    </h2>
                    <p className="text-xl font-medium  leading-relaxed max-w-2xl mx-auto text-center">
                        To ensure a safe and pleasant living experience for everyone, we kindly ask all residents and guests to adhere to the following community guidelines:
                    </p>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className=" p-8 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-300">
                            <h3 className="text-2xl font-bold  mb-4">Respect for All</h3>
                            <p className="text-lg">
                                Treat all residents and guests with respect and kindness, fostering a positive and inclusive environment.
                            </p>
                        </div>
                        <div className="p-8 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-300">
                            <h3 className="text-2xl font-bold  mb-4">Noise Consideration</h3>
                            <p className="text-lg ">
                                Maintain a reasonable noise level to ensure that everyone can enjoy their living spaces in peace and comfort.
                            </p>
                        </div>
                        <div className=" p-8 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-300">
                            <h3 className="text-2xl font-bold  mb-4">Waste Management</h3>
                            <p className="text-lg ">
                                Dispose of waste properly and recycle when possible to maintain a clean and sustainable environment.
                            </p>
                        </div>
                        <div className="p-8 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-300">
                            <h3 className="text-2xl font-bold mb-4">Pets Policy</h3>
                            <p className="text-lg ">
                                Ensure that pets are kept under control and are not disruptive to other residents or common areas.
                            </p>
                        </div>
                        <div className="p-8 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-300">
                            <h3 className="text-2xl font-bold  mb-4">Safety First</h3>
                            <p className="text-lg ">
                                Follow all building safety protocols, including fire drills, emergency exits, and reporting any hazards immediately.
                            </p>
                        </div>
                        <div className=" p-8 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-300">
                            <h3 className="text-2xl font-bold  mb-4">Respect Common Areas</h3>
                            <p className="text-lg ">
                                Take care of common spaces and be considerate when using shared amenities, leaving them clean and in good condition.
                            </p>
                        </div>
                    </div>
                </section>
                {/* FAQ Preview */}
                <section className="w-full pb-20">
                    <div className="rounded-2xl border border-gray-100 p-8 sm:p-10">
                        <h2 className="text-4xl font-bold text-center mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-xl font-medium leading-relaxed max-w-2xl mx-auto text-center">
                            Quick answers to the most common questions about rent, maintenance, amenities, and moving in or out.
                        </p>
                        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="rounded-xl border border-gray-100 p-6">
                                <h3 className="text-xl font-semibold mb-3">How do I pay my rent online?</h3>
                                <p className="text-lg">Log in to your account and visit the payments section to complete your rent payment securely.</p>
                            </div>
                            <div className="rounded-xl border border-gray-100 p-6">
                                <h3 className="text-xl font-semibold mb-3">What should I do for maintenance issues?</h3>
                                <p className="text-lg">Use the support flow for general requests, and contact emergency support for urgent problems.</p>
                            </div>
                            <div className="rounded-xl border border-gray-100 p-6">
                                <h3 className="text-xl font-semibold mb-3">Can I book amenities online?</h3>
                                <p className="text-lg">Yes, common facilities like the gym or clubhouse can be booked through the platform.</p>
                            </div>
                            <div className="rounded-xl border border-gray-100 p-6">
                                <h3 className="text-xl font-semibold mb-3">What is the move-in or move-out process?</h3>
                                <p className="text-lg">Residents should notify management in advance and follow the inspection process.</p>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-center">
                            <Link to="/FAQ" className="inline-flex items-center rounded-lg bg-[#0E9F9F] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#14B8B8]">
                                View All FAQs
                            </Link>
                        </div>
                    </div>
                </section>
                {/* Call To Action */}
                <section className="w-full pb-20">
                    <div className="rounded-2xl bg-[#1A1A1A] px-6 py-12 text-center text-white sm:px-10">
                        <h2 className="text-4xl font-bold mb-4">
                            Ready to Find Your Next Home?
                        </h2>
                        <p className="text-xl leading-relaxed max-w-2xl mx-auto text-[#D1D5DB]">
                            Explore available apartments, review the booking flow, and contact us if you need help choosing the right unit.
                        </p>
                        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link to="/apartment" className="rounded-lg bg-[#0E9F9F] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#14B8B8]">
                                Browse Apartments
                            </Link>
                            <Link to="/contacts" className="rounded-lg border border-white px-6 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-[#1A1A1A]">
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </section>
                {/* Newsletter Section */}
                <section className="w-full pb-20">
                    <div className="rounded-2xl border border-[#0E9F9F]/20 bg-[#0E9F9F]/5 px-6 py-12 sm:px-10">
                        <h2 className="text-4xl font-bold text-center mb-4">
                            Stay Updated With EstateEase
                        </h2>
                        <p className="text-xl font-medium leading-relaxed max-w-2xl mx-auto text-center">
                            Subscribe for apartment availability, announcements, and helpful booking updates sent directly to your inbox.
                        </p>
                        <div className="mt-8 mx-auto flex max-w-2xl flex-col gap-4 md:flex-row">
                            <input
                                type="email"
                                value={newsletterEmail}
                                onChange={(event) => setNewsletterEmail(event.target.value)}
                                placeholder="Enter your email"
                                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0E9F9F]"
                            />
                            <button
                                type="button"
                                onClick={handleNewsletterSubscribe}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0E9F9F] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#14B8B8]"
                            >
                                <FaPaperPlane /> Subscribe
                            </button>
                        </div>
                    </div>
                </section>
                <section>
                    <ReviewsList></ReviewsList>
                </section>
            </div>
        </div>
    );
};

export default Home;