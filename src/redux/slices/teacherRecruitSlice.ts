import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { getRecruitOpts, TagMode } from "../../services/recruitApi";

type Filters = Omit<getRecruitOpts, "myRecruit"> & { newTag: string }; 

type TeacherRecruitState = {
  selectedId: string | null;
  filters: Filters;
  isSelectedRecruitViewing: boolean;
};

const initialState: TeacherRecruitState = {
  selectedId: null,
  isSelectedRecruitViewing: false,
  filters: {
    tags: [],
    newTag: "", 
    mode: 'OR',
    // sort: 'latest',
  },
};

const teacherRecruitSlice = createSlice({
  name: "teacherRecruit",
  initialState,
  reducers: {
    viewSelectedRecruit(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
      state.isSelectedRecruitViewing = true; 
    },
    stopViewing(state) {
      state.selectedId = null, 
      state.isSelectedRecruitViewing = false;
    }, 
    setFilters(state, action: PayloadAction<Partial<Filters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = initialState.filters;
    },
    addTag(state) {
      state.filters.newTag = state.filters.newTag.trim() 
      if (!state.filters.newTag || state.filters.newTag === "") return 
      else if (!state.filters.tags) state.filters.tags = [state.filters.newTag]
      else if (!state.filters.tags.includes(state.filters.newTag)) state.filters.tags = [...state.filters.tags, state.filters.newTag]
    }, 
    setNewTag(state, action) {
      state.filters.newTag = action.payload
    }, 
    removeTag(state, action: PayloadAction<string>) {
      state.filters.tags = state.filters.tags?.filter((x) => x !== action.payload)
    }, 
    setMode(state, action: PayloadAction<TagMode>) {
      state.filters.mode = action.payload
    }, 
  },
});

export const { viewSelectedRecruit, setFilters, resetFilters, addTag, removeTag, setNewTag, setMode} =
  teacherRecruitSlice.actions;
export default teacherRecruitSlice.reducer;

export const selectTeacherRecruit = (s: any) => s.teacherRecruit;
export const selectSelectedId = (s: any) => s.teacherRecruit.selectedId;
export const selectFilters = (s: any) => s.teacherRecruit.filters;
