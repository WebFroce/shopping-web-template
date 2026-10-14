import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";
import { useSiteConfig } from "../../context/SiteConfigContext";


function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();
  const { t } = useSiteConfig();

  if (loading) {
    return (
      <div className="container py-5 text-center">
        {t("checkingAccount")}
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}


export default ProtectedRoute;
