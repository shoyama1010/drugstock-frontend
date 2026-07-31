import { Outlet, useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

export default function StaffLayout() {
  const navigate = useNavigate();

  return (
    <>
      <Box
        sx={{
          height: 64,
          px: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #ddd",
          bgcolor: "#fff",
        }}
      >
        <Typography
          fontWeight={700}
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/staff/dashboard")}
        >
          DrugStore Stock / スタッフ
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button onClick={() => navigate("/staff-dashboard")}>
            ダッシュボード
          </Button>
          <Button onClick={() => navigate("/staff/stock-in")}>
            入庫
          </Button>
          <Button onClick={() => navigate("/staff/stock-out")}>
            出庫
          </Button>
          
        </Box>
      </Box>

      <Box sx={{ p: 4 }}>
        <Outlet />
      </Box>
    </>
  );
}