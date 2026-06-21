import { Link } from "react-router-dom";

import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Card,
  CardContent,
} from "@mui/material";
import { Inventory2, Speed, Security } from "@mui/icons-material";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: "1px solid #e0e0e0",
        transition: "all 0.3s",
        "&:hover": {
          boxShadow: 3,
          transform: "translateY(-4px)",
        },
      }}
    >
      <CardContent sx={{ p: 4, textAlign: "center" }}>
        <Box
          sx={{
            display: "inline-flex",
            p: 2,
            borderRadius: "50%",
            bgcolor: "#e3f2fd",
            mb: 3,
          }}
        >
          {icon}
        </Box>
        <Typography variant='h6' fontWeight={600} gutterBottom>
          {title}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const features = [
    {
      icon: <Inventory2 sx={{ fontSize: 40, color: "#1976d2" }} />,
      title: "在庫管理の効率化",
      description:
        "医薬品や日用品の在庫をリアルタイムで追跡。発注管理も自動化し、欠品を防ぎます。",
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: "#1976d2" }} />,
      title: "スピーディな操作",
      description:
        "直感的なインターフェースで、入出庫の登録がわずか数秒。業務時間を大幅に短縮します。",
    },
    {
      icon: <Security sx={{ fontSize: 40, color: "#1976d2" }} />,
      title: "セキュアな管理",
      description:
        "ユーザー権限管理により、重要な在庫情報を安全に保護。監査ログも完備しています。",
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#ffffff" }}>
      {/* ヘッダー */}
      <AppBar
        position='static'
        elevation={0}
        sx={{
          bgcolor: "#ffffff",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box display='flex' alignItems='center' sx={{ flexGrow: 1 }}>
            <Inventory2 sx={{ fontSize: 32, color: "#1976d2", mr: 1 }} />
            <Typography
              variant='h6'
              component='div'
              sx={{ color: "#1976d2", fontWeight: 700 }}
            >
              DrugStore Stock
            </Typography>
          </Box>
          <Button
            component={Link}
            // to='/dashboard'
            to='/login'
            variant='outlined'
            sx={{ mr: 2 }}
          >
            管理ログイン
          </Button>

          <Button
            component={Link}
            to='/Staff-Login'
            variant='outlined'
            sx={{
              mr: 2,
              borderColor: "#9c27b0",
              color: "#9c27b0",
              "&:hover": {
                bgcolor: "#f3e5f5",
                borderColor: "#7b1fa2",
              },
            }}
          >
            スタッフログイン
          </Button>

        </Toolbar>
      </AppBar>

      {/* ヒーローセクション */}
      <Box
        sx={{
          bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
          color: "#ffffff",
          py: 12,
        }}
      >
        <Container maxWidth='lg'>
          <Box textAlign='center'>
            <Typography
              variant='h2'
              component='h1'
              fontWeight={700}
              gutterBottom
              sx={{ mb: 3 }}
            >
              Drug store stock 
            </Typography>
            <Typography variant='h5' sx={{ mb: 5, opacity: 0.95 }}>
              医薬品・日用品の在庫をリアルタイムで管理
            </Typography>
            <Box display='flex' gap={2} justifyContent='center'>
              <Button
                component={Link}
                // to='/dashboard'
                to='/login'
                variant='contained'
                size='large'
                sx={{
                  bgcolor: "#ffffff",
                  color: "#1976d2",
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "#f5f5f5",
                  },
                }}
              >
                管理 ログイン
              </Button>

              {/* <Button
                component={Link}
                to='/dashboard'
                variant='outlined'
                size='large'
                sx={{
                  borderColor: "#ffffff",
                  color: "#ffffff",
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: "#ffffff",
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                デモを見る
              </Button> */}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* 特徴セクション */}
      <Container maxWidth='lg' sx={{ py: 10 }}>
        <Box textAlign='center' mb={6}>
          <Typography variant='h4' fontWeight={700} gutterBottom>
            主な機能
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            効率的な在庫管理を実現する3つの特徴
          </Typography>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, 1fr)",
            },
            gap: 4,
          }}
        >
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </Box>
      </Container>

      {/* フッター */}
      <Box
        sx={{
          bgcolor: "#f5f5f5",
          py: 4,
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Container maxWidth='lg'>
          <Typography variant='body2' color='text.secondary' textAlign='center'>
            © 2026 DrugStore Stock. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
