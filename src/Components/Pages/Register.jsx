import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { AuthContext } from '../Provider/AuthProvider';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet';

const Register = () => {
    const { createNewUser, setUser, updateUserProfile } = useContext(AuthContext);
    const navigate = useNavigate();

    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassWord] = useState(false);
    const [error, setError] = useState('');

    const validatePassword = (password) => {
        if (password.length < 6) {
            return "Password must be at least 6 characters long.";
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            return "Password must contain at least one uppercase letter.";
        }
        if (!/(?=.*[a-z])/.test(password)) {
            return "Password must contain at least one lowercase letter.";
        }
        if (!/(?=.*\d)/.test(password)) {
            return "Password must contain at least one number.";
        }
        if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) {
            return "Password must contain at least one special character.";
        }
        return '';
    };

    const handleRegister = (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const photo = e.target.photo.value;
        const password = e.target.password.value;

        const validationError = validatePassword(password);
        if (validationError) {
            setPasswordError(validationError);
            return;
        }

        setPasswordError('');
        createNewUser(email, password)
            .then((result) => {
                setUser(result.user);
                updateUserProfile({
                    photoURL: photo,
                    displayName: name,
                })
                    .then(() => {
                        setUser((prevUser) => ({
                            ...prevUser,
                            displayName: name,
                            photoURL: photo,
                        }));
                        Swal.fire({
                            title: 'Registration Successful!',
                            text: `Welcome, ${name}! Your account has been created successfully.`,
                            icon: 'success'
                        }).then(() => {
                            navigate('/');
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            })
            .catch((error) => {
                const errorMessage = error.message;
                setError(errorMessage);
                Swal.fire({
                    title: 'Registration Failed',
                    text: 'There was an error creating your account. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'Retry',
                });
            });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
            <Helmet><title>Register | EstateEase</title></Helmet>
            <div className="w-full max-w-md bg-white border border-gray-200 shadow-lg rounded-lg p-6">
                <h2 className="text-2xl lg:text-4xl font-bold text-center mb-6">Register Now!</h2>
                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-sm lg:text-base">Name</span>
                        </label>
                        <input
                            name="name"
                            type="text"
                            placeholder="Enter your name"
                            className="input input-bordered w-full"
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-sm lg:text-base">Email</span>
                        </label>
                        <input
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            className="input input-bordered w-full"
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-sm lg:text-base">Photo URL</span>
                        </label>
                        <input
                            name="photo"
                            type="text"
                            placeholder="Enter your photo URL"
                            className="input input-bordered w-full"
                            required
                        />
                    </div>
                    <div className="form-control relative">
                        <label className="label">
                            <span className="label-text text-sm lg:text-base">Password</span>
                        </label>
                        <input
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            className="input input-bordered w-full"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassWord(!showPassword)}
                            className="absolute right-3 top-9 text-gray-500 text-lg"
                        >
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                        {passwordError && <p className="text-red-500 text-sm mt-2">{passwordError}</p>}
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <div className="form-control mt-6">
                        <button className="btn btn-primary w-full">Register</button>
                    </div>
                </form>
                <p className="mt-4 text-sm text-center">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-600 font-medium">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;