import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../common/axiosBaseQuery";

export type TagMode = 'AND' | 'OR'

export type getRecruitOpts = {
    myRecruit?: boolean
    tags?: string[]
    mode?: TagMode
    // sort?: 'latest' | 'priceAsc' | 'priceDesc';
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
        getRecruitByOpt: builder.query<(Recruit & {id: string, updatedAt: number | string | null})[], getRecruitOpts>({
            query: (opt) => ({
                url: '/api/recruit/opt', 
                method: 'GET', 
                params: opt, 
            })
        }), 
        getRecruitByAuthorId: builder.query<Recruit & {id: string, updatedAt: number | string | null}, string>({
            query: (authorId) => ({
                url: `/api/recruit/authorId/${authorId}`, 
                method: 'GET', 
            })
        }), 
        getRecruitByRecruitId: builder.query<Recruit & {id: string, updatedAt: number | string | null}, string>({
            query: (recruitId) => ({
                url: `/api/recruit/recruitId/${recruitId}`, 
                method: 'GET'
            })
        }), 
        addRecruit: builder.mutation<Recruit & {id: string, updatedAt: number | string | null}, Recruit>({
            query: (recruit) => ({
                url: '/api/recruit', 
                method: 'POST', 
                data: recruit, 
            }), 
            async onQueryStarted(newItem, { dispatch, queryFulfilled}) {
                const patchResult = dispatch(
                    recruitApi.util.updateQueryData('getRecruitByOpt', {myRecruit: true}, (draft) => {
                        draft.unshift({
                            id: 'temp-' + Math.random().toString(36).slice(2),
                            ...newItem,
                            updatedAt: Date.now(),
                        } as any)
                    })
                )
        
                try {
                    const { data: created } = await queryFulfilled
                    dispatch(
                    recruitApi.util.updateQueryData('getRecruitByOpt', { myRecruit: true }, (draft) => {
                        const idx = draft.findIndex(r => r.title === newItem.title && r.content === newItem.content)
                        if (idx !== -1) draft[idx] = created
                        else draft.unshift(created)
                    })
                    )
                } catch {
                    patchResult.undo()
                }
            }
        }), 
        updateRecruit: builder.mutation<Recruit & {id: string, updatedAt: number | string | null}, { id: string; patch: Partial<Recruit> }>({
            query: ({ id, patch }) => ({ 
                url: `/api/recruit/${id}`, 
                method: 'PATCH', 
                data: patch 
            }),
            async onQueryStarted({ id, patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                recruitApi.util.updateQueryData('getRecruitByOpt', { myRecruit: true }, (draft) => {
                    const i = draft.findIndex(r => r.id === id)
                    if (i !== -1) Object.assign(draft[i], patch)
                })
                )
                try {
                const { data: fresh } = await queryFulfilled
                dispatch(
                    recruitApi.util.updateQueryData('getRecruitByOpt', { myRecruit: true }, (draft) => {
                    const i = draft.findIndex(r => r.id === id)
                    if (i !== -1) draft[i] = fresh
                    })
                )
                } catch {
                patchResult.undo()
                }
            }
        }),
        deleteRecruit: builder.mutation<void, string>({
        query: (id) => ({ url: `/api/recruit/${id}`, method: 'DELETE' }),
        async onQueryStarted(id, { dispatch, queryFulfilled }) {
            const patchResult = dispatch(
            recruitApi.util.updateQueryData('getRecruitByOpt', { myRecruit: true }, (draft) => {
                const i = draft.findIndex(r => r.id === id)
                if (i !== -1) draft.splice(i, 1)
            })
            )
            try { await queryFulfilled } catch { patchResult.undo() }
        }
        }),
    })
})

export const {
    useGetRecruitByOptQuery,
    useGetRecruitByAuthorIdQuery,
    useGetRecruitByRecruitIdQuery,   
    useAddRecruitMutation, 
    useUpdateRecruitMutation, 
    useDeleteRecruitMutation 
} = recruitApi; 