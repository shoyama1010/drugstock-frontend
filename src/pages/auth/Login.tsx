import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import { api } from "../../api/client";
// import Login from "../pages/auth/Login";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/admin/login", {
        email,
        password,
      });
      // const res = await axios.post("http://localhost/api/admin/login", {
      //   email,
      //   password,
      // });

      // トークン保存
      localStorage.setItem("token", res.data.token);

      // ダッシュボードへ
      navigate("/dashboard");
    } catch (err) {
      alert("ログイン失敗");
    }
  };

  return (
    <>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>ログイン</button>
    </>
  );
}
