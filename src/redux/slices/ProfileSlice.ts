import type { RootState } from './../../index';
import { createSlice, type PayloadAction, createSelector } from '@reduxjs/toolkit'
import type { Role, Profile } from '../../services/ProfileApi' // 경로는 네 프로젝트에 맞게
import { ProfileApi } from '../../services/ProfileApi'

type ProfileDraft = Pick<Profile, 'role' | 'bio' | 'tag'>

type ProfileState = {
  server: (Profile & { username?: string }) | null // username을 서버에서 보여줄 수 있다면 포함
  draft: ProfileDraft | null
  isEditing: boolean
}

const initialState: ProfileState = {
  server: null,
  draft: null,  
  isEditing: false,
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    startEdit(state) {
      if (!state.server) return
      state.draft = {
        role: state.server.role,
        bio: state.server.bio,
        tag: [...state.server.tag],
      }
      state.isEditing = true
    },
    cancelEdit(state) {
      state.draft = null
      state.isEditing = false
    },
    setRole(state, action: PayloadAction<Role>) {
      if (state.draft) state.draft.role = action.payload
    },
    setBio(state, action: PayloadAction<string>) {
      if (state.draft) state.draft.bio = action.payload
    },
    setTags(state, action: PayloadAction<string[]>) {
      if (state.draft) state.draft.tag = action.payload
    },
    addTag(state, action: PayloadAction<string>) {
      if (!state.draft) return
      const t = action.payload.trim()
      if (t && !state.draft.tag.includes(t)) state.draft.tag.push(t)
    },
    removeTag(state, action: PayloadAction<string>) {
      if (!state.draft) return
      state.draft.tag = state.draft.tag.filter((x) => x !== action.payload)
    },
  },
  extraReducers: (builder) => {
    // 서버 프로필 로드 성공 → server 갱신, 편집 중이 아니면 draft 비움
    builder.addMatcher(ProfileApi.endpoints.getProfile.matchFulfilled, (state, { payload }) => {
      state.server = payload as any // 서버가 username도 주면 유지
      if (!state.isEditing) state.draft = null
    })

    // 업데이트 성공 → server 최신 반영 + 편집 종료
    builder.addMatcher(ProfileApi.endpoints.updateProfile.matchFulfilled, (state, { payload }) => {
      state.server = payload as any
      state.draft = null
      state.isEditing = false
    })
  },
})

export const {
  startEdit,
  cancelEdit,
  setRole,
  setBio,
  setTags,
  addTag,
  removeTag,
} = profileSlice.actions

export default profileSlice.reducer

// ---------- Selectors ----------
export const selectProfileState = (s: RootState) => s.profile

// 편집 중이면 draft를, 아니면 server를 뷰 모델로 제공
export const selectProfileView = createSelector(selectProfileState, (p) => {
  if (p.isEditing && p.draft && p.server) {
    return { ...p.server, ...p.draft }
  }
  return p.server
})

export const selectIsEditingProfile = createSelector(selectProfileState, (p) => p.isEditing)
