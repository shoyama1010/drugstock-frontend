// import { Link, useLocation } from "react-router-dom";
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
} from "@mui/icons-material";

const drawerWidth = 240;

export default function SidebarLayout() {
  const location = useLocation();

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
      // path: "/staff",
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant='permanent'
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
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 2,
            py: 2.5,
            borderBottom: "1px solid #e0e0e0",
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
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component='main'
        sx={{
          flexGrow: 1,
          bgcolor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
