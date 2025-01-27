import { useEffect, useState } from "react";

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch announcements from the backend
    useEffect(() => {
        fetch('http://localhost:5000/announcements')
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
        return <div>Loading announcements...</div>;
    }

    return (
        <div>
            <h2>All Announcements</h2>
            {announcements.length === 0 ? (
                <p>No announcements available.</p>
            ) : (
                <ul>
                    {announcements.map((announcement) => (
                        <li key={announcement._id}>
                            <h3>{announcement.title}</h3>
                            <p>{announcement.description}</p>
                            <small>Posted on: {new Date(announcement.createdAt).toLocaleDateString()}</small>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Announcements;