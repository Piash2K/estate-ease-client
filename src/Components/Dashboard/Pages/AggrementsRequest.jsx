import { useEffect, useState } from "react";

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
        return <div>Loading agreement requests...</div>;
    }

    return (
        <div>
            <h2>Agreement Requests</h2>
            {requests.length === 0 ? (
                <p>No agreement requests available.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>User Name</th>
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
                            <tr key={request._id}>
                                <td>{request.userName}</td>
                                <td>{request.userEmail}</td>
                                <td>{request.floorNo}</td>
                                <td>{request.blockName}</td>
                                <td>{request.apartmentNo}</td>
                                <td>{request.rent}</td>
                                <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button 
                                        onClick={() => handleAccept(request._id)} 
                                        disabled={actionLoading === request._id}
                                        aria-label={`Accept request for ${request.userName}`}
                                    >
                                        {actionLoading === request._id ? "Processing..." : "Accept"}
                                    </button>
                                    <button 
                                        onClick={() => handleReject(request._id)} 
                                        disabled={actionLoading === request._id}
                                        aria-label={`Reject request for ${request.userName}`}
                                    >
                                        {actionLoading === request._id ? "Processing..." : "Reject"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AgreementRequests;