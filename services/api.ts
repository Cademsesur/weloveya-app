// services/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://attendee-api.eyawle.sesur.bj/api/v1';

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
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        // Ne pas lancer d'erreur pour les 404, laisser getEvent gérer
        if (response.status === 404) {
          return { data: null } as unknown as T;
        }
        throw new Error(data.message || 'Une erreur est survenue');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Méthode POST générique
  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }
  // Events
  async getEventPassTypes(eventId: number): Promise<PassTypesResponse> {
    return this.request<PassTypesResponse>(`/events/${eventId}/pass-types`);
  }

  // Récupérer un événement par son ID
  async getEvent(eventId: number): Promise<EventDetailResponse> {
    try {
      // D'abord essayer avec la route spécifique
      try {
        const response = await this.request<EventDetailResponse>(`/events/${eventId}`, {
          method: 'GET',
        });
        if (response.data) {
          return response;
        }
      } catch (error) {
        console.log(`La route /events/${eventId} n'est pas disponible, utilisation de /events/all comme fallback`);
      }
      
      // Fallback: Récupérer tous les événements et filtrer
      const allEvents = await this.getAllEvents();
      const foundEvent = allEvents.data.find((event: EventDetail) => event.id === eventId);
      
      if (!foundEvent) {
        return { data: null } as unknown as EventDetailResponse;
      }
      
      return { data: foundEvent };
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'événement:', error);
      return { data: null } as unknown as EventDetailResponse;
    }
  }

  // Récupérer tous les événements
  async getAllEvents(): Promise<EventsResponse> {
    return this.request<EventsResponse>('/events/all', {
      method: 'GET',
    });
  }

  // Récupérer toutes les catégories d'événements
  async getEventTags(): Promise<TagsResponse> {
    return this.request<TagsResponse>('/events/tags', {
      method: 'GET',
    });
  }
}

// Define EventsResponse interface
export interface EventsResponse {
  data: EventDetail[];
  message?: string;
}

export interface EventDetailResponse {
  data: EventDetail;
  message?: string;
}

export interface EventDetail {
  id: number;
  reference: string;
  organizer_id: number;
  name: string;
  slug: string;
  description?: string;
  banner_url?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  sales_start_date?: string | null;
  sales_end_date?: string | null;
  location?: string;
  is_online: boolean;
  category?: string;
  capacity?: number | null;
  status: string;
  visibility: string;
  created_at?: string;
  updated_at?: string;
  pass_types?: PassType[];
  'min_price-max_price'?: string | {
    min: number | null;
    max: number | null;
  } | null;
  min?: number | null;
  max?: number | null;
}

// Define Tag interface
export interface Tag {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface TagsResponse {
  data: Tag[];
  message?: string;
}

// Define PassType interface
export interface PassType {
  id: number;
  event_id: number;
  name: string;
  description?: string | null;
  price: number | string; // Added price property
  quota: number;
  created_at?: string;
  updated_at?: string;
  event?: {
    id: number;
    slug?: string | null;
    reference?: string | null;
    name?: string | null;
  };
}

export interface PassTypesResponse {
  data: PassType[];
  message?: string;
}

export default new ApiService();