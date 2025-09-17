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
        res?.items
          ? [{ type: 'Post', id: 'LIST' }, ...res.items.map(p => ({ type: 'Post', id: p.id }))]
          : [{ type: 'Post', id: 'LIST' }],
    }),
    banPost: build.mutation({
      query: (id) => ({ url: `/${id}/ban`, method: 'POST' }),
      invalidatesTags: (r, e, id) => [{ type: 'Post', id }],
    }),
    unbanPost: build.mutation({
      query: (id) => ({ url: `/${id}/unban`, method: 'POST' }),
      invalidatesTags: (r, e, id) => [{ type: 'Post', id }],
    }),
    recoverPost: build.mutation({
      query: (id) => ({ url: `/${id}/recover`, method: 'POST' }),
      invalidatesTags: (r, e, id) => [{ type: 'Post', id }],
    }),
  }),
});

export const { useLazyListPostsQuery, useBanPostMutation, useUnbanPostMutation, useRecoverPostMutation } = adminPostApi;