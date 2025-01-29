import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Provider/AuthProvider";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { Helmet } from "react-helmet";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

// Load Stripe outside of a component to prevent recreating the object on each render.
const stripePromise = loadStripe(import.meta.env.VITE_Payment_Gateway_PK);

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
      axios
        .get(`https://estate-ease-server.vercel.app/agreements/${user.email}`)
        .then((response) => {
          if (response.data) {
            setAgreement(response.data);
            setFinalRent(response.data.rent);
          }
        })
        .catch((error) => console.error("Error fetching agreement:", error));
    }
  }, [user?.email]);

  const handleApplyCoupon = () => {
    if (!coupon) {
      alert("Please enter a coupon code.");
      return;
    }

    axios
      .get(`https://estate-ease-server.vercel.app/coupons/${coupon}`)
      .then((response) => {
        if (response.data?.discount) {
          const discountAmount = (agreement.rent * response.data.discount) / 100;
          setDiscount(response.data.discount);
          setFinalRent(agreement.rent - discountAmount);
        } else {
          alert("Invalid Coupon");
          setDiscount(0);
          setFinalRent(agreement.rent);
        }
      })
      .catch((error) => console.error("Error applying coupon:", error));
  };

  // Month validation & Payment proceed
  const handlePayment = () => {
    if (!month) {
      alert("Month field is required!");
      return;
    }
    navigate("/payment"); // Change this as per your navigation logic
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];

  if (!agreement) {
    return <p>Loading agreement details...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <Helmet><title>Make Payment | EstateEase</title></Helmet>
      <h2 className="text-2xl font-bold mb-4">Make Payment</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="mb-4">
          <label className="block font-semibold">Email:</label>
          <input type="text" value={agreement.userEmail} readOnly className="w-full p-2 border rounded" />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Floor:</label>
          <input type="text" value={agreement.floorNo} readOnly className="w-full p-2 border rounded" />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Block Name:</label>
          <input type="text" value={agreement.blockName} readOnly className="w-full p-2 border rounded" />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Apartment/Room No:</label>
          <input type="text" value={agreement.apartmentNo} readOnly className="w-full p-2 border rounded" />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Rent:</label>
          <input type="text" value={agreement.rent} readOnly className="w-full p-2 border rounded" />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Month:</label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Month</option>
            {monthNames.map((monthName, index) => (
              <option key={index} value={monthName}>
                {monthName}
              </option>
            ))}
          </select>
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
          <button type="button" onClick={handleApplyCoupon} className="mt-2 p-2 bg-blue-500 text-white rounded">Apply Coupon</button>
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Final Rent:</label>
          <input type="text" value={finalRent} readOnly className="w-full p-2 border rounded" />
        </div>
      </form>

      {/* Conditional Rendering based on Month field validation */}
      {month ? (
        <Elements stripe={stripePromise}>
          <CheckoutForm finalRent={finalRent} month={month} agreement={agreement} />
        </Elements>
      ) : (
        <p className="text-red-500">Please fill in the "Month" field to proceed with payment.</p>
      )}
    </div>
  );
};

export default MakePayment;