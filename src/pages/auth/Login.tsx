import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/clients";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("メールアドレスとパスワードを入力してください");
      return;
    }

    try {
      const res = await api.post("/login", {
        email,
        password,
      });

      // トークン保存
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role); // ← 追加

      // ダッシュボードへ
      if (res.data.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/staff-dashboard");
      }
    } catch (err: any) {
      console.log(err);
      alert(err.response?.data?.message || "ログイン失敗");
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='bg-white p-8 rounded-xl shadow-md w-96'>
        <h1 className='text-2xl font-bold text-center mb-6'>管理ログイン</h1>

        <input
          type='email'
          placeholder='メールアドレス'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
        />

        <input
          type='password'
          placeholder='パスワード'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='w-full p-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
        />

        <button
          onClick={handleLogin}
          className='w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-lg hover:opacity-90 transition'
        >
          ログイン
        </button>
      </div>
    </div>

  );
}
