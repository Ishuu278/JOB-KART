const API_BASE = (typeof window !== 'undefined' && window.location.protocol !== 'file:' && (window.location.port === '5000' || !window.location.hostname.match(/localhost|127\.0\.0\.1/)))
  ? '/api'
  : 'http://localhost:5000/api';

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

  baseUrl: API_BASE,

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = { ...options.headers };
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    }
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
    const isForm = body instanceof FormData;
    return this.request(endpoint, {
      method: 'POST',
      body: isForm ? body : JSON.stringify(body)
    });
  },

  put(endpoint, body) {
    const isForm = body instanceof FormData;
    return this.request(endpoint, {
      method: 'PUT',
      body: isForm ? body : JSON.stringify(body)
    });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },

  upload(endpoint, formData) {
    return this.request(endpoint, { method: 'POST', body: formData });
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
