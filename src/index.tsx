import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Outlet, Link, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

// --- 임시 store (RTK Query/슬라이스는 추후 추가) ---
const store = configureStore({
  reducer: {
    // 예: user: userReducer,
    // RTK Query 사용 시: [api.reducerPath]: api.reducer
  },
  // middleware: (getDefault) => getDefault().concat(api.middleware),
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// --- 페이지 컴포넌트 (임시 더미, 나중에 파일 분리해도 됨) ---
function MainPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Main</h1>
      <p>로그인/회원가입으로 이동</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <Link to="/login"><button>로그인</button></Link>
        <Link to="/register"><button>회원가입</button></Link>
      </div>
    </div>
  )
}

function LoginPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Login</h1>
      <p>아이디/비번 입력 + 로그인 버튼 (구현은 추후)</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <Link to="/register"><button>회원가입으로</button></Link>
        <Link to="/"><button>메인으로</button></Link>
      </div>
    </div>
  )
}

function RegisterPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Register</h1>
      <p>아이디/비번 입력 + 회원가입 버튼 (구현은 추후)</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <Link to="/login"><button>로그인으로</button></Link>
        <Link to="/"><button>메인으로</button></Link>
      </div>
    </div>
  )
}

// /mypage 레이아웃 (헤더 + Outlet)
function MyPageLayout() {
  return (
    <div style={{ padding: 24 }}>
      <header style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
        <strong>MyPage</strong>
        <nav style={{ display: 'flex', gap: 8 }}>
          <Link to="/mypage">profile</Link>
          <Link to="/mypage/notes">notes</Link>
        </nav>
      </header>
      <Outlet />
    </div>
  )
}

function ProfilePage() {
  return (
    <div>
      <h2>Profile (기본값)</h2>
      <p>프로필 내용은 추후 구현</p>
    </div>
  )
}

function NotesPage() {
  return (
    <div>
      <h2>Notes</h2>
      <p>백엔드 note API 연동은 추후(RTK Query)에서 구현</p>
    </div>
  )
}

// --- 라우터 정의 ---
// 보호 라우팅(권한 없을 때 메인으로)은 나중에 별도 가드/래퍼에서 처리 예정
const router = createBrowserRouter([
  { path: '/', element: <MainPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    path: '/mypage',
    element: <MyPageLayout />,
    children: [
      { index: true, element: <ProfilePage /> },     // 기본값: /mypage -> profile
      { path: 'notes', element: <NotesPage /> },     // /mypage/notes
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> }, // 잘못된 경로 처리
])

// --- 루트 렌더 ---
const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Suspense fallback={<div>Loading…</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </Provider>
  </React.StrictMode>
)
