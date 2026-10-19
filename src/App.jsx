import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Productos from './pages/Productos';
import DetalleProducto from './pages/DetalleProducto';
import Categorias from './pages/Categorias';
import Ofertas from './pages/Ofertas';
import Nosotros from './pages/Nosotros';
import Blog from './pages/Blogs';
import DetalleBlog from './pages/DetalleBlog';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import Register from './pages/Register';
import Carrito from './pages/Carrito';
import Checkout from './pages/Checkout';
import CompraExitosa from './pages/CompraExitosa';
import CompraFallida from './pages/CompraFallida';
import AdminLayout from './components/organisms/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminProductos from './pages/AdminProductos';
import AdminProductoForm from './pages/AdminProductoForm';
import AdminCategorias from './pages/AdminCategorias';
import AdminUsuarios from './pages/AdminUsuarios';
import AdminUsuarioForm from './pages/AdminProductoForm';
import AdminUsuarioHistorial from './pages/AdminUsuarioHistorial';
import AdminOrdenes from './pages/AdminOrdenes';
import AdminBoleta from './pages/AdminBoleta';
import AdminReportes from './pages/AdminReportes';
import { Header } from './components/organisms/Header';
import { Navbar, Footer } from './components/organisms/Navbar';
import './App.css';

function App() {
  const [busqueda, setBusqueda] = useState('');

  return (
    <>
      <Header onBuscar={setBusqueda} />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/productos"
          element={<Productos busqueda={busqueda} onLimpiarBusqueda={() => setBusqueda('')} />}
        />
        <Route path="/productos/:id" element={<DetalleProducto />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/categorias/:categoria" element={<Categorias />} />
        <Route path="/ofertas" element={<Ofertas />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<DetalleBlog />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/compra-exitosa/:nro" element={<CompraExitosa />} />
        <Route path="/compra-fallida/:nro" element={<CompraFallida />} />

        <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/productos" element={<AdminLayout><AdminProductos /></AdminLayout>} />
        <Route path="/admin/productos/nuevo" element={<AdminLayout><AdminProductoForm /></AdminLayout>} />
        <Route path="/admin/productos/:id/editar" element={<AdminLayout><AdminProductoForm /></AdminLayout>} />
        <Route path="/admin/categorias" element={<AdminLayout><AdminCategorias /></AdminLayout>} />
        <Route path="/admin/usuarios" element={<AdminLayout><AdminUsuarios /></AdminLayout>} />
        <Route path="/admin/usuarios/nuevo" element={<AdminLayout><AdminUsuarioForm /></AdminLayout>} />
        <Route path="/admin/usuarios/:id/editar" element={<AdminLayout><AdminUsuarioForm /></AdminLayout>} />
        <Route path="/admin/usuarios/:id/historial" element={<AdminLayout><AdminUsuarioHistorial /></AdminLayout>} />
        <Route path="/admin/ordenes" element={<AdminLayout><AdminOrdenes /></AdminLayout>} />
        <Route path="/admin/ordenes/:nro" element={<AdminLayout><AdminBoleta /></AdminLayout>} />
        <Route path="/admin/reportes" element={<AdminLayout><AdminReportes /></AdminLayout>} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;