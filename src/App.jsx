// src/App.jsx

function App() {
  return (
    <div className="min-h-screen bg-sky-100 flex flex-col justify-center items-center p-5">
      <h1 className="text-5xl font-extrabold text-indigo-700 underline decoration-wavy decoration-pink-500 mb-6">
        Finans Takip Uygulamam
      </h1>
      <p className="mt-4 text-xl text-slate-700 bg-amber-200 p-4 rounded-xl shadow-2xl max-w-md text-center">
        Bu uygulama TailwindCSS ile harika görünecek! React öğreniyorum.
      </p>
      <button className="mt-8 bg-teal-500 hover:bg-teal-600 active:bg-teal-700 focus:outline-none focus:ring focus:ring-teal-300 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-150">
        Başla!
      </button>
    </div>
  );
}

export default App;