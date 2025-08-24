import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/auth/signup", { username, password });
      if (res.data?.ok) {
        alert("회원가입 성공! 로그인 페이지로 이동합니다.");
        navigate("/login");
      } else {
        setError("unknown error");
      }
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 400) setError("이미 존재하는 아이디입니다.");
      else setError("회원가입 실패. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 360, margin: "0 auto" }}>
      <h1>Register</h1>

      <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
              autoComplete="new-password"
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
          {loading ? "가입 중…" : "회원가입"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}

      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <Link to="/login"><button>로그인으로</button></Link>
        <Link to="/"><button>메인으로</button></Link>
      </div>
    </div>
  );
}

export default RegisterPage;
