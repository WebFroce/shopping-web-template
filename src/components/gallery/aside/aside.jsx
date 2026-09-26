import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import api from "../../../api/api";
import "./aside.css";


function Aside() {

  const [categories, setCategories] = useState([]);

  const [searchParams, setSearchParams] =
    useSearchParams();


  const [minPrice, setMinPrice] = useState(
    searchParams.get("min_price") || ""
  );

  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("max_price") || ""
  );


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

      }

    };


    fetchCategories();

  }, []);


  const selectedCategory =
    searchParams.get("category");


  const selectedOrdering =
    searchParams.get("ordering") || "";


  // -------------------------
  // Category
  // -------------------------

  const handleCategory = (slug) => {

    const params =
      new URLSearchParams(searchParams);


    if (slug) {

      params.set(
        "category",
        slug
      );

    } else {

      params.delete(
        "category"
      );

    }


    params.delete("page");

    setSearchParams(params);
  };


  // -------------------------
  // Price
  // -------------------------

  const handlePriceFilter = (event) => {

    event.preventDefault();


    const params =
      new URLSearchParams(searchParams);


    if (minPrice) {

      params.set(
        "min_price",
        minPrice
      );

    } else {

      params.delete(
        "min_price"
      );

    }


    if (maxPrice) {

      params.set(
        "max_price",
        maxPrice
      );

    } else {

      params.delete(
        "max_price"
      );

    }


    params.delete("page");

    setSearchParams(params);
  };


  // -------------------------
  // Ordering
  // -------------------------

  const handleOrdering = (event) => {

    const value =
      event.target.value;


    const params =
      new URLSearchParams(searchParams);


    if (value) {

      params.set(
        "ordering",
        value
      );

    } else {

      params.delete(
        "ordering"
      );

    }


    params.delete("page");

    setSearchParams(params);
  };


  // -------------------------
  // Reset
  // -------------------------

  const handleResetFilters = () => {

    const params =
      new URLSearchParams(searchParams);


    params.delete("category");
    params.delete("min_price");
    params.delete("max_price");
    params.delete("ordering");
    params.delete("page");


    // search را نگه می‌داریم
    // تا اگر کاربر چیزی سرچ کرده بود،
    // سرچ از بین نرود.


    setMinPrice("");
    setMaxPrice("");

    setSearchParams(params);
  };


  return (

    <div className="mt-5 ms-3 w-75 border border-2 rounded-4 sticky-top aside-gallery p-3">

      <h4 className="mb-4">
        فیلتر محصولات
      </h4>


      {/* Category */}

      <div className="mb-5">

        <h5 className="mb-3">
          دسته‌بندی
        </h5>


        <div className="d-flex flex-column gap-2">

          <button
            className={
              !selectedCategory
                ? "btn btn-dark"
                : "btn btn-outline-dark"
            }
            onClick={() =>
              handleCategory(null)
            }
          >
            همه محصولات
          </button>


          {categories.map((category) => (

            <button
              key={category.id}
              className={
                selectedCategory === category.slug
                  ? "btn btn-dark"
                  : "btn btn-outline-dark"
              }
              onClick={() =>
                handleCategory(
                  category.slug
                )
              }
            >
              {category.name}
            </button>

          ))}

        </div>

      </div>


      {/* Price */}

      <div className="mb-5">

        <h5 className="mb-3">
          محدوده قیمت
        </h5>


        <form
          onSubmit={handlePriceFilter}
        >

          <input
            type="number"
            className="form-control mb-2"
            placeholder="حداقل قیمت"
            min="0"
            value={minPrice}
            onChange={(event) =>
              setMinPrice(
                event.target.value
              )
            }
          />


          <input
            type="number"
            className="form-control mb-3"
            placeholder="حداکثر قیمت"
            min="0"
            value={maxPrice}
            onChange={(event) =>
              setMaxPrice(
                event.target.value
              )
            }
          />


          <button
            type="submit"
            className="btn btn-dark w-100"
          >
            اعمال محدوده قیمت
          </button>

        </form>

      </div>


      {/* Ordering */}

      <div className="mb-4">

        <h5 className="mb-3">
          مرتب‌سازی
        </h5>


        <select
          className="form-select"
          value={selectedOrdering}
          onChange={handleOrdering}
        >

          <option value="">
            جدیدترین
          </option>

          <option value="price">
            ارزان‌ترین
          </option>

          <option value="-price">
            گران‌ترین
          </option>

          <option value="name">
            نام محصول
          </option>

          <option value="-stock">
            بیشترین موجودی
          </option>

        </select>

      </div>


      <button
        className="btn btn-outline-danger w-100"
        onClick={handleResetFilters}
      >
        پاک کردن فیلترها
      </button>

    </div>

  );
}


export default Aside;