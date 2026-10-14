import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import { useSiteConfig } from "../../context/SiteConfigContext";
import SwiperCar from "./Swiper";

import "./header.css";


function Head() {
  const { config } = useSiteConfig();
  const hero = config.hero;

  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="hero-kicker">{config.site_name}</span>
          <h1 className="hero-title">{hero.title}</h1>
          <p className="hero-subtitle">{hero.subtitle}</p>
          <Link to="/Gallery" className="hero-cta">
            <span>{hero.button_text}</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>

        <div className="hero-visual">
          <img
            src={hero.image || "/header.png"}
            alt={hero.title}
            className="hero-image"
          />
        </div>
      </section>

      <SwiperCar />
    </>
  );
}


export default Head;
