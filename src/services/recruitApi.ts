import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../common/axiosBaseQuery";

export type TagMode = 'AND' | 'OR'

export type getRecruitOpts = {
    author?: boolean
    tags?: string[]
    mode?: TagMode
    count?: number 
}

export type Recruit = {
    title: string
    content: string
    dayAvailable: boolean[] 
    tags: string[] 
}

export const recruitApi = createApi({
    reducerPath: 'recruitApi', 
    baseQuery: axiosBaseQuery(), 
    endpoints: (builder) => ({
        getRecruit: builder.query<(Recruit & {updatedAt: number | string | null})[], getRecruitOpts>({
            query: (opt) => ({
                url: '/api/recruit', 
                method: 'GET', 
                data: opt, 
            })
        }), 
        addRecruit: builder.mutation<Recruit, Recruit>({
            query: (recruit) => ({
                url: '/api/recruit', 
                method: 'POST', 
                data: recruit, 
            })
        }), 
        updateRecruit: builder.mutation<Recruit, {recruitId: string, newRecruit: Recruit}>({
            query: ({recruitId, newRecruit}) => ({
                url: `/api/recruit/${recruitId}`, 
                method: 'PATCH', 
                data: newRecruit, 
            })
        }), 
        deleteRecruit: builder.mutation<void, string>({
            query: (recruitId) => ({
                url: `/api/recruit/${recruitId}`, 
                method: 'DELETE', 
            })
        })
    })
})

export const {
    useGetRecruitQuery, 
    useAddRecruitMutation, 
    useUpdateRecruitMutation, 
    useDeleteRecruitMutation 
} = recruitApi; 