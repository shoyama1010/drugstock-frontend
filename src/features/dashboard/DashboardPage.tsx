import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Container,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Inventory2,
  Warehouse,
  ArrowDownward,
  ArrowUpward,
} from "@mui/icons-material";

// 例: 既存の axios インスタンスがある場合
// import api from "../lib/api";
// import api from "../api/client";

// まだ共通APIクライアントを使っていない場合は一時的に axios でもOK
import axios from "axios";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBgColor: string;
}

interface DashboardStats {
  total_products: number;
  total_stock: number;
  today_in: number;
  today_out: number;
}

function StatCard({ title, value, icon, iconBgColor }: StatCardProps) {
  return (
    <Card
      elevation={1}
      sx={{
        height: "100%",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 3,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              bgcolor: iconBgColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>

          <Box flex={1}>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              sx={{ mb: 0.5 }}
            >
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={600}>
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError("");

        // 共通の api クライアントがあるならそちらを優先してください
        // const res = await api.get("/dashboard");

        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:8000/api/dashboard", {
          headers: token
            ? {
              Authorization: `Bearer ${token}`,
            }
            : {},
        });

        setStats(res.data);
      } catch (err) {
        console.error("ダッシュボード取得エラー:", err);
        setError("ダッシュボード情報の取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const displayStats = useMemo(() => {
    if (!stats) return [];

    return [
      {
        title: "総商品数",
        value: stats.total_products.toLocaleString(),
        icon: <Inventory2 sx={{ fontSize: 28, color: "#1976d2" }} />,
        iconBgColor: "#e3f2fd",
      },
      {
        title: "総在庫数",
        value: stats.total_stock.toLocaleString(),
        icon: <Warehouse sx={{ fontSize: 28, color: "#2e7d32" }} />,
        iconBgColor: "#e8f5e9",
      },
      {
        title: "本日入庫数",
        value: stats.today_in.toLocaleString(),
        icon: <ArrowDownward sx={{ fontSize: 28, color: "#ed6c02" }} />,
        iconBgColor: "#fff4e5",
      },
      {
        title: "本日出庫数",
        value: stats.today_out.toLocaleString(),
        icon: <ArrowUpward sx={{ fontSize: 28, color: "#d32f2f" }} />,
        iconBgColor: "#ffebee",
      },
    ];
  }, [stats]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
        現在の商品在庫状況
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && stats && (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 3,
            }}
          >
            {displayStats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </Box>

          <Box sx={{ mt: 4 }}>
            <Card elevation={0} sx={{ border: "1px solid #e0e0e0" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  最近の活動
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  現在は（管理者での）入出庫処理のみです。今後、スタッフでの入出庫内容やレポート表示を追加予定です。
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </>
      )}
    </Container>
  );
}

