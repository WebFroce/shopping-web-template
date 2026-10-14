import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import api from "../../../api/api";
import { useSiteConfig } from "../../../context/SiteConfigContext";
import RatingStar from "../../home/RatingStar";
import ProductPagination from "./ProductPagination";

import "../../products/product.css";


function GalleryProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, count: 0 });
  const [searchParams] = useSearchParams();
  const { config, t } = useSiteConfig();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const params = Object.fromEntries(searchParams.entries());
        const response = await api.get("/api/products/", { params });
        setProducts(response.data.results ?? []);
        setPagination({
          currentPage: response.data.current_page,
          totalPages: response.data.total_pages,
          count: response.data.count,
        });
      } catch (requestError) {
        console.error(requestError);
        setError(t("productsError"));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams, t]);

  if (loading) return <div className="gallery-state">{t("loadingProducts")}</div>;
  if (error) return <div className="gallery-state text-danger">{error}</div>;
  if (!products.length) return <div className="gallery-state">{t("noProducts")}</div>;

  return (
    <>
      <div className="result-meta">
        <span>{pagination.count.toLocaleString(config.language)} {t("productsCount")}</span>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <article className="product-card" key={product.id}>
            <Link className="product-image-wrap" to={`/Gallery/${product.slug}`}>
              {product.image ? (
                <img src={product.image} alt={product.name} className="product-image" />
              ) : (
                <div className="product-placeholder">{t("noImage")}</div>
              )}
              {product.stock === 0 && <span className="stock-badge">0</span>}
            </Link>

            <div className="product-card-body">
              <div className="product-meta-row">
                <span>{product.category_detail?.name || ""}</span>
                <RatingStar defaultValue={0} />
              </div>
              <Link className="product-title" to={`/Gallery/${product.slug}`}>
                {product.name}
              </Link>
              <p className="product-price">
                {Number(product.price).toLocaleString(config.language)}
                <small>{t("toman")}</small>
              </p>
            </div>
          </article>
        ))}
      </div>

      <ProductPagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
      />
    </>
  );
}


export default GalleryProducts;
