
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="py-16 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <h2 className="text-xl font-bold mb-4">EstateEase</h2>
                        <p className="text-gray-400 text-sm">
                            Explore a seamless real estate experience with reviews, news, and guides to help you navigate your property journey.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Explore</h2>
                        <ul>
                            <li>
                                <Link><p className='text-gray-400'>About Us</p>
                                </Link>
                            </li>
                            <li>
                                <Link><p className='text-gray-400'>
                                    Reviews
                                </p></Link>
                            </li>
                            <li>
                                <a className='text-gray-400'>
                                    Contact
                                </a>
                            </li>
                            <li>
                                <a className='text-gray-400'>
                                    Privacy Policy
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Newsletter</h2>
                        <p className="text-gray-400 text-sm mb-4">
                            Subscribe to receive the latest real estate news, property guides, and reviews directly to your inbox.
                        </p>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full bg-gray-800 text-sm text-gray-300 p-2 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm p-2 rounded-md transition"
                        >
                            Subscribe
                        </button>

                    </div>
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Follow Us</h2>
                        <div className="flex space-x-4">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                className=" transition"
                            >
                                <FaFacebook className='text-4xl'></FaFacebook>
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                className="transition"
                            >
                                <FaTwitter className='text-4xl'></FaTwitter>
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                className=" transition"
                            >
                                <FaInstagram className='text-4xl'></FaInstagram>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 text-center text-gray-400 text-sm">
                    &copy; {new Date().getFullYear()} EstateEase. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
