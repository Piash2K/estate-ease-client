import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Bars } from 'react-loader-spinner';
import { apiFetch } from '../../../api/apiClient';

const ManageMembers = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch the list of members when the component mounts
    useEffect(() => {
        apiFetch('/users')
            .then(data => {
                setMembers(Array.isArray(data) ? data : data.data || []);
            })
            .catch(error => console.error('Error fetching members:', error))
            .finally(() => setLoading(false));
    }, []);

    const handleRemoveMember = (userId) => {
        apiFetch(`/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify({ role: 'user' })
        })
            .then(() => {
                setMembers((prevMembers) =>
                    prevMembers.map((member) =>
                        member._id === userId ? { ...member, role: 'user' } : member
                    )
                );
                alert('Member role updated to user successfully!');
            })
            .catch((error) => {
                console.error('Error updating member role:', error);
                alert('Failed to update member role.');
            });
    };

    if (loading) {
        return (
            <div className="ml-0 flex min-h-[60vh] items-center justify-center p-4 md:ml-72 md:p-6">
                <Bars 
                    height="80" 
                    width="80" 
                    color="#14B8A6" 
                    ariaLabel="bars-loading" 
                    wrapperStyle={{}}
                    visible={true} 
                />
            </div>
        );
    }

    return (
        <div className="ml-0 p-4 md:ml-72 md:p-6">
            <Helmet><title>Manage Members | EstateEase </title></Helmet>
            <h2 className="text-2xl font-bold mb-4">Manage Members</h2>
            {members.length === 0 ? (
                <p className="text-gray-600">No users available.</p>
            ) : (
                <div className="mt-4 overflow-hidden rounded-lg border border-base-300 bg-base-100">
                    <div className="overflow-x-auto">
                    <table className="table w-full min-w-[680px]">
                        <thead className="bg-base-200/70">
                            <tr >
                                <th className="px-4 py-2 border-b text-left">User Name</th>
                                <th className="px-4 py-2 border-b text-left">User Email</th>
                                <th className="px-4 py-2 border-b text-left">Role</th>
                                <th className="px-4 py-2 border-b text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member) => (
                                <tr key={member._id} className="border-b">
                                    <td className="px-4 py-2">{member.displayName || 'Unknown'}</td>
                                    <td className="px-4 py-2 break-all">{member.email}</td>
                                    <td className="px-4 py-2">{member.role}</td>
                                    <td className="px-4 py-2">
                                        {(member.role || '').toLowerCase() === 'member' ? (
                                            <button
                                                className="btn btn-sm btn-error"
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
                </div>
            )}
        </div>
    );
};

export default ManageMembers;