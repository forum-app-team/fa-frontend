import { createApi } from "@reduxjs/toolkit/query/react";
import apiClient from "@/libs/axios";

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
      // Updated to use /api/users/profile/<user_id>
      query: (userId) => ({ url: `/api/users/profile/${userId}` }),
      providesTags: ["Profile"],
    }),

    getTopPosts: build.query({
      query: (limit = 3) => ({
        url: `/api/posts/top?limit=${limit}`,
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
      query: () => ({ url: "/api/posts/drafts" }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((d) => ({ type: "Drafts", id: d.id })),
              { type: "Drafts", id: "LIST" },
            ]
          : [{ type: "Drafts", id: "LIST" }],
    }),

    getViewHistory: build.query({
      query: (params = {}) => {
        const q = new URLSearchParams();
        if (params.search) q.set("search", params.search);
        if (params.date) q.set("date", params.date);
        return { url: `/api/users/identity/history?${q.toString()}` };
      },
      transformResponse: (data) =>
        Array.isArray(data)
          ? data
              .filter((item) => item.published)
              .sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt))
          : data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((h) => ({ type: "History", id: h.postId })),
              { type: "History", id: "LIST" },
            ]
          : [{ type: "History", id: "LIST" }],
    }),

    requestProfileImageUpload: build.mutation({
      query: () => ({
        url: "/api/users/identity/profile-image/presign",
        method: "POST",
      }),
    }),

    updateProfileImage: build.mutation({
      query: (body) => ({
        url: "/api/users/identity/profile-image",
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["Profile"],
    }),

    requestEmailVerification: build.mutation({
      query: (newEmail) => ({
        url: "/api/users/identity/email/verification",
        method: "POST",
        data: { newEmail },
      }),
      invalidatesTags: ["Email"],
    }),

    confirmEmailUpdate: build.mutation({
      query: ({ code, newEmail }) => ({
        url: "/api/users/identity/email/confirm",
        method: "POST",
        data: { code, newEmail },
      }),
      invalidatesTags: ["Profile", "Email"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useGetTopPostsQuery,
  useGetDraftsQuery,
  useGetViewHistoryQuery,
  useRequestProfileImageUploadMutation,
  useUpdateProfileImageMutation,
  useRequestEmailVerificationMutation,
  useConfirmEmailUpdateMutation,
} = normalUserApi;
