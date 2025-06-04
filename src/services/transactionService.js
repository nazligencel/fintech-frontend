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

const TransactionService = {
  getAllTransactions,
  getTransactionById,
  addTransaction,
  updateTransaction,
  deleteTransaction,
};

export default TransactionService;