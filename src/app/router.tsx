import { createBrowserRouter } from "react-router-dom";

import SidebarLayout from "../components/layout/SidebarLayout";

import DashboardPage from "../features/dashboard/DashboardPage";
import ProductPage from "../features/products/ProductManagementPage";
import StockPage from "../features/stock/StockManagementPage";
import TransactionsPage from "../features/transactions/TransactionsPage";
import StaffManagementPage from "../features/staff/StaffManagementPage";
import StockInPage from "../features/inbound/StockInPage";
import StockOutPage from "../features/outbound/StockOutPage";
import { Box, Button, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomePage from "../features/home/HomePage";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Container>
      <Box textAlign='center' mt={10}>
        <Typography variant='h3' gutterBottom>
          DrugStore 在庫管理システム
        </Typography>

        <Typography variant='body1' sx={{ mb: 4 }}>
          医薬品倉庫向け在庫管理SPA
        </Typography>

        <Button
          variant='contained'
          size='large'
          onClick={() => navigate("/login")}
        >
          ログイン
        </Button>
      </Box>
    </Container>
  );
}

export const router = createBrowserRouter([
   {
        index: true,
        element: <HomePage />,
      },
  {
    path: "/",
    element: <SidebarLayout />,
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "products",
        element: <ProductPage />,
      },
      {
        path: "stock",
        element: <StockPage />,
      },
      {
        path: "transactions",
        element: <TransactionsPage />,
      },
      {
        // path: "staff",
        path: "/staff-management",
        element: <StaffManagementPage />,
      },
      {
        path: "stock-in",
        element: <StockInPage />,
      },
      {
        path: "stock-out",
        element: <StockOutPage />,
      },

    ],
  },
]);
