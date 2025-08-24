import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../index'  

// 디스패치 타입 지정
export const useAppDispatch = () => useDispatch<AppDispatch>()

// 셀렉터 타입 지정
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
