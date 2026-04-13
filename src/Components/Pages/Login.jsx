import  { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {  signInWithPopup } from 'firebase/auth';

import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { AuthContext } from '../Provider/AuthProvider';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet';
import auth from '../Firebase/firebase.config';



const Login = () => {
    const { signInWithEmail, googleProvider } = useContext(AuthContext);
    const [, setError] = useState('');
    const [showPassword, setShowPassWord] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            Swal.fire({
                title: 'Welcome back!',
                text: `Hello, ${user.displayName || user.email}`,
                icon: 'success',
                confirmButtonText: 'Okay',
            });
            navigate(from, { replace: true });
        } catch (error) {
            const errorMessage = error.message;
            setError(errorMessage); // Set error message
            Swal.fire({
                title: 'Error',
                text: 'Google Sign-In failed. Please try again.',
                icon: 'error',
                confirmButtonText: 'Retry',
            });
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoggingIn(true);
        try {
            const result = await signInWithEmail(email, password);
            const user = result.user;
            Swal.fire({
                title: 'Login Successful!',
                text: `Welcome back, ${user.email}`,
                icon: 'success',
                confirmButtonText: 'Okay',
            });
            navigate(from, { replace: true });
        } catch (error) {
            const errorMessage = error.message;
            setError(errorMessage);
            Swal.fire({
                title: 'Login Failed',
                text: 'Please check your email and password.',
                icon: 'error',
                confirmButtonText: 'Retry',
            });
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white px-4 py-12">
            <Helmet><title>Login | EstateEase </title></Helmet>
            <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
                <h1 className="text-center text-3xl font-bold text-gray-900">Welcome Back</h1>
                <p className="mt-2 text-center text-sm text-gray-600">Sign in to continue managing apartments and agreements.</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="form-control mt-6">
                        <label className="label">
                            <span className="label-text text-sm font-semibold text-gray-700">Email</span>
                        </label>
                        <input
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="input input-bordered w-full rounded-lg border-gray-300 focus:border-teal-500 focus:outline-none"
                            required
                        />
                    </div>

                    <div className="form-control relative">
                        <label className="label">
                            <span className="label-text text-sm font-semibold text-gray-700">Password</span>
                        </label>
                        <input
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="input input-bordered w-full rounded-lg border-gray-300 focus:border-teal-500 focus:outline-none"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassWord(!showPassword)}
                            className="absolute right-3 top-9 text-lg text-gray-500"
                        >
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                    </div>

                    <div className="form-control mt-6">
                        <button
                            className="btn w-full rounded-lg border-0 bg-teal-600 text-white hover:bg-teal-700"
                            disabled={isLoggingIn || isGoogleLoading}
                        >
                            {isLoggingIn ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>

                <p className="mt-4 text-sm text-center">
                    New here?{' '}
                    <Link to="/register" className="text-teal-600 font-medium">
                        Register now
                    </Link>
                </p>

                <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoggingIn || isGoogleLoading}
                    className="btn mt-4 w-full rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
                >
                    {isGoogleLoading ? 'Signing in with Google...' : 'Login with Google'}
                </button>
            </div>
        </div>
    );
};

export default Login;