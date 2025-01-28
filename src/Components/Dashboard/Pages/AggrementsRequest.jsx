import { useEffect, useState } from "react";

const AgreementRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch all pending agreements
        fetch('http://localhost:5000/agreements')
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
        fetch(`http://localhost:5000/agreements/${agreementId}/update`, {
            method: 'PUT',
            body: JSON.stringify({ status: 'accepted', role: 'member' }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then(() => {
                // Remove the request from the list
                setRequests(prevRequests => prevRequests.filter(req => req._id !== agreementId));
            })
            .catch(error => console.error("Error accepting agreement:", error));
    };

    // Handle rejecting the agreement
    const handleReject = (agreementId) => {
        fetch(`http://localhost:5000/agreements/${agreementId}/update`, {
            method: 'PUT',
            body: JSON.stringify({ status: 'rejected' }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then(() => {
                // Remove the request from the list
                setRequests(prevRequests => prevRequests.filter(req => req._id !== agreementId));
            })
            .catch(error => console.error("Error rejecting agreement:", error));
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
                                    <button onClick={() => handleAccept(request._id, request.userEmail)}>Accept</button>
                                    <button onClick={() => handleReject(request._id)}>Reject</button>
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