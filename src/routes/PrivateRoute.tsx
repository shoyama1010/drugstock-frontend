import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

type Props = {
  
  children: ReactNode;
};

export const PrivateRoute = ({ children }: Props) => {
  const token = localStorage.getItem("token");

  // 未ログイン
  if (!token) {
    return <Navigate to='/login' replace />;
  }

  return <>{children}</>;
  // return children;
};
