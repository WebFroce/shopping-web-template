import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navigation from './components/header/nav/Nav'
import Home from './components/home/Home'
import Gallery from './components/gallery/Gallery'
import ProudPage from './components/gallery/product/ProudPage'
import Error from './components/404Eror/Error'
import ContactUs from './components/ContactUs/ContactUs'
import ShoppingCard from './components/ShoppingCard/ShoppingCard'
import { CartProvider } from './components/CardContext/cardContext'
function App() {
  const pages = [{
    path: '/',
    element:<Home/>
  },
  {
    path: '/Gallery',
    element:<Gallery/>
  },
  {
    path: '/faq',
    element: <Error/>
  }, {
    path: '/contact_Us',
    element: <ContactUs/>
  },
    {
      path: `Gallery/:slug`,
      element:<ProudPage/>
    }

]
  return (
    <>
    <CartProvider>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path='/' element={<Home />} />
          {
            pages.map(({ path, element }) => <Route key={path} path={path} element={element} />)
          }
          <Route path='Cart' element={<ShoppingCard/>}/>
          <Route path="*" element={<Error/>} />
        </Routes>
      </BrowserRouter>
      </CartProvider>
    </>
  )
}

export default App
