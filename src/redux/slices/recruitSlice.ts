import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Recruit } from "../../services/recruitApi"

type SortKey = 'TAGS' | 'DAYS'

type RecruitState = {
    selectedId: string | null, 
    daySearch: boolean[], 
    tagSearch: string[], 
    sortKey: SortKey, 
    drafts: Record<string, Partial<Recruit>>
}

const initialState: RecruitState = {
    selectedId: null, 
    daySearch: [true, true, true, true, true, true, true], 
    tagSearch: [], 
    sortKey: 'TAGS', 
    drafts: {} 
}

const recruitSlice = createSlice({
    name: 'recruit', 
    initialState: initialState, 
    reducers: {
        selectRecruit(state, action: PayloadAction<string | null>) {
            state.selectedId = action.payload; 
        } 
    }
})