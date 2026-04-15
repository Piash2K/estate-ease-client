import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../../api/apiClient";

const fetchAgreements = async () => {
    return apiFetch('/agreements');
};

const updateAgreement = async (agreementId, status, role = "") => {
    return apiFetch(`/agreements/${agreementId}/update`, {
        method: "PUT",
        body: JSON.stringify({ status, role })
    });
};

const AgreementRequests = () => {
    const queryClient = useQueryClient();
    const { data: agreements = [], isLoading, isError } = useQuery({
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
            <div className="ml-0 p-4 md:ml-72 md:p-6">
                <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
                <div className="mt-4 overflow-hidden rounded-lg border border-base-300 bg-base-100 p-4">
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
    if (isError) return <div>Error loading agreements</div>;

    return (
        <div className="p-4 md:p-6 max-w-6xl mx-auto w-full">
            <Helmet>
                <title>Agreement Requests | EstateEase</title>
            </Helmet>
            <h2 className="text-2xl font-bold mb-4">Manage Agreement Requests</h2>

            <div className="overflow-x-auto">
                <table className="table w-full min-w-[720px] border text-sm md:text-base">
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
                                <td className="break-all max-w-[120px]">{agreement.userEmail}</td>
                                <td>{agreement.floorNo}</td>
                                <td>{agreement.blockName}</td>
                                <td>{agreement.apartmentNo}</td>
                                <td>${agreement.rent}</td>
                                <td>{new Date(agreement.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <div className="flex flex-col gap-2 sm:flex-row">
                                        <button
                                            className="btn btn-sm btn-success"
                                            disabled={updateMutation.isPending}
                                            onClick={() => updateMutation.mutate({ agreementId: agreement._id, status: "accepted", role: "member" })}
                                        >
                                            Accept
                                        </button>
                                        <button
                                            className="btn btn-sm btn-error"
                                            disabled={updateMutation.isPending}
                                            onClick={() => updateMutation.mutate({ agreementId: agreement._id, status: "rejected" })}
                                        >
                                            Reject
                                        </button>
                                    </div>
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