import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../Provider/AuthProvider';
import { Helmet } from 'react-helmet';
import { apiFetch } from '../../../api/apiClient';

const PaymentHistory = () => {
    const { user } = useContext(AuthContext);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.email) {
            apiFetch(`/payments/${user.email}`)
                .then(data => {
                    setPayments(Array.isArray(data) ? data : data.data || []);
                })
                .catch(error => console.error('Error fetching payments:', error))
                .finally(() => setLoading(false));
        }
    }, [user?.email]);

    if (loading) {
        return (
            <div className="ml-0 p-4 md:ml-72 md:p-6">
                <div className="h-8 w-56 animate-pulse rounded bg-gray-200" />
                <div className="mt-4 rounded-lg border border-base-300 bg-base-100 p-4">
                    <div className="mb-3 h-12 w-full animate-pulse rounded bg-gray-200" />
                    <div className="space-y-3">
                        <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
                        <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
                        <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="ml-0 min-h-screen p-4 md:ml-72 md:p-6">
            <Helmet>
                <title>Payment History | EstateEase</title>
            </Helmet>
            <div>
                <h2 className="mb-6 text-2xl font-bold md:mb-8 md:text-3xl">Payment History</h2>
                {payments.length === 0 ? (
                    <p className="text-gray-600">No payment history available.</p>
                ) : (
                    <>
                        {/* Mobile Layout */}
                        <div className="block lg:hidden">
                            {payments.map((payment) => (
                                <div key={payment._id} className="mb-4 rounded-lg border border-base-300 bg-base-100 p-4 shadow-sm">
                                    <div >
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
                        <div className="hidden overflow-hidden rounded-lg border border-base-300 bg-base-100 shadow-sm lg:block">
                            <div className="overflow-x-auto">
                                <table className="table w-full min-w-[900px]">
                                    <thead className="bg-base-200/60">
                                        <tr>
                                            <th scope="col" className="text-left text-xs font-medium uppercase tracking-wider">
                                                Floor No
                                            </th>
                                            <th scope="col" className="text-left text-xs font-medium uppercase tracking-wider">
                                                Block Name
                                            </th>
                                            <th scope="col" className="text-left text-xs font-medium uppercase tracking-wider">
                                                Apartment No
                                            </th>
                                            <th scope="col" className="text-left text-xs font-medium uppercase tracking-wider">
                                                Original Rent
                                            </th>
                                            <th scope="col" className="text-left text-xs font-medium uppercase tracking-wider">
                                                Final Rent
                                            </th>
                                            <th scope="col" className="text-left text-xs font-medium uppercase tracking-wider">
                                                Month
                                            </th>
                                            <th scope="col" className="text-left text-xs font-medium uppercase tracking-wider">
                                                Payment Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.map((payment) => (
                                            <tr key={payment._id}>
                                                <td className="whitespace-nowrap text-sm">
                                                    {payment.floorNo}
                                                </td>
                                                <td className="whitespace-nowrap text-sm">
                                                    {payment.blockName}
                                                </td>
                                                <td className="whitespace-nowrap text-sm">
                                                    {payment.apartmentNo}
                                                </td>
                                                <td className="whitespace-nowrap text-sm">
                                                    {payment.originalRent}
                                                </td>
                                                <td className="whitespace-nowrap text-sm">
                                                    {payment.finalRent}
                                                </td>
                                                <td className="whitespace-nowrap text-sm">
                                                    {payment.month}
                                                </td>
                                                <td className="whitespace-nowrap text-sm">
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
