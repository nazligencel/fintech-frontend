import api from './api';

// API_URL'yi artık api instance'ı baseURL olarak bildiği için path'ler direkt yazılabilir.

const register = (username, email, password) => {
  return api.post('/api/auth/register', {
    username,
    email,
    password,
  });
};

const login = (username, password) => {
  return api
    .post('/api/auth/login', { 
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        // Kullanıcı adı bilgisini de response'dan veya parametreden alıp saklayalım
        const userToStore = {
          ...response.data, 
          username: username // veya response.data.username (eğer backend dönüyorsa)
        };
        localStorage.setItem('user', JSON.stringify(userToStore));
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;