import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";

const ManageCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [currentCouponId, setCurrentCouponId] = useState(null);
    const [formData, setFormData] = useState({
        code: "",
        discount: "",
        description: "",
        expiration: "",
    });

    useEffect(() => {
        fetch("https://estate-ease-server.vercel.app/coupons")
            .then((res) => res.json())
            .then((data) => setCoupons(data))
            .catch((err) => console.error("Error fetching coupons:", err));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newCoupon = { ...formData };

        const endpoint = isUpdate
            ? `https://estate-ease-server.vercel.app/coupons/${currentCouponId}`
            : "https://estate-ease-server.vercel.app/coupons";

        const method = isUpdate ? "PUT" : "POST";

        fetch(endpoint, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newCoupon),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success || data.couponId) {
                    const updatedCoupons = isUpdate
                        ? coupons.map((coupon) =>
                              coupon._id === currentCouponId
                                  ? { ...newCoupon, _id: currentCouponId }
                                  : coupon
                          )
                        : [...coupons, { ...newCoupon, _id: data.couponId }];
                    setCoupons(updatedCoupons);
                    setModalOpen(false);
                }
            })
            .catch((err) => console.error("Error saving coupon:", err));
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
                fetch(`https://estate-ease-server.vercel.app/coupons/${id}`, {
                    method: "DELETE",
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.success) {
                            setCoupons(coupons.filter((coupon) => coupon._id !== id));
                            Swal.fire("Deleted!", "Your coupon has been deleted.", "success");
                        }
                    })
                    .catch((err) => console.error("Error deleting coupon:", err));
            }
        });
    };

    return (
        <div className="p-4">
            <Helmet>
                <title>Manage Coupons | EstateEase</title>
            </Helmet>
            <h2 className="text-2xl font-bold mb-4">Manage Coupons</h2>

            {/* Coupon Table */}
            <div className="overflow-x-auto">
                <table className="table w-full border">
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
                                    <button
                                        className="btn btn-sm btn-warning mr-2"
                                        onClick={() => handleUpdateClick(coupon)}
                                    >
                                        Update
                                    </button>
                                    <button
                                        className="btn btn-sm btn-error"
                                        onClick={() => handleDelete(coupon._id)}
                                    >
                                        Delete
                                    </button>
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
                    className="btn btn-primary"
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
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
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