import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from "@/config/api.config.js";
import apiClient from '../../libs/axios';

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url = '', method, data, params }, api) => {
    try {
      return await apiClient({ url: baseUrl + url, method, data, params });
    } catch (err) {
      console.error(err);
    }
  };

export const adminUserApi = createApi({
  reducerPath: 'adminUserApi',
  baseQuery: axiosBaseQuery({ baseUrl: API_CONFIG.ENDPOINTS.ADMIN.USERS }),
  tagTypes: ['User'],
  endpoints: (build) => ({
    listUsers: build.query({
      query: ({ offset = 0, limit = 50, sort = 'created_at.desc' } = {}) => ({
        params: { offset, limit, sort }
      }),
      providesTags: (res) =>
        res?.users
          ? [{ type: 'User', id: 'LIST' }, ...res.users.map(u => ({ type: 'User', id: u.id }))]
          : [{ type: 'User', id: 'LIST' }],
    }),
    updateUserStatus: build.mutation({
      query: (patches) => ({ url: '/status', method: 'PATCH', data: patches }),
      invalidatesTags: (r, e, patches) => patches.map(({ id }) => ({ type: 'User', id })),
    }),
    updateUserRoles: build.mutation({
      query: (patches) => ({ url: '/role', method: 'PATCH', data: patches }),
      invalidatesTags: (r, e, patches) => patches.map(({ id }) => ({ type: 'User', id })),
    }),
  }),
});

export const { useListUsersQuery, useUpdateUserStatusMutation, useUpdateUserRolesMutation } = adminUserApi;