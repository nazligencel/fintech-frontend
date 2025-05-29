  import React, { useState } from 'react';
    import { useNavigate, useLocation } from 'react-router-dom';
    // import AuthService from '../services/authService'; // Artık doğrudan servisi değil, context'i kullanacağız
    import { useAuth } from '../contexts/AuthContext.jsx'; // useAuth hook'unu import et

    function LoginPage() {
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const [message, setMessage] = useState('');
      const [loading, setLoading] = useState(false);

      const navigate = useNavigate();
      const location = useLocation();
      const { login } = useAuth(); // AuthContext'ten login fonksiyonunu al

      const from = location.state?.from?.pathname || "/dashboard";

      const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
          await login(username, password); // Context'teki login fonksiyonunu çağır
          setLoading(false);
          navigate(from, {replace: true});
        } catch (error) {
       
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            (error.response && error.response.status === 401 && "Kullanıcı adı veya şifre hatalı.") ||
            error.message ||
            error.toString();
          setMessage(resMessage);
          setLoading(false);
        }
      };

      return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
          <h1 className="text-3xl font-bold text-center text-sky-600 mb-6">Giriş Yap</h1>
          <form onSubmit={handleLogin}>
           
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="login-username">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                id="login-username"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="login-password">
                Şifre
              </label>
              <input
                type="password"
                id="login-password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:bg-sky-300"
                disabled={loading}
              >
                {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
              </button>
            </div>
            {message && (
              <p className={`mt-4 text-sm ${message.includes('Error') || message.includes('hatalı') ? 'text-red-500' : 'text-green-500'}`}>
                {message}
              </p>
            )}
          </form>
        </div>
      );
    }

    export default LoginPage;