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
  CategoryScale,
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


const TransactionForm = ({ onTransactionAdded, existingTransaction, onTransactionUpdated, formKey }) => {
  const [type, setType] = useState('EXPENSE');
  const [amount, setAmount] = useState('');
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('FOOD');
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
      setMessageForm('');
    } else {
      // Yeni işlem veya form resetlendiğinde
      setType('EXPENSE');
      setAmount('');
      setTransactionDate(new Date().toISOString().split('T')[0]);
      setCategory('FOOD');
      setDescription('');
      setMessageForm('');
    }
  }, [existingTransaction, formKey]); // formKey değiştiğinde de resetle

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessageForm('');
    setLoadingForm(true);
    const transactionData = { type, amount: parseFloat(amount), transactionDate, category, description };
    try {
      if (existingTransaction) {
        const response = await TransactionService.updateTransaction(existingTransaction.id, transactionData);
        onTransactionUpdated(response.data);
        setMessageForm('İşlem başarıyla güncellendi!');
      } else {
        const response = await TransactionService.addTransaction(transactionData);
        onTransactionAdded(response.data);
        setMessageForm('İşlem başarıyla eklendi!');
        // Formu sıfırla (useEffect key sayesinde de resetlenecek)
      }
      setTimeout(() => setMessageForm(''), 3000);
    } catch (error) {
      const resMessage = (error.response?.data?.message) || error.message || error.toString();
      setMessageForm(`Hata: ${resMessage}`);
    } finally {
      setLoadingForm(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">{existingTransaction ? 'İşlemi Düzenle' : 'Yeni İşlem Ekle'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tür</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
            <option value="EXPENSE">Gider</option>
            <option value="INCOME">Gelir</option>
          </select>
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Tutar</label>
          <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} step="0.01" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label htmlFor="transactionDate" className="block text-sm font-medium text-gray-700">Tarih</label>
          <input type="date" id="transactionDate" value={transactionDate} onChange={(e) => setTransactionDate(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Kategori</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
            {type === 'INCOME' ? (
              <> <option value="SALARY">Maaş</option> <option value="FREELANCE">Serbest Çalışma</option> <option value="INVESTMENT">Yatırım</option> <option value="GIFT">Hediye</option> <option value="OTHER_INCOME">Diğer Gelir</option> </>
            ) : (
              <> <option value="FOOD">Yemek</option> <option value="TRANSPORTATION">Ulaşım</option> <option value="HOUSING">Konut</option> <option value="BILLS">Faturalar</option> <option value="HEALTH">Sağlık</option> <option value="EDUCATION">Eğitim</option> <option value="ENTERTAINMENT">Eğlence</option> <option value="SHOPPING">Alışveriş</option> <option value="TRAVEL">Seyahat</option> <option value="OTHER_EXPENSE">Diğer Gider</option> </>
            )}
          </select>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Açıklama</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"></textarea>
        </div>
      </div>
      <button type="submit" disabled={loadingForm} className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm disabled:bg-indigo-300">
        {loadingForm ? 'Kaydediliyor...' : (existingTransaction ? 'Güncelle' : 'Ekle')}
      </button>
      {messageForm && <p className={`mt-3 text-sm text-center ${messageForm.includes('Hata') ? 'text-red-600' : 'text-green-600'}`}>{messageForm}</p>}
    </form>
  );
};
// TransactionForm sonu


function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [errorTransactions, setErrorTransactions] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formKey, setFormKey] = useState('new-transaction'); // Formu resetlemek için key

  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [errorSummary, setErrorSummary] = useState(null);

  const [categorySummary, setCategorySummary] = useState([]);
  const [loadingCategorySummary, setLoadingCategorySummary] = useState(true);
  const [errorCategorySummary, setErrorCategorySummary] = useState(null);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchAllData = useCallback(async () => {
    console.log(`Fetching data for Year: ${selectedYear}, Month: ${selectedMonth}`); // LOG
    setLoadingTransactions(true);
    setLoadingSummary(true);
    setLoadingCategorySummary(true);

    // Paralel istekler için Promise.all kullanılabilir
    try {
      const [transResponse, summaryResponse, catSummaryResponse] = await Promise.all([
        TransactionService.getAllTransactions(), 
        TransactionService.getDashboardSummary(selectedYear, selectedMonth),
        TransactionService.getCategoryExpenseSummary(selectedYear, selectedMonth)
      ]);

      setTransactions(transResponse.data);
      setErrorTransactions(null);
      console.log("Transactions data:", transResponse.data); 

      setSummary(summaryResponse.data);
      setErrorSummary(null);
      console.log("Dashboard summary data:", summaryResponse.data); 

      setCategorySummary(catSummaryResponse.data);
      setErrorCategorySummary(null);
      console.log("Category summary data:", catSummaryResponse.data); 

    } catch (err) {
     
      const errorMessage = err.message || 'Veriler yüklenirken bir hata oluştu.';
      setErrorTransactions(errorMessage);
      setErrorSummary(errorMessage);
      setErrorCategorySummary(errorMessage);
      console.error("Fetch all data error:", err);
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
    setFormKey(`new-${Date.now()}`);
    fetchAllData(); // Tüm verileri yeniden yükle
  };

  const handleTransactionUpdated = (updatedTransaction) => {
    setEditingTransaction(null);
    setFormKey(`updated-${Date.now()}`); 
    fetchAllData();
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Bu işlemi silmek istediğinizden emin misiniz?')) {
      try {
        await TransactionService.deleteTransaction(id);
        // setTransactions(prev => prev.filter(t => t.id !== id)); // İsteğe bağlı
        fetchAllData();
      } catch (err) {
        setErrorTransactions(err.message || 'İşlem silinirken bir hata oluştu.');
      }
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setFormKey(`edit-${transaction.id}`); // Formu düzenleme modunda açmak ve doldurmak için
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { value: 1, label: 'Ocak' }, { value: 2, label: 'Şubat' }, { value: 3, label: 'Mart' },
    { value: 4, label: 'Nisan' }, { value: 5, label: 'Mayıs' }, { value: 6, label: 'Haziran' },
    { value: 7, label: 'Temmuz' }, { value: 8, label: 'Ağustos' }, { value: 9, label: 'Eylül' },
    { value: 10, label: 'Ekim' }, { value: 11, label: 'Kasım' }, { value: 12, label: 'Aralık' },
  ];

  // Grafik verileri state'ler tanımlandıktan sonra hazırlanmalı
  const pieChartData = {
    labels: categorySummary.map(item => {
      
        const categoryNames = {
            FOOD: "Yemek", TRANSPORTATION: "Ulaşım", HOUSING: "Konut", BILLS: "Faturalar",
            HEALTH: "Sağlık", EDUCATION: "Eğitim", ENTERTAINMENT: "Eğlence",
            SHOPPING: "Alışveriş", TRAVEL: "Seyahat", OTHER_EXPENSE: "Diğer Gider"
        
        };
        return categoryNames[item.category] || item.category;
    }),
    datasets: [
      {
        label: 'Harcamalar (TL)',
        data: categorySummary.map(item => item.totalAmount),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
          '#FFCD56', '#C9CBCF', '#32CD32', '#8A2BE2'
        ],
        hoverOffset: 4
      },
    ],
  };

  const pieChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
        },
        title: {
          display: true,
          text: `Harcama Dağılımı (${months.find(m=>m.value===selectedMonth)?.label} ${selectedYear})`,
          font: { size: 16 }
        },
        tooltip: {
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

  // Ana yükleme durumu (tüm başlangıç verileri yüklenene kadar)
  if (loadingTransactions && loadingSummary && loadingCategorySummary && transactions.length === 0 && !summary && categorySummary.length === 0) {
    return <div className="flex justify-center items-center h-screen"><p className="text-xl">Veriler yükleniyor...</p></div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">Kontrol Paneli</h1>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4">
        <div>
          <label htmlFor="year-select" className="block text-sm font-medium text-gray-700 mb-1">Yıl:</label>
          <select id="year-select" value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
            {years.map(year => <option key={year} value={year}>{year}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="month-select" className="block text-sm font-medium text-gray-700 mb-1">Ay:</label>
          <select id="month-select" value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
            {months.map(month => <option key={month.value} value={month.value}>{month.label}</option>)}
          </select>
        </div>
      </div>

      {loadingSummary ? <p className="text-center">Özet yükleniyor...</p> :
       errorSummary ? <p className="text-red-500 text-center">Özet Yüklenemedi: {errorSummary}</p> :
       summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-green-500 text-white p-6 rounded-xl shadow-lg text-center">
            <h3 className="text-xl font-semibold">Toplam Gelir</h3>
            <p className="text-4xl font-bold mt-2">{summary.totalIncome.toFixed(2)} TL</p>
          </div>
          <div className="bg-red-500 text-white p-6 rounded-xl shadow-lg text-center">
            <h3 className="text-xl font-semibold">Toplam Gider</h3>
            <p className="text-4xl font-bold mt-2">{summary.totalExpense.toFixed(2)} TL</p>
          </div>
          <div className={`p-6 rounded-xl shadow-lg text-center text-white ${summary.balance >= 0 ? 'bg-blue-500' : 'bg-orange-500'}`}>
            <h3 className="text-xl font-semibold">Net Bakiye</h3>
            <p className="text-4xl font-bold mt-2">{summary.balance.toFixed(2)} TL</p>
          </div>
        </div>
      )}

      <TransactionForm
        onTransactionAdded={handleTransactionAdded}
        existingTransaction={editingTransaction}
        onTransactionUpdated={handleTransactionUpdated}
        formKey={formKey} // formKey prop'unu TransactionForm'a geç
      />

      <div className="my-10 p-6 bg-white rounded-lg shadow-md">
        {loadingCategorySummary ? <p className="text-center">Harcama dağılımı yükleniyor...</p> :
         errorCategorySummary ? <p className="text-red-500 text-center">Harcama Dağılımı Yüklenemedi: {errorCategorySummary}</p> :
         categorySummary.length > 0 ? (
          <div className="relative h-72 md:h-96"> {/* Yükseklik ayarı */}
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        ) : (
          <p className="text-center text-gray-500">Bu dönem için gösterilecek harcama verisi bulunmamaktadır.</p>
        )}
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-gray-700 mt-10">
        İşlemler ({months.find(m=>m.value===selectedMonth)?.label} {selectedYear})
      </h2>
      {loadingTransactions ? <p className="text-center">İşlemler yükleniyor...</p> :
       errorTransactions ? <p className="text-red-500 text-center">İşlemler Yüklenemedi: {errorTransactions}</p> :
       transactions.filter(t => {
           const transactionDateObj = new Date(t.transactionDate);
           return transactionDateObj.getFullYear() === selectedYear && (transactionDateObj.getMonth() + 1) === selectedMonth;
         }).length === 0 ? (
        <p className="text-gray-600 text-center">Bu dönem için işlem bulunmamaktadır.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tür</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Açıklama</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions
                .filter(t => {
                    const transactionDateObj = new Date(t.transactionDate);
                    return transactionDateObj.getFullYear() === selectedYear && (transactionDateObj.getMonth() + 1) === selectedMonth;
                })
                .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)) // Tarihe göre tersten sırala (en yeni en üstte)
                .map((transaction) => (
                <tr key={transaction.id} className={`${transaction.type === 'INCOME' ? 'hover:bg-green-50' : 'hover:bg-red-50'}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(transaction.transactionDate).toLocaleDateString('tr-TR')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.type === 'INCOME' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type === 'INCOME' ? 'Gelir' : 'Gider'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    
                    {pieChartData.labels[categorySummary.findIndex(cs => cs.category === transaction.category)] || transaction.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs" title={transaction.description}>{transaction.description}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                      transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {transaction.amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEditTransaction(transaction)} className="text-indigo-600 hover:text-indigo-900 mr-3">Düzenle</button>
                    <button onClick={() => handleDeleteTransaction(transaction.id)} className="text-red-600 hover:text-red-900">Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;