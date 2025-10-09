// services/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://attendee-api-v1-w52eyawle.sesur.bj/api/v1';

export interface RegisterData {
  email: string;
  password: string;
  password_confirmation: string;
  firstname?: string;
  lastname?: string;
  name?: string;
  telephone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string | null;
  firstname: string | null;
  lastname: string | null;
  email: string;
  phone_number: string | null;
}

export interface AuthResponse {
  message: string;
  data: {
    eventAttender?: {
      id: number;
      user_id: number;
      created_at: string;
      updated_at: string;
      user: User;
    };
    user: User;
    token: string;
    token_type: string;
  };
}

class ApiService {
  private token: string | null = null;

  async setToken(token: string) {
    this.token = token;
    await AsyncStorage.setItem('auth_token', token);
  }

  async getToken(): Promise<string | null> {
    if (!this.token) {
      this.token = await AsyncStorage.getItem('auth_token');
    }
    return this.token;
  }

  async removeToken() {
    this.token = null;
    await AsyncStorage.removeItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Une erreur est survenue');
    }

    return data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Sauvegarder le token après l'inscription réussie
    if (response.data.token) {
      await this.setToken(response.data.token);
    }

    return response;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Sauvegarder le token après la connexion réussie
    if (response.data.token) {
      await this.setToken(response.data.token);
    }

    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } finally {
      await this.removeToken();
    }
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(data: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<{ message: string }> {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Events
  async getAllEvents(): Promise<EventsResponse> {
    return this.request('/events/all', {
      method: 'GET',
    });
  }

  async getEvent(eventId: number): Promise<EventDetailResponse> {
    return this.request(`/events/${eventId}`, {
      method: 'GET',
    });
  }

  async getEventPassTypes(eventId: number): Promise<PassTypesResponse> {
    return this.request(`/events/${eventId}/pass-types`, {
      method: 'GET',
    });
  }
}

export default new ApiService();