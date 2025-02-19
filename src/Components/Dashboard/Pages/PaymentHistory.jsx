import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../Provider/AuthProvider';
import { Helmet } from 'react-helmet';

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
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <Helmet>
                <title>Payment History | EstateEase</title>
            </Helmet>
            <div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Payment History</h2>
                {payments.length === 0 ? (
                    <p className="text-gray-600">No payment history available.</p>
                ) : (
                    <>
                        {/* Mobile Layout */}
                        <div className="block lg:hidden">
                            {payments.map((payment) => (
                                <div key={payment._id} className="bg-white shadow rounded-lg p-4 mb-6">
                                    <div className="text-gray-600">
                                        <div className="mb-2">
                                            <strong>Floor No:</strong> {payment.floorNo}
                                        </div>
                                        <div className="mb-2">
                                            <strong>Block Name:</strong> {payment.blockName}
                                        </div>
                                        <div className="mb-2">
                                            <strong>Apartment No:</strong> {payment.apartmentNo}
                                        </div>
                                        <div className="mb-2">
                                            <strong>Original Rent:</strong> {payment.originalRent}
                                        </div>
                                        <div className="mb-2">
                                            <strong>Final Rent:</strong> {payment.finalRent}
                                        </div>
                                        <div className="mb-2">
                                            <strong>Month:</strong> {payment.month}
                                        </div>
                                        <div className="mb-2">
                                            <strong>Payment Date:</strong> {new Date(payment.paymentDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Layout */}
                        <div className="hidden lg:block shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Floor No
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Block Name
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Apartment No
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Original Rent
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Final Rent
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Month
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Payment Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {payments.map((payment) => (
                                            <tr key={payment._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {payment.floorNo}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {payment.blockName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {payment.apartmentNo}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {payment.originalRent}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {payment.finalRent}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {payment.month}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(payment.paymentDate).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentHistory;
