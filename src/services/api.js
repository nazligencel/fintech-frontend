/*
Backend'deki korumalı API endpoint'lerine (ekleme, listeleme) istek yaparken her seferinde manuel olarak JWT'yi header'a eklemek yerine,
bunu otomatik olarak yapacak bir Axios interceptor'ı (araya girici) oluşturuldu. API istekleri daha yönetilebilir hale gelir.
*/ 

import axios from 'axios';
import AuthService from './authService'; 

// Backend API'in temel URL'si
const API_BASE_URL = 'http://localhost:8080'; 

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor (İstek Araya Giricisi)
instance.interceptors.request.use(
  (config) => {
    const user = AuthService.getCurrentUser(); // localStorage'dan mevcut kullanıcıyı al
    if (user && user.accessToken) {
      config.headers['Authorization'] = 'Bearer ' + user.accessToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor (Yanıt Araya Giricisi)
instance.interceptors.response.use(
  (response) => {
  
    return response;
  },
  (error) => {
    const originalRequest = error.config;

    // Eğer 401 hatası geldiyse ve bu zaten bir token yenileme isteği değilse
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // originalRequest._retry = true; // Tekrar denemeyi işaretle (refresh token mekanizması için)

      console.error("401 Unauthorized - Token might be expired or invalid.");
      AuthService.logout(); 
      if (window.location.pathname !== '/login') { 
         window.location.href = '/login'; // Sayfayı yeniden yükleyerek yönlendirir 
      }
      return Promise.reject(error); 
    }
    return Promise.reject(error);
  }
);

export default instance;