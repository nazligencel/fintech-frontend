import api from './api'; 

const API_TRANSACTIONS_URL = '/api/transactions'; // Backend'deki transactions endpoint'inin temel yolu

const getAllTransactions = () => {
  return api.get(API_TRANSACTIONS_URL); 
};

const getTransactionById = (id) => {
  return api.get(`${API_TRANSACTIONS_URL}/${id}`);
};


const addTransaction = (transactionData) => {
  return api.post(API_TRANSACTIONS_URL, transactionData); 
};


const updateTransaction = (id, transactionData) => {
  return api.put(`${API_TRANSACTIONS_URL}/${id}`, transactionData); 
};


const deleteTransaction = (id) => {
  return api.delete(`${API_TRANSACTIONS_URL}/${id}`); 
};
const getDashboardSummary = (year, month) => {
  let params = {};
  if (year) params.year = year;
  if (month) params.month = month;
  return api.get(`${API_TRANSACTIONS_URL}/summary`, { params });
};

const getCategoryExpenseSummary = (year, month) => {
  let params = {};
  if (year) params.year = year;
  if (month) params.month = month;
  return api.get(`${API_TRANSACTIONS_URL}/expenses/by-category`, { params });
};

const TransactionService = {
  getAllTransactions,
  getTransactionById,
  addTransaction,
  updateTransaction,
  deleteTransaction,
   getDashboardSummary,
  getCategoryExpenseSummary,
};

export default TransactionService;