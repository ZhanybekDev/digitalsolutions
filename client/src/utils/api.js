import axios from 'axios';
const BASE = import.meta.env.VITE_API_BASE_URL;

export const fetchItems = async (offset = 0, limit = 20, minId) => {
    const res = await axios.get(`${BASE}/api/items`, { params: { offset, limit, minId } });
    return res.data.items;
};

export const fetchSelected = async (offset = 0, limit = 20, minId) => {
    const res = await axios.get(`${BASE}/api/selected`, { params: { offset, limit, minId } });
    return res.data.items;
};

export const enqueueAction = async (type, payload) => {
    await axios.post(`${BASE}/api/queue`, { type, payload });
};
