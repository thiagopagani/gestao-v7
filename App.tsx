import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Empresas from './pages/Empresas';
import Clientes from './pages/Clientes';
import Funcionarios from './pages/Funcionarios';
import Diarias from './pages/Diarias';
import Recibos from './pages/Recibos';
import Relatorios from './pages/Relatorios';
import Usuarios from './pages/Usuarios';
import Login from './pages/Login';

const App: React.FC = () => {
  // Simple auth state simulation. Start as not authenticated.
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
        <Route 
          path="/*" 
          element={
            isAuthenticated ? (
              <Layout onLogout={handleLogout}>
                <Routes>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/empresas" element={<Empresas />} />
                  <Route path="/clientes" element={<Clientes />} />
                  <Route path="/funcionarios" element={<Funcionarios />} />
                  <Route path="/diarias" element={<Diarias />} />
                  <Route path="/recibos" element={<Recibos />} />
                  <Route path="/relatorios" element={<Relatorios />} />
                  <Route path="/usuarios" element={<Usuarios />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </HashRouter>
  );
};

export default App;
