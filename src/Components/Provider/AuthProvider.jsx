import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    getIdToken,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import { createContext, useCallback, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import auth from '../Firebase/firebase.config';
import 'react-toastify/dist/ReactToastify.css';
import { RotatingLines } from 'react-loader-spinner';
import { apiFetch, extractTokenFromResponse, removeToken, setToken } from '../../api/apiClient';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const [roleLoading, setRoleLoading] = useState(true);

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

    const requestBackendToken = useCallback(async (currentUser) => {
        if (!currentUser?.email) {
            removeToken();
            return null;
        }

        const firebaseToken = await getIdToken(currentUser, true);
        const authEndpoint = import.meta.env.VITE_AUTH_ENDPOINT || '/jwt';

        try {
            const tokenResponse = await apiFetch(authEndpoint, {
                method: 'POST',
                skipAuth: true,
                body: JSON.stringify({
                    email: currentUser.email,
                    uid: currentUser.uid,
                    firebaseToken,
                }),
            });

            const backendToken = extractTokenFromResponse(tokenResponse);
            if (backendToken) {
                setToken(backendToken);
                return backendToken;
            }
        } catch (error) {
            console.warn(`JWT exchange at "${authEndpoint}" failed. Falling back to the Firebase ID token.`, error);
        }

        setToken(firebaseToken);
        return firebaseToken;
    }, []);

    const logOut = () => {
        setLoading(true);
        return signOut(auth)
            .then(() => {
                removeToken();
                toast.success('Successfully logged out!');
                setLoading(false);
            })
            .catch((error) => {
                toast.error('An error occurred during logout.');
                setLoading(false);
                console.error(error);
            });
    };

    // Function to send user data to the backend using fetch
    const sendUserDataToBackend = useCallback(async (email, displayName, role) => {
        try {
            const userInfo = { email, displayName, lastLogin: new Date().toISOString(), role };
            await apiFetch('/users', {
                method: 'POST',
                skipAuth: true,
                body: JSON.stringify(userInfo),
            });
            toast.success('User info synced with backend.');
        } catch (error) {
            console.error(error);
        }
    }, []);

    const syncUserRole = useCallback(async (currentUser) => {
        try {
            const data = await apiFetch(`/users/${currentUser.email}`);
            if (data?.role) {
                setUserRole(data.role);
                return;
            }

            await sendUserDataToBackend(currentUser.email, currentUser.displayName, 'user');
            setUserRole('user');
        } catch (error) {
            if (error?.status === 404) {
                await sendUserDataToBackend(currentUser.email, currentUser.displayName, 'user');
                setUserRole('user');
                return;
            }

            console.error('Error fetching user role:', error);
        }
    }, [sendUserDataToBackend]);

    const authInfo = {
        user,
        setUser,
        userRole,
        roleLoading,
        createNewUser,
        logOut,
        signInWithEmail,
        updateUserProfile,
        googleProvider,
        loading
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setUserRole('user');
                setRoleLoading(true);

                try {
                    await requestBackendToken(currentUser);
                    await syncUserRole(currentUser);
                } catch (error) {
                    removeToken();
                    setUserRole(null);
                    console.error('Error establishing authenticated session:', error);
                    toast.error('Could not start your authenticated session right now.');
                } finally {
                    setRoleLoading(false);
                }
            } else {
                removeToken();
                setUser(null);
                setUserRole(null);
                setRoleLoading(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [requestBackendToken, syncUserRole]);

    if (loading || roleLoading) {
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
