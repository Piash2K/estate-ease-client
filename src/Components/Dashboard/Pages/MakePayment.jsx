/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Provider/AuthProvider";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { Helmet } from "react-helmet";

// Load Stripe outside of a component to prevent recreating the object on each render.
const stripePromise = loadStripe("pk_test_51QmDiTFRZePTg8h6jyQVxOBc4lWNS2fD5bGwX0jNqKHIKPeNE3uKyikKsGziYRVCc5hn8wolnIaBRhTEfMH4UzEr002JXooCIS");

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
          setAgreement(response.data);
          if (response.data) setFinalRent(response.data.rent);
        });
    }
  }, [user?.email]);

  const handleApplyCoupon = () => {
    axios
      .get(`https://estate-ease-server.vercel.app/coupons/${coupon}`)
      .then((response) => {
        if (response.data && response.data.discount) {
          const discountAmount = (agreement.rent * response.data.discount) / 100;
          setDiscount(response.data.discount);
          setFinalRent(agreement.rent - discountAmount);
        } else {
          alert("Invalid Coupon");
          setDiscount(0);
          setFinalRent(agreement.rent);
        }
      });
  };

  const handlePayment = () => {
    if (!month) {
      alert("Please select a month.");
      return;
    }

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

    axios
      .post("https://estate-ease-server.vercel.app/payments", paymentDetails)
      .then(() => {
        alert("Payment successful!");
        navigate("/dashboard/payment-history");
      });
  };

  if (!agreement) {
    return <p>Loading agreement details...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
        <Helmet><title>Make Payment| EstateEase </title></Helmet>
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

        <Elements stripe={stripePromise}>
          <CheckoutForm
            amount={finalRent}
            onSuccess={handlePayment}
          />
        </Elements>
      </form>
    </div>
  );
};

const CheckoutForm = ({ amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return; // Stripe has not yet loaded or Elements not initialized
    }

    // Step 1: Create Payment Method with the Card Element
    const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (paymentMethodError) {
      console.error(paymentMethodError);
      return;
    }

    // Step 2: Call backend to create a Payment Intent
    axios
      .post("https://estate-ease-server.vercel.app/create-payment-intent", {
        amount: amount * 100, // Convert the amount to cents
        paymentMethodId: paymentMethod.id,
      })
      .then((response) => {
        if (!response.data.clientSecret) {
          console.error("No client secret received from backend");
          return;
        }

        // Step 3: Confirm the payment with the returned client secret
        stripe.confirmCardPayment(response.data.clientSecret).then(({ error, paymentIntent }) => {
          if (error) {
            console.error("Error confirming the card payment:", error.message);
          } else {
            if (paymentIntent.status === "succeeded") {
              console.log("Payment succeeded!");
              onSuccess();
            } else {
              console.error(`PaymentIntent status is ${paymentIntent.status}.`);
            }
          }
        });
      });
  };

  return (
    <div>
      {/* Card Element for user to enter card details */}
      <CardElement />
      
      <button
        type="button"
        disabled={!stripe || !elements}
        onClick={handleSubmit}
        className="w-full p-2 bg-green-500 text-white rounded mt-4"
      >
        Pay Now
      </button>
    </div>
  );
};

export default MakePayment;