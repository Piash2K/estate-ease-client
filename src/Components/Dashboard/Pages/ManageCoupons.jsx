import { useState } from "react";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bars } from "react-loader-spinner";
import { apiFetch } from "../../../api/apiClient";

const fetchCoupons = async () => {
    return apiFetch('/coupons');
};

const saveCoupon = async (couponData, isUpdate, couponId) => {
    const endpoint = isUpdate ? `/coupons/${couponId}` : '/coupons';
    return apiFetch(endpoint, {
        method: isUpdate ? "PUT" : "POST",
        body: JSON.stringify(couponData)
    });
};

const deleteCoupon = async (id) => {
    return apiFetch(`/coupons/${id}`, { method: "DELETE" });
};

const ManageCoupons = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [currentCouponId, setCurrentCouponId] = useState(null);
    const [formData, setFormData] = useState({
        code: "",
        discount: "",
        description: "",
        expiration: "",
    });

    const queryClient = useQueryClient();

    const { data: coupons = [], isLoading, isError } = useQuery({
        queryKey: ["coupons"],
        queryFn: fetchCoupons,
    });

    const saveMutation = useMutation({
        mutationFn: (couponData) => saveCoupon(couponData, isUpdate, currentCouponId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["coupons"] });
            setModalOpen(false);
            // SweetAlert for adding/updating a coupon
            Swal.fire({
                title: isUpdate ? "Coupon Updated!" : "Coupon Added!",
                text: isUpdate
                    ? "Your coupon has been updated successfully."
                    : "Your coupon has been added successfully.",
                icon: "success",
                confirmButtonText: "Okay",
            });
        },
        onError: (err) => {
            console.error("Error saving coupon:", err);
            Swal.fire("Error", "There was an error saving the coupon.", "error");
        },
    });

    // Mutation to delete coupon
    const deleteMutation = useMutation({
        mutationFn: deleteCoupon,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["coupons"] }); // Refetch coupons after successful deletion
            // SweetAlert for deletion
            Swal.fire("Deleted!", "Your coupon has been deleted.", "success");
        },
        onError: (err) => {
            console.error("Error deleting coupon:", err);
            Swal.fire("Error", "There was an error deleting the coupon.", "error");
        },
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newCoupon = { ...formData };
        saveMutation.mutate(newCoupon);
    };

    const handleUpdateClick = (coupon) => {
        setFormData({
            code: coupon.code,
            discount: coupon.discount,
            description: coupon.description,
            expiration: coupon.expiration,
        });
        setCurrentCouponId(coupon._id);
        setIsUpdate(true);
        setModalOpen(true);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(id);
            }
        });
    };

    if (isLoading) {
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
    if (isError) return <div>Error loading coupons</div>;

    return (
        <div className="ml-0 p-4 md:ml-72 md:p-6">
            <Helmet>
                <title>Manage Coupons | EstateEase</title>
            </Helmet>
            <h2 className="text-2xl font-bold mb-4">Manage Coupons</h2>

            {/* Coupon Table */}
            <div className="overflow-x-auto">
                <table className="table w-full min-w-[760px] border">
                    <thead>
                        <tr>
                            <th>Coupon Code</th>
                            <th>Discount (%)</th>
                            <th>Description</th>
                            <th>Expiration Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map((coupon) => (
                            <tr key={coupon._id}>
                                <td>{coupon.code}</td>
                                <td>{coupon.discount}</td>
                                <td>{coupon.description}</td>
                                <td>{coupon.expiration}</td>
                                <td>
                                    <div className="flex flex-col gap-2 sm:flex-row">
                                        <button
                                            className="btn btn-sm bg-teal-600 text-white hover:bg-teal-700"
                                            onClick={() => handleUpdateClick(coupon)}
                                        >
                                            Update
                                        </button>
                                        <button
                                            className="btn btn-sm bg-red-500 text-white hover:bg-red-600"
                                            onClick={() => handleDelete(coupon._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {coupons.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    No coupons available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Coupon Button */}
            <div className="mt-4">
                <button
                    className="btn bg-[#14B8A6]"
                    onClick={() => {
                        setModalOpen(true);
                        setIsUpdate(false);
                        setFormData({ code: "", discount: "", description: "", expiration: "" });
                    }}
                >
                    Add Coupon
                </button>
            </div>

            {/* Add/Update Coupon Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-5 shadow-lg sm:p-6">
                        <h3 className="text-xl font-bold mb-4">
                            {isUpdate ? "Update Coupon" : "Add New Coupon"}
                        </h3>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block font-semibold mb-2">Coupon Code</label>
                                <input
                                    type="text"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block font-semibold mb-2">Discount (%)</label>
                                <input
                                    type="number"
                                    name="discount"
                                    value={formData.discount}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    min="0"
                                    max="100"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block font-semibold mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="textarea textarea-bordered w-full"
                                    required
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="block font-semibold mb-2">Expiration Date</label>
                                <input
                                    type="date"
                                    name="expiration"
                                    value={formData.expiration}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="btn btn-ghost mr-2"
                                    onClick={() => setModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCoupons;