// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Auth types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  nombre: string;
  role: 'ADMIN' | 'VENDEDOR';
}

export interface AuthResponse extends AuthTokens {
  user: User;
}

// Product types
export type ProductCategory = 'iPhone' | 'iPad' | 'Mac' | 'Watch' | 'AirPods' | 'Accesorios';

export interface Producto {
  id: string;
  modelo: string;
  categoria: ProductCategory;
  memoria: string;
  color: string;
  precio: string;
  bateria: number | null;
  usado: boolean;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductoInput {
  modelo: string;
  categoria: ProductCategory;
  memoria: string;
  color: string;
  precio: number;
  bateria?: number | null;
  usado: boolean;
  stock: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedProducts {
  items: Producto[];
  meta: PaginationMeta;
}

// Filter types
export interface ProductFilters {
  categoria?: ProductCategory;
  modelo?: string;
  memoria?: string;
  color?: string;
  usado?: boolean;
  minPrice?: number;
  maxPrice?: number;
  stockDisponible?: boolean;
  page?: number;
  limit?: number;
}
