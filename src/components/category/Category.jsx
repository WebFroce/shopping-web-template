import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import api from "../../api/api";
import { useSiteConfig } from "../../context/SiteConfigContext";

import "./category.css";


function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useSiteConfig();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/products/categories/");
        setCategories(response.data);
      } catch (error) {
        console.error("Could not load categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <div className="gallery-state">{t("loadingProducts")}</div>;
  if (!categories.length) return null;

  return (
    <section className="category-section">
      <header className="text-center section-heading">
        <span className="section-kicker">{t("categories")}</span>
        <h2 className="section-title">{t("categories")}</h2>
        <p className="section-subtitle">{t("categoriesSubtitle")}</p>
      </header>

      <div className="category-grid">
        {categories.map((category) => (
          <article key={category.id} className="category-card">
            {category.image ? (
              <img src={category.image} alt={category.name} className="category-image" />
            ) : (
              <div className="category-image category-placeholder" />
            )}
            <div className="category-overlay" />
            <div className="category-content">
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <Link to={`/Gallery?category=${category.slug}`} className="category-link">
                {t("viewProducts")}
                <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}


export default Category;
