// src/pages/DashboardPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import TransactionService from '../services/transactionService';

// Chart.js ve react-chartjs-2 importları
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale, // Kullanmasak bile register etmekte zarar yok, ileride lazım olabilir
  LinearScale,
  BarElement,
  Title
} from 'chart.js';

// Chart.js elemanlarını register et
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

// TransactionForm Bileşeni
const TransactionForm = ({ onTransactionAdded, existingTransaction, onTransactionUpdated, formKeyProp }) => {
  const [type, setType] = useState('EXPENSE');
  const [amount, setAmount] = useState('');
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('FOOD'); // Varsayılan kategori
  const [description, setDescription] = useState('');
  const [loadingForm, setLoadingForm] = useState(false);
  const [messageForm, setMessageForm] = useState('');

  useEffect(() => {
    if (existingTransaction) {
      setType(existingTransaction.type);
      setAmount(existingTransaction.amount.toString());
      setTransactionDate(existingTransaction.transactionDate);
      setCategory(existingTransaction.category);
      setDescription(existingTransaction.description || '');
      setMessageForm(''); // Düzenleme moduna geçince mesajı temizle
    } else {
      // Yeni işlem veya form resetlendiğinde
      setType('EXPENSE');
      setAmount('');
      setTransactionDate(new Date().toISOString().split('T')[0]);
      setCategory('FOOD'); // Gider için varsayılan kategori
      setDescription('');
      setMessageForm('');
    }
  }, [existingTransaction, formKeyProp]); // formKeyProp değiştiğinde de formu resetle

  // Tür (Gelir/Gider) değiştiğinde varsayılan kategoriyi ayarla
  useEffect(() => {
    if (!existingTransaction) { // Sadece yeni işlem eklerken ve düzenleme modunda değilken
      if (type === 'INCOME') {
        setCategory('SALARY'); // Gelir için varsayılan kategori
      } else {
        setCategory('FOOD'); // Gider için varsayılan kategori
      }
    }
  }, [type, existingTransaction]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessageForm('');
    setLoadingForm(true);

    // Tutarın geçerli bir sayı olup olmadığını kontrol et
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        setMessageForm('Hata: Lütfen geçerli bir pozitif tutar girin.');
        setLoadingForm(false);
        return;
    }

    const transactionData = { type, amount: parsedAmount, transactionDate, category, description };
    try {
      if (existingTransaction) {
        const response = await TransactionService.updateTransaction(existingTransaction.id, transactionData);
        onTransactionUpdated(response.data);
        setMessageForm('İşlem başarıyla güncellendi!');
      } else {
        const response = await TransactionService.addTransaction(transactionData);
        onTransactionAdded(response.data);
        setMessageForm('İşlem başarıyla eklendi!');
        // Formu sıfırlama işlemi useEffect ile formKeyProp sayesinde yapılacak
      }
      setTimeout(() => setMessageForm(''), 3000); // Mesajı 3 saniye sonra temizle
    } catch (error) {
      const resMessage = (error.response?.data?.message) || error.message || error.toString();
      setMessageForm(`Hata: ${resMessage}`);
    } finally {
      setLoadingForm(false);
    }
  };

  const KATEGORILER = {
    GELIR: [
      { value: "SALARY", label: "Maaş" }, { value: "FREELANCE", label: "Serbest Çalışma" },
      { value: "INVESTMENT", label: "Yatırım" }, { value: "GIFT", label: "Hediye" },
      { value: "OTHER_INCOME", label: "Diğer Gelir" }
    ],
    GIDER: [
      { value: "FOOD", label: "Yemek" }, { value: "TRANSPORTATION", label: "Ulaşım" },
      { value: "HOUSING", label: "Konut" }, { value: "BILLS", label: "Faturalar" },
      { value: "HEALTH", label: "Sağlık" }, { value: "EDUCATION", label: "Eğitim" },
      { value: "ENTERTAINMENT", label: "Eğlence" }, { value: "SHOPPING", label: "Alışveriş" },
      { value: "TRAVEL", label: "Seyahat" }, { value: "OTHER_EXPENSE", label: "Diğer Gider" }
    ]
  };

  const currentCategories = type === 'INCOME' ? KATEGORILER.GELIR : KATEGORILER.GIDER;

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-transparent"> {/* Formun kendi arka planını kaldırdık, dış container yönetecek */}
      <h2 className="text-2xl font-semibold mb-6 text-slate-700">{existingTransaction ? 'İşlemi Düzenle' : 'Yeni İşlem Ekle'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-slate-600">Tür</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)} className="mt-1 block w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm">
            <option value="EXPENSE">Gider</option>
            <option value="INCOME">Gelir</option>
          </select>
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-slate-600">Tutar (TL)</label>
          <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} step="0.01" required placeholder="0.00" className="mt-1 block w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm" />
        </div>
        <div>
          <label htmlFor="transactionDate" className="block text-sm font-medium text-slate-600">Tarih</label>
          <input type="date" id="transactionDate" value={transactionDate} onChange={(e) => setTransactionDate(e.target.value)} required className="mt-1 block w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm" />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-600">Kategori</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm">
            {currentCategories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-slate-600">Açıklama (İsteğe Bağlı)</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" placeholder="Örn: Öğle yemeği, Elektrik faturası" className="mt-1 block w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"></textarea>
        </div>
      </div>
      <button type="submit" disabled={loadingForm}
        className={`
          mt-6 w-full font-semibold py-3 px-6 rounded-lg shadow-md text-white text-base
          bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
          hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
          transition-all duration-150 ease-in-out
          transform hover:scale-105
          disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
        `}
      >
        {loadingForm ? 'Kaydediliyor...' : (existingTransaction ? 'Değişiklikleri Kaydet' : 'Yeni İşlem Ekle')}
      </button>
      {messageForm && <p className={`mt-4 text-sm text-center ${messageForm.toLowerCase().includes('hata') ? 'text-red-600' : 'text-green-600'}`}>{messageForm}</p>}
    </form>
  );
};
// TransactionForm sonu


