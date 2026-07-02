const API_BASE = 'http://localhost:5000/api';

const api = {
  getToken: () => localStorage.getItem('jobkart_token'),
  setToken: (token) => localStorage.setItem('jobkart_token', token),
  removeToken: () => localStorage.removeItem('jobkart_token'),
  getUser: () => {
    const user = localStorage.getItem('jobkart_user');
    return user ? JSON.parse(user) : null;
  },
  setUser: (user) => localStorage.setItem('jobkart_user', JSON.stringify(user)),
  removeUser: () => localStorage.removeItem('jobkart_user'),

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Request failed');
    }
    return data;
  },

  get(endpoint) {
    return this.request(endpoint);
  },

  post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) });
  },

  put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },

  async login(email, password) {
    const data = await this.post('/auth/login', { email, password });
    this.setToken(data.token);
    this.setUser(data);
    return data;
  },

  async register(userData) {
    const data = await this.post('/auth/register', userData);
    this.setToken(data.token);
    this.setUser(data);
    return data;
  },

  logout() {
    this.removeToken();
    this.removeUser();
  },

  isLoggedIn() {
    return !!this.getToken();
  }
};
