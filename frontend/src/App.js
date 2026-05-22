import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Shein from './pages/Shein';
import Temu from './pages/Temu';
import Primark from './pages/Primark';
import OtherBrands from './pages/OtherBrands';
import AllOrders from './pages/AllOrders';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="shein" element={<Shein />} />
            <Route path="temu" element={<Temu />} />
            <Route path="primark" element={<Primark />} />
            <Route path="other" element={<OtherBrands />} />
            <Route path="all-orders" element={<AllOrders />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
