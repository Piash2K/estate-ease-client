import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Provider/AuthProvider";

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
            alert('Payment recorded successfully!');
          })
          .catch(error => {
            console.error("Error saving payment info:", error);
            alert("Failed to record payment.");
          });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
      <button className="btn-primary my-4 w-full bg-indigo-600 py-2 rounded-lg" type="submit" disabled={!stripe || !clientSecret}>
        Pay
      </button>
      <p className="text-red-600">{error}</p>
      {transactionId && <p className="text-green-600">Your transaction id: {transactionId}</p>}
    </form>
  );
};

export default CheckoutForm;