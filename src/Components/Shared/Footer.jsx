import { useState } from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const Footer = () => {
    const [email, setEmail] = useState('');

    const handleSubscribe = () => {
        const emailInput = email.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailPattern.test(emailInput)) {
            Swal.fire({
                icon: 'success',
                title: 'Subscribed Successfully!',
                text: 'You have been added to our newsletter.',
                confirmButtonColor: '#0E9F9F',
            });
            setEmail('');
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
        <footer className="mt-20 border-t border-[#0E9F9F]/30 bg-gradient-to-b from-[#111111] to-[#1A1A1A]">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            <span className="text-[#0E9F9F]">Estate</span>Ease
                        </h2>
                        <p className="mt-4 text-sm leading-6 text-[#A3A3A3]">
                            Explore verified apartments, real-time updates, and a simple booking experience built for modern renters.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-white">Quick Links</h2>
                        <ul className="mt-4 space-y-3 text-sm">
                            <li>
                                <Link to="/" className="text-[#A3A3A3] transition-colors hover:text-[#0E9F9F]">Home</Link>
                            </li>
                            <li>
                                <Link to="/apartment" className="text-[#A3A3A3] transition-colors hover:text-[#0E9F9F]">Apartments</Link>
                            </li>
                            <li>
                                <Link to="/contacts" className="text-[#A3A3A3] transition-colors hover:text-[#0E9F9F]">Contact</Link>
                            </li>
                            <li>
                                <Link to="/FAQ" className="text-[#A3A3A3] transition-colors hover:text-[#0E9F9F]">FAQ</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-white">Contact</h2>
                        <ul className="mt-4 space-y-3 text-sm text-[#A3A3A3]">
                            <li className="flex items-center gap-3">
                                <FaMapMarkerAlt className="text-[#0E9F9F]" />
                                <span>Dhaka, Bangladesh</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FaPhone className="text-[#0E9F9F]" />
                                <a href="tel:+880123456789" className="transition-colors hover:text-[#0E9F9F]">+880 1234 56789</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <FaEnvelope className="text-[#0E9F9F]" />
                                <a href="mailto:support@estateease.com" className="transition-colors hover:text-[#0E9F9F]">support@estateease.com</a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-white">Newsletter</h2>
                        <p className="mt-4 text-sm leading-6 text-[#A3A3A3]">
                            Get apartment updates, property tips, and new announcements in your inbox.
                        </p>
                        <div className="mt-4 space-y-3">
                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="Enter your email"
                                className="w-full rounded-md bg-[#333333] p-3 text-sm text-white placeholder:text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-[#0E9F9F]"
                            />
                            <button
                                type="button"
                                onClick={handleSubscribe}
                                className="flex w-full items-center justify-center gap-2 rounded-md bg-[#0E9F9F] p-3 text-sm font-semibold text-white transition-colors hover:bg-[#14B8B8]"
                            >
                                <FaPaperPlane /> Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
                    <p className="text-center text-sm text-[#A3A3A3] md:text-left">
                        &copy; {new Date().getFullYear()} EstateEase. All rights reserved.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#0E9F9F] transition-colors hover:text-[#14B8B8]" aria-label="Facebook">
                            <FaFacebook className="text-2xl" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[#0E9F9F] transition-colors hover:text-[#14B8B8]" aria-label="Twitter">
                            <FaTwitter className="text-2xl" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#0E9F9F] transition-colors hover:text-[#14B8B8]" aria-label="Instagram">
                            <FaInstagram className="text-2xl" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;