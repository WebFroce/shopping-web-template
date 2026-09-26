import "bootstrap/dist/css/bootstrap.min.css";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faCartShopping,
  faMagnifyingGlass,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

import "../header.css";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import React, { useState } from "react";

import navs from "./navData";


function Navigation() {

  const [showSearch, setShowSearch] =
    useState(false);

  const [searchText, setSearchText] =
    useState("");

  const [showNav, setShowNav] =
    useState(false);

  const navigate = useNavigate();


  const handleSearch = (event) => {

    event.preventDefault();

    const value = searchText.trim();

    if (!value) {
      navigate("/Gallery");
      return;
    }

    const params = new URLSearchParams();

    params.set("search", value);

    navigate(
      `/Gallery?${params.toString()}`
    );

    setShowSearch(false);
    setShowNav(false);
  };


  return (
    <>

      {/* Desktop Navbar */}

      <Navbar className="mt-3 nav-xs">

        <Container className="grid3 border rounded-4 p-3 container">

          <div>

            <Navbar.Brand
              as={Link}
              to="/"
              className="me-5"
            >
              Navbar
            </Navbar.Brand>

          </div>


          <div>

            <Nav className="flex-center gap-4">

              {navs.map(({ href, text }) => (

                <Link
                  key={href}
                  to={href}
                  className="text-decoration-none text-secondary ms-2 font-weight-bold"
                >
                  {text}
                </Link>

              ))}

            </Nav>

          </div>


          <div>

            <Form
              className="d-flex"
              onSubmit={handleSearch}
            >

              <Link
                className="btn border border-0 rounded-5"
                to="/Cart"
              >

                <FontAwesomeIcon
                  icon={faCartShopping}
                />

              </Link>


              <button
                type="button"
                className="border border-0 btn-search rounded-5"
                onClick={() =>
                  setShowSearch(
                    !showSearch
                  )
                }
              >

                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                />

              </button>


              {showSearch && (

                <Form.Control
                  type="text"
                  placeholder="جستجوی محصول..."
                  className="inp-search"
                  value={searchText}
                  onChange={(event) =>
                    setSearchText(
                      event.target.value
                    )
                  }
                  autoFocus
                />

              )}

            </Form>

          </div>

        </Container>

      </Navbar>


      {/* Mobile menu button */}

      <button
        className="btn btn-nav mt-3 ms-2"
        onClick={() =>
          setShowNav(!showNav)
        }
      >

        <FontAwesomeIcon
          icon={
            !showNav
              ? faBars
              : faTimes
          }
        />

      </button>


      {/* Mobile Navbar */}

      <nav
        className={
          `mt-3 nav-mobile bg-light w-75 mx-auto rounded-4 ${showNav
            ? "nav-mobile__open"
            : "nav-mobile__hidden"
          }`
        }
      >

        <div className="nav-mobile-item pb-3 pt-2">

          <div>

            <div className="gap-4 ms-5">

              {navs.map(({ href, text }) => (

                <React.Fragment key={href}>

                  <div className="mb-2">

                    <Link
                      to={href}
                      className="text-decoration-none text-secondary ms-2 font-weight-bold"
                      onClick={() =>
                        setShowNav(false)
                      }
                    >
                      {text}
                    </Link>

                    <div className="border w-75" />

                  </div>

                </React.Fragment>

              ))}

            </div>

          </div>


          <div className="gap-4 ms-5">

            <Link
              className="text-decoration-none text-secondary ms-2 font-weight-bold"
              to="/Cart"
              onClick={() =>
                setShowNav(false)
              }
            >
              سبد خرید
            </Link>

            <div className="border w-75" />

          </div>


          <Form
            className="mt-3"
            onSubmit={handleSearch}
          >

            <div className="d-flex ms-5">

              <Form.Control
                type="text"
                placeholder="جستجوی محصول..."
                className="inp-search w-50"
                value={searchText}
                onChange={(event) =>
                  setSearchText(
                    event.target.value
                  )
                }
              />


              <button
                type="submit"
                className="btn"
              >

                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                />

              </button>

            </div>

          </Form>

        </div>

      </nav>

    </>
  );
}


export default Navigation;