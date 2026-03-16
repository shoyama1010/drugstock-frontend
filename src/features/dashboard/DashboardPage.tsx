import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  Typography,
  Box,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Button,
} from "@mui/material";

import {
  Inventory2,
  Warehouse,
  ArrowDownward,
  ArrowUpward,
  Menu as MenuIcon,
} from "@mui/icons-material";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBgColor: string;
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
        <Box display='flex' alignItems='center' gap={2}>
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
              variant='body2'
              color='text.secondary'
              gutterBottom
              sx={{ mb: 0.5 }}
            >
              {title}
            </Typography>
            <Typography variant='h4' fontWeight={600}>
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const stats = [
    {
      title: "総商品数",
      value: "1,247",
      icon: <Inventory2 sx={{ fontSize: 28, color: "#1976d2" }} />,
      iconBgColor: "#e3f2fd",
    },
    {
      title: "総在庫数",
      value: "8,532",
      icon: <Warehouse sx={{ fontSize: 28, color: "#2e7d32" }} />,
      iconBgColor: "#e8f5e9",
    },
    {
      title: "本日入庫数",
      value: "156",
      icon: <ArrowDownward sx={{ fontSize: 28, color: "#ed6c02" }} />,
      iconBgColor: "#fff4e5",
    },
    {
      title: "本日出庫数",
      value: "89",
      icon: <ArrowUpward sx={{ fontSize: 28, color: "#d32f2f" }} />,
      iconBgColor: "#ffebee",
    },
  ];

  return (
    <Container maxWidth='xl' sx={{ py: 4 }}>
      <Typography variant='h4' fontWeight={600} gutterBottom sx={{ mb: 3 }}>
        ダッシュボード
      </Typography>

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
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </Box>

      <Box sx={{ mt: 4 }}>
        <Card elevation={0} sx={{ border: "1px solid #e0e0e0" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant='h6' gutterBottom>
              最近の活動
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              在庫の入出庫履歴や商品情報がここに表示されます。
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
