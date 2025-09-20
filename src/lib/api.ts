import { Product } from '@/data/products';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-vercel-app.vercel.app'
  : 'http://localhost:3001'; // Backend server runs on port 3001

export interface AdminSettings {
  whatsappNumber?: string;
  whatsappDirectOrder?: boolean;
  enablePurchaseNotifications?: boolean;
  enableFloatingCart?: boolean;
  showDiscountBadges?: boolean;
  showBreadcrumbs?: boolean;
  popupSettings?: {
    enabled?: boolean;
    title?: string;
    message?: string;
    buttonText?: string;
    buttonHref?: string;
    showTimer?: boolean;
    timerDuration?: number;
    trigger?: 'delay' | 'scroll' | 'exit-intent';
    delaySeconds?: number;
    frequency?: 'always' | 'once-per-session' | 'once-per-day';
    theme?: 'light' | 'dark';
    pages?: string[];
  };
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add admin token if available
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getAdminSettings(): Promise<AdminSettings> {
    return this.request<AdminSettings>('/api/admin/settings');
  }

  async updateAdminSettings(settings: AdminSettings): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/admin/settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  }

  async loginAdmin(password: string): Promise<{ token: string; message: string }> {
    return this.request<{ token: string; message: string }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  }

  async getProducts(): Promise<Product[]> {
    return this.request<Product[]>('/api/admin/products');
  }

  async updateProducts(products: Product[]): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/admin/products', {
      method: 'POST',
      body: JSON.stringify(products),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
