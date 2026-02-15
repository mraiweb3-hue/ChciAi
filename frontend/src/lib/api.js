import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

const savedToken = localStorage.getItem('chciai_token');
if (savedToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
}
