import { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Bars } from "react-loader-spinner";
import { apiFetch } from "../../../api/apiClient";

const MakeAnnouncement = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.description.trim()) {
            return Swal.fire({
                icon: "warning",
                title: "All fields are required!",
            });
        }

        setLoading(true);

        const announcementData = {
            ...formData,
            createdAt: new Date().toISOString(),
        };

        try {
            await apiFetch("/announcements", {
                method: "POST",
                body: JSON.stringify(announcementData),
            });

            Swal.fire({
                icon: "success",
                title: "Announcement created successfully!",
                timer: 1500,
                showConfirmButton: false,
            });

            setFormData({
                title: "",
                description: "",
            });

            navigate("/dashboard/announcements");
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Failed to create announcement",
                text: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Bars height="80" width="80" color="#14B8A6" />
            </div>
        );
    }

    return (
        <div className="w-full p-4 md:p-8">
            <Helmet>
                <title>Make Announcement | EstateEase</title>
            </Helmet>

            <h2 className="mb-6 text-2xl font-bold">
                📢 Make Announcement
            </h2>

            <form
                onSubmit={handleSubmit}
                className="w-full space-y-6 rounded-xl border border-base-300 bg-base-100 p-6 md:p-8 shadow-md"
            >
                {/* Title */}
                <div>
                    <label className="mb-2 block font-medium">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter announcement title..."
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="mb-2 block font-medium">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="6"
                        placeholder="Write your announcement..."
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>

                {/* Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="btn w-full md:w-auto bg-teal-600 text-white hover:bg-teal-700 transition duration-200 px-6"
                >
                    {loading ? "Creating..." : "Create Announcement"}
                </button>
            </form>
        </div>
    );
};

export default MakeAnnouncement;