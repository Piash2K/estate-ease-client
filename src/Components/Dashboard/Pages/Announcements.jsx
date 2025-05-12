import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Bars } from "react-loader-spinner";

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch announcements from the backend
    useEffect(() => {
        fetch('https://estate-ease-server.vercel.app/announcements')
            .then((response) => response.json())
            .then((data) => {
                setAnnouncements(data); // Set fetched announcements
                setLoading(false); // Set loading to false when data is fetched
            })
            .catch((error) => {
                console.error("Error fetching announcements:", error);
                setLoading(false); // Set loading to false on error
            });
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Bars 
                    height="80" 
                    width="80" 
                    color="#14B8A6" 
                    ariaLabel="bars-loading" 
                    wrapperStyle={{}}
                    visible={true} 
                />
            </div>
        );
    }

    return (
        <div className="p-6">
            <Helmet><title>Announcements | EstateEase</title></Helmet>
            <h2 className="text-3xl font-bold mb-6 ">All Announcements</h2>
            {announcements.length === 0 ? (
                <p className="text-center text-lg">No announcements available.</p>
            ) : (
                <ul className="space-y-6">
                    {announcements.map((announcement) => (
                        <li key={announcement._id} className=" shadow-xl rounded-xl p-5 border-l-4 border-teal-600 transition duration-300 ease-in-out hover:bg-teal-700">
                            <h3 className="text-2xl font-semibold ">{announcement.title}</h3>
                            <p className=" mt-2">{announcement.description}</p>
                            <small className="mt-2 block">Posted on: {new Date(announcement.createdAt).toLocaleDateString()}</small>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Announcements;
