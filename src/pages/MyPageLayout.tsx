import { Link, Outlet } from "react-router-dom";

export function MyPageLayout() {
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