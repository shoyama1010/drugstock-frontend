import { createBrowserRouter } from "react-router-dom";

import SidebarLayout from "../components/layout/SidebarLayout";

import DashboardPage from "../features/dashboard/DashboardPage";
import ProductPage from "../features/products/ProductManagementPage";
import StockPage from "../features/stock/StockManagementPage";
import TransactionsPage from "../features/transactions/TransactionsPage";
import StaffManagementPage from "../features/staff/StaffManagementPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SidebarLayout />,
    children: [
      {
        // path: "/",
        index: true,
        element: <DashboardPage />,
      },
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
    ],
  },
]);
