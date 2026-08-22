import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RootLayout from './components/layout/RootLayout';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Reservation from './pages/Reservation';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import NotFound from './pages/NotFound';

import { AdminAuthProvider } from './context/AdminAuthContext';
import { UserAuthProvider } from './context/UserAuthContext';
import { CartProvider } from './context/CartContext';
import AdminRoute from './components/auth/AdminRoute';
import UserRoute from './components/auth/UserRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <UserAuthProvider>
      <AdminAuthProvider>
        <CartProvider>
          <Router>
          <Routes>
            {/* Admin Login & Protected Subsystem */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminRoute />}>
              <Route index element={<AdminDashboard />} />
            </Route>

            {/* Customer Login Page */}
            <Route path="/login" element={<Login />} />

            {/* Global Root Layout wrapper for customer site */}
            <Route path="/" element={<RootLayout />}>
              {/* Index landing route */}
              <Route index element={<Home />} />

              {/* Menu and reservation detail routes */}
              <Route path="menu" element={<Menu />} />
              <Route path="reservation" element={<Reservation />} />

              {/* Customer Protected Dashboard */}
              <Route path="dashboard" element={<UserRoute />}>
                <Route index element={<UserDashboard />} />
              </Route>

              {/* Handled 404 pathing */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AdminAuthProvider>
    </UserAuthProvider>
  );
}

export default App;
