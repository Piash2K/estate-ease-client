import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { apiFetch } from "../../../api/apiClient";

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch announcements from the backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await apiFetch('/announcements');
                setAnnouncements(Array.isArray(data) ? data : data.data || []);
            } catch (error) {
                console.error('Error fetching announcements:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="ml-0 p-4 md:ml-72 md:p-6">
                <div className="h-8 w-56 animate-pulse rounded bg-gray-200" />
                <div className="mt-6 space-y-4">
                    <div className="h-28 w-full animate-pulse rounded-xl bg-gray-200" />
                    <div className="h-28 w-full animate-pulse rounded-xl bg-gray-200" />
                    <div className="h-28 w-full animate-pulse rounded-xl bg-gray-200" />
                </div>
            </div>
        );
    }

    return (
        <div className="ml-0 p-4 md:ml-72 md:p-6">
            <Helmet><title>Announcements | EstateEase</title></Helmet>
            <h2 className="mb-4 text-2xl font-bold md:mb-6 md:text-3xl">All Announcements</h2>
            {announcements.length === 0 ? (
                <p className="text-center text-base text-gray-600 md:text-lg">No announcements available.</p>
            ) : (
                <ul className="space-y-4 md:space-y-6">
                    {announcements.map((announcement) => (
                        <li
                            key={announcement._id}
                            className="rounded-xl border-l-4 border-teal-600 bg-base-100 p-4 shadow-md transition duration-300 ease-in-out hover:bg-base-200 md:p-5"
                        >
                            <h3 className="break-words text-lg font-semibold md:text-2xl">{announcement.title}</h3>
                            <p className="mt-2 break-words text-sm md:text-base">{announcement.description}</p>
                            <small className="mt-3 block text-xs text-gray-500 md:text-sm">
                                Posted on: {new Date(announcement.createdAt).toLocaleDateString()}
                            </small>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Announcements;
