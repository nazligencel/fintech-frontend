import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx'; 

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation(); // Kullanıcının gitmek istediği orijinal yolu saklamak için

  if (loading) {
    // AuthContext hala kullanıcıyı yüklüyorsa (localStorage'dan okuyorsa),
    // bir yüklenme göstergesi gösterin veya hiçbir şey render etmeyin.
    // Bu, currentUser nullken hemen login'e yönlendirmeyi engeller.
    return <div className="flex justify-center items-center h-screen"><p>Yükleniyor...</p></div>; 
  }

  if (!currentUser) {
    // Kullanıcı giriş yapmamışsa, login sayfasına yönlendir.
    // `state={{ from: location }}` ile kullanıcının gitmek istediği
    // orijinal yolu login sayfasına iletiyoruz, böylece login sonrası oraya geri dönebilir.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Kullanıcı giriş yapmışsa, istenen bileşeni (children) veya Outlet'i render et.
  // Eğer <ProtectedRoute><DashboardPage /></ProtectedRoute> gibi kullanırsak children props'u gelir.
  // Eğer <Route element={<ProtectedRoute />}> <Route path="dashboard" element={<DashboardPage/> /> </Route> gibi kullanırsak Outlet'i kullan.
  return children ? children : <Outlet />;
};

export default ProtectedRoute;