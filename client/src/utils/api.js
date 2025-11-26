import axios from 'axios';
const BASE = 'http://localhost:3000';

export const fetchItems = async (offset = 0, limit = 20, minId) => {
    const res = await axios.get(`${BASE}/items`, { params: { offset, limit, minId } });
    return res.data.items;
};

export const fetchSelected = async (offset = 0, limit = 20, minId) => {
    const res = await axios.get(`${BASE}/selected`, { params: { offset, limit, minId } });
    return res.data.items;
};

export const enqueueAction = async (type, payload) => {
    await axios.post(`${BASE}/queue`, { type, payload });
};
