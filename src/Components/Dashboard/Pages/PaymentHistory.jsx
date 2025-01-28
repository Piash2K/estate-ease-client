import  { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../Provider/AuthProvider';


const PaymentHistory = () => {
    const { user } = useContext(AuthContext);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.email) {
            fetch(`https://estate-ease-server.vercel.app/payments/${user.email}`)
                .then(response => response.json())
                .then(data => {
                    setPayments(data); 
                })
                .finally(() => setLoading(false)); 
        }
    }, [user?.email]);
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="payment-history">
            <h2>Payment History</h2>
            {payments.length === 0 ? (
                <p>No payment history available.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Floor No</th>
                            <th>Block Name</th>
                            <th>Apartment No</th>
                            <th>Original Rent</th>
                            <th>Final Rent</th>
                            <th>Month</th>
                            <th>Payment Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment) => (
                            <tr key={payment._id}>
                                <td>{payment.floorNo}</td>
                                <td>{payment.blockName}</td>
                                <td>{payment.apartmentNo}</td>
                                <td>{payment.originalRent}</td>
                                <td>{payment.finalRent}</td>
                                <td>{payment.month}</td>
                                <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default PaymentHistory;
