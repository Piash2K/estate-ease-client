import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Provider/AuthProvider";


const MakePayment = () => {
    const { user } = useContext(AuthContext);
    const [agreement, setAgreement] = useState(null);
    const [month, setMonth] = useState("");
    const [coupon, setCoupon] = useState("");
    const [discount, setDiscount] = useState(0);
    const [finalRent, setFinalRent] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.email) {
            // Fetch agreement details for the logged-in user
            fetch(`http://localhost:5000/agreements/${user.email}`)
                .then((response) => response.json())
                .then((data) => {
                    setAgreement(data);
                    if (data) setFinalRent(data.rent);
                })
                .catch((error) => console.error("Error fetching agreement:", error));
        }
    }, [user?.email]);

    const handleApplyCoupon = () => {
        fetch(`http://localhost:5000/coupons/${coupon}`)
            .then((response) => {
                if (!response.ok) {
                    return null;
                }
                return response.json();
            })
            .then((data) => {
                if (data && data.discount) {
                    const discountAmount = (agreement.rent * data.discount) / 100;
                    setDiscount(data.discount);
                    setFinalRent(agreement.rent - discountAmount);
                } else {
                    alert("Invalid Coupon");
                    setDiscount(0);
                    setFinalRent(agreement.rent);
                }
            })
            .catch((error) => {
                console.error("Error fetching coupon:", error);
            });
    };

    const handlePayment = () => {
        if (!month) {
            alert("Please select a month.");
            return;
        }
        // Payment submission logic
        const paymentDetails = {
            userEmail: agreement.userEmail,
            floorNo: agreement.floorNo,
            blockName: agreement.blockName,
            apartmentNo: agreement.apartmentNo,
            originalRent: agreement.rent,
            finalRent,
            discount,
            month,
        };

        fetch("http://localhost:5000/payments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(paymentDetails),
        })
            .then((response) => response.json())
            .then(() => {
                alert("Payment successful!");
                navigate("/dashboard/payment-history");
            })
            .catch((error) => {
                console.error("Error submitting payment:", error);
            });
    };

    if (!agreement) {
        return <p>Loading agreement details...</p>;
    }

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
            <h2 className="text-2xl font-bold mb-4">Make Payment</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-4">
                    <label className="block font-semibold">Email:</label>
                    <input
                        type="text"
                        value={agreement.userEmail}
                        readOnly
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold">Floor:</label>
                    <input
                        type="text"
                        value={agreement.floorNo}
                        readOnly
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold">Block Name:</label>
                    <input
                        type="text"
                        value={agreement.blockName}
                        readOnly
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold">Apartment/Room No:</label>
                    <input
                        type="text"
                        value={agreement.apartmentNo}
                        readOnly
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold">Rent:</label>
                    <input
                        type="text"
                        value={agreement.rent}
                        readOnly
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold">Month:</label>
                    <input
                        type="text"
                        placeholder="Enter month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold">Coupon:</label>
                    <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                    <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="mt-2 p-2 bg-blue-500 text-white rounded"
                    >
                        Apply Coupon
                    </button>
                </div>
                <div className="mb-4">
                    <label className="block font-semibold">Final Rent:</label>
                    <input
                        type="text"
                        value={finalRent}
                        readOnly
                        className="w-full p-2 border rounded"
                    />
                </div>
                <button
                    type="button"
                    onClick={handlePayment}
                    className="w-full p-2 bg-green-500 text-white rounded"
                >
                    Pay
                </button>
            </form>
        </div>
    );
};

export default MakePayment;
