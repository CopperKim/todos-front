import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit' 

import { MainPage } from './pages/MainPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import axios from 'axios'
import { TodosPage } from './pages/TodosPage'
import { ProfilePage } from './pages/ProfilePage'
import { MyPageLayout } from './pages/MyPageLayout'

import { todoApi } from './services/todoApi'
import { profileApi } from './services/profileApi'

import profileReducer from './redux/slices/profileSlice'
import todoReducer from './redux/slices/todoSlice'

axios.defaults.baseURL = "http://localhost:8000"
axios.defaults.withCredentials = true 
axios.defaults.headers.common["Content-Type"] = "application/json"

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    todo: todoReducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [todoApi.reducerPath]: todoApi.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(
      profileApi.middleware,
      todoApi.middleware
  ),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const router = createBrowserRouter([
  { path: '/', element: <MainPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    path: '/mypage',
    element: <MyPageLayout />,
    children: [
      { index: true, element: <ProfilePage /> },
      { path: 'notes', element: <TodosPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> }, 
])

const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
)
