import { Routes, Route } from "react-router-dom";
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
import StaffDashboard from "../features/staff/StaffDashboard";
import Reports from "../features/reports/Reports";
import StaffChangePinPage from "../features/staff/StaffChangePinPage";

// guard
import { PrivateRoute } from "./PrivateRoute";

export default function AppRouter() {
  return (
    <Routes>
      {/* 🏠 トップ */}
      <Route path='/' element={<HomePage />} />
      {/* 🔓 未ログイン */}
      <Route path='/login' element={<Login />} />
      <Route path='/staff-login' element={<StaffLogin />} />
      {/* 🛡 管理者 */}
      <Route element={<PrivateRoute role='admin' />}>
        <Route element={<SidebarLayout />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/products' element={<Products />} />
          <Route path='/stock' element={<StockPage />} />
          <Route path='/transactions' element={<TransactionsPage />} />
          <Route path='/stock-in' element={<StockInPage />} />
          <Route path='/stock-out' element={<StockOutPage />} />
          <Route path='/staff-management' element={<StaffManagementPage />} />
          <Route path='/reports' element={<Reports />} />
          {/* <Route path="/stock/:shelf" element={<StockDetailPage />} /> */}
        </Route>
      </Route>
      {/* 👷 スタッフ */}
      <Route element={<PrivateRoute role='staff' />}>
        <Route path='/staff-dashboard' element={<StaffDashboard />} />
        <Route path='/staff/change-pin' element={<StaffChangePinPage />} />
      </Route>
      {/* 🚨 fallback */}
      <Route path='*' element={<HomePage />} />
    </Routes>

  );
}
