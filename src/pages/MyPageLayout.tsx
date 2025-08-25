import { Link, Outlet, useNavigate } from "react-router-dom";
import { profileApi } from "../services/profileApi";
import { todoApi } from "../services/todoApi";
import { useAppDispatch } from "../redux/hooks";
import axios from "axios";

export function MyPageLayout() {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await axios.post("/auth/logout")
    } catch (e) {
      console.warn("logout call failed:", e);
    } finally {
      dispatch(profileApi.util.resetApiState());
      dispatch(todoApi.util.resetApiState());
      navigate("/");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <header style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
        <strong>MyPage</strong>
        <nav style={{ display: 'flex', gap: 8 }}>
          <Link to="/mypage">profile</Link>
          <Link to="/mypage/notes">notes</Link>
          <Link to="/" onClick={handleLogout}>logout</Link>
        </nav>
      </header>
      <Outlet />
    </div>
  )
}