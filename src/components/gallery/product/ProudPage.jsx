import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

import { toast, ToastContainer } from "react-toastify";

import Footer from "../../footer/Footer";
import { CartContext } from "../../CardContext/cardContext";
import api from "../../../api/api";


function ProudPage() {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { addToCart } = useContext(CartContext);

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
        setError("محصول مورد نظر پیدا نشد.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);


  const handleAddToCart = () => {
    if (!product) {
      toast.error("محصول در دسترس نیست.");
      return;
    }

    addToCart(product);

    toast.success("محصول به سبد خرید اضافه شد.", {
      position: "bottom-left",
      autoClose: 2000,
    });
  };


  if (loading) {
    return (
      <div className="text-center mt-5">
        در حال دریافت اطلاعات محصول...
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

      <div className="grid-2 mt-5 ms-5 mb-5">

        <div>
          {product?.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-75 ms-5 h-75"
            />
          ) : (
            <div className="text-center">
              تصویری برای این محصول ثبت نشده است.
            </div>
          )}
        </div>


        <div className="text-center">

          <h3>
            {product?.name}
          </h3>

          <h5 className="mt-5 mb-5">
            <i>
              {Number(product?.price).toLocaleString("fa-IR")} تومان
            </i>
          </h5>


          {product?.category_detail && (
            <p>
              دسته‌بندی:
              {" "}
              {product.category_detail.name}
            </p>
          )}


          <div className="w-75 mx-auto mb-5">
            <p>
              {product?.description}
            </p>
          </div>


          <p>
            موجودی:
            {" "}
            {product?.stock}
          </p>


          <button
            className="btn border rounded-5"
            onClick={handleAddToCart}
            disabled={product?.stock === 0}
          >
            افزودن به سبد خرید

            <FontAwesomeIcon
              icon={faCartShopping}
              className="ms-3"
            />
          </button>

        </div>

      </div>

      <Footer />
    </>
  );
}


export default ProudPage;