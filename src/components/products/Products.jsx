import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../api/api";
import { useSiteConfig } from "../../context/SiteConfigContext";
import RatingStar from "../home/RatingStar";

import "./product.css";


function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { config, t } = useSiteConfig();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/api/products/", {
          params: { ordering: "-created_at" },
        });
        setProducts((response.data.results ?? response.data).slice(0, 6));
      } catch (requestError) {
        console.error(requestError);
        setError(t("productsError"));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [t]);

  if (loading) return <div className="gallery-state">{t("loadingProducts")}</div>;
  if (error) return <div className="gallery-state text-danger">{error}</div>;

  return (
    <section className="latest-products-section">
      <header className="text-center section-heading">
        <span className="section-kicker">{t("latestProducts")}</span>
        <h2 className="section-title">{t("latestProducts")}</h2>
        <p className="section-subtitle">{t("latestSubtitle")}</p>
      </header>

      <div className="product-grid">
        {products.map((product) => (
          <article className="product-card" key={product.id}>
            <Link className="product-image-wrap" to={`/Gallery/${product.slug}`}>
              {product.image ? (
                <img src={product.image} alt={product.name} className="product-image" />
              ) : (
                <div className="product-placeholder">{t("noImage")}</div>
              )}
            </Link>
            <div className="product-card-body">
              <div className="product-meta-row">
                <span>{product.category_detail?.name || ""}</span>
                <RatingStar defaultValue={0} />
              </div>
              <Link className="product-title" to={`/Gallery/${product.slug}`}>{product.name}</Link>
              <p className="product-price">
                {Number(product.price).toLocaleString(config.language)}
                <small>{t("toman")}</small>
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="text-center mt-5">
        <Link to="/Gallery" className="btn-prud d-inline-block text-decoration-none">
          {t("viewAllProducts")}
        </Link>
      </div>
    </section>
  );
}


export default Products;
