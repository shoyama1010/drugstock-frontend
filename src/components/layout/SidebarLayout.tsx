// import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";

import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  Dashboard as DashboardIcon,
  Inventory2,
  ShoppingCart,
  Assessment,
  Warehouse,
  ArrowDownward,
  ArrowUpward,
  People,
  Menu as MenuIcon,
} from "@mui/icons-material";

import Header from "./Header";

const drawerWidth = 240;

export default function SidebarLayout() {
  const location = useLocation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const menuItems = [
    {
      text: "ダッシュボード",
      icon: <DashboardIcon />,
      path: "/dashboard",
    },
    {
      text: "商品管理",
      icon: <Inventory2 />,
      path: "/products",
    },
    {
      text: "在庫管理",
      icon: <Warehouse />,
      path: "/stock",
    },
    {
      text: "入庫処理",
      icon: <ArrowDownward />,
      path: "/stock-in",
    },
    {
      text: "出庫処理",
      icon: <ArrowUpward />,
      path: "/stock-out",
    },
    {
      text: "入出庫履歴",
      icon: <ShoppingCart />,
      path: "/transactions",
    },
    {
      text: "レポート",
      icon: <Assessment />,
      path: "/reports",
    },
    {
      text: "スタッフ管理",
      icon: <People />,
      path: "/staff-management",
    },
  ];

  const drawerContent = (
    <>
      <Toolbar
        component={Link}
        to="/"
        onClick={() => {
          if (isMobile) {
            setMobileOpen(false);
          }
        }}
        sx={{
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: 2.5,
          borderBottom: "1px solid #e0e0e0",
          cursor: "pointer",
          "&:hover": {
            bgcolor: "#f5f5f5",
          },
        }}
      >
        <Inventory2 sx={{ fontSize: 28, color: "#1976d2", mr: 1 }} />

        <Box
          sx={{
            color: "#1976d2",
            fontWeight: 700,
            fontSize: "1.1rem",
          }}
        >
          DrugStore Stock
        </Box>
      </Toolbar>

      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ px: 1 }}>
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={() => {
                if (isMobile) {
                  setMobileOpen(false);
                }
              }}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 1,
                "&.Mui-selected": {
                  bgcolor: "#e3f2fd",
                  color: "#1976d2",

                  "& .MuiListItemIcon-root": {
                    color: "#1976d2",
                  },

                  "&:hover": {
                    bgcolor: "#e3f2fd",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>

              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* PC用サイドバー */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,

            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: "1px solid #e0e0e0",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* スマホ用サイドバー */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* メインコンテンツ */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: {
            xs: "100%",
            md: `calc(100% - ${drawerWidth}px)`,
          },
          bgcolor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        {/* スマホ用メニューボタン */}
        {isMobile && (
          <Box
            sx={{
              px: 2,
              py: 1,
              bgcolor: "#fff",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <IconButton
              onClick={handleDrawerToggle}
              edge="start"
              aria-label="メニューを開く"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        )}

        <Header />

        <Outlet />
      </Box>
    </Box>
  );
}

