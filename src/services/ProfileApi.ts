import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "../common/axiosBaseQuery"

export type Role = 'UNDEFINED' | 'TEACHER' | 'STUDENT'

export type Profile = {
  username?: string
  role: Role
  bio: string
  tag: string[]
}

export const ProfileApi = createApi({
  reducerPath: 'ProfileApi', 
  baseQuery: axiosBaseQuery(), 
  endpoints: (builder) => ({
    getProfile: builder.query<Profile, void>({
      query: () => ({
        url: '/api/profile',
        method: 'GET',
      })
    }), 
    updateProfile: builder.mutation<Profile, Profile>({
      query: (patch) => ({
        url: '/api/profile', 
        method: 'PATCH',
        data: patch, 
      }), 
      async onQueryStarted(patch, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          ProfileApi.util.updateQueryData('getProfile', undefined, (draft) => {
            Object.assign(draft, patch)
          })
        )

        try {
          const { data: fresh } = await queryFulfilled
          dispatch(
            ProfileApi.util.updateQueryData('getProfile', undefined, (draft) => {
              Object.assign(draft, fresh)
            })
          )
        } catch {
          patchResult.undo()
        }
      },
    })
  })
})

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
} = ProfileApi;

