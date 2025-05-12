import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const Footer = () => {
    const handleSubscribe = () => {
        const emailInput = document.getElementById('newsletter-email').value.trim();

        // Regular expression for email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailPattern.test(emailInput)) {
            Swal.fire({
                icon: 'success',
                title: 'Subscribed Successfully!',
                text: 'You have been added to our newsletter.',
                confirmButtonColor: '#0E9F9F',
            });
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
        <footer className="py-16 mt-20 bg-[#1A1A1A]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* About Section */}
                    <div>
                        <h2 className="text-xl font-bold mb-4 text-white">EstateEase</h2>
                        <p className="text-[#A3A3A3] text-sm">
                            Explore a seamless real estate experience with reviews, news, and guides to help you navigate your property journey.
                        </p>
                    </div>

                    {/* Explore Section */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4 text-white">Explore</h2>
                        <ul>
                            <li>
                                <Link><p className='text-[#A3A3A3] hover:text-[#0E9F9F] transition-colors'>About Us</p></Link>
                            </li>
                            <li>
                                <Link><p className='text-[#A3A3A3] hover:text-[#0E9F9F] transition-colors'>Reviews</p></Link>
                            </li>
                            <li>
                                <Link><p className='text-[#A3A3A3] hover:text-[#0E9F9F] transition-colors'>Contact</p></Link>
                            </li>
                            <li>
                                <Link><p className='text-[#A3A3A3] hover:text-[#0E9F9F] transition-colors'>Privacy Policy</p></Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter Section */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4 text-white">Newsletter</h2>
                        <p className="text-[#A3A3A3] text-sm mb-4">
                            Subscribe to receive the latest real estate news, property guides, and reviews directly to your inbox.
                        </p>

                        <input
                            id="newsletter-email"
                            type="email"
                            placeholder="Enter your email"
                            className="w-full bg-[#333333] text-sm text-[#A3A3A3] p-2 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-[#0E9F9F]"
                        />
                        <button
                            type="button"
                            onClick={handleSubscribe}
                            className="w-full bg-[#0E9F9F] hover:bg-[#14B8B8] text-white text-sm p-2 rounded-md transition-colors"
                        >
                            Subscribe
                        </button>
                    </div>

                    {/* Follow Us Section */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4 text-white">Follow Us</h2>
                        <div className="flex space-x-4">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#0E9F9F] hover:text-[#14B8B8] transition-colors"
                            >
                                <FaFacebook className='text-4xl' />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#0E9F9F] hover:text-[#14B8B8] transition-colors"
                            >
                                <FaTwitter className='text-4xl' />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#0E9F9F] hover:text-[#14B8B8] transition-colors"
                            >
                                <FaInstagram className='text-4xl' />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="mt-8 text-center text-[#A3A3A3] text-sm">
                    &copy; {new Date().getFullYear()} EstateEase. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;