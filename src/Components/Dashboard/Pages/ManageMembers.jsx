import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Bars } from 'react-loader-spinner'; // Importing the spinner

const ManageMembers = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch the list of members when the component mounts
    useEffect(() => {
        fetch('https://estate-ease-server.vercel.app/users')
            .then((response) => response.json())
            .then((data) => {
                setMembers(data);
            })
            .catch((error) => console.error('Error fetching members:', error))
            .finally(() => setLoading(false));
    }, []);

    const handleRemoveMember = (userId) => {
        fetch(`https://estate-ease-server.vercel.app/users/${userId}`, {
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
        <div className="p-6">
            <h2 className="text-2xl font-semibold">Manage Members</h2>
            <Helmet><title>Manage Members | EstateEase </title></Helmet>
            {members.length === 0 ? (
                <p>No members available.</p>
            ) : (
                <div className="overflow-x-auto mt-4">
                    <table className="table-auto w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 border-b text-left">User Name</th>
                                <th className="px-4 py-2 border-b text-left">User Email</th>
                                <th className="px-4 py-2 border-b text-left">Role</th>
                                <th className="px-4 py-2 border-b text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member) => (
                                <tr key={member._id} className="border-b">
                                    <td className="px-4 py-2">{member.displayName}</td>
                                    <td className="px-4 py-2">{member.email}</td>
                                    <td className="px-4 py-2">{member.role}</td>
                                    <td className="px-4 py-2">
                                        {member.role === 'member' ? (
                                            <button
                                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
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
                </div>
            )}
        </div>
    );
};

export default ManageMembers;