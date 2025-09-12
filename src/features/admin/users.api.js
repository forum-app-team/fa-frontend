import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from "@/config/api.config.js";
import { tokenService } from '@/libs/tokenService';

export const adminUserApi = createApi({
  reducerPath: 'adminUserApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.ENDPOINTS.ADMIN.USERS,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = tokenService.get() ?? localStorage.getItem('token');
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (build) => ({
    listUsers: build.query({
      query: ({ offset = 0, limit = 50, sort = 'created_at.desc' } = {}) => {
        const p = new URLSearchParams({ offset, limit, sort });
        return `?${p.toString()}`;
      },
      providesTags: (res) =>
        res?.users
          ? [{ type: 'User', id: 'LIST' }, ...res.users.map(u => ({ type: 'User', id: u.id }))]
          : [{ type: 'User', id: 'LIST' }],
    }),
    updateUserStatus: build.mutation({
      query: (patches) => ({ url: 'status', method: 'PATCH', body: patches }),
      invalidatesTags: (r, e, patches) => patches.map(({ id }) => ({ type: 'User', id })),
    }),
    updateUserRoles: build.mutation({
      query: (patches) => ({ url: 'role', method: 'PATCH', body: patches }),
      invalidatesTags: (r, e, patches) => patches.map(({ id }) => ({ type: 'User', id })),
    }),
  }),
});

export const { useListUsersQuery, useUpdateUserStatusMutation, useUpdateUserRolesMutation } = adminUserApi;