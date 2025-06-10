// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx'; // AuthContext'i import et

// Basit ikonlar için (SVG veya FontAwesome/Heroicons kullanabilirsiniz)
// Şimdilik metin tabanlı "ikonlar" kullanalım
const FeatureIcon = ({ children }) => (
  <div className="text-4xl text-emerald-500 mb-2">{children}</div>
);

function HomePage() {
  const { currentUser } = useAuth(); // Kullanıcının giriş durumunu al

  return (
    <div className="bg-gradient-to-br from-slate-50 to-sky-100 min-h-[calc(100vh-var(--navbar-height)-var(--footer-height))] flex flex-col items-center justify-center p-6 text-center">
      {/* Navbar ve Footer yüksekliğini CSS değişkenleri ile hesaba katmak isteyebilirsiniz,
          şimdilik min-h-screen'den biraz daha az bir yükseklik ayarlayalım veya
          App.jsx'teki main tag'ine flex-grow vererek içeriğin kalan alanı doldurmasını sağlayalım.
          App.jsx'te zaten flex-grow kullanıyoruz, bu yüzden burası da o alanı dolduracaktır.
      */}

      <div className="max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-600 mb-6 animate-fade-in-down">
          Mali Durumunuzu Kontrol Altına Alın!
        </h1>
        <p className="text-lg md:text-xl text-slate-700 mb-8 animate-fade-in-up delay-200">
          Mini Finans Takip Uygulaması ile gelir ve giderlerinizi kolayca yönetin,
          harcama alışkanlıklarınızı keşfedin ve finansal hedeflerinize bir adım daha yaklaşın.
        </p>

        <div className="mb-10 animate-fade-in-up delay-400">
          {currentUser ? (
            <Link
              to="/dashboard"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-150 text-lg"
            >
              Kontrol Paneline Git
            </Link>
          ) : (
            <div className="space-x-0 space-y-4 sm:space-x-4 sm:space-y-0">
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-150 text-lg inline-block w-full sm:w-auto"
              >
                Hemen Kayıt Ol
              </Link>
              <Link
                to="/login"
                className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-150 text-lg inline-block w-full sm:w-auto"
              >
                Giriş Yap
              </Link>
            </div>
          )}
        </div>

        {/* Özellikler Bölümü */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 animate-fade-in-up delay-600">
          <div className="bg-white p-6 rounded-xl shadow-xl transform hover:scale-105 transition-transform duration-150">
            <FeatureIcon>📊</FeatureIcon> {/* Gerçek ikonlarla değiştirilebilir */}
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Kolay Takip</h3>
            <p className="text-slate-600">
              Gelir ve giderlerinizi saniyeler içinde kaydedin, kategorilendirin.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-xl transform hover:scale-105 transition-transform duration-150">
            <FeatureIcon>💡</FeatureIcon>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Anlık Analiz</h3>
            <p className="text-slate-600">
              Harcama raporları ve grafiklerle mali durumunuzu anında görün.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-xl transform hover:scale-105 transition-transform duration-150">
            <FeatureIcon>🔒</FeatureIcon>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Güvenli Erişim</h3>
            <p className="text-slate-600">
              Verileriniz size özel ve güvende. İstediğiniz zaman erişin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;