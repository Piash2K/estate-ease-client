import { useEffect, useState } from 'react';

const ManageMembers = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch the list of members when the component mounts
    useEffect(() => {
        fetch('http://localhost:5000/users')
            .then((response) => response.json())
            .then((data) => {
                setMembers(data);
            })
            .catch((error) => console.error('Error fetching members:', error))
            .finally(() => setLoading(false));
    }, []);

    const handleRemoveMember = (userId) => {
        fetch(`http://localhost:5000/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: 'user' }),
        })
            .then((response) => {
                if (response.ok) {
                    setMembers((prevMembers) =>
                        prevMembers.map((member) =>
                            member._id === userId ? { ...member, role: 'user' } : member
                        )
                    );
                    alert('Member role updated to user successfully!');
                } else {
                    alert('Failed to update member role.');
                }
            })
            .catch((error) => {
                console.error('Error updating member role:', error);
                alert('Failed to update member role.');
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>Manage Members</h2>
            {members.length === 0 ? (
                <p>No members available.</p>
            ) : (
                <table style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f0f0f0', textAlign: 'left' }}>
                            <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>User Name</th>
                            <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>User Email</th>
                            <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Role</th>
                            <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member) => (
                            <tr key={member._id}>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                                    {member.displayName || 'N/A'}
                                </td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                                    {member.email}
                                </td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                                    {member.role}
                                </td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                                    {member.role === 'member' ? (
                                        <button
                                            style={{
                                                padding: '5px 10px',
                                                backgroundColor: '#ff4d4f',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => handleRemoveMember(member._id)}
                                        >
                                            Remove
                                        </button>
                                    ) : (
                                        'N/A'
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ManageMembers;