// src/pages/DashboardPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import TransactionService from '../services/transactionService';
import { useAuth } from '../contexts/AuthContext.jsx'; // Çıkış yaparken gerekebilir


const TransactionForm = ({ onTransactionAdded, existingTransaction, onTransactionUpdated }) => {
  const [type, setType] = useState(existingTransaction ? existingTransaction.type : 'EXPENSE');
  const [amount, setAmount] = useState(existingTransaction ? existingTransaction.amount : '');
  const [transactionDate, setTransactionDate] = useState(
    existingTransaction ? existingTransaction.transactionDate : new Date().toISOString().split('T')[0]
  );
  const [category, setCategory] = useState(existingTransaction ? existingTransaction.category : 'FOOD');
  const [description, setDescription] = useState(existingTransaction ? existingTransaction.description : '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    const transactionData = {
      type,
      amount: parseFloat(amount), 
      transactionDate,
      category,
      description,
    };

    try {
      if (existingTransaction) {
        
        const response = await TransactionService.updateTransaction(existingTransaction.id, transactionData);
        onTransactionUpdated(response.data); // Ana bileşeni güncelle
        setMessage('İşlem başarıyla güncellendi!');
      } else {
        
        const response = await TransactionService.addTransaction(transactionData);
        onTransactionAdded(response.data); // yeni işlemi listeye ekle
        setMessage('İşlem başarıyla eklendi!');
        // Formu sıfırla
        setType('EXPENSE');
        setAmount('');
        setTransactionDate(new Date().toISOString().split('T')[0]);
        setCategory('FOOD');
        setDescription('');
      }
      setTimeout(() => setMessage(''), 3000); // Mesajı 3 saniye sonra temizle
    } catch (error) {
      const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      setMessage(`Hata: ${resMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (existingTransaction) {
      setType(existingTransaction.type);
      setAmount(existingTransaction.amount.toString());
      setTransactionDate(existingTransaction.transactionDate);
      setCategory(existingTransaction.category);
      setDescription(existingTransaction.description || '');
    } else {
        // Yeni işlem için formu sıfırla
        setType('EXPENSE');
        setAmount('');
        setTransactionDate(new Date().toISOString().split('T')[0]);
        setCategory('FOOD');
        setDescription('');
    }
  }, [existingTransaction]);


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
          {/* Kategori seçenekleri backend'deki enum'a göre veya dinamik olabilir */}
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
            {type === 'INCOME' ? (
              <>
                <option value="SALARY">Maaş</option>
                <option value="FREELANCE">Serbest Çalışma</option>
                <option value="INVESTMENT">Yatırım</option>
                <option value="GIFT">Hediye</option>
                <option value="OTHER_INCOME">Diğer Gelir</option>
              </>
            ) : (
              <>
                <option value="FOOD">Yemek</option>
                <option value="TRANSPORTATION">Ulaşım</option>
                <option value="HOUSING">Konut</option>
                <option value="BILLS">Faturalar</option>
                <option value="HEALTH">Sağlık</option>
                <option value="EDUCATION">Eğitim</option>
                <option value="ENTERTAINMENT">Eğlence</option>
                <option value="SHOPPING">Alışveriş</option>
                <option value="TRAVEL">Seyahat</option>
                <option value="OTHER_EXPENSE">Diğer Gider</option>
              </>
            )}
          </select>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Açıklama</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"></textarea>
        </div>
      </div>
      <button type="submit" disabled={loading} className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm disabled:bg-indigo-300">
        {loading ? 'Kaydediliyor...' : (existingTransaction ? 'Güncelle' : 'Ekle')}
      </button>
      {message && <p className={`mt-3 text-sm text-center ${message.includes('Hata') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
    </form>
  );
};


function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null); // Düzenlenecek işlem state'i

  // useCallback, fetchTransactions fonksiyonunun gereksiz yere yeniden oluşturulmasını engeller
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await TransactionService.getAllTransactions();
      setTransactions(response.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'İşlemler yüklenirken bir hata oluştu.');
      console.error("Fetch transactions error:", err);
      // Eğer 401 (Unauthorized) veya 403 (Forbidden) ise logout yapıp login'e yönlendirme burada yapılabilir
      // Ancak bu, Axios interceptor'ında daha merkezi bir şekilde hallediliyor olabilir
    } finally {
      setLoading(false);
    }
  }, []); // Bağımlılık dizisi boş, yani sadece bileşen mount olduğunda veya manuel çağrıldığında çalışır

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]); // fetchTransactions değiştiğinde (ki useCallback ile sabit) tekrar çalışır

  const handleTransactionAdded = (newTransaction) => {
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]); // Yeni işlemi listenin başına ekle
  };

  const handleTransactionUpdated = (updatedTransaction) => {
    setTransactions(prevTransactions =>
      prevTransactions.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
    );
    setEditingTransaction(null); 
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Bu işlemi silmek istediğinizden emin misiniz?')) {
      try {
        await TransactionService.deleteTransaction(id);
        setTransactions(prevTransactions => prevTransactions.filter(t => t.id !== id));
      } catch (err) {
        setError(err.message || 'İşlem silinirken bir hata oluştu.');
        console.error("Delete transaction error:", err);
      }
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Formun olduğu yere scroll yap
  };


  if (loading) return <div className="text-center mt-10"><p>İşlemler yükleniyor...</p></div>;
  if (error) return <div className="text-center mt-10 p-4 bg-red-100 text-red-700 rounded-md"><p>Hata: {error}</p></div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-orange-600 mb-8">Kontrol Paneli</h1>

      <TransactionForm
        onTransactionAdded={handleTransactionAdded}
        existingTransaction={editingTransaction}
        onTransactionUpdated={handleTransactionUpdated}
        key={editingTransaction ? editingTransaction.id : 'new'} // Formu resetlemek için key
      />

      <h2 className="text-2xl font-semibold mb-4 text-gray-700 mt-10">Son İşlemler</h2>
      {transactions.length === 0 && !loading ? (
        <p className="text-gray-600">Henüz hiç işlem eklenmemiş.</p>
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
              {transactions.map((transaction) => (
                <tr key={transaction.id} className={`${transaction.type === 'INCOME' ? 'bg-green-50' : 'bg-red-50'}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(transaction.transactionDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.type === 'INCOME' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type === 'INCOME' ? 'Gelir' : 'Gider'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{transaction.description}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                      transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {transaction.amount.toFixed(2)} TL
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