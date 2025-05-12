import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bars } from "react-loader-spinner";

const fetchAgreements = async () => {
    const res = await fetch("https://estate-ease-server.vercel.app/agreements");
    return res.json();
};

const updateAgreement = async (agreementId, status, role = "") => {
    const res = await fetch(`https://estate-ease-server.vercel.app/agreements/${agreementId}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, role }),
    });
    return res.json();
};

const AgreementRequests = () => {
    const queryClient = useQueryClient();
    const { data: agreements, isLoading, isError } = useQuery({
        queryKey: ["agreements"],
        queryFn: fetchAgreements,
    });

    const updateMutation = useMutation({
        mutationFn: ({ agreementId, status, role }) => updateAgreement(agreementId, status, role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["agreements"] });
            Swal.fire({
                title: "Success!",
                text: "Agreement status updated successfully.",
                icon: "success",
                confirmButtonText: "Okay",
            });
        },
        onError: () => {
            Swal.fire("Error", "Failed to update agreement status.", "error");
        },
    });
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
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
    if (isError) return <div>Error loading agreements</div>;

    return (
        <div className="p-4 w-full">
            <Helmet>
                <title>Agreement Requests | EstateEase</title>
            </Helmet>
            <h2 className="text-2xl font-bold mb-4">Manage Agreement Requests</h2>

            <div className="overflow-x-auto">
                <table className="table w-full border">
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Email</th>
                            <th>Floor No</th>
                            <th>Block Name</th>
                            <th>Apartment No</th>
                            <th>Rent</th>
                            <th>Request Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agreements.map((agreement) => (
                            <tr key={agreement._id}>
                                <td>{agreement.userName}</td>
                                <td>{agreement.userEmail}</td>
                                <td>{agreement.floorNo}</td>
                                <td>{agreement.blockName}</td>
                                <td>{agreement.apartmentNo}</td>
                                <td>${agreement.rent}</td>
                                <td>{new Date(agreement.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-success mr-2"
                                        onClick={() => updateMutation.mutate({ agreementId: agreement._id, status: "accepted", role: "member" })}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className="btn btn-sm btn-error"
                                        onClick={() => updateMutation.mutate({ agreementId: agreement._id, status: "rejected" })}
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {agreements.length === 0 && (
                            <tr>
                                <td colSpan="8" className="text-center">
                                    No agreement requests available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AgreementRequests;