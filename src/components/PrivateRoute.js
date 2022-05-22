import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
  const location = useLocation();

  const { isAuthenticated } = useSelector((st) => st.auth);

  if (!isAuthenticated)
    return <Navigate to="/login" state={{ from: location }} />;

  return children;
};
