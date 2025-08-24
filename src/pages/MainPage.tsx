import { Link } from "react-router-dom";

export const MainPage = () => {
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