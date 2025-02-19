import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Provider/AuthProvider";
import Swal from "sweetalert2";

const CheckoutForm = ({ finalRent, month, agreement }) => {
  const { user } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    axios.post('https://estate-ease-server.vercel.app/create-payment-intent', { price: finalRent })
      .then(res => {
        setClientSecret(res.data.clientSecret);
      });
  }, [finalRent]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    const card = elements.getElement(CardElement);
    if (card === null) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });
    if (error) {
      setError(error.message);
    } else {
      setError('');
    }
    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          email: user?.email || 'anonymous',
          name: user?.displayName || 'anonymous',
        }
      }
    });

    if (confirmError) {
      console.log("Confirm error", confirmError);
    } else {
      console.log('Payment intent', paymentIntent);
      if (paymentIntent.status === 'succeeded') {
        console.log('Transaction ID:', paymentIntent.id);
        setTransactionId(paymentIntent.id);

        const paymentDetails = {
          userEmail: agreement.userEmail,
          floorNo: agreement.floorNo,
          blockName: agreement.blockName,
          apartmentNo: agreement.apartmentNo,
          originalRent: agreement.rent,
          finalRent: finalRent,
          discount: agreement.discount,
          month: month,
          transactionId: paymentIntent.id,
        };
        axios.post('https://estate-ease-server.vercel.app/payments', paymentDetails)
          .then(response => {
            Swal.fire({
              title: 'Success!',
              text: 'Payment recorded successfully!',
              icon: 'success',
              confirmButtonText: 'OK'
            });
          })
          .catch(error => {
            console.error("Error saving payment info:", error);
            Swal.fire({
              title: 'Error!',
              text: 'Failed to record payment.',
              icon: 'error',
              confirmButtonText: 'Try Again'
            });
          });
      }
    }
  };

  return (
    <div className="bg-white shadow-lg p-6 rounded-xl border border-gray-200">
      <h3 className="text-2xl font-semibold text-gray-800 text-center mb-4">Payment Details</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 border border-gray-300 rounded-md">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#333',
                  fontWeight: '500',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#ff4d4d',
                },
              },
            }}
          />
        </div>

        <button
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 rounded-lg transition-all"
          type="submit"
          disabled={!stripe || !clientSecret}
        >
          Pay
        </button>

        {error && <p className="text-red-600 text-center">{error}</p>}
        {transactionId && <p className="text-green-600 text-center font-medium">Your transaction ID: {transactionId}</p>}
      </form>
    </div>
  );
};

export default CheckoutForm;