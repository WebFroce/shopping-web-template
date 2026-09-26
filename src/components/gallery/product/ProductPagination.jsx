import { useSearchParams } from "react-router-dom";


function ProductPagination({
    currentPage,
    totalPages
}) {

    const [searchParams, setSearchParams] =
        useSearchParams();


    if (totalPages <= 1) {
        return null;
    }


    const changePage = (page) => {

        if (
            page < 1 ||
            page > totalPages ||
            page === currentPage
        ) {
            return;
        }


        const params =
            new URLSearchParams(searchParams);

        params.set(
            "page",
            page.toString()
        );

        setSearchParams(params);


        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    // حداکثر 5 شماره صفحه نشان می‌دهیم

    let startPage =
        Math.max(
            1,
            currentPage - 2
        );

    let endPage =
        Math.min(
            totalPages,
            startPage + 4
        );


    if (endPage - startPage < 4) {

        startPage =
            Math.max(
                1,
                endPage - 4
            );

    }


    const pages = [];

    for (
        let page = startPage;
        page <= endPage;
        page++
    ) {
        pages.push(page);
    }


    return (

        <nav className="d-flex justify-content-center mt-4 mb-5">

            <ul className="pagination">

                {/* Previous */}

                <li
                    className={
                        `page-item ${currentPage === 1
                            ? "disabled"
                            : ""
                        }`
                    }
                >

                    <button
                        className="page-link"
                        onClick={() =>
                            changePage(
                                currentPage - 1
                            )
                        }
                    >
                        قبلی
                    </button>

                </li>


                {/* Page numbers */}

                {pages.map((page) => (

                    <li
                        key={page}
                        className={
                            `page-item ${page === currentPage
                                ? "active"
                                : ""
                            }`
                        }
                    >

                        <button
                            className="page-link"
                            onClick={() =>
                                changePage(page)
                            }
                        >
                            {page.toLocaleString(
                                "fa-IR"
                            )}
                        </button>

                    </li>

                ))}


                {/* Next */}

                <li
                    className={
                        `page-item ${currentPage === totalPages
                            ? "disabled"
                            : ""
                        }`
                    }
                >

                    <button
                        className="page-link"
                        onClick={() =>
                            changePage(
                                currentPage + 1
                            )
                        }
                    >
                        بعدی
                    </button>

                </li>

            </ul>

        </nav>

    );
}


export default ProductPagination;