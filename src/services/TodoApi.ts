import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "../common/axiosBaseQuery";

export type BaseTodo = {
  title?: string;
  content?: string | null;
  dueDate?: number | string | null; 
};

export type Todo = BaseTodo & { id: string, userId: string }
export type CreateTodo = BaseTodo 
export type UpdateTodo = BaseTodo 

// chatGPT : optimistic update 

export const TodoApi = createApi({
  reducerPath: 'TodoApi', 
  baseQuery: axiosBaseQuery(), 
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], void>({
      query: () => ({
        url: '/api/todo', 
        method: 'GET', 
      })
    }), 
    addTodo: builder.mutation<Todo, CreateTodo>({
      query: (body) => ({
        url: '/api/todo', 
        method: 'POST', 
        data: body
      }), 
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const tempId = `temp-${Date.now()}`
        const patchResult = dispatch(
          TodoApi.util.updateQueryData('getTodos', undefined, (draft) => {
            const tempTodo: Todo = {
              id: tempId,
              userId: 'me', 
              ...body,
            }
            draft.unshift(tempTodo)
          })
        )

        try {
          const { data: created } = await queryFulfilled
          dispatch(
            TodoApi.util.updateQueryData('getTodos', undefined, (draft) => {
              const idx = draft.findIndex(t => t.id === tempId)
              if (idx >= 0) draft[idx] = created
            })
          )
        } catch {
          patchResult.undo()
        }
      }, 
    }), 
    updateTodo: builder.mutation<Todo, {id: string, patch: UpdateTodo}>({
      query: ({id, patch}) => ({
        url: `/api/todo/${id}`, 
        method: 'PATCH', 
        data: patch
      }), 
      async onQueryStarted({ id, patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          TodoApi.util.updateQueryData('getTodos', undefined, (draft) => {
            const t = draft.find(d => d.id === id)
            if (t) Object.assign(t, patch)
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }), 
    deleteTodo: builder.mutation<Todo, string>({
      query: (id) => ({
        url: `/api/todo/${id}`, 
        method: 'DELETE', 
      }), 
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          TodoApi.util.updateQueryData('getTodos', undefined, (draft) => {
            const idx = draft.findIndex(d => d.id === id)
            if (idx >= 0) draft.splice(idx, 1)
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    })
  })
})

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = TodoApi;