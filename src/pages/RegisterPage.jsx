 import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    // import AuthService from '../services/authService'; // Artık doğrudan servisi değil, context kullanılacak
    import { useAuth } from '../contexts/AuthContext'; 

    function RegisterPage() {
      const [username, setUsername] = useState('');
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [message, setMessage] = useState('');
      const [loading, setLoading] = useState(false);

      const navigate = useNavigate();
      const { register } = useAuth(); // AuthContext'ten register fonksiyonunu al

      const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
          const response = await register(username, email, password); 
          setMessage(response.data || "Kayıt başarılı!"); 
          setLoading(false);
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } catch (error) {
          // ... (hata yönetimi aynı kalabilir) ...
          const resMessage =
            (error.response &&
              error.response.data &&
              (typeof error.response.data === 'string' ? error.response.data : error.response.data.message)) || // Backend'den string veya obje gelebilir
            error.message ||
            error.toString();
          setMessage(resMessage);
          setLoading(false);
        }
      };

    
      return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
          <h1 className="text-3xl font-bold text-center text-purple-600 mb-6">Kayıt Ol</h1>
          <form onSubmit={handleRegister}>
            {}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                id="username"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                E-posta
              </label>
              <input
                type="email"
                id="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Şifre
              </label>
              <input
                type="password"
                id="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:bg-purple-300"
                disabled={loading}
              >
                {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
              </button>
            </div>
            {message && (
              <p className={`mt-4 text-sm ${message.toLowerCase().includes('error') || message.toLowerCase().includes('hatalı') ? 'text-red-500' : 'text-green-500'}`}>
                {message}
              </p>
            )}
          </form>
        </div>
      );
    }

    export default RegisterPage;