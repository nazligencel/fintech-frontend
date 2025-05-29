// src/components/layout/MainLayout.jsx
import React from 'react';
import { Link, NavLink, useNavigate, Routes, Route } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx'; // Doğru yolu kontrol edin
import ProtectedRoute from '../ProtectedRoute.jsx';

import HomePage from '../../pages/HomePage';
import LoginPage from '../../pages/LoginPage';
import RegisterPage from '../../pages/RegisterPage';
import DashboardPage from '../../pages/DashboardPage';
import NotFoundPage from '../../pages/NotFoundPage';

function MainLayout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate(); // Artık <Router> içinde olduğu için sorunsuz çalışacak

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigasyon Menüsü */}
      <nav className="bg-slate-800 shadow-lg">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/" className="text-2xl font-bold text-white hover:text-slate-300">
                FinansTakip
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-slate-900 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`
                }
              >
                Ana Sayfa
              </NavLink>

              {currentUser ? (
                <>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium ${
                        isActive ? 'bg-slate-900 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
                  >
                    Çıkış Yap ({currentUser.username})
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium ${
                        isActive ? 'bg-slate-900 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`
                    }
                  >
                    Giriş Yap
                  </NavLink>
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium ${
                        isActive ? 'bg-slate-900 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`
                    }
                  >
                    Kayıt Ol
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Sayfa İçeriği */}
      <main className="flex-grow container mx-auto mt-6 p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

           {/* Korumalı Yollar */}
           <Route element={<ProtectedRoute />}> {/* Bu bir layout route gibi davranır */}
           <Route path="/dashboard" element={<DashboardPage />} />
           </Route>
            <Route path="*" element={<NotFoundPage />} />
          
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-slate-200 text-center p-4 mt-auto">
        <p className="text-sm text-slate-600">© {new Date().getFullYear()} Finans Takip Uygulaması. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}

export default MainLayout;