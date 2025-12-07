import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { AuthResponse, LoginCredentials } from './types/auth';
import type { CreateUserDto, UpdateUserDto, User } from './types/users';
import type { CurrentTemperature, LocationHistory, TemperatureHistoryItem } from './types/dashboard';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        credentials: 'include',
    }),
    tagTypes: [
        'User',
        'Auth',
        'CurrentWeather',
        'TemperatureHistory',
        'LocationHistory',
        'InsightIA',
    ],
    endpoints: (builder) => ({
        // -------------- AUTH --------------
        login: builder.mutation<AuthResponse, LoginCredentials>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth'],
        }),

        getMe: builder.query<AuthResponse, void>({
            query: () => ({
                url: '/auth/me',
                method: 'GET',
            }),
            providesTags: ['Auth'],
        }),

        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            invalidatesTags: ['Auth'],
        }),

        // -------------- USER --------------
        getUsers: builder.query<User[], void>({
            query: () => ({
                url: '/users',
                method: 'GET',
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ _id }) => ({ type: 'User' as const, id: _id })),
                        { type: 'User', id: 'LIST' },
                    ]
                    : [{ type: 'User', id: 'LIST' }],
        }),

        getUserById: builder.query<User, string>({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'GET',
            }),
            providesTags: (_result, _error, id) => [{ type: 'User', id }],
        }),

        createUser: builder.mutation<User, CreateUserDto>({
            query: (data) => ({
                url: '/users',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'User', id: 'LIST' }],
        }),

        updateUser: builder.mutation<User, { id: string; data: UpdateUserDto }>({
            query: ({ id, data }) => ({
                url: `/users/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'User', id },
                { type: 'User', id: 'LIST' },
            ],
        }),

        deleteUser: builder.mutation<void, string>({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: 'User', id },
                { type: 'User', id: 'LIST' },
            ],
        }),

        // -------------- DASHBOARD --------------
        getCurrentTemperature: builder.query<CurrentTemperature, void>({
            query: () => ({
                url: '/dashboard/current-temperature',
                method: 'GET',
            }),
            providesTags: ['CurrentWeather'],
        }),

        getTemperatureHistory: builder.query<
            TemperatureHistoryItem[],
            { startDate?: string; endDate?: string } | void
        >({
            query: (params) => {
                const queryParams = new URLSearchParams()
                if (params?.startDate) queryParams.append('startDate', params.startDate)
                if (params?.endDate) queryParams.append('endDate', params.endDate)

                return {
                    url: `/dashboard/temperature-history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
                    method: 'GET',
                }
            },
            providesTags: ['TemperatureHistory'],
        }),

        getLocationHistory: builder.query<LocationHistory[], void>({
            query: () => ({
                url: '/dashboard/location-history',
                method: 'GET',
            }),
            providesTags: ['LocationHistory'],
        }),

        exportData: builder.mutation<Blob, { startDate?: string; endDate?: string } | void>({
            query: (params) => {
                const queryParams = new URLSearchParams()
                if (params?.startDate) queryParams.append('startDate', params.startDate)
                if (params?.endDate) queryParams.append('endDate', params.endDate)

                return {
                    url: `/dashboard/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
                    method: 'GET',
                    responseHandler: (response) => response.blob(),
                }
            },
        }),

        // -------------- IA --------------
        getInsightIA: builder.query<string, void>({
            query: () => ({
                url: '/insight/temperature',
                method: 'GET',
                responseHandler: (response) => response.text(),
            }),
            providesTags: ['InsightIA'],
        }),
    }),
})

export const {
    useLoginMutation,
    useGetMeQuery,
    useLogoutMutation,
    useGetUsersQuery,
    useGetUserByIdQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useGetCurrentTemperatureQuery,
    useGetTemperatureHistoryQuery,
    useGetLocationHistoryQuery,
    useExportDataMutation,
    useGetInsightIAQuery,
} = apiSlice
