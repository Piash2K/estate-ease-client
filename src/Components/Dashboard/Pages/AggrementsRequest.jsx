import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Bars, RotatingLines } from "react-loader-spinner";

const AgreementRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // To track individual button loading states

    useEffect(() => {
        // Fetch all pending agreements
        fetch('https://estate-ease-server.vercel.app/agreements')
            .then((response) => response.json())
            .then((data) => {
                setRequests(data);
                setLoading(false); // Set loading to false when data is fetched
            })
            .catch((error) => {
                console.error("Error fetching agreement requests:", error);
                setLoading(false);
            });
    }, []);

    // Handle accepting the agreement
    const handleAccept = (agreementId) => {
        setActionLoading(agreementId); // Start loading for the action
        fetch(`https://estate-ease-server.vercel.app/agreements/${agreementId}/update`, {
            method: 'PUT',
            body: JSON.stringify({ status: 'accepted', role: 'member' }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then(() => {
                // Remove the request from the list
                setRequests(prevRequests => prevRequests.filter(req => req._id !== agreementId));
                setActionLoading(null); // Reset loading state
            })
            .catch(error => {
                console.error("Error accepting agreement:", error);
                setActionLoading(null);
            });
    };

    // Handle rejecting the agreement
    const handleReject = (agreementId) => {
        setActionLoading(agreementId); // Start loading for the action
        fetch(`https://estate-ease-server.vercel.app/agreements/${agreementId}/update`, {
            method: 'PUT',
            body: JSON.stringify({ status: 'rejected' }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then(() => {
                // Remove the request from the list
                setRequests(prevRequests => prevRequests.filter(req => req._id !== agreementId));
                setActionLoading(null); // Reset loading state
            })
            .catch(error => {
                console.error("Error rejecting agreement:", error);
                setActionLoading(null);
            });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Bars 
                    height="80" 
                    width="80" 
                    color="#4fa94d" 
                    ariaLabel="bars-loading" 
                    wrapperStyle={{}}
                    visible={true} 
                />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <Helmet><title>Agreement Requests | EstateEase</title></Helmet>
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Agreement Requests</h2>
            {requests.length === 0 ? (
                <p className="text-lg text-center text-gray-500">No agreement requests available.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table w-full border border-gray-200 rounded-lg shadow-lg">
                        <thead>
                            <tr className="bg-gray-100 text-gray-800">
                                <th className="p-3">User Name</th>
                                <th>User Email</th>
                                <th>Floor No</th>
                                <th>Block Name</th>
                                <th>Apartment No</th>
                                <th>Rent</th>
                                <th>Request Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map(request => (
                                <tr key={request._id} className="hover:bg-gray-50">
                                    <td className="p-3">{request.userName}</td>
                                    <td>{request.userEmail}</td>
                                    <td>{request.floorNo}</td>
                                    <td>{request.blockName}</td>
                                    <td>{request.apartmentNo}</td>
                                    <td>${request.rent}</td>
                                    <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                                    <td className="space-x-2">
                                        <button 
                                            onClick={() => handleAccept(request._id)} 
                                            disabled={actionLoading === request._id}
                                            className="btn btn-success btn-sm flex items-center gap-2"
                                        >
                                            {actionLoading === request._id ? <RotatingLines strokeColor="white" strokeWidth="5" animationDuration="0.75" width="20" visible={true} /> : "Accept"}
                                        </button>
                                        <button 
                                            onClick={() => handleReject(request._id)} 
                                            disabled={actionLoading === request._id}
                                            className="btn btn-error btn-sm flex items-center gap-2"
                                        >
                                            {actionLoading === request._id ? <RotatingLines strokeColor="white" strokeWidth="5" animationDuration="0.75" width="20" visible={true} /> : "Reject"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AgreementRequests;