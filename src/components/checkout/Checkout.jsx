import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../api/api";
import { getApiError } from "../../api/errors";
import { AuthContext } from "../../context/AuthContext";
import { useSiteConfig } from "../../context/SiteConfigContext";
import { CartContext } from "../CardContext/cardContext";
import Footer from "../footer/Footer";

import "./checkout.css";


function Checkout() {
  const { user } = useContext(AuthContext);
  const { cartItems, clearCart } = useContext(CartContext);
  const { config, t } = useSiteConfig();
  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    phone: "",
    address: "",
    postal_code: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [createdOrder, setCreatedOrder] = useState(null);

  const totalPrice = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.count,
    0
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setSubmitting(true);

      const response = await api.post("/api/orders/", {
        ...form,
        line_items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.count,
        })),
      });

      setCreatedOrder(response.data);
      clearCart();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (requestError) {
      setError(getApiError(requestError, t("orderFailed")));
    } finally {
      setSubmitting(false);
    }
  };

  if (createdOrder) {
    return (
      <>
        <main className="container py-5">
          <div className="checkout-success bg-white rounded-4 shadow-sm p-5 mx-auto text-center">
            <div className="success-mark mx-auto mb-4">✓</div>
            <h1 className="h3">{t("orderSuccess")}</h1>
            <p className="text-secondary mt-3">
              {t("orderNumber")}: <strong>{createdOrder.id.toLocaleString(config.language)}</strong>
            </p>
            <p>
              {t("finalAmount")}: {Number(createdOrder.total_amount).toLocaleString(config.language)} {t("toman")}
            </p>
            <Link to="/orders" className="btn btn-dark mt-3">
              {t("viewMyOrders")}
            </Link>
          </div>
        </main>
        <div className="container"><Footer /></div>
      </>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <main className="container py-5 text-center">
          <h1 className="h3 mb-3">{t("emptyCart")}</h1>
          <Link to="/Gallery" className="btn btn-dark">
            {t("continueShopping")}
          </Link>
        </main>
        <div className="container"><Footer /></div>
      </>
    );
  }

  return (
    <>
      <main className="container py-5">
        <h1 className="h3 mb-4">{t("checkoutTitle")}</h1>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="checkout-layout">
          <form className="bg-white rounded-4 shadow-sm p-4" onSubmit={handleSubmit}>
            <h2 className="h5 mb-4">{t("deliveryInfo")}</h2>

            <div className="row">
              <div className="col-md-6">
                <label className="form-label" htmlFor="first_name">{t("firstName")}</label>
                <input id="first_name" name="first_name" className="form-control mb-3" value={form.first_name} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="last_name">{t("lastName")}</label>
                <input id="last_name" name="last_name" className="form-control mb-3" value={form.last_name} onChange={handleChange} required />
              </div>
            </div>

            <label className="form-label" htmlFor="phone">{t("phone")}</label>
            <input id="phone" name="phone" type="tel" className="form-control mb-3" value={form.phone} onChange={handleChange} required />

            <label className="form-label" htmlFor="address">{t("fullAddress")}</label>
            <textarea id="address" name="address" className="form-control mb-3" rows="3" value={form.address} onChange={handleChange} required />

            <label className="form-label" htmlFor="postal_code">{t("postalCode")}</label>
            <input id="postal_code" name="postal_code" className="form-control mb-3" value={form.postal_code} onChange={handleChange} />

            <label className="form-label" htmlFor="notes">{t("orderNotes")}</label>
            <textarea id="notes" name="notes" className="form-control mb-4" rows="2" value={form.notes} onChange={handleChange} />

            <button type="submit" className="btn btn-dark w-100 py-2" disabled={submitting}>
              {submitting ? t("submittingOrder") : t("submitOrder")}
            </button>
          </form>

          <aside className="bg-white rounded-4 shadow-sm p-4 checkout-summary">
            <h2 className="h5 mb-4">{t("orderSummary")}</h2>
            {cartItems.map((item) => (
              <div key={item.id} className="d-flex justify-content-between border-bottom py-3 gap-3">
                <span>{item.name} × {item.count.toLocaleString(config.language)}</span>
                <span className="text-nowrap">
                  {(Number(item.price) * item.count).toLocaleString(config.language)} {t("toman")}
                </span>
              </div>
            ))}
            <div className="d-flex justify-content-between fw-bold pt-4">
              <span>{t("totalAmount")}</span>
              <span>{totalPrice.toLocaleString(config.language)} {t("toman")}</span>
            </div>
          </aside>
        </div>
      </main>

      <div className="container"><Footer /></div>
    </>
  );
}


export default Checkout;
