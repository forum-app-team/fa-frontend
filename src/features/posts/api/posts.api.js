import apiClient from "@/libs/axios";

import { API_CONFIG } from "@/config/api.config";

const POSTS_API = API_CONFIG.ENDPOINTS.POSTS;

const listPublishedPosts = async () => {
    const { data } = await apiClient.get(POSTS_API.LIST);
    return data;
};

const getPostDetail = async (id) => {
    const { data } = await apiClient.get(POSTS_API.DETAIL(id));
    return data;
};

const createPost = async (payload) => {
    const { data } = await apiClient.post(POSTS_API.CREATE, payload);
    return data;
};

const updatePost = async (id, payload) => {
    const { data } = await apiClient.put(POSTS_API.UPDATE(id), payload);
    return data;
};

const deletePost = async (id) => {
    const { data } = await apiClient.delete(POSTS_API.DELETE(id));
    return data;
};

const publishPost = async (id) => {
    const { data } = await apiClient.put(POSTS_API.PUBLISH(id));
    return data;
};

const archivePost = async (id) => {
    const { data } = await apiClient.post(POSTS_API.ARCHIVE(id));
    return data;
};

const unarchivePost = async (id) => {
    const { data } = await apiClient.post(POSTS_API.UNARCHIVE(id));
    return data;
};

const hidePost = async (id) => {
    const { data } = await apiClient.post(POSTS_API.HIDE(id));
    return data;
};

const unhidePost = async (id) => {
    const { data } = await apiClient.post(POSTS_API.UNHIDE(id));
    return data;
};

const banPost = async (id) => {
    const { data } = await apiClient.post(POSTS_API.BAN(id));
    return data;
};

const unbanPost = async (id) => {
    const { data } = await apiClient.post(POSTS_API.UNBAN(id));
    return data;
};

const recoverPost = async (id) => {
    const { data } = await apiClient.post(POSTS_API.RECOVER(id));
    return data;
};

export { listPublishedPosts, getPostDetail, createPost, updatePost, deletePost, publishPost, archivePost, unarchivePost, hidePost, unhidePost, banPost, unbanPost, recoverPost };
