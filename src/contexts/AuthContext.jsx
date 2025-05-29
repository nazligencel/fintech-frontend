import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../services/authService'; // authService'i import ediyoruz

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser()); // Başlangıçta localStorage'dan al
  const [loading, setLoading] = useState(true);

  // Uygulama ilk yüklendiğinde veya localStorage değiştiğinde kullanıcıyı kontrol et
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false); 
  }, []);

  const login = async (username, password) => {
    try {
      const backendResponse = await
      AuthService.login(username,password);
      const userToStore = {
        accessToken: backendResponse.accessToken,
        tokenType: backendResponse.tokenType,
        username: username
      };
      localStorage.setItem('user',
    JSON.stringify(userToStore));
        setCurrentUser(userToStore);
        return userToStore;
    } catch (error) {
    
      console.error("Login failed in AuthContext:", error);
      throw error; 
    }
  };

  const register = async (username, email, password) => {
    try {
        const response = await AuthService.register(username, email, password);
        return response; 
    } catch (error) {
        console.error("Registration failed in AuthContext:", error);
        throw error;
    }
  };

  const logout = () => {
    AuthService.logout(); // localStorage'ı temizle
    setCurrentUser(null); // Context state'ini güncelle
  };


  const value = {
    currentUser,
    loading, 
    login,
    logout,
    register,
  
  };

  // Provider, sarmaladığı çocuk bileşenlere 'value' prop'unu iletir
  // !loading kontrolü, başlangıçta kullanıcı bilgisi localStorage'dan okunana kadar çocukların render edilmemesini sağlayabilir.
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext; // Doğrudan context'i de export edebilebilir