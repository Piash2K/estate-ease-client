import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MakeAnnouncement = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const announcementData = {
            title,
            description,
            createdAt: new Date(),
        };

        fetch('https://estate-ease-server.vercel.app/announcements', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(announcementData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error creating announcement');
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                alert('Announcement created successfully!');
                navigate('/dashboard'); // Redirect to the dashboard after successful creation
            })
            .catch((error) => {
                console.error(error);
                alert('Failed to create announcement');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="p-4">
            <h2 className="text-xl mb-4">Make Announcement</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-gray-700">
                        Title:
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-gray-700">
                        Description:
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows="4"
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded-md"
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create Announcement"}
                </button>
            </form>
        </div>
    );
};

export default MakeAnnouncement;
