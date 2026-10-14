import { useContext, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";
import { useSiteConfig } from "../../context/SiteConfigContext";
import { getApiError } from "../../api/errors";
import Footer from "../footer/Footer";

import "./auth.css";


const initialForm = {
  username: "",
  email: "",
  password: "",
  passwordConfirm: "",
};


function AuthPage({ mode }) {
  const isRegister = mode === "register";
  const { isAuthenticated, loading, login, register } = useContext(AuthContext);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useSiteConfig();

  const redirectTo = location.state?.from
    ? `${location.state.from.pathname}${location.state.from.search || ""}`
    : "/";

  if (!loading && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (isRegister && form.password !== form.passwordConfirm) {
      setError(t("passwordMismatch"));
      return;
    }

    try {
      setSubmitting(true);

      if (isRegister) {
        await register(form);
      } else {
        await login(form.username, form.password);
      }

      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(getApiError(
        requestError,
        isRegister ? t("registerFailed") : t("loginFailed")
      ));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <main className="container auth-page py-5">
        <div className="auth-card bg-white rounded-4 shadow-sm mx-auto p-4 p-md-5">
          <h1 className="h3 text-center mb-2">
            {isRegister ? t("registerTitle") : t("loginTitle")}
          </h1>

          <p className="text-secondary text-center mb-4">
            {isRegister
              ? t("registerSubtitle")
              : t("loginSubtitle")}
          </p>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label className="form-label" htmlFor="username">
              {t("username")}
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className="form-control mb-3"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />

            {isRegister && (
              <>
                <label className="form-label" htmlFor="email">
                  {t("email")}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control mb-3"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </>
            )}

            <label className="form-label" htmlFor="password">
              {t("password")}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-control mb-3"
              value={form.password}
              onChange={handleChange}
              autoComplete={isRegister ? "new-password" : "current-password"}
              minLength={8}
              required
            />

            {isRegister && (
              <>
                <label className="form-label" htmlFor="passwordConfirm">
                  {t("passwordConfirm")}
                </label>
                <input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type="password"
                  className="form-control mb-4"
                  value={form.passwordConfirm}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </>
            )}

            <button
              type="submit"
              className="btn btn-dark w-100 py-2"
              disabled={submitting || loading}
            >
              {submitting
                ? t("pleaseWait")
                : isRegister ? t("register") : t("login")}
            </button>
          </form>

          <p className="text-center mt-4 mb-0">
            {isRegister ? t("alreadyRegistered") : t("noAccount")}
            {" "}
            <Link
              to={isRegister ? "/login" : "/register"}
              state={location.state}
            >
              {isRegister ? t("signIn") : t("signUp")}
            </Link>
          </p>
        </div>
      </main>

      <div className="container">
        <Footer />
      </div>
    </>
  );
}


export default AuthPage;
