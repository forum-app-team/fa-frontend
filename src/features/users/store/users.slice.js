import { createApi } from "@reduxjs/toolkit/query/react";
import apiClient from "@/libs/axios";
import { API_CONFIG } from "@/config/api.config";

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url = "", method = "GET", data, params }) => {
    try {
      const result = await apiClient({
        url: baseUrl + url,
        method,
        data,
        params,
      });
      return { data: result.data };
    } catch (err) {
      const status = err?.response?.status;
      return {
        error: {
          status: status || 500,
          data: err?.response?.data || err.message || "Request failed",
        },
      };
    }
  };

export const normalUserApi = createApi({
  reducerPath: "normalUserApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Profile", "TopPosts", "Drafts", "History", "Email"],
  endpoints: (build) => ({
    getProfile: build.query({
      query: (userId) => ({ url: API_CONFIG.ENDPOINTS.USERS.PROFILE(userId) }),
      providesTags: ["Profile"],
    }),

    getTopPosts: build.query({
      query: (limit = 3) => ({
        url: API_CONFIG.ENDPOINTS.POSTS.TOP_POSTS(limit),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((p) => ({ type: "TopPosts", id: p.id })),
              { type: "TopPosts", id: "LIST" },
            ]
          : [{ type: "TopPosts", id: "LIST" }],
    }),

    getDrafts: build.query({
      query: () => ({ url: API_CONFIG.ENDPOINTS.POSTS.DRAFTS }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((d) => ({ type: "Drafts", id: d.id })),
              { type: "Drafts", id: "LIST" },
            ]
          : [{ type: "Drafts", id: "LIST" }],
    }),

    updateProfileImage: build.mutation({
      query: ({ userId, ...body }) => ({
        url: API_CONFIG.ENDPOINTS.USERS.PATCH_PROFILE(userId),
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["Profile"],
    }),

    requestEmailVerification: build.mutation({
      query: (newEmail) => ({
        url: API_CONFIG.ENDPOINTS.AUTH.EMAIL_VERIFICATION_SEND,
        method: "POST",
        data: { email: newEmail },
      }),
      invalidatesTags: ["Email"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useGetTopPostsQuery,
  useGetDraftsQuery,
  useUpdateProfileImageMutation,
  useRequestEmailVerificationMutation,
} = normalUserApi;
