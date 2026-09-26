import { useEffect, useState } from "react";
import {
    Link,
    useSearchParams
} from "react-router-dom";

import api from "../../../api/api";
import RatingStar from "../../home/RatingStar";
import ProductPagination from "./ProductPagination";


function GalleryProducts() {

    const [products, setProducts] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");
    const [pagination, setPagination] =
        useState({
            currentPage: 1,
            totalPages: 1,
            count: 0,
        });

    const [searchParams] =
        useSearchParams();


    useEffect(() => {

        const fetchProducts = async () => {

            try {

                setLoading(true);
                setError("");


                // تمام query parameter های URL
                // را برای Django می‌فرستیم
                const params =
                    Object.fromEntries(
                        searchParams.entries()
                    );


                const response =
                    await api.get(
                        "/api/products/",
                        {
                            params: params
                        }
                    );


                const productsData =
                    response.data.results ?? [];

                setProducts(productsData);

                setPagination({
                    currentPage:
                        response.data.current_page,

                    totalPages:
                        response.data.total_pages,

                    count:
                        response.data.count,
                });


            } catch (error) {

                console.error(error);

                setError(
                    "خطا در دریافت محصولات"
                );

            } finally {

                setLoading(false);

            }

        };


        fetchProducts();


    }, [searchParams]);


    if (loading) {

        return (
            <div className="text-center mt-5">
                در حال دریافت محصولات...
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


    if (products.length === 0) {

        return (
            <div className="text-center mt-5">
                محصولی با این مشخصات پیدا نشد.
            </div>
        );

    }


    return (
        <>

        <div className="grid-3 mt-5">

            {products.map((product) => (

                <div
                    className="mb-5"
                    key={product.id}
                >

                    <Link
                        className="link1"
                        to={`/Gallery/${product.slug}`}
                    >

                        {product.image ? (

                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-100 rounded-4 mb-4 image"
                                height={400}
                            />

                        ) : (

                            <div
                                className="w-100 rounded-4 mb-4 d-flex align-items-center justify-content-center bg-light"
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

                            <p className="text-secondary">

                                {
                                    product
                                        .category_detail
                                        .name
                                }

                            </p>

                        )}


                        <p className="mb-4 text-body">

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
            <ProductPagination
                currentPage={
                    pagination.currentPage
                }
                totalPages={
                    pagination.totalPages
                }
            />

        </>

    );
}


export default GalleryProducts;