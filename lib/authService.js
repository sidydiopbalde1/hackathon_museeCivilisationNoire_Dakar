export class AuthService {
  static TOKEN_KEY = 'auth_token';
  static USER_KEY = 'user_data';
  static ROLE_KEY = 'user_role';

  static async login(email, password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur de connexion');
      }

      if (data.success && data.token) {
        this.setToken(data.token);
        this.setUser(data.user);
        this.setRole(data.user.role);
        return { success: true, user: data.user };
      }

      throw new Error('Réponse invalide du serveur');
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }

  static setToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  static getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  static setUser(user) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  static getUser() {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  static setRole(role) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.ROLE_KEY, role);
    }
  }

  static getRole() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.ROLE_KEY);
    }
    return null;
  }

  static isAuthenticated() {
    return !!this.getToken();
  }

  static isAdmin() {
    return this.getRole() === 'admin';
  }

  static logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.ROLE_KEY);
    }
  }

  static getAuthHeaders() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}