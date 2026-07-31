import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:8000/api",
  // baseURL: "https://drugs-stock-app-production.up.railway.app/api",
  baseURL: import.meta.env.VITE_API_URL,
  // withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

// 🔥 リクエスト時にトークン付与
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔥 レスポンスエラー処理（重要）
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 認証エラー（401）
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // 強制ログアウト
    }
    return Promise.reject(error);
  },
);

