import { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // For carousel styling
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Banner1 from './../../assets/Banner1.jpeg'
import Banner2 from './../../assets/Banner-2.jpg'
import Banner3 from './../../assets/Banner3.jpeg'
import { Helmet } from 'react-helmet';
import { FaDumbbell, FaParking, FaShieldAlt, FaUmbrellaBeach, FaWifi } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Home = () => {
    const [coupons, setCoupons] = useState([]);
    const [announcements, setAnnouncements] = useState([]);

    const bannerImages = [
        Banner1,
        Banner2,
        Banner3,
    ];

    // Fetch data from backend
    useEffect(() => {
        const fetchCoupons = async () => {
            const res = await fetch('https://estate-ease-server.vercel.app/coupons');
            const data = await res.json();
            setCoupons(data);
        };

        const fetchAnnouncements = async () => {
            const res = await fetch('https://estate-ease-server.vercel.app/announcements');
            const data = await res.json();
            setAnnouncements(data);
        };

        fetchCoupons();
        fetchAnnouncements();
    }, []);

    // Automatic slider feature
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
        }, 5000); // Change image every 5 seconds
        return () => clearInterval(interval);
    }, [bannerImages.length]);

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
                            <div key={index} className="w-full h-[300px] sm:h-[450px] lg:h-[600px]">
                                <img src={image} alt={`banner-${index}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </Carousel>
                </div>
            </section>
            <div className='w-9/12 mx-auto'>
                {/* About the Building */}
                <section className="w-full py-20">
                    <div>
                        <h2 className="text-6xl font-bold text-gray-900 text-center mb-8">
                            About the Building
                        </h2>
                        <p className="text-xl font-medium text-gray-700 leading-relaxed max-w-2xl mx-auto text-center">
                            A premium living experience blending modern luxury with cutting-edge design. Our building offers residents top-tier amenities
                            and spacious, thoughtfully crafted apartments, designed to maximize comfort and style.
                        </p>
                        <p className="mt-8 text-2xl font-light italic text-gray-600 text-center max-w-2xl mx-auto">
                            “Where modern design meets timeless comfort.”
                        </p>
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* 24/7 Security */}
                            <div className="bg-white p-8 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-300">
                                <FaShieldAlt className="text-5xl text-[#0E9F9F] mb-6" /> {/* Teal */}
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">24/7 Security</h3>
                                <p className="text-lg text-gray-600">
                                    State-of-the-art surveillance and security systems to ensure your safety at all times.
                                </p>
                            </div>

                            {/* Fitness Center */}
                            <div className="bg-white p-8 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-300">
                                <FaDumbbell className="text-5xl text-[#0E9F9F] mb-6" /> {/* Teal */}
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Fitness Center</h3>
                                <p className="text-lg text-gray-600">
                                    A fully-equipped modern gym to help you stay fit and healthy.
                                </p>
                            </div>

                            {/* Rooftop Lounge */}
                            <div className="bg-white p-8 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-300">
                                <FaUmbrellaBeach className="text-5xl text-[#0E9F9F] mb-6" /> {/* Teal */}
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Rooftop Lounge</h3>
                                <p className="text-lg text-gray-600">
                                    A serene rooftop space to relax and enjoy stunning views of the city.
                                </p>
                            </div>

                            {/* High-Speed Internet */}
                            <div className="bg-white p-8 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-300">
                                <FaWifi className="text-5xl text-[#0E9F9F] mb-6" /> {/* Teal */}
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">High-Speed Internet</h3>
                                <p className="text-lg text-gray-600">
                                    Seamless connectivity with high-speed Wi-Fi and smart home integration.
                                </p>
                            </div>

                            {/* Spacious Parking */}
                            <div className="bg-white p-8 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-300">
                                <FaParking className="text-5xl text-[#0E9F9F] mb-6" /> {/* Teal */}
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Spacious Parking</h3>
                                <p className="text-lg text-gray-600">
                                    Ample parking space for residents and guests, ensuring convenience.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Coupons Section */}
                <section className="w-full py-20">
                    {/* Heading */}
                    <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
                        Exclusive Coupons
                    </h2>

                    {/* Coupons Grid */}
                    <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {coupons.map((coupon, index) => (
                                <div
                                    key={index}
                                    className="relative bg-white p-8 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 group"
                                >
                                    {/* Coupon Code */}
                                    <div className="absolute top-4 right-4 bg-[#0E9F9F] text-white px-3 py-1 rounded-full text-sm font-semibold">
                                        {coupon.code}
                                    </div>

                                    {/* Discount */}
                                    <p className="text-4xl font-bold text-[#0E9F9F] mb-4">
                                        {coupon.discount}% OFF
                                    </p>

                                    {/* Description */}
                                    <p className="text-lg text-gray-600 mb-6">
                                        {coupon.description}
                                    </p>

                                    {/* CTA Button */}
                                    <button
                                        className="w-full bg-[#0E9F9F] text-white py-3 rounded-lg font-semibold hover:bg-[#14B8B8] transition-colors duration-300"
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
                    <h2 className="text-3xl font-semibold text-gray-800 text-center">Latest Announcements</h2>
                    <div className="mt-8">
                        {announcements.map((announcement, index) => (
                            <div key={index} className="bg-white p-8 rounded-xl shadow-lg mb-8">
                                <h3 className="text-2xl font-semibold text-gray-800">{announcement.title}</h3>
                                <p className="text-gray-600 mt-4">{announcement.description}</p>
                                <p className="text-gray-500 text-sm mt-2">Posted on: {new Date(announcement.createdAt).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </section>
                {/* Dynamic Image Gallery Section */}
                <section className="w-full py-20">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
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
                <section className="py-16">
                    <h2 className="text-3xl font-semibold text-gray-800 text-center">Apartment Location</h2>
                    <div className="mt-8">
                        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "400px", width: "100%" }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://maps.app.goo.gl/AfG7U9F3umxGAGnx6'
                            />
                            <Marker position={[51.505, -0.09]} icon={new Icon({ iconUrl: 'path/to/marker-icon.png', iconSize: [25, 41], iconAnchor: [12, 41] })}>
                                <Popup>Apartment Location</Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;