function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [errorTransactions, setErrorTransactions] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formKey, setFormKey] = useState('new-transaction-' + Date.now());

  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [errorSummary, setErrorSummary] = useState(null);

  const [categorySummary, setCategorySummary] = useState([]);
  const [loadingCategorySummary, setLoadingCategorySummary] = useState(true);
  const [errorCategorySummary, setErrorCategorySummary] = useState(null);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const KATEGORI_ADLARI = {
    SALARY: "Maaş", FREELANCE: "Serbest Çalışma", INVESTMENT: "Yatırım", GIFT: "Hediye", OTHER_INCOME: "Diğer Gelir",
    FOOD: "Yemek", TRANSPORTATION: "Ulaşım", HOUSING: "Konut", BILLS: "Faturalar", HEALTH: "Sağlık",
    EDUCATION: "Eğitim", ENTERTAINMENT: "Eğlence", SHOPPING: "Alışveriş", TRAVEL: "Seyahat", OTHER_EXPENSE: "Diğer Gider"
  };

  const fetchAllData = useCallback(async () => {
    setLoadingTransactions(true);
    setLoadingSummary(true);
    setLoadingCategorySummary(true);

    try {
      const [transResponse, summaryResponse, catSummaryResponse] = await Promise.all([
        TransactionService.getAllTransactions(),
        TransactionService.getDashboardSummary(selectedYear, selectedMonth),
        TransactionService.getCategoryExpenseSummary(selectedYear, selectedMonth)
      ]);

      setTransactions(transResponse.data || []);
      setErrorTransactions(null);

      setSummary(summaryResponse.data);
      setErrorSummary(null);

      setCategorySummary(catSummaryResponse.data || []);
      setErrorCategorySummary(null);

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Veriler yüklenirken bir hata oluştu.';
      console.error("Fetch all data error:", err, err.response);
      setErrorTransactions(errorMessage);
      setErrorSummary(errorMessage);
      setErrorCategorySummary(errorMessage);
      // Token süresi dolmuşsa veya yetkisizse AuthContext ile logout tetiklenebilir
      // Axios interceptor bu durumu zaten ele alıyor olmalı (window.location.href = '/login';)
    } finally {
      setLoadingTransactions(false);
      setLoadingSummary(false);
      setLoadingCategorySummary(false);
    }
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleTransactionAdded = (newTransaction) => {
    setEditingTransaction(null);
    setFormKey('new-transaction-' + Date.now());
    fetchAllData();
  };

  const handleTransactionUpdated = (updatedTransaction) => {
    setEditingTransaction(null);
    setFormKey('updated-transaction-' + Date.now());
    fetchAllData();
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Bu işlemi silmek istediğinizden emin misiniz?')) {
      try {
        setLoadingTransactions(true); // Silme işlemi sırasında loading göster
        await TransactionService.deleteTransaction(id);
        fetchAllData(); // Verileri yeniden çekerek listeyi ve özetleri güncelle
      } catch (err) {
        setErrorTransactions(err.response?.data?.message || err.message || 'İşlem silinirken bir hata oluştu.');
      } finally {
        setLoadingTransactions(false);
      }
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setFormKey(`edit-${transaction.id}-${Date.now()}`);
    // Sayfanın başına scroll yap (formun olduğu yere)
    const formElement = document.getElementById('transaction-form-section');
    if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i); // Son 10 yıl
  const months = [
    { value: 1, label: 'Ocak' }, { value: 2, label: 'Şubat' }, { value: 3, label: 'Mart' },
    { value: 4, label: 'Nisan' }, { value: 5, label: 'Mayıs' }, { value: 6, label: 'Haziran' },
    { value: 7, label: 'Temmuz' }, { value: 8, label: 'Ağustos' }, { value: 9, label: 'Eylül' },
    { value: 10, label: 'Ekim' }, { value: 11, label: 'Kasım' }, { value: 12, label: 'Aralık' },
  ];

  const pieChartData = {
    labels: categorySummary.map(item => KATEGORI_ADLARI[item.category] || item.category),
    datasets: [
      {
        label: 'Harcamalar (TL)',
        data: categorySummary.map(item => item.totalAmount),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
          '#FFCD56', '#C9CBCF', '#32CD32', '#8A2BE2', '#FFD700', '#008080'
        ], // Daha fazla renk eklenebilir veya dinamik üretilebilir
        borderColor: '#FFFFFF',
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const pieChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom', // Legend'ı alta aldık, daha fazla yer açabilir
          labels: {
            padding: 20,
            boxWidth: 12,
            font: { size: 10 }
          }
        },
        title: {
          display: true,
          text: `Harcama Dağılımı (${months.find(m=>m.value===selectedMonth)?.label} ${selectedYear})`,
          font: { size: 18, weight: 'bold' },
          padding: { top: 10, bottom: 20 },
          color: '#334155' // slate-700
        },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.7)',
          titleFont: { size: 14 },
          bodyFont: { size: 12 },
          padding: 10,
          cornerRadius: 4,
          callbacks: {
              label: function(context) {
                  let label = context.label || '';
                  if (label) { label += ': '; }
                  if (context.parsed !== null) {
                      label += new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(context.parsed);
                  }
                  return label;
              }
          }
        }
      },
    };

  const filteredTransactions = transactions.filter(t => {
      const transactionDateObj = new Date(t.transactionDate);
      return transactionDateObj.getFullYear() === selectedYear && (transactionDateObj.getMonth() + 1) === selectedMonth;
  }).sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));


  if (loadingTransactions && loadingSummary && loadingCategorySummary && transactions.length === 0 && !summary && categorySummary.length === 0 && !errorTransactions && !errorSummary && !errorCategorySummary) {
    return (
      <div className="bg-gradient-to-br from-slate-50 to-sky-100 min-h-screen flex justify-center items-center">
        <p className="text-xl text-slate-700 animate-pulse">Veriler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-100 to-sky-100 min-h-screen py-6 sm:py-8">
      <div className="container mx-auto px-2 sm:px-4">
         <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-600 mb-8 sm:mb-10 text-center">
          Kontrol Paneli 
        </h1>

        <div className="mb-8 p-4 sm:p-6 bg-white/70 backdrop-blur-md rounded-xl shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 sm:gap-6">
          <div>
            <label htmlFor="year-select" className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Yıl:</label>
            <select id="year-select" value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="p-2 sm:p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm sm:text-base w-full sm:w-auto">
              {years.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="month-select" className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Ay:</label>
            <select id="month-select" value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="p-2 sm:p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm sm:text-base w-full sm:w-auto">
              {months.map(month => <option key={month.value} value={month.value}>{month.label}</option>)}
            </select>
          </div>
        </div>

        {loadingSummary && !summary && <p className="text-center text-slate-600 my-4">Özet yükleniyor...</p>}
        {errorSummary && <p className="text-red-600 text-center bg-red-100 p-3 rounded-md my-4">Özet Yüklenemedi: {errorSummary}</p>}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
            <div className="bg-white/80 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-xl text-center border-t-4 border-emerald-500">
              <h3 className="text-lg sm:text-xl font-semibold text-slate-700">Toplam Gelir</h3>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-2">{summary.totalIncome.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-xl text-center border-t-4 border-rose-500">
              <h3 className="text-lg sm:text-xl font-semibold text-slate-700">Toplam Gider</h3>
              <p className="text-2xl sm:text-3xl font-bold text-rose-600 mt-2">{summary.totalExpense.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>
            </div>
            <div className={`bg-white/80 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-xl text-center border-t-4 ${summary.balance >= 0 ? 'border-indigo-500' : 'border-orange-500'}`}>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-700">Net Bakiye</h3>
              <p className={`text-2xl sm:text-3xl font-bold mt-2 ${summary.balance >= 0 ? 'text-indigo-600' : 'text-orange-600'}`}>
                {summary.balance.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
              </p>
            </div>
          </div>
        )}
        
        <div id="transaction-form-section" className="mb-8 sm:mb-10 bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-2 sm:p-0">
            <TransactionForm
                onTransactionAdded={handleTransactionAdded}
                existingTransaction={editingTransaction}
                onTransactionUpdated={handleTransactionUpdated}
                formKeyProp={formKey}
            />
        </div>

        <div className="my-8 sm:my-10 p-4 sm:p-6 bg-white/80 backdrop-blur-md rounded-xl shadow-xl">
          {loadingCategorySummary && !categorySummary.length && <p className="text-center text-slate-600 py-10">Harcama dağılımı yükleniyor...</p>}
          {errorCategorySummary && <p className="text-red-600 text-center bg-red-100 p-3 rounded-md py-10">Harcama Dağılımı Yüklenemedi: {errorCategorySummary}</p>}
          {!loadingCategorySummary && !errorCategorySummary && categorySummary.length > 0 ? (
            <div className="relative h-80 md:h-96">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
          ) : (
            !loadingCategorySummary && !errorCategorySummary && <p className="text-center text-slate-500 py-10">Bu dönem için gösterilecek harcama verisi bulunmamaktadır.</p>
          )}
        </div>

        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-slate-800 mt-8 sm:mt-10">
          İşlemler ({months.find(m=>m.value===selectedMonth)?.label} {selectedYear})
        </h2>
        {loadingTransactions && !transactions.length && <p className="text-center text-slate-600 py-10">İşlemler yükleniyor...</p>}
        {errorTransactions && <p className="text-red-600 text-center bg-red-100 p-3 rounded-md py-10">İşlemler Yüklenemedi: {errorTransactions}</p>}
        {!loadingTransactions && !errorTransactions && filteredTransactions.length === 0 ? (
          <p className="text-slate-600 text-center py-10">Bu dönem için işlem bulunmamaktadır.</p>
        ) : (
          !errorTransactions && filteredTransactions.length > 0 && (
            <div className="overflow-x-auto bg-white/80 backdrop-blur-md rounded-xl shadow-xl">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-100/80">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Tarih</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Tür</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Kategori</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden md:table-cell">Açıklama</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Tutar</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className={`${transaction.type === 'INCOME' ? 'hover:bg-emerald-50/70' : 'hover:bg-rose-50/70'} transition-colors duration-150`}>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-800">{new Date(transaction.transactionDate).toLocaleDateString('tr-TR')}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.type === 'INCOME' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {transaction.type === 'INCOME' ? 'Gelir' : 'Gider'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                      {KATEGORI_ADLARI[transaction.category] || transaction.category}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600 truncate max-w-xs hidden md:table-cell" title={transaction.description}>{transaction.description}</td>
                    <td className={`px-4 py-3 whitespace-nowrap text-right font-medium ${
                        transaction.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                      {transaction.amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center text-xs sm:text-sm">
                      <button onClick={() => handleEditTransaction(transaction)} className="text-indigo-600 hover:text-indigo-800 font-medium mr-2 sm:mr-3">Düzenle</button>
                      <button onClick={() => handleDeleteTransaction(transaction.id)} className="text-slate-500 hover:text-slate-700 font-medium">Sil</button>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default DashboardPage;