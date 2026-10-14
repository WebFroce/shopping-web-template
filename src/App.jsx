import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navigation from './components/header/nav/Nav'
import Home from './components/home/Home'
import Gallery from './components/gallery/Gallery'
import ProudPage from './components/gallery/product/ProudPage'
import Error from './components/404Eror/Error'
import ContactUs from './components/ContactUs/ContactUs'
import ShoppingCard from './components/ShoppingCard/ShoppingCard'
import AuthPage from './components/auth/AuthPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Checkout from './components/checkout/Checkout'
import Orders from './components/orders/Orders'

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Gallery" element={<Gallery />} />
        <Route path="/Gallery/:slug" element={<ProudPage />} />
        <Route path="/faq" element={<Error />} />
        <Route path="/contact_Us" element={<ContactUs />} />
        <Route path="/Cart" element={<ShoppingCard />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
