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
            <div className="w-full p-4 md:p-6">
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

    if (isError) return <div className="p-4 text-center text-red-500">Error loading agreements</div>;

    return (
        <div className="w-full px-4 py-4 md:px-6 md:py-6">
            <Helmet>
                <title>Agreement Requests | EstateEase</title>
            </Helmet>
            
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Manage Agreement Requests</h2>

            {/* Card View for Mobile */}
            <div className="block md:hidden space-y-4">
                {agreements.map((agreement) => (
                    <div key={agreement._id} className="bg-base-100 rounded-lg border border-base-300 p-4 shadow-sm">
                        <div className="space-y-2">
                            <div className="flex justify-between items-start">
                                <span className="font-semibold text-gray-600">User Name:</span>
                                <span className="text-gray-800">{agreement.userName}</span>
                            </div>
                            <div className="flex justify-between items-start">
                                <span className="font-semibold text-gray-600">Email:</span>
                                <span className="text-gray-800 break-all text-right ml-2">{agreement.userEmail}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-600">Floor No:</span>
                                <span className="text-gray-800">{agreement.floorNo}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-600">Block Name:</span>
                                <span className="text-gray-800">{agreement.blockName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-600">Apartment No:</span>
                                <span className="text-gray-800">{agreement.apartmentNo}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-600">Rent:</span>
                                <span className="text-gray-800 font-medium">${agreement.rent}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-600">Request Date:</span>
                                <span className="text-gray-800">{new Date(agreement.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex gap-2 pt-3">
                                <button
                                    className="flex-1 btn btn-sm btn-success"
                                    disabled={updateMutation.isPending}
                                    onClick={() => updateMutation.mutate({ agreementId: agreement._id, status: "accepted", role: "member" })}
                                >
                                    Accept
                                </button>
                                <button
                                    className="flex-1 btn btn-sm btn-error"
                                    disabled={updateMutation.isPending}
                                    onClick={() => updateMutation.mutate({ agreementId: agreement._id, status: "rejected" })}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {agreements.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No agreement requests available
                    </div>
                )}
            </div>

            {/* Table View for Tablet and Desktop */}
            <div className="hidden md:block overflow-x-auto">
                <table className="table w-full border text-sm lg:text-base">
                    <thead>
                        <tr className="bg-base-200">
                            <th className="px-4 py-3 text-left">User Name</th>
                            <th className="px-4 py-3 text-left">Email</th>
                            <th className="px-4 py-3 text-left">Floor No</th>
                            <th className="px-4 py-3 text-left">Block Name</th>
                            <th className="px-4 py-3 text-left">Apartment No</th>
                            <th className="px-4 py-3 text-left">Rent</th>
                            <th className="px-4 py-3 text-left">Request Date</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agreements.map((agreement) => (
                            <tr key={agreement._id} className="border-b hover:bg-base-200 transition-colors">
                                <td className="px-4 py-3">{agreement.userName}</td>
                                <td className="px-4 py-3 max-w-[200px] break-all">{agreement.userEmail}</td>
                                <td className="px-4 py-3">{agreement.floorNo}</td>
                                <td className="px-4 py-3">{agreement.blockName}</td>
                                <td className="px-4 py-3">{agreement.apartmentNo}</td>
                                <td className="px-4 py-3 font-medium">${agreement.rent}</td>
                                <td className="px-4 py-3">{new Date(agreement.createdAt).toLocaleDateString()}</td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <button
                                            className="btn btn-xs lg:btn-sm btn-success"
                                            disabled={updateMutation.isPending}
                                            onClick={() => updateMutation.mutate({ agreementId: agreement._id, status: "accepted", role: "member" })}
                                        >
                                            Accept
                                        </button>
                                        <button
                                            className="btn btn-xs lg:btn-sm btn-error"
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
                                <td colSpan="8" className="text-center py-8 text-gray-500">
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