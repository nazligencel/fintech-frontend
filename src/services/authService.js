// src/services/authService.js
import axios from 'axios';

// Backend API'mizin temel URL'si
// Bu URL'yi bir environment variable'dan almak daha iyidir, şimdilik sabit bırakalım.
const API_URL = 'http://localhost:8080/api/auth/'; // Backend'inizin çalıştığı adresi ve portu kontrol edin

// Kullanıcı Kayıt Fonksiyonu
const register = (username, email, password) => {
  return axios.post(API_URL + 'register', {
    username,
    email,
    password,
  });
};

// Kullanıcı Giriş Fonksiyonu
const login = (username, password) => {
  return axios
    .post(API_URL + 'login', {
      username,
      password,
    })
    .then((response) => {
      // Giriş başarılıysa ve backend bir accessToken döndürüyorsa
      if (response.data.accessToken) {
        // JWT'yi localStorage'a kaydet(daha sonra AuthContext ile yönlendir)
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data; // Dönen tüm veriyi (örn: { accessToken: "...", tokenType: "..." }) geri ver
    });
}; 

// Kullanıcı Çıkış Fonksiyonu
const logout = () => {
  // localStorage'dan kullanıcı bilgilerini (ve token'ı) sil
  localStorage.removeItem('user');
  // İsteğe bağlı: Backend'de bir logout endpoint'i varsa onu da çağırabilirsiniz
  // return axios.post(API_URL + 'logout');
};

// Mevcut Kullanıcı Bilgilerini (ve Token'ı) Alma Fonksiyonu
const getCurrentUser = () => {
  // localStorage'dan kullanıcı bilgilerini al ve parse et
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

// Bu fonksiyonları dışa aktaralım ki başka dosyalarda kullanabilelim
const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;