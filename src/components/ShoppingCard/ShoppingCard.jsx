import { useContext } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import { toast, ToastContainer } from "react-toastify";

import { CartContext } from "../CardContext/cardContext";
import Footer from "../footer/Footer";


function CartPage() {

    const {
        cartItems,
        removeFromCart,
        updateCartItem
    } = useContext(CartContext);


    const handleIncreaseItem = (
        id,
        currentCount,
        stock
    ) => {

        if (currentCount >= stock) {
            toast.info("بیشتر از موجودی محصول نمی‌توانید اضافه کنید.");
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
            "محصول از سبد خرید حذف شد.",
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
                    سبد خرید
                </h2>

                {cartItems.length === 0 ? (

                    <div className="mt-5">

                        <p className="fs-4">
                            سبد خرید شما خالی است.
                        </p>

                        <Link
                            to="/Gallery"
                            className="btn btn-secondary rounded-5"
                        >
                            مشاهده محصولات
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
                                            ).toLocaleString(
                                                "fa-IR"
                                            )}

                                            {" تومان"}

                                        </h5>


                                        <p>
                                            موجودی:
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
                                                تعداد:
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

                                            جمع:

                                            {" "}

                                            {(
                                                Number(item.price) *
                                                item.count
                                            ).toLocaleString(
                                                "fa-IR"
                                            )}

                                            {" تومان"}

                                        </p>

                                    </div>

                                </div>

                            ))}

                        </div>


                        <div className="border rounded-4 text-center mt-4 mb-4 p-3 text-bg-secondary">

                            مبلغ کل:

                            {" "}

                            {totalPrice.toLocaleString(
                                "fa-IR"
                            )}

                            {" تومان"}

                        </div>
                    </>

                )}

            </div>

            <Footer />
        </>
    );
}


export default CartPage;