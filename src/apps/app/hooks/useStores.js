import axios from 'axios';

export const useStores = (userId) => {
  const fetchStores = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/stores?user_id=${userId}`);
    return res.data;
  };

  const createStore = async (name) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/stores`, { name, user_id: userId });
    return res.data;
  };

  const updateStore = async (id, name) => {
    const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/stores/${id}`, { name });
    return res.data;
  };

  const deleteStore = async (id) => {
    const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/stores/${id}`);
    return res.data;
  };

  return { fetchStores, createStore, updateStore, deleteStore };
};