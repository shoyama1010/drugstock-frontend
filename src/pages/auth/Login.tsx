import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../api/clients";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";

type ValidationErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");
  // const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const getFirstValidationError = (
    errors?: Record<string, string[]>
  ): string | null => {
    if (!errors) return null;

    const firstKey = Object.keys(errors)[0];
    if (!firstKey) return null;

    const firstMessages = errors[firstKey];
    if (!Array.isArray(firstMessages) || firstMessages.length === 0) {
      return null;
    }

    return firstMessages[0];
  };

  const handleLogin = async (): Promise<void> => {
    setErrorMessage("");
   
    try {
      setLoading(true);

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
    } catch (error: unknown) {
      console.error("管理ログインエラー:", error);

      if (axios.isAxiosError<ValidationErrorResponse>(error)) {
        const status = error.response?.status;
        const responseData = error.response?.data;

        if (status === 422) {
          const firstValidationError = getFirstValidationError(
            responseData?.errors
          );

          if (firstValidationError) {
            setErrorMessage(firstValidationError);
            return;
          }

          setErrorMessage(
            responseData?.message || "入力内容に誤りがあります。"
          );
          return;
        }

        if (status === 401) {
          setErrorMessage(
            responseData?.message || "ログイン情報が正しくありません。"
          );
          return;
        }

        setErrorMessage(
          responseData?.message || "ログインに失敗しました。"
        );
        return;
      }

      setErrorMessage("予期しないエラーが発生しました。");
    } finally {
      setLoading(false);
    }

  };

  return (
    <Box className="flex items-center justify-center min-h-screen bg-gray-100">
      <Paper className="bg-white p-8 rounded-xl shadow-md w-96">
        <Typography
          variant="h4"
          fontWeight={700}
          align="center"
          gutterBottom
          sx={{ mb: 3 }}
        >
          管理ログイン
        </Typography>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            error={!!errorMessage && errorMessage.includes("メール")}
          />

          <TextField
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            inputProps={{ minLength: 8 }}      
            error={!!errorMessage && errorMessage.includes("パスワード")}
          />

          <Button
            variant="contained"
            onClick={handleLogin}
            disabled={loading}
            sx={{
              mt: 1,
              py: 1.5,
              fontWeight: 700,
              background: "linear-gradient(90deg, #a855f7, #6366f1)",
              "&:hover": {
                background: "linear-gradient(90deg, #9333ea, #4f46e5)",
              },
            }}
          >
            {loading ? "ログイン中..." : "ログイン"}
          </Button>
        </Box>
      </Paper>
    </Box>

  );
}


