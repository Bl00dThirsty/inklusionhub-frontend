
"use client"; 

import Cookies from 'js-cookie';

export interface User {
  id: string;
  email: string;
  name: string;
  forename: string;
  role: string;
  avatar?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

class AuthService {
  private readonly isProduction: boolean;
  
  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
  }
  
  // Stocke les deux tokens
  setTokens(tokens: AuthTokens): void {
    this.setAccessToken(tokens.access);
    this.setRefreshToken(tokens.refresh);
  }
  
  // Stocke le token d'accès (méthode manquante)
  setAccessToken(token: string): void {
    if (typeof window === 'undefined') return;
    
    Cookies.set('access_token', token, {
      secure: this.isProduction,
      sameSite: 'strict',
      expires: 1, // 1 jour
      path: '/'
    });
  }
  
  // Stocke le refresh token
  setRefreshToken(token: string): void {
    if (typeof window === 'undefined') return;
    
    Cookies.set('refresh_token', token, {
      secure: this.isProduction,
      sameSite: 'strict',
      expires: 7, // 7 jours
      path: '/'
    });
  }
  
  // Récupère le token d'accès
  getAccessToken(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    return Cookies.get('access_token');
  }
  
  // Récupère le refresh token
  getRefreshToken(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    return Cookies.get('refresh_token');
  }
  
  // Stocke l'utilisateur
  setUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
  
  // Récupère l'utilisateur
  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  
  // Vérifie si authentifié
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
  
  // Déconnexion
  logout(): void {
    if (typeof window === 'undefined') return;
    
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    localStorage.removeItem('user');
  }
  
  // Rafraîchit le token
  async refreshAccessToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      this.logout();
      throw new Error('No refresh token');
    }
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/auth/refresh/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        }
      );
      
      if (!response.ok) {
        this.logout();
        throw new Error('Token refresh failed');
      }
      
      const data = await response.json();
      this.setAccessToken(data.access);
      return data.access;
    } catch (error) {
      this.logout();
      throw error;
    }
  }
}

export const authService = new AuthService();