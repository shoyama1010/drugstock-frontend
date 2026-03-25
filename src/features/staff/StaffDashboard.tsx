import { useNavigate } from "react-router-dom";
import { Box, Container, Button, Typography, Paper } from "@mui/material";
import {
  ArrowDownward,
  ArrowUpward,
  Logout,
  Warehouse,
  LocalShipping,
} from "@mui/icons-material";

export default function StaffDashboard() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ヘッダー */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant='h6' fontWeight={700}>
            スタッフ作業画面
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            作業を選択してください
          </Typography>
        </Box>
        <Button
          variant='outlined'
          color='error'
          startIcon={<Logout />}
          onClick={() => navigate("/staff/login")}
          sx={{ height: 48 }}
        >
          ログアウト
        </Button>
      </Paper>

      {/* メインコンテンツ */}
      <Container
        maxWidth='md'
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          py: 4,
        }}
      >
        {/* 開発予定バッジ */}
        <Box
          sx={{
            display: "inline-block",
            bgcolor: "#9e9e9e",
            color: "#ffffff",
            px: 2,
            py: 0.5,
            borderRadius: 1,
            mb: 4,
            fontSize: "0.875rem",
            fontWeight: 600,
            alignSelf: "center",
          }}
        >
          🚧 開発 新機能
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: 3,
          }}
        >
          {/* 入庫作業ボタン */}
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: "center",
              minHeight: 320,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.3s",
              border: "3px solid #4caf50",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: 6,
                bgcolor: "#f1f8e9",
              },
            }}
            onClick={() => navigate("/staff/scan-in")}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 100,
                height: 100,
                borderRadius: "50%",
                bgcolor: "#4caf50",
                color: "#ffffff",
                mb: 3,
                mx: "auto",
              }}
            >
              <Warehouse sx={{ fontSize: 50 }} />
            </Box>

            <Typography
              variant='h4'
              fontWeight={700}
              gutterBottom
              sx={{ color: "#4caf50" }}
            >
              入庫作業
            </Typography>

            <Typography variant='body1' color='text.secondary' mb={3}>
              商品を棚に格納する作業
            </Typography>

            <Button
              variant='contained'
              size='large'
              startIcon={<ArrowDownward />}
              sx={{
                height: 64,
                fontSize: "1.25rem",
                fontWeight: 700,
                bgcolor: "#4caf50",
                "&:hover": {
                  bgcolor: "#388e3c",
                },
              }}
            >
              入庫開始
            </Button>
          </Paper>

          {/* 出庫作業ボタン */}
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: "center",
              minHeight: 320,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.3s",
              border: "3px solid #f44336",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: 6,
                bgcolor: "#ffebee",
              },
            }}
            onClick={() => navigate("/staff/scan-out")}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 100,
                height: 100,
                borderRadius: "50%",
                bgcolor: "#f44336",
                color: "#ffffff",
                mb: 3,
                mx: "auto",
              }}
            >
              <LocalShipping sx={{ fontSize: 50 }} />
            </Box>

            <Typography
              variant='h4'
              fontWeight={700}
              gutterBottom
              sx={{ color: "#f44336" }}
            >
              出庫作業
            </Typography>

            <Typography variant='body1' color='text.secondary' mb={3}>
              商品を棚から取り出す作業
            </Typography>

            <Button
              variant='contained'
              size='large'
              startIcon={<ArrowUpward />}
              sx={{
                height: 64,
                fontSize: "1.25rem",
                fontWeight: 700,
                bgcolor: "#f44336",
                "&:hover": {
                  bgcolor: "#d32f2f",
                },
              }}
            >
              出庫開始
            </Button>
          </Paper>
        </Box>

        {/* 注意事項 */}
        <Paper
          elevation={0}
          sx={{
            mt: 4,
            p: 3,
            bgcolor: "#fff3e0",
            border: "2px solid #ff9800",
          }}
        >
          <Typography variant='body2' fontWeight={600} gutterBottom>
            ⚠️ 注意事項
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            • バーコードスキャナーが接続されていることを確認してください
            <br />
            • スキャン画面では自動的に入力フィールドにフォーカスされます
            <br />• エラーが発生した場合は、管理者に連絡してください
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
