import { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { Bars } from "react-loader-spinner"; // Import the loader spinner

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
                Swal.fire({
                    icon: 'success',
                    title: 'Announcement created successfully!',
                    confirmButtonText: 'OK'
                });
                navigate('/dashboard');
            })
            .catch((error) => {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to create announcement',
                    text: error.message,
                    confirmButtonText: 'Try Again'
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

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
        <div className="p-4">
            <Helmet><title>Make Announcement | EstateEase </title></Helmet>
            <h2 className="text-xl mb-4">Make Announcement</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block ">
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
                    <label htmlFor="description" className="block">
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
                    className="w-full bg-teal-600 text-white p-2 rounded-md"
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create Announcement"}
                </button>
            </form>
        </div>
    );
};

export default MakeAnnouncement;