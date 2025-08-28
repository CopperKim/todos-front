import type { RootState } from '../../index';
import { createSlice, type PayloadAction, createSelector } from '@reduxjs/toolkit'
import type { Role, ProfileWithUsername } from '../../services/profileApi'
import { profileApi } from '../../services/profileApi'

type ProfileDraft = Pick<ProfileWithUsername, 'role' | 'bio' | 'tags'>

type ProfileState = {
  server: (ProfileWithUsername & { username?: string }) | null 
  draft: ProfileDraft | null
  isEditing: boolean
}

const initialState: ProfileState = {
  server: {username:"username", role:"UNDEFINED", bio:"bio", tags:["tags"]},
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
        tags: state.server.tags,
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
    settags(state, action: PayloadAction<string[]>) {
      if (state.draft) state.draft.tags = action.payload
    },
    addtags(state, action: PayloadAction<string>) {
      if (!state.draft) return
      const t = action.payload.trim()
      if (t && !state.draft.tags.includes(t)) state.draft.tags.push(t)
    },
    removetags(state, action: PayloadAction<string>) {
      if (!state.draft) return
      state.draft.tags = state.draft.tags.filter((x) => x !== action.payload)
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
  settags,
  addtags,
  removetags,
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
