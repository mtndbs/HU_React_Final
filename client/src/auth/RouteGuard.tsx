import { Navigate } from "react-router-dom";
import { verifyAdmin, verifyBiz, verifyToken } from "./TokenManager";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  level?: number;
}

const guardLevelFunc = (level: number) => {
  if (level === 1) {
    return verifyToken();
  }
  if (level === 2) {
    return verifyBiz() || verifyAdmin();
  }
  if (level === 3) {
    return verifyAdmin();
  } else {
    return false;
  }
};

function RouteGuard({ children, level = 1 }: Props) {
  return guardLevelFunc(level) ? <>{children}</> : <Navigate to="/login" replace={true} />;
}

export default RouteGuard;
