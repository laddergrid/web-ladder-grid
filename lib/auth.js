const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user';
const AUTH_CHANGE_EVENT = 'auth-state-changed';

export const authService = {
  setTokens(accessToken, refreshToken) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      this.notifyAuthChange();
    }
  },

  getAccessToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },

  getRefreshToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return null;
  },

  setUser(user) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  getUser() {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  isAuthenticated() {
    return !!this.getAccessToken();
  },

  clearAuth() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      this.notifyAuthChange();
    }
  },

  notifyAuthChange() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
    }
  },

  onAuthChange(callback) {
    if (typeof window !== 'undefined') {
      window.addEventListener(AUTH_CHANGE_EVENT, callback);
      return () => window.removeEventListener(AUTH_CHANGE_EVENT, callback);
    }
    return () => {};
  },

  async refreshAccessToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        this.clearAuth();
        return null;
      }

      const data = await response.json();
      if (data.access_token) {
        localStorage.setItem(TOKEN_KEY, data.access_token);
        return data.access_token;
      }

      return null;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      this.clearAuth();
      return null;
    }
  },

  async logout() {
    const accessToken = this.getAccessToken();

    if (accessToken) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
      } catch (error) {
        console.error('Logout request failed:', error);
      }
    }

    this.clearAuth();
  },
};
