// ;import type { JSX } from "@emotion/react/jsx-runtime";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = ({ role }: { role?: string }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/" replace />; // ← ここ変更
  }

  return <Outlet />;
};

// if (!token) {
//     // スタッフ系URLならスタッフログインへ
//     if (location.pathname.startsWith("/staff")) {
//       return <Navigate to='/staff-login' replace />;
//     }
//     return <Navigate to='/login' replace />;
//   }

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
