import { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { Bars } from "react-loader-spinner";
import { apiFetch } from "../../../api/apiClient";

const MakeAnnouncement = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const announcementData = {
            title,
            description,
            createdAt: new Date(),
        };

        try {
            await apiFetch('/announcements', {
                method: 'POST',
                body: JSON.stringify(announcementData),
            });

            Swal.fire({
                icon: 'success',
                title: 'Announcement created successfully!',
                confirmButtonText: 'OK'
            });
            navigate('/dashboard/announcements');
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Failed to create announcement',
                text: error.message,
                confirmButtonText: 'Try Again'
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="ml-0 flex min-h-[60vh] items-center justify-center p-4 md:ml-72 md:p-6">
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
        <div className="p-4 md:p-6 max-w-2xl mx-auto w-full">
            <Helmet><title>Make Announcement | EstateEase </title></Helmet>
            <h2 className="mb-4 text-2xl font-bold">Make Announcement</h2>
            <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-base-300 bg-base-100 p-4 md:p-6">
                <div>
                    <label htmlFor="title" className="mb-1 block font-medium">
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
                    <label htmlFor="description" className="mb-1 block font-medium">
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
                    className="btn w-full bg-teal-600 text-white hover:bg-teal-700"
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create Announcement"}
                </button>
            </form>
        </div>
    );
};

export default MakeAnnouncement;