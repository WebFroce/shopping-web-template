import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  AuthProvider
} from "./context/AuthContext";
import App from './App.jsx'
import './index.css'
import './styles/design-presets.css'
import { CartProvider } from './components/CardContext/cardContext.jsx';
import { SiteConfigProvider } from './context/SiteConfigContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <SiteConfigProvider>

    <AuthProvider>

      <CartProvider>

        <App />

      </CartProvider>

    </AuthProvider>

    </SiteConfigProvider>

  </StrictMode>
)
