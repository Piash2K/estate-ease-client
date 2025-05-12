import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Provider/AuthProvider";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { Helmet } from "react-helmet";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import Swal from "sweetalert2";
import { Bars } from "react-loader-spinner";  // Import the spinner

const stripePromise = loadStripe(import.meta.env.VITE_Payment_Gateway_PK);

const MakePayment = () => {
  const { user } = useContext(AuthContext);
  const [agreement, setAgreement] = useState(null);
  const [month, setMonth] = useState("");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalRent, setFinalRent] = useState(0);
  const [loading, setLoading] = useState(true);  // Loading state
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
          setLoading(false);  // Set loading to false once the data is fetched
        })
        .catch((error) => {
          console.error("Error fetching agreement:", error);
          setLoading(false);  // Set loading to false in case of error
        });
    }
  }, [user?.email]);

  const handleApplyCoupon = () => {
    if (!coupon) {
      Swal.fire({
        icon: "warning",
        title: "Coupon Code Required",
        text: "Please enter a coupon code.",
        confirmButtonColor: "#14B8A6",
      });
      return;
    }

    axios
      .get(`https://estate-ease-server.vercel.app/coupons/${coupon}`)
      .then((response) => {
        if (response.data?.discount) {
          const discountAmount = (agreement.rent * response.data.discount) / 100;
          setDiscount(response.data.discount);
          setFinalRent(agreement.rent - discountAmount);
          Swal.fire({
            icon: "success",
            title: "Coupon Applied!",
            text: `You got ${response.data.discount}% off!`,
            confirmButtonColor: "#14B8A6",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Invalid Coupon",
            text: "This coupon is not valid.",
            confirmButtonColor: "#EF4444",
          });
          setDiscount(0);
          setFinalRent(agreement.rent);
        }
      })
      .catch((error) => console.error("Error applying coupon:", error));
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

  if (!agreement) {
    return <p className="text-center text-gray-600 text-lg">No agreement details found.</p>;
  }

  return (
    <div className="p-6 border border-gray-200 rounded-lg shadow-lg ">
      <Helmet>
        <title>Make Payment | EstateEase</title>
      </Helmet>

      <h2 className="text-3xl font-bold  mb-6">Make Payment</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className=" font-medium">Email:</label>
          <input
            type="text"
            value={agreement.userEmail}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-md "
          />
        </div>
        <div>
          <label className=" font-medium">Floor:</label>
          <input
            type="text"
            value={agreement.floorNo}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-md "
          />
        </div>
        <div>
          <label className=" font-medium">Block Name:</label>
          <input
            type="text"
            value={agreement.blockName}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-md "
          />
        </div>
        <div>
          <label className=" font-medium">Apartment No:</label>
          <input
            type="text"
            value={agreement.apartmentNo}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-md "
          />
        </div>
        <div>
          <label className=" font-medium">Original Rent:</label>
          <input
            type="text"
            value={agreement.rent}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-md "
          />
        </div>
        <div>
          <label className=" font-medium">Final Rent:</label>
          <input
            type="text"
            value={finalRent}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-md "
          />
        </div>
        <div className="mt-6">
          <label className=" font-medium">Select Month:</label>
          <select
  value={month}
  onChange={(e) => setMonth(e.target.value)}
  className="w-full p-3 border border-gray-300 rounded-md appearance-none"
>
  <option value="" className="bg-black text-white">Choose Month</option>
  {[
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ].map((m, i) => (
    <option key={i} value={m} className="bg-black text-white">
      {m}
    </option>
  ))}
</select>

        </div>
        <div className="mt-6">
          <label className=" font-medium">Coupon Code:</label>
          <div className="flex flex-col sm:flex-row">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-l-md  mb-4 sm:mb-0 sm:rounded-l-md"
            />
            <button
              onClick={handleApplyCoupon}
              className="px-6 py-3 bg-teal-600 text-white font-medium rounded-md sm:rounded-r-md hover:bg-teal-700 transition-all"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        {month ? (
          <Elements stripe={stripePromise}>
            <CheckoutForm finalRent={finalRent} month={month} agreement={agreement} />
          </Elements>
        ) : (
          <p className="text-red-500 font-medium">Please select a month before proceeding.</p>
        )}
      </div>
    </div>
  );
};

export default MakePayment;