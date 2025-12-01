/// <reference types="vite/client" />
/**
 * Secure API Client for Authentication
 * 
 * This implementation uses httpOnly cookies for authentication instead of localStorage
 * for improved security:
 * 
 * - JWT tokens are stored in httpOnly cookies on the server side
 * - No sensitive token data is stored client-side (localStorage/sessionStorage)
 * - Cookies are automatically included in requests with credentials: 'include'
 * - XSS attacks cannot access httpOnly cookies
 * - CSRF protection should be implemented on the server side
 * 
 * Session Management:
 * - AuthSession only contains user data and authentication status
 * - No access_token, refresh_token, or expires_at on client side
 * - Authentication state is verified via /api/auth/me endpoint
 * - Tokens are managed entirely by the server through cookies
 */

const API_BASE_URL = window.config?.apiUrl || 'http://localhost:5261';

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  email_verified: boolean;
  created_at: string;
}

export interface AuthResponse {
  user: User | null;
  error: {
    message: string;
  } | null;
}

export interface AuthSession {
  user: User;
  authenticated: boolean;
}

class AuthClient {
  private session: AuthSession | null = null;
  private listeners: ((event: string, session: AuthSession | null) => void)[] = [];

  constructor() {
    this.checkAuthStatus();
  }

  private async checkAuthStatus(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const userData = await response.json();
        this.session = {
          user: {
            id: userData.id,
            email: userData.email,
            username: userData.username,
            name: userData.name,
            email_verified: userData.email_verified,
            created_at: userData.created_at,
          },
          authenticated: true,
        };
        this.notifyListeners('auth_change', this.session);
      } else {
        this.session = null;
        this.notifyListeners('auth_change', null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      this.session = null;
      this.notifyListeners('auth_change', null);
    }
  }

  private notifyListeners(event: string, session: AuthSession | null): void {
    this.session = session;
    this.listeners.forEach(listener => {
      listener(event, session);
    });
  }

  async me(): Promise<User> {
    if (this.session && this.session.authenticated) {
      return this.session.user;
    }
    throw new Error('No authenticated user');
  }

  async signInWithPassword({ email, password }: { email: string; password: string }): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          user: null,
          error: { message: data.message || 'Login failed' },
        };
      }

      const session: AuthSession = {
        user: {
            id: data.id,
            email: data.email,
            username: data.username,
            name: data.name,
            email_verified: data.email_verified,
            created_at: data.created_at,
        },
        authenticated: true,
      };

      this.notifyListeners('auth_change', session);

      return {
        user: {
            id: data.id,
            email: data.email,
            username: data.username,
            name: data.name,
            email_verified: data.email_verified,
            created_at: data.created_at,
        },
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        error: { message: 'Network error occurred' },
      };
    }
  }

  async signUp({ username, email, password }: { username: string; email: string; password: string }): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          user: null,
          error: { message: data.message || 'Registration failed' },
        };
      }

      return {
        user: {
          id: data.id,
          email: data.email,
          username: data.username,
          name: data.name,
          email_verified: data.email_verified,
          created_at: data.created_at,
        },
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        error: { message: 'Network error occurred' },
      };
    }
  }

  async signOut(): Promise<{ error: { message: string } | null }> {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      this.notifyListeners('auth_change', null);
      return { error: null };
    } catch (error) {
      this.notifyListeners('auth_change', null);
      return { error: null };
    }
  }

  async getSession(forceRefresh: boolean = false): Promise<{ data: { session: AuthSession | null } }> {
    if (forceRefresh || this.session === null) {
      await this.checkAuthStatus();
    }
    
    return {
      data: {
        session: this.session,
      },
    };
  }

  onAuthStateChange(callback: (event: string, session: AuthSession | null) => void): { data: { subscription: { unsubscribe: () => void } } } {
    this.listeners.push(callback);

    if (this.session !== null) {
      callback('initial', this.session);
    }

    return {
      data: {
        subscription: {
          unsubscribe: () => {
            const index = this.listeners.indexOf(callback);
            if (index > -1) {
              this.listeners.splice(index, 1);
            }
          },
        },
      },
    };
  }
}

export const apiClient = {
  auth: new AuthClient(),
};
