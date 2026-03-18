import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { Backspace, Login } from "@mui/icons-material";

export default function StaffLogin() {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<"employee" | "pin">(
    "employee",
  );

  const handleLogin = () => {
    if (!employeeId || !pin) {
      setError("社員番号とPINを入力してください");
      return;
    }

    if (pin.length !== 4) {
      setError("PINは4桁で入力してください");
      return;
    }

    // 簡易認証（開発予定機能）
    // 本番環境では適切な認証処理を実装
    navigate("/staff/dashboard");
  };

  const handleNumberClick = (num: string) => {
    if (focusedField === "employee") {
      setEmployeeId((prev) => prev + num);
    } else {
      if (pin.length < 4) {
        setPin((prev) => prev + num);
      }
    }
    setError("");
  };

  const handleBackspace = () => {
    if (focusedField === "employee") {
      setEmployeeId((prev) => prev.slice(0, -1));
    } else {
      setPin((prev) => prev.slice(0, -1));
    }
    setError("");
  };

  const handleClear = () => {
    if (focusedField === "employee") {
      setEmployeeId("");
    } else {
      setPin("");
    }
    setError("");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
        p: 2,
      }}
    >
      <Container maxWidth='sm'>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 2,
          }}
        >
          {/* ロゴエリア */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 60,
                height: 60,
                borderRadius: 2,
                bgcolor: "#1976d2",
                color: "#ffffff",
                mb: 2,
              }}
            >
              <Typography variant='h5' fontWeight={700}>
                DS
              </Typography>
            </Box>
            <Typography variant='h6' fontWeight={600} color='text.primary'>
              スタッフログイン
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              倉庫作業端末
            </Typography>
          </Box>

          {error && (
            <Alert severity='error' sx={{ mb: 2, fontSize: "0.9rem" }}>
              {error}
            </Alert>
          )}

          {/* 社員番号入力 */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant='body2'
              fontWeight={600}
              color='text.secondary'
              sx={{ mb: 1 }}
            >
              社員番号
            </Typography>
            <TextField
              fullWidth
              placeholder='社員番号を入力'
              value={employeeId}
              onFocus={() => setFocusedField("employee")}
              onChange={(e) => {
                setEmployeeId(e.target.value);
                setError("");
              }}
              sx={{
                "& .MuiInputBase-root": {
                  height: 56,
                  fontSize: "1.1rem",
                  bgcolor: focusedField === "employee" ? "#e3f2fd" : "#ffffff",
                },
              }}
            />
          </Box>

          {/* PIN入力 */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant='body2'
              fontWeight={600}
              color='text.secondary'
              sx={{ mb: 1 }}
            >
              PIN（4桁）
            </Typography>
            <TextField
              fullWidth
              placeholder='••••'
              type='password'
              value={pin}
              onFocus={() => setFocusedField("pin")}
              onChange={(e) => {
                if (/^\d{0,4}$/.test(e.target.value)) {
                  setPin(e.target.value);
                  setError("");
                }
              }}
              inputProps={{
                maxLength: 4,
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              sx={{
                "& .MuiInputBase-root": {
                  height: 56,
                  fontSize: "1.5rem",
                  letterSpacing: "0.5em",
                  bgcolor: focusedField === "pin" ? "#e3f2fd" : "#ffffff",
                },
              }}
            />
          </Box>

          {/* 数字テンキー */}
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 1.5,
              }}
            >
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                <Button
                  key={num}
                  fullWidth
                  variant='outlined'
                  onClick={() => handleNumberClick(num)}
                  sx={{
                    height: 64,
                    fontSize: "1.5rem",
                    fontWeight: 600,
                    borderColor: "#1976d2",
                    color: "#1976d2",
                    "&:hover": {
                      borderColor: "#1565c0",
                      bgcolor: "#e3f2fd",
                    },
                  }}
                >
                  {num}
                </Button>
              ))}
              <Button
                fullWidth
                variant='outlined'
                onClick={handleClear}
                sx={{
                  height: 64,
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  borderColor: "#9e9e9e",
                  color: "#616161",
                  "&:hover": {
                    borderColor: "#757575",
                    bgcolor: "#f5f5f5",
                  },
                }}
              >
                クリア
              </Button>
              <Button
                fullWidth
                variant='outlined'
                onClick={() => handleNumberClick("0")}
                sx={{
                  height: 64,
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  borderColor: "#1976d2",
                  color: "#1976d2",
                  "&:hover": {
                    borderColor: "#1565c0",
                    bgcolor: "#e3f2fd",
                  },
                }}
              >
                0
              </Button>
              <Button
                fullWidth
                variant='outlined'
                onClick={handleBackspace}
                sx={{
                  height: 64,
                  borderColor: "#9e9e9e",
                  color: "#616161",
                  "&:hover": {
                    borderColor: "#757575",
                    bgcolor: "#f5f5f5",
                  },
                }}
              >
                <Backspace />
              </Button>
            </Box>
          </Box>

          {/* ログインボタン */}
          <Button
            fullWidth
            variant='contained'
            size='large'
            onClick={handleLogin}
            startIcon={<Login />}
            sx={{
              height: 60,
              fontSize: "1.1rem",
              fontWeight: 700,
              bgcolor: "#1976d2",
              "&:hover": {
                bgcolor: "#1565c0",
              },
              mb: 1.5,
            }}
          >
            ログイン
          </Button>

          <Button
            fullWidth
            variant='text'
            onClick={() => navigate("/")}
            sx={{
              height: 44,
              fontSize: "0.9rem",
              color: "#757575",
            }}
          >
            トップページに戻る
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}