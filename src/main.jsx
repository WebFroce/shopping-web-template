import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  AuthProvider
} from "./context/AuthContext";
import App from './App.jsx'
import './index.css'
import { CartProvider } from './components/CardContext/cardContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <AuthProvider>

      <CartProvider>

        <App />

      </CartProvider>

    </AuthProvider>

  </StrictMode>
)
