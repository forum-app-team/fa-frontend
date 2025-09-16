import apiClient from "@/libs/axios";

export const getPublicUsers = async (ids=[]) => {
    if (!ids.length) return {};
    const q = ids.join(",");
    return (await apiClient.get(`/api/auth/public_users?ids=${q}`)).data;
};