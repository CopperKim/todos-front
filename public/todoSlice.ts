// // src/slices/todoSlice.ts
// import { createSlice, type PayloadAction, createSelector } from '@reduxjs/toolkit'
// import type { RootState } from '../../index'
// import type { BaseTodo, Todo } from '../../services/todoApi'
// import { todoApi } from '../../services/todoApi'

// type SortKey = 'title' | 'dueDate' 
// type SortOrder = 'asc' | 'desc'

// type TodoState = {
//   selectedId: string | null
//   search: string
//   sortKey: SortKey
//   sortOrder: SortOrder
//   drafts: Record<string, Partial<BaseTodo>>
// }

// const initialState: TodoState = {
//   selectedId: null,
//   search: '',
//   sortKey: 'dueDate',
//   sortOrder: 'asc',
//   drafts: {},
// }

// const todoSlice = createSlice({
//   name: 'todo',
//   initialState,
//   reducers: {
//     selectTodo(state, action: PayloadAction<string | null>) {
//       state.selectedId = action.payload
//     },
//     setSearch(state, action: PayloadAction<string>) {
//       state.search = action.payload
//     },
//     setSort(state, action: PayloadAction<{ key: SortKey; order?: SortOrder }>) {
//       state.sortKey = action.payload.key
//       state.sortOrder = action.payload.order ?? (state.sortOrder === 'asc' ? 'desc' : 'asc')
//     },
//     beginDraft(state, action: PayloadAction<{ id: string; initial?: Partial<BaseTodo> }>) {
//       const { id, initial } = action.payload
//       state.drafts[id] = { ...(initial ?? {}) }
//     },
//     setDraftField(state, action: PayloadAction<{ id: string; patch: Partial<BaseTodo> }>) {
//       const { id, patch } = action.payload
//       state.drafts[id] = { ...(state.drafts[id] ?? {}), ...patch }
//     },
//     cancelDraft(state, action: PayloadAction<{ id: string }>) {
//       delete state.drafts[action.payload.id]
//     },
//     clearAllDrafts(state) {
//       state.drafts = {}
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addMatcher(todoApi.endpoints.getTodos.matchFulfilled, (state, { payload }) => {
//       if (!state.selectedId && payload.length > 0) {
//         state.selectedId = payload[0].id
//       }
//       if (state.selectedId && !payload.some((t) => t.id === state.selectedId)) {
//         state.selectedId = payload[0]?.id ?? null
//       }
//     })

//     builder.addMatcher(todoApi.endpoints.deleteTodo.matchFulfilled, (state, action) => {
//       const deletedId = action.meta?.arg?.originalArgs as string | undefined
//       if (!deletedId) return
//       if (state.selectedId === deletedId) {
//         state.selectedId = null 
//       }
//       delete state.drafts[deletedId]
//     })

//     builder.addMatcher(todoApi.endpoints.updateTodo.matchFulfilled, (state, action) => {
//       const updated = action.payload as Todo
//       delete state.drafts[updated.id]
//     })
//   },
// })

// export const {
//   selectTodo,
//   setSearch,
//   setSort,
//   beginDraft,
//   setDraftField,
//   cancelDraft,
//   clearAllDrafts,
// } = todoSlice.actions

// export default todoSlice.reducer

// // Selectors 
// export const selectTodoUi = (s: RootState) => s.todo
// export const selectSelectedTodoId = (s: RootState) => s.todo.selectedId

// // rtk query 캐시 / UI 상태를 결합한 편의 셀렉터들
// const selectTodosQueryResult = todoApi.endpoints.getTodos.select()

// export const selectTodos = createSelector(
//   selectTodosQueryResult,
//   (res) => res.data ?? []
// )

// export const selectFilteredSortedTodos = createSelector(
//   selectTodos,
//   selectTodoUi,
//   (todos, ui) => {
//     const q = ui.search.trim().toLowerCase()
//     let out = !q
//       ? todos
//       : todos.filter((t) => {
//           const hay = `${t.title ?? ''} ${t.content ?? ''}`.toLowerCase()
//           return hay.includes(q)
//         })

//     out = [...out].sort((a, b) => {
//       const dir = ui.sortOrder === 'asc' ? 1 : -1
//       if (ui.sortKey === 'title') {
//         return (a.title ?? '').localeCompare(b.title ?? '') * dir
//       }
//       if (ui.sortKey === 'dueDate') {
//         const av = a.dueDate == null ? 0 : +new Date(a.dueDate as any)
//         const bv = b.dueDate == null ? 0 : +new Date(b.dueDate as any)
//         return (av - bv) * dir
//       }
//       return 0
//     })

//     return out
//   }
// )

// export const selectSelectedTodo = createSelector(
//   selectFilteredSortedTodos,
//   selectSelectedTodoId,
//   (list, id) => (id ? list.find((t) => t.id === id) ?? null : null)
// )

// export const selectTodoDraft = (id: string) =>
//   createSelector(
//     (s: RootState) => s.todo.drafts[id],
//     (draft) => draft ?? null
//   )
