import { useContext } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import { toast, ToastContainer } from "react-toastify";

import { CartContext } from "../CardContext/cardContext";
import Footer from "../footer/Footer";
import { useSiteConfig } from "../../context/SiteConfigContext";


function CartPage() {

    const {
        cartItems,
        removeFromCart,
        updateCartItem
    } = useContext(CartContext);

    const { config, t } = useSiteConfig();


    const handleIncreaseItem = (
        id,
        currentCount,
        stock
    ) => {

        if (currentCount >= stock) {
            toast.info(t("stockLimit"));
            return;
        }

        updateCartItem(
            id,
            currentCount + 1
        );
    };


    const handleDecreaseItem = (
        id,
        currentCount
    ) => {

        if (currentCount > 1) {
            updateCartItem(
                id,
                currentCount - 1
            );
        }
    };


    const handleDeleteItem = (id) => {

        removeFromCart(id);

        toast.success(
            t("removedFromCart"),
            {
                position: "bottom-left",
                autoClose: 2000,
            }
        );
    };


    const totalPrice = cartItems.reduce(
        (total, item) =>
            total +
            Number(item.price) * item.count,
        0
    );


    const getImageUrl = (image) => {

        if (!image) {
            return null;
        }

        if (image.startsWith("http")) {
            return image;
        }

        const baseURL =
            import.meta.env.VITE_API_BASE_URL;

        return `${baseURL}${image}`;
    };


    return (
        <>
            <ToastContainer />

            <div className="container">

                <h2 className="mt-4">
                    {t("cart")}
                </h2>

                {cartItems.length === 0 ? (

                    <div className="mt-5">

                        <p className="fs-4">
                            {t("emptyCart")}
                        </p>

                        <Link
                            to="/Gallery"
                            className="btn btn-secondary rounded-5"
                        >
                            {t("continueShopping")}
                        </Link>

                    </div>

                ) : (

                    <>
                        <div className="grid-3 items-center mt-5">

                            {cartItems.map((item) => (

                                <div
                                    key={item.id}
                                    className="mx-auto mt-3 mb-3 w-75 border rounded-3 p-3 card-item"
                                >

                                    <button
                                        className="btn border rounded-5"
                                        onClick={() =>
                                            handleDeleteItem(
                                                item.id
                                            )
                                        }
                                    >
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            className="text-danger"
                                        />
                                    </button>


                                    <Link
                                        className="link1 text-dark text-center"
                                        to={`/Gallery/${item.slug}`}
                                    >

                                        {item.image ? (

                                            <img
                                                src={getImageUrl(item.image)}
                                                alt={item.name}
                                                className="w-75 rounded"
                                            />

                                        ) : (

                                            <div
                                                className="bg-light rounded d-flex align-items-center justify-content-center mx-auto"
                                                style={{
                                                    height: "200px",
                                                    width: "75%"
                                                }}
                                            >
                                                بدون تصویر
                                            </div>

                                        )}

                                    </Link>


                                    <div className="text-center mt-3">

                                        <h4>
                                            {item.name}
                                        </h4>


                                        <h5 className="mt-3 mb-3">

                                            {Number(
                                                item.price
                                            ).toLocaleString(config.language)}

                                            {` ${t("toman")}`}

                                        </h5>


                                        <p>
                                            {t("stock")}:
                                            {" "}
                                            {item.stock}
                                        </p>


                                        <div className="d-flex justify-content-center align-items-center">

                                            <button
                                                className="btn"
                                                disabled={
                                                    item.count <= 1
                                                }
                                                onClick={() =>
                                                    handleDecreaseItem(
                                                        item.id,
                                                        item.count
                                                    )
                                                }
                                            >
                                                <h5>-</h5>
                                            </button>


                                            <span className="mx-3">
                                                {t("quantity")}:
                                                {" "}
                                                {item.count}
                                            </span>


                                            <button
                                                className="btn"
                                                disabled={
                                                    item.count >= item.stock
                                                }
                                                onClick={() =>
                                                    handleIncreaseItem(
                                                        item.id,
                                                        item.count,
                                                        item.stock
                                                    )
                                                }
                                            >
                                                <h5>+</h5>
                                            </button>

                                        </div>


                                        <p className="mt-3">

                                            {t("sum")}:

                                            {" "}

                                            {(
                                                Number(item.price) *
                                                item.count
                                            ).toLocaleString(config.language)}

                                            {` ${t("toman")}`}

                                        </p>

                                    </div>

                                </div>

                            ))}

                        </div>


                        <div className="border rounded-4 text-center mt-4 mb-4 p-3 text-bg-secondary">

                            {t("totalAmount")}:

                            {" "}

                            {totalPrice.toLocaleString(config.language)}

                            {` ${t("toman")}`}

                        </div>

                        <div className="text-center mb-5">
                            <Link
                                to="/checkout"
                                className="btn btn-dark rounded-5 px-5 py-2"
                            >
                                {t("continueCheckout")}
                            </Link>
                        </div>
                    </>

                )}

            </div>

            <Footer />
        </>
    );
}


export default CartPage;
