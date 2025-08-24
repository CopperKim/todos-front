// src/slices/todoSlice.ts
import { createSlice, type PayloadAction, createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../../index'
import type { BaseTodo, Todo } from '../../services/TodoApi'
import { TodoApi } from '../../services/TodoApi'

type SortKey = 'title' | 'dueDate' // 필요시 확장(서버에 createdAt 있으면 추가)
type SortOrder = 'asc' | 'desc'

type TodoState = {
  selectedId: string | null
  search: string
  sortKey: SortKey
  sortOrder: SortOrder
  // 인라인 편집용 드래프트(선택): todoId → patch
  drafts: Record<string, Partial<BaseTodo>>
  // 모달/패널 등 UI 플래그가 있으면 여기에
}

const initialState: TodoState = {
  selectedId: null,
  search: '',
  sortKey: 'dueDate',
  sortOrder: 'asc',
  drafts: {},
}

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    selectTodo(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload
    },
    setSort(state, action: PayloadAction<{ key: SortKey; order?: SortOrder }>) {
      state.sortKey = action.payload.key
      state.sortOrder = action.payload.order ?? (state.sortOrder === 'asc' ? 'desc' : 'asc')
    },
    // 인라인 편집 시작/수정/취소
    beginDraft(state, action: PayloadAction<{ id: string; initial?: Partial<BaseTodo> }>) {
      const { id, initial } = action.payload
      state.drafts[id] = { ...(initial ?? {}) }
    },
    setDraftField(
      state,
      action: PayloadAction<{ id: string; patch: Partial<BaseTodo> }>
    ) {
      const { id, patch } = action.payload
      state.drafts[id] = { ...(state.drafts[id] ?? {}), ...patch }
    },
    cancelDraft(state, action: PayloadAction<{ id: string }>) {
      delete state.drafts[action.payload.id]
    },
    clearAllDrafts(state) {
      state.drafts = {}
    },
  },
  extraReducers: (builder) => {
    // 리스트 로드 후 선택 없으면 첫 항목 자동 선택(UX 편의)
    builder.addMatcher(TodoApi.endpoints.getTodos.matchFulfilled, (state, { payload }) => {
      if (!state.selectedId && payload.length > 0) {
        state.selectedId = payload[0].id
      }
      // 로드 후 사라진 항목을 선택 중이었다면 선택 해제
      if (state.selectedId && !payload.some((t) => t.id === state.selectedId)) {
        state.selectedId = payload[0]?.id ?? null
      }
    })

    // 삭제 성공 시 현재 선택 항목이었으면 이동/해제
    builder.addMatcher(TodoApi.endpoints.deleteTodo.matchFulfilled, (state, action) => {
      // arg는 originalArgs에 있음 (deleteTodo: string)
      const deletedId = action.meta?.arg?.originalArgs as string | undefined
      if (!deletedId) return
      if (state.selectedId === deletedId) {
        state.selectedId = null // or 다른 정책: 최근 항목으로 이동
      }
      // 드래프트도 정리
      delete state.drafts[deletedId]
    })

    // 업데이트 성공 시 드래프트 정리
    builder.addMatcher(TodoApi.endpoints.updateTodo.matchFulfilled, (state, action) => {
      const updated = action.payload as Todo
      delete state.drafts[updated.id]
    })
  },
})

export const {
  selectTodo,
  setSearch,
  setSort,
  beginDraft,
  setDraftField,
  cancelDraft,
  clearAllDrafts,
} = todoSlice.actions

export default todoSlice.reducer

// ---------- Selectors ----------
export const selectTodoUi = (s: RootState) => s.todo
export const selectSelectedTodoId = (s: RootState) => s.todo.selectedId

// RTKQ 캐시와 UI 상태를 결합한 편의 셀렉터들
const selectTodosQueryResult = TodoApi.endpoints.getTodos.select()

export const selectTodos = createSelector(
  selectTodosQueryResult,
  (res) => res.data ?? []
)

export const selectFilteredSortedTodos = createSelector(
  selectTodos,
  selectTodoUi,
  (todos, ui) => {
    const q = ui.search.trim().toLowerCase()
    let out = !q
      ? todos
      : todos.filter((t) => {
          const hay = `${t.title ?? ''} ${t.content ?? ''}`.toLowerCase()
          return hay.includes(q)
        })

    out = [...out].sort((a, b) => {
      const dir = ui.sortOrder === 'asc' ? 1 : -1
      if (ui.sortKey === 'title') {
        return (a.title ?? '').localeCompare(b.title ?? '') * dir
      }
      if (ui.sortKey === 'dueDate') {
        const av = a.dueDate == null ? 0 : +new Date(a.dueDate as any)
        const bv = b.dueDate == null ? 0 : +new Date(b.dueDate as any)
        return (av - bv) * dir
      }
      return 0
    })

    return out
  }
)

export const selectSelectedTodo = createSelector(
  selectFilteredSortedTodos,
  selectSelectedTodoId,
  (list, id) => (id ? list.find((t) => t.id === id) ?? null : null)
)

export const selectTodoDraft = (id: string) =>
  createSelector(
    (s: RootState) => s.todo.drafts[id],
    (draft) => draft ?? null
  )
