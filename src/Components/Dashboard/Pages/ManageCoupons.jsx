import { useState, useEffect } from "react";

const ManageCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        code: "",
        discount: "",
        description: "",
        expiry: "", // New expiration date field
    });

    useEffect(() => {
        // Fetch existing coupons from the database
        fetch("https://estate-ease-server.vercel.app/coupons")
            .then((res) => res.json())
            .then((data) => setCoupons(data))
            .catch((err) => console.error("Error fetching coupons:", err));
    }, []);

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Log formData to check values
        console.log("Form Data:", formData);
    
        const newCoupon = { ...formData };
    
        fetch("https://estate-ease-server.vercel.app/coupons", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newCoupon),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.couponId) {
                    setCoupons([...coupons, { ...newCoupon, _id: data.couponId }]);
                    setModalOpen(false); // Close the modal after submission
                }
            })
            .catch((err) => console.error("Error adding coupon:", err));
    };
    

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Manage Coupons</h2>
            
            {/* Coupon Table */}
            <div className="overflow-x-auto">
                <table className="table w-full border">
                    <thead>
                        <tr>
                            <th>Coupon Code</th>
                            <th>Discount (%)</th>
                            <th>Description</th>
                            <th>Expiration Date</th> {/* Added for expiration */}
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map((coupon) => (
                            <tr key={coupon._id}>
                                <td>{coupon.code}</td>
                                <td>{coupon.discount}</td>
                                <td>{coupon.description}</td>
                                <td>{coupon.expiration}</td> {/* Added for expiration */}
                            </tr>
                        ))}
                        {coupons.length === 0 && (
                            <tr>
                                <td colSpan="4" className="text-center">No coupons available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Add Coupon Button */}
            <div className="mt-4">
                <button
                    className="btn btn-primary"
                    onClick={() => setModalOpen(true)}
                >
                    Add Coupon
                </button>
            </div>
            
            {/* Add Coupon Modal */}
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-bold mb-4">Add New Coupon</h3>
                        
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
