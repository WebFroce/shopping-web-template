import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../api/api";
import { getApiError } from "../../api/errors";
import { useSiteConfig } from "../../context/SiteConfigContext";
import Footer from "../footer/Footer";


function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { config, t } = useSiteConfig();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/api/orders/");
        setOrders(response.data.results ?? response.data);
      } catch (requestError) {
        setError(getApiError(requestError, t("ordersFailed")));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [t]);

  return (
    <>
      <main className="container py-5">
        <h1 className="h3 mb-4">{t("ordersTitle")}</h1>

        {loading && <p className="text-center">{t("loadingOrders")}</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && orders.length === 0 && (
          <div className="bg-white rounded-4 p-5 text-center">
            <p className="fs-5">{t("noOrders")}</p>
            <Link to="/Gallery" className="btn btn-dark">{t("continueShopping")}</Link>
          </div>
        )}

        <div className="d-flex flex-column gap-3">
          {orders.map((order) => (
            <article key={order.id} className="bg-white rounded-4 shadow-sm p-4">
              <div className="d-flex flex-wrap justify-content-between gap-3 border-bottom pb-3 mb-3">
                <div>
                  <strong>{t("orderNumber")} #{order.id.toLocaleString(config.language)}</strong>
                  <span className="badge text-bg-secondary me-3">{order.status_display}</span>
                </div>
                <time className="text-secondary">
                  {new Date(order.created_at).toLocaleDateString(config.language)}
                </time>
              </div>

              {order.items.map((item) => (
                <div key={item.id} className="d-flex justify-content-between py-2">
                  <span>
                    {item.product_slug ? (
                      <Link to={`/Gallery/${item.product_slug}`} className="text-dark">
                        {item.product_name}
                      </Link>
                    ) : item.product_name}
                    {" × "}{item.quantity.toLocaleString(config.language)}
                  </span>
                  <span>{Number(item.subtotal).toLocaleString(config.language)} {t("toman")}</span>
                </div>
              ))}

              <div className="text-start fw-bold mt-3">
                {t("totalAmount")}: {Number(order.total_amount).toLocaleString(config.language)} {t("toman")}
              </div>
            </article>
          ))}
        </div>
      </main>

      <div className="container"><Footer /></div>
    </>
  );
}


export default Orders;
