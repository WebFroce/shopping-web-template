import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faCartShopping,
  faMagnifyingGlass,
  faRightFromBracket,
  faTimes,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import { AuthContext } from "../../../context/AuthContext";
import { useSiteConfig } from "../../../context/SiteConfigContext";
import { CartContext } from "../../CardContext/cardContext";

import "../header.css";


function MenuLink({ item, onClick, className = "" }) {
  const isExternal = /^https?:\/\//i.test(item.url);

  if (isExternal) {
    return (
      <a
        href={item.url}
        className={className}
        target={item.open_in_new_tab ? "_blank" : undefined}
        rel={item.open_in_new_tab ? "noreferrer" : undefined}
        onClick={onClick}
      >
        {item.label}
      </a>
    );
  }

  return (
    <Link
      to={item.url}
      className={className}
      target={item.open_in_new_tab ? "_blank" : undefined}
      onClick={onClick}
    >
      {item.label}
    </Link>
  );
}


function Navigation() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showNav, setShowNav] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { config, t } = useSiteConfig();

  const cartCount = cartItems.reduce(
    (total, item) => total + item.count,
    0
  );

  const handleSearch = (event) => {
    event.preventDefault();
    const value = searchText.trim();
    navigate(value ? `/Gallery?search=${encodeURIComponent(value)}` : "/Gallery");
    setShowSearch(false);
    setShowNav(false);
  };

  const handleLogout = async () => {
    await logout();
    setShowNav(false);
    navigate("/");
  };

  return (
    <header className="site-header">
      {config.announcement && (
        <div className="announcement-bar">{config.announcement}</div>
      )}

      <div className="site-nav-wrap">
        <nav className="site-nav" aria-label="Main navigation">
          <Link to="/" className="site-brand">
            {config.logo ? (
              <img src={config.logo} alt={config.site_name} className="site-logo" />
            ) : (
              <span className="brand-mark">N</span>
            )}
            <span>{config.site_name}</span>
          </Link>

          <div className="desktop-links">
            {config.navigation.map((item) => (
              <MenuLink key={item.id} item={item} className="nav-link-modern" />
            ))}
          </div>

          <div className="nav-actions">
            <form
              className={`nav-search ${showSearch ? "nav-search-open" : ""}`}
              onSubmit={handleSearch}
            >
              {showSearch && (
                <input
                  type="search"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder={t("searchPlaceholder")}
                  aria-label={t("searchPlaceholder")}
                  autoFocus
                />
              )}
              <button
                type={showSearch ? "submit" : "button"}
                className="icon-action"
                onClick={() => !showSearch && setShowSearch(true)}
                aria-label={t("searchPlaceholder")}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </form>

            <Link to="/Cart" className="icon-action cart-action" aria-label={t("cart")}>
              <FontAwesomeIcon icon={faCartShopping} />
              {cartCount > 0 && (
                <span className="cart-count">{cartCount.toLocaleString(config.language)}</span>
              )}
            </Link>

            {user ? (
              <div className="account-actions">
                <Link to="/orders" className="account-link">
                  <FontAwesomeIcon icon={faUser} />
                  <span>{user.username}</span>
                </Link>
                <button className="icon-action" onClick={handleLogout} aria-label={t("logout")}>
                  <FontAwesomeIcon icon={faRightFromBracket} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="login-link">{t("loginRegister")}</Link>
            )}

            <button
              className="mobile-toggle"
              onClick={() => setShowNav((value) => !value)}
              aria-label="Toggle navigation"
              aria-expanded={showNav}
            >
              <FontAwesomeIcon icon={showNav ? faTimes : faBars} />
            </button>
          </div>
        </nav>

        {showNav && (
          <div className="mobile-panel">
            {config.navigation.map((item) => (
              <MenuLink
                key={item.id}
                item={item}
                className="mobile-nav-link"
                onClick={() => setShowNav(false)}
              />
            ))}

            <form className="mobile-search" onSubmit={handleSearch}>
              <input
                type="search"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder={t("searchPlaceholder")}
              />
              <button type="submit" className="icon-action">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </form>

            {user ? (
              <>
                <Link to="/orders" className="mobile-nav-link" onClick={() => setShowNav(false)}>
                  {t("myOrders")}
                </Link>
                <button className="mobile-logout" onClick={handleLogout}>{t("logout")}</button>
              </>
            ) : (
              <Link to="/login" className="mobile-nav-link" onClick={() => setShowNav(false)}>
                {t("loginRegister")}
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}


export default Navigation;
