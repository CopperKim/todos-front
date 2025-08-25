import type { RootState } from '../../index';
import { createSlice, type PayloadAction, createSelector } from '@reduxjs/toolkit'
import type { Role, Profile } from '../../services/profileApi'
import { profileApi } from '../../services/profileApi'

type ProfileDraft = Pick<Profile, 'role' | 'bio' | 'tag'>

type ProfileState = {
  server: (Profile & { username?: string }) | null 
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
    builder.addMatcher(profileApi.endpoints.getProfile.matchFulfilled, (state, { payload }) => {
      state.server = payload as any 
      if (!state.isEditing) state.draft = null
    })

    builder.addMatcher(profileApi.endpoints.updateProfile.matchFulfilled, (state, { payload }) => {
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

// Selectors 
export const selectProfileState = (s: RootState) => s.profile

// 편집 중이면 draft를, 아니면 server를 뷰 모델로 제공
export const selectProfileView = createSelector(selectProfileState, (p) => {
  if (p.isEditing && p.draft && p.server) {
    return { ...p.server, ...p.draft }
  }
  return p.server
})

export const selectIsEditingProfile = createSelector(selectProfileState, (p) => p.isEditing)
