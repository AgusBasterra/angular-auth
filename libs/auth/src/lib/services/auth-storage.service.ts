import { Injectable, inject } from '@angular/core';
import { AUTH_CONFIG } from '../config/auth.tokens';
import { AuthUser } from '../models/auth-user.model';

/**
 * Servicio para manejar el almacenamiento de tokens y usuario
 */
@Injectable({
  providedIn: 'root',
})
export class AuthStorageService {
  private readonly config = inject(AUTH_CONFIG);
  private memoryStorage: Map<string, string> = new Map();

  /**
   * Obtiene el storage configurado
   */
  private getStorage(): Storage | null {
    const storageType = this.config.storage ?? 'localStorage';
    
    if (storageType === 'memory') {
      return null; // Usar memoryStorage
    }
    
    try {
      const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
      // Test si está disponible
      const testKey = '__storage_test__';
      storage.setItem(testKey, 'test');
      storage.removeItem(testKey);
      return storage;
    } catch {
      console.warn(`${storageType} no está disponible. Usando memoria temporal.`);
      return null;
    }
  }

  /**
   * Guarda un valor en el storage
   */
  private setItem(key: string, value: string): void {
    const storage = this.getStorage();
    
    if (storage) {
      storage.setItem(key, value);
    } else {
      this.memoryStorage.set(key, value);
    }
  }

  /**
   * Obtiene un valor del storage
   */
  private getItem(key: string): string | null {
    const storage = this.getStorage();
    
    if (storage) {
      return storage.getItem(key);
    } else {
      return this.memoryStorage.get(key) ?? null;
    }
  }

  /**
   * Elimina un valor del storage
   */
  private removeItem(key: string): void {
    const storage = this.getStorage();
    
    if (storage) {
      storage.removeItem(key);
    } else {
      this.memoryStorage.delete(key);
    }
  }

  // ===========================
  // PUBLIC API
  // ===========================

  /**
   * Guarda el access token
   */
  setAccessToken(token: string): void {
    const key = this.config.storageKeys?.accessToken ?? 'access_token';
    this.setItem(key, token);
  }

  /**
   * Obtiene el access token
   */
  getAccessToken(): string | null {
    const key = this.config.storageKeys?.accessToken ?? 'access_token';
    return this.getItem(key);
  }

  /**
   * Elimina el access token
   */
  removeAccessToken(): void {
    const key = this.config.storageKeys?.accessToken ?? 'access_token';
    this.removeItem(key);
  }

  /**
   * Guarda el refresh token
   */
  setRefreshToken(token: string): void {
    const key = this.config.storageKeys?.refreshToken ?? 'refresh_token';
    this.setItem(key, token);
  }

  /**
   * Obtiene el refresh token
   */
  getRefreshToken(): string | null {
    const key = this.config.storageKeys?.refreshToken ?? 'refresh_token';
    return this.getItem(key);
  }

  /**
   * Elimina el refresh token
   */
  removeRefreshToken(): void {
    const key = this.config.storageKeys?.refreshToken ?? 'refresh_token';
    this.removeItem(key);
  }

  /**
   * Guarda el usuario
   */
  setUser(user: AuthUser): void {
    const key = this.config.storageKeys?.user ?? 'auth_user';
    this.setItem(key, JSON.stringify(user));
  }

  /**
   * Obtiene el usuario
   */
  getUser(): AuthUser | null {
    const key = this.config.storageKeys?.user ?? 'auth_user';
    const userJson = this.getItem(key);
    
    if (!userJson) {
      return null;
    }
    
    try {
      return JSON.parse(userJson) as AuthUser;
    } catch {
      return null;
    }
  }

  /**
   * Elimina el usuario
   */
  removeUser(): void {
    const key = this.config.storageKeys?.user ?? 'auth_user';
    this.removeItem(key);
  }

  /**
   * Limpia todo el storage (tokens y usuario)
   */
  clear(): void {
    this.removeAccessToken();
    this.removeRefreshToken();
    this.removeUser();
  }

  /**
   * Verifica si hay tokens almacenados
   */
  hasTokens(): boolean {
    return !!this.getAccessToken();
  }
}

