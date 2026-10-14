import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import api from "../../../api/api";
import { useSiteConfig } from "../../../context/SiteConfigContext";

import "./aside.css";


function Aside() {
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "");
  const { t } = useSiteConfig();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/products/categories/");
        setCategories(response.data);
      } catch (error) {
        console.error("Could not load categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    setMinPrice(searchParams.get("min_price") || "");
    setMaxPrice(searchParams.get("max_price") || "");
  }, [searchParams]);

  const updateParam = (name, value) => {
    const params = new URLSearchParams(searchParams);
    value ? params.set(name, value) : params.delete(name);
    params.delete("page");
    setSearchParams(params);
  };

  const handlePriceFilter = (event) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams);
    minPrice ? params.set("min_price", minPrice) : params.delete("min_price");
    maxPrice ? params.set("max_price", maxPrice) : params.delete("max_price");
    params.delete("page");
    setSearchParams(params);
  };

  const resetFilters = () => {
    const params = new URLSearchParams();
    const search = searchParams.get("search");
    if (search) params.set("search", search);
    setSearchParams(params);
  };

  const selectedCategory = searchParams.get("category") || "";
  const selectedOrdering = searchParams.get("ordering") || "";

  return (
    <aside className="filter-panel">
      <div className="filter-title-row">
        <h2>{t("filterTitle")}</h2>
        <span className="filter-dot" />
      </div>

      <section className="filter-group">
        <h3>{t("category")}</h3>
        <div className="category-filter-list">
          <button
            className={!selectedCategory ? "filter-chip active" : "filter-chip"}
            onClick={() => updateParam("category", "")}
          >
            {t("allProducts")}
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={selectedCategory === category.slug ? "filter-chip active" : "filter-chip"}
              onClick={() => updateParam("category", category.slug)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      <section className="filter-group">
        <h3>{t("priceRange")}</h3>
        <form onSubmit={handlePriceFilter}>
          <div className="price-inputs">
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              placeholder={t("minPrice")}
            />
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder={t("maxPrice")}
            />
          </div>
          <button type="submit" className="apply-filter">{t("applyPrice")}</button>
        </form>
      </section>

      <section className="filter-group">
        <h3>{t("sort")}</h3>
        <select
          value={selectedOrdering}
          onChange={(event) => updateParam("ordering", event.target.value)}
        >
          <option value="">{t("newest")}</option>
          <option value="price">{t("cheapest")}</option>
          <option value="-price">{t("mostExpensive")}</option>
          <option value="name">{t("productName")}</option>
          <option value="-stock">{t("mostStock")}</option>
        </select>
      </section>

      <button className="reset-filters" onClick={resetFilters}>
        {t("resetFilters")}
      </button>
    </aside>
  );
}


export default Aside;
