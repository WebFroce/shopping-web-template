import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";

import { useSiteConfig } from "../../context/SiteConfigContext";

import "./Footer.css";


function Footer() {
  const { config, t } = useSiteConfig();
  const footer = config.footer;

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <Link to="/" className="footer-brand">{config.site_name}</Link>
          <p className="footer-description">{footer.text}</p>
        </div>

        <div>
          <h3>{t("quickAccess")}</h3>
          <nav className="footer-links">
            {config.navigation.map((item) => (
              /^https?:\/\//i.test(item.url) ? (
                <a key={item.id} href={item.url}>{item.label}</a>
              ) : (
                <Link key={item.id} to={item.url}>{item.label}</Link>
              )
            ))}
          </nav>
        </div>

        <div>
          <h3>{t("contact")}</h3>
          <div className="footer-contact">
            {footer.phone && <a href={`tel:${footer.phone}`}><FontAwesomeIcon icon={faPhone} />{footer.phone}</a>}
            {footer.email && <a href={`mailto:${footer.email}`}><FontAwesomeIcon icon={faEnvelope} />{footer.email}</a>}
            {footer.address && <span><FontAwesomeIcon icon={faLocationDot} />{footer.address}</span>}
          </div>
        </div>

        <div>
          <h3>{t("newsletter")}</h3>
          <p className="footer-description">{t("newsletterText")}</p>
          <form className="newsletter-form" onSubmit={(event) => event.preventDefault()}>
            <input type="email" placeholder={t("emailPlaceholder")} aria-label={t("emailPlaceholder")} />
            <button type="submit">{t("subscribe")}</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {config.site_name}. {t("rights")}</span>
      </div>
    </footer>
  );
}


export default Footer;
