import axios from "axios";

const api = axios.create({
  baseURL: "https://finance-tracker-backend-production-9c35.up.railway.app",
});

// Automatically attach the token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export async function getTransactions() {
  const response = await api.get("/transactions/");
  return response.data;
}

export async function createTransaction(data) {
  // data should be: { amount, description, category, type, date }
  const response = await api.post("/transactions/", data);
  return response.data;
}

export async function deleteTransaction(id) {
  await api.delete(`/transactions/${id}`);
}

export async function updateTransaction(id, data) {
  const response = await api.put(`/transactions/${id}`, data);
  return response.data;
}

// We'll also add a helper for categories
export async function getCategories() {
  const response = await api.get("/categories");
  return response.data;
}

