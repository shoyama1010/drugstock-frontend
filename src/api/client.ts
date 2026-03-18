import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

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
