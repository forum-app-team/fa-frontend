import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from "../../config/api.config";
import apiClient from '../../libs/axios';

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url = '', method, data, params }, api) => {
    return await apiClient({ url: baseUrl + url, method, data, params });
  };

export const adminPostApi = createApi({
  reducerPath: 'adminPostApi',
  baseQuery: axiosBaseQuery({ baseUrl: API_CONFIG.ENDPOINTS.POSTS.LIST }),
  tagTypes: ['Post'],
  endpoints: (build) => ({
    listPosts: build.query({
      query: ({ offset = 0, limit = 50, status = 'Published', field = 'title', q, sort = 'createdAt', ascending = false } = {}) => ({
        params: { offset, limit, status, sort, field, q, ascending },
      }),
      providesTags: (res) =>
        res?.posts
          ? [{ type: 'Post', id: 'LIST' }, ...res.posts.map(p => ({ type: 'Post', id: p.id }))]
          : [{ type: 'Post', id: 'LIST' }],
    }),
    updatePostStatus: build.mutation({
      query: (patches) => ({ url: '/status', method: 'PATCH', data: patches }),
      invalidatesTags: (r, e, patches) => patches.map(({ id }) => ({ type: 'Post', id })),
    }),
  }),
});

export const { useLazyListPostsQuery, useUpdatePostStatusMutation } = adminPostApi;