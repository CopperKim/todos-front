import axios from "axios";
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setError("");
    setLoading(true);
    try {
      const res = await axios.post("/auth/login", { username, password });
      if (res.data?.ok) {
        navigate("/mypage");
      } else {
        setError("unknown error");
      }
    } catch (err: any) {
      const status = err?.response?.status;
      setError(status === 401 ? "username or password is invalid" : "unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 360, margin: "0 auto" }}>
      <h1>Login</h1>

      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>아이디</span>
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>비밀번호</span>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type={showPw ? "text" : "password"}
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              {showPw ? "숨김" : "보기"}
            </button>
          </div>
        </label>

        <button type="submit" disabled={loading || !username || !password}>
          {loading ? "로그인 중…" : "로그인"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}

      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <Link to="/register">
          <button>회원가입</button>
        </Link>
        <Link to="/">
          <button>메인으로</button>
        </Link>
      </div>
    </div>
  );
}