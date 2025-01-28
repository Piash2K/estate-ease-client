import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import auth from '../Firebase/firebase.config';
import 'react-toastify/dist/ReactToastify.css';
import { RotatingLines } from 'react-loader-spinner';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const createNewUser = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const signInWithEmail = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const updateUserProfile = (updatedData) => {
        return updateProfile(auth.currentUser, updatedData);
    };

    const googleProvider = new GoogleAuthProvider();

    const logOut = () => {
        setLoading(true);
        signOut(auth)
            .then(() => {
                toast.success('Successfully logged out!');
                setLoading(false);
            })
            .catch((error) => {
                toast.error('An error occurred during logout.');
                setLoading(false);
                console.error(error);
            });
    };

    const authInfo = {
        user,
        setUser,
        createNewUser,
        logOut,
        signInWithEmail,
        updateUserProfile,
        googleProvider,
        loading
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log(currentUser);
            if (currentUser) {
                setUser(currentUser);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}>
                <RotatingLines
                    strokeColor="blue"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="50"
                    visible={true}
                />
            </div>
        );
    }

    return (
        <AuthContext.Provider value={authInfo}>
            <ToastContainer position="top-center" autoClose={3000} />
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;