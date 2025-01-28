import { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // For carousel styling
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Banner1 from './../../assets/Banner1.jpeg'
import Banner2 from './../../assets/Banner-2.jpg'
import Banner3 from './../../assets/Banner3.jpeg'

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
            const res = await fetch('http://localhost:5000/coupons');
            const data = await res.json();
            setCoupons(data);
        };

        const fetchAnnouncements = async () => {
            const res = await fetch('http://localhost:5000/announcements');
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
        <div className="space-y-12">
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
                            <div key={index} className="w-full h-[600px]">
                                <img src={image} alt={`banner-${index}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </Carousel>
                </div>
            </section>

            {/* About the Building */}
            <section className="text-center bg-gray-100 py-16 px-6">
                <h2 className="text-3xl font-semibold text-gray-800">About the Building</h2>
                <p className="text-lg text-gray-600 mt-6 max-w-3xl mx-auto leading-relaxed">
                    The building stands tall, offering modern amenities, exceptional design, and a welcoming environment for all our residents.
                    We have made sure to design apartments that maximize comfort, convenience, and style.
                </p>
            </section>

            {/* Coupons Section */}
            <section className="bg-blue-50 py-16 px-6">
                <h2 className="text-3xl font-semibold text-gray-800 text-center">Exclusive Coupons</h2>
                <div className="flex justify-center gap-8 mt-8">
                    {coupons.map((coupon, index) => (
                        <div key={index} className="bg-white p-8 rounded-xl shadow-lg text-center w-64">
                            <p className="text-2xl font-bold text-green-600">{coupon.discount}% OFF</p>
                            <p className="text-gray-600 mt-4">{coupon.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Announcements Section */}
            <section className="bg-gray-50 py-16 px-6">
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
    );
};

export default Home;