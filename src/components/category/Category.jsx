import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import api from "../../api/api";

import "./category.css";
import "bootstrap/dist/css/bootstrap.min.css";


function Category() {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const fetchCategories = async () => {

            try {

                const response = await api.get(
                    "/api/products/categories/"
                );

                setCategories(response.data);

            } catch (error) {

                console.error(
                    "خطا در دریافت دسته‌بندی‌ها:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };


        fetchCategories();

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
                در حال دریافت دسته‌بندی‌ها...
            </div>
        );

    }


    return (

        <div className="grid-3 pt-5 mb-5">

            {categories.map((category) => (

                <div
                    key={category.id}
                    className="d-flex item-body rounded"
                >

                    <div>

                        <h2 className="mt-3 ms-3">
                            {category.name}
                        </h2>


                        <p className="ms-3">
                            {category.description}
                        </p>


                        <Link
                            to={`/Gallery?category=${category.slug}`}
                            className="btn btn-category flex-center"
                        >

                            <span className="me-1">
                                مشاهده محصولات
                            </span>

                            <FontAwesomeIcon
                                className="btn-icon"
                                icon={faArrowRight}
                            />

                        </Link>

                    </div>


                    <div>

                        {category.image ? (

                            <img
                                src={getImageUrl(category.image)}
                                alt={category.name}
                                className="h-100 w-100 img-head"
                            />

                        ) : (

                            <div className="h-100 w-100 d-flex align-items-center justify-content-center">
                                بدون تصویر
                            </div>

                        )}

                    </div>

                </div>

            ))}

        </div>

    );
}


export default Category;