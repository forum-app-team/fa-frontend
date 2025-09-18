import apiClient from "@/libs/axios";
import { API_CONFIG } from "@/config/api.config";

export async function getUserProfile(userId) {
    const { data } = await apiClient.get(API_CONFIG.ENDPOINTS.USERS.PROFILE(userId));
    return data?.profile ?? data;
}

export async function getUserProfiles(ids = []) {
    const uniq = [...new Set(ids)].filter(Boolean);
    if (!uniq.length) return {};
    const results = await Promise.allSettled(uniq.map(getUserProfile));
    const map = {};
    uniq.forEach((id, i) => {
        const r = results[i];
        if (r.status === "fulfilled" && r.value) {
            const p = r.value;
            map[id] = {
                firstName: p.firstName ?? null,
                lastName: p.lastName ?? null,
                email: p.email ?? null,
                profileImageUrl:
                    p.profileImageUrl ?? null,
            };
        }
    });
    return map;
}
