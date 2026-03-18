import { BrowserRouter, Routes, Route } from "react-router-dom";
// pages
import HomePage from "../features/home/HomePage";
import Login from "../pages/auth/Login";
import StaffLogin from "../pages/auth/StaffLogin";
// features
import Dashboard from "../features/dashboard/DashboardPage";
import Products from "../features/products/ProductManagementPage";
import SidebarLayout from "../components/layout/SidebarLayout";
import StockPage from "../features/stock/StockManagementPage";
import TransactionsPage from "../features/transactions/TransactionsPage";
import StockInPage from "../features/inbound/StockInPage";
import StockOutPage from "../features/outbound/StockOutPage";
import StaffManagementPage from "../features/staff/StaffManagementPage";
// guard
import { PrivateRoute } from "./PrivateRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🏠 トップ画面 */}
        <Route path='/' element={<HomePage />} />

        {/* 🔓 未ログインOK */}
        <Route path='/login' element={<Login />} />
        <Route path='/staff-login' element={<StaffLogin />} />

        {/* 🔒 認証必須 +レイアウト*/}
        <Route
          element={
            <PrivateRoute>
              <SidebarLayout />
            </PrivateRoute>
          }
        >
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/products' element={<Products />} />
          <Route path='/stock' element={<StockPage />} />
          <Route path='/transactions' element={<TransactionsPage />} />
          <Route path='/stock-in' element={<StockInPage />} />
          <Route path='/stock-out' element={<StockOutPage />} />
          <Route path='/staff-management' element={<StaffManagementPage />} />
          <Route path='/staff-login' element={<StaffLogin />} />
        </Route>

        {/* 🚨 存在しないURL対策 */}
        <Route path='*' element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
