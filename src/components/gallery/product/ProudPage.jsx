import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

import { toast, ToastContainer } from "react-toastify";

import Footer from "../../footer/Footer";
import { CartContext } from "../../CardContext/cardContext";
import api from "../../../api/api";
import { useSiteConfig } from "../../../context/SiteConfigContext";


function ProudPage() {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { addToCart } = useContext(CartContext);
  const { config, t } = useSiteConfig();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/api/products/${encodeURIComponent(slug)}/`
        );

        setProduct(response.data);
      } catch (error) {
        console.error(error);
        setError(t("productNotFound"));
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug, t]);


  const handleAddToCart = () => {
    if (!product) {
      toast.error(t("productUnavailable"));
      return;
    }

    addToCart(product);

    toast.success(t("addedToCart"), {
      position: "bottom-left",
      autoClose: 2000,
    });
  };


  if (loading) {
    return (
      <div className="text-center mt-5">
        {t("loadingProduct")}
      </div>
    );
  }


  if (error) {
    return (
      <div className="text-center mt-5 text-danger">
        {error}
      </div>
    );
  }


  return (
    <>
      <ToastContainer />

      <main className="container">
      <div className="product-detail">

        <div className="product-detail-visual">
          {product?.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="product-detail-image"
            />
          ) : (
            <div className="product-detail-placeholder">
              {t("noProductImage")}
            </div>
          )}
        </div>


        <div className="product-detail-copy">

          <h1 className="product-detail-title">
            {product?.name}
          </h1>

          <p className="product-detail-price">
            {Number(product?.price).toLocaleString(config.language)} <small>{t("toman")}</small>
          </p>


          {product?.category_detail && (
            <p className="product-detail-category">
              {t("productCategory")}:
              {" "}
              {product.category_detail.name}
            </p>
          )}


          <div className="product-detail-description">
            <p>
              {product?.description}
            </p>
          </div>


          <p className="product-detail-stock">
            {t("stock")}:
            {" "}
            {product?.stock}
          </p>


          <button
            className="product-add-button"
            onClick={handleAddToCart}
            disabled={product?.stock === 0}
          >
            {t("addToCart")}

            <FontAwesomeIcon
              icon={faCartShopping}
              className="ms-3"
            />
          </button>

        </div>

      </div>
      </main>

      <div className="container"><Footer /></div>
    </>
  );
}


export default ProudPage;
