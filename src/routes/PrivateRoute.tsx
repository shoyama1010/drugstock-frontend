// ;import type { JSX } from "@emotion/react/jsx-runtime";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function PrivateRoute({ role }: { role?: string }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const location = useLocation();

  // 未ログイン
  if (!token) {
    return <Navigate to='/login' replace />;
  }
  // if (!token) {
  //   // スタッフ系URLならスタッフログインへ
  //   if (location.pathname.startsWith("/staff")) {
  //     return <Navigate to='/staff-login' replace />;
  //   }
  //   return <Navigate to='/login' replace />;
  // }

  // roleチェック（必要な場合）
  if (role && userRole !== role) {
    if (userRole === "staff") {
      return <Navigate to='/staff-dashboard' replace />;
    }
    return <Navigate to='/dashboard' replace />;
  }

  return <Outlet />;
}
// type Props = {
//   children: ReactNode;
//   // children: JSX.Element;
// };

// export const PrivateRoute = ({ children }: Props) => {
// export const PrivateRoute = ({ children }: any) => {
//   const token = localStorage.getItem("token");

//   // 未ログイン
//   if (!token) {
//     return <Navigate to='/login' />;
//   }

//   return children;
//   // return children;
// };
