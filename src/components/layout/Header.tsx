import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <AppBar
      position='static'
      sx={{
        bgcolor: "#fff",
        color: "#333",
        boxShadow: "none",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* 左：タイトル */}
        <Typography sx={{ fontWeight: 600 }}>ダッシュボード</Typography>

        {/* 右：ユーザー＋ログアウト */}
        <Box>
          <Typography component='span' sx={{ mr: 2 }}>
            {localStorage.getItem("role")}
          </Typography>

          <Button variant='outlined' color='error' onClick={handleLogout}>
            ログアウト
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
