import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import RatingStar from "../home/RatingStar";
import Crumb from "../breadcrumb/Breadcrumb";

import api from "../../api/api";

import "./product.css";


function Products() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const fetchProducts = async () => {

            try {

                setLoading(true);

                const response = await api.get(
                    "/api/products/",
                    {
                        params: {
                            ordering: "-created_at"
                        }
                    }
                );


                const productsData =
                    Array.isArray(response.data)
                        ? response.data
                        : response.data.results;


                // فقط 6 محصول در صفحه اصلی
                setProducts(
                    productsData.slice(0, 6)
                );


            } catch (error) {

                console.error(
                    "خطا در دریافت محصولات:",
                    error
                );

                setError(
                    "خطا در دریافت محصولات"
                );

            } finally {

                setLoading(false);

            }

        };


        fetchProducts();

    }, []);


    const getImageUrl = (image) => {

        if (!image) {
            return null;
        }

        if (image.startsWith("http")) {
            return image;
        }

        return `${import.meta.env.VITE_API_BASE_URL
            }${image}`;
    };


    if (loading) {

        return (
            <div className="text-center py-5">
                در حال دریافت محصولات...
            </div>
        );

    }


    if (error) {

        return (
            <div className="text-center text-danger py-5">
                {error}
            </div>
        );

    }


    return (
        <>

            <h3 className="mt-5 mb-3 text-center">
                جدیدترین محصولات
            </h3>

            <Crumb />


            <div className="grid-3 mt-5">

                {products.map((product) => (

                    <div
                        key={product.id}
                        className="mb-5"
                    >

                        <Link
                            className="link1"
                            to={`/Gallery/${product.slug}`}
                        >

                            {product.image ? (

                                <img
                                    src={getImageUrl(product.image)}
                                    alt={product.name}
                                    className="w-100 rounded-4 mb-4 image"
                                    height={400}
                                />

                            ) : (

                                <div
                                    className="w-100 rounded-4 mb-4 bg-light d-flex justify-content-center align-items-center"
                                    style={{
                                        height: "400px"
                                    }}
                                >
                                    بدون تصویر
                                </div>

                            )}

                        </Link>


                        <div>

                            <RatingStar
                                defaultValue={0}
                            />


                            <h6 className="mb-3 text-body">
                                {product.name}
                            </h6>


                            {product.category_detail && (

                                <small className="text-secondary">

                                    {
                                        product
                                            .category_detail
                                            .name
                                    }

                                </small>

                            )}


                            <p className="mt-2 mb-4 text-body">

                                {Number(
                                    product.price
                                ).toLocaleString(
                                    "fa-IR"
                                )}

                                {" تومان"}

                            </p>

                        </div>

                    </div>

                ))}

            </div>


            <div className="text-center mb-5">

                <Link
                    to="/Gallery"
                    className="link1"
                >

                    <button
                        className="btn rounded-4 border border-dark btn-prud"
                    >
                        مشاهده همه محصولات
                    </button>

                </Link>

            </div>

        </>
    );
}


export default Products;