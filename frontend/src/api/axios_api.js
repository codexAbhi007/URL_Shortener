import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

export const shortenUrl = (data) => API.post('/shorten', data);
export const getAllShortLinks = () => API.get('/shorten/view'); // 
export const getOriginalUrl = (code) => API.get(`/shorten/${code}`);