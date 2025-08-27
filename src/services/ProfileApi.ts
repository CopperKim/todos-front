import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "../common/axiosBaseQuery"

export type Role = 'UNDEFINED' | 'TEACHER' | 'STUDENT'

export type ProfileWithUsername = {
  username?: string
  role: Role
  bio: string
  tags: string[]
}

export const profileApi = createApi({
  reducerPath: 'profileApi', 
  baseQuery: axiosBaseQuery(), 
  endpoints: (builder) => ({
    getProfile: builder.query<ProfileWithUsername, void>({
      query: () => ({
        url: '/api/profile',
        method: 'GET',
      })
    }), 
    updateProfile: builder.mutation<ProfileWithUsername, ProfileWithUsername>({
      query: (patch) => ({
        url: '/api/profile', 
        method: 'PATCH',
        data: patch, 
      }), 
      async onQueryStarted(patch, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          profileApi.util.updateQueryData('getProfile', undefined, (draft) => {
            Object.assign(draft, patch)
          })
        )

        try {
          const { data: fresh } = await queryFulfilled
          dispatch(
            profileApi.util.updateQueryData('getProfile', undefined, (draft) => {
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
} = profileApi;

