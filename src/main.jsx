import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import './styles/estail.css'
import App from './App.jsx'
import { HashRouter } from 'react-router-dom'
import { AuthProvider } from './components/organisms/AuthContext.jsx'
import { CartProvider } from './components/organisms/CartContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </HashRouter>
  </StrictMode>,
)
