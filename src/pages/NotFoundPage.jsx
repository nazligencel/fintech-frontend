import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="p-4 text-center">
      <h1 className="text-4xl font-bold text-red-600">404 - Sayfa Bulunamadı</h1>
      <p className="text-lg text-gray-700 mt-2">Aradığınız sayfa mevcut değil.</p>
      <Link to="/" className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
export default NotFoundPage;