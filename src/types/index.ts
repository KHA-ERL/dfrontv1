export interface User {
  id: string;
  email: string;
  fullName: string;
  whatsapp?: string;
  houseAddress?: string;
  substituteAddress?: string;
  bankAccount?: string;
  bankName?: string;
  role: 'admin' | 'regular';
  createdAt: string;
  hasAcceptedTerms: boolean;
}
export interface UserPublic {
  id: number;
  fullName: string;
  email: string;
  whatsapp?: string;
  houseAddress?: string;
  substituteAddress?: string;
}
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  condition?: string;
  conditionRating?: number; // 0-10 seller rating
  images: string[];
  videos?: string[];
  location_state?: string;
  locationState?: string;
  delivery_fee?: number;
  deliveryFee?: number;
  sellerId?: number;
  seller?: UserPublic;
  createdAt?: string;
  isDisabled?: boolean;
  outOfStock?: boolean; // For Online Store items
  type: 'Declutter' | 'Online Store';
  quantity: number;
  active: boolean;
}
export interface Order {
  id: string;
  reference: string;

  product?: Product;
  productId?: string;

  buyer?: UserPublic;
  buyerId?: string;

  seller?: UserPublic;
  sellerId?: string;

  price: number;
  deliveryFee?: number;
  totalAmount?: number;

  status: string; // e.g., PENDING, PROCESSING, SHIPPED, DELIVERED, COMPLETED
  satisfied: boolean;

  createdAt: string;
  deliveredAt?: string | null;

  satisfactionStatus: 'PENDING' | 'NOT_SATISFIED' | 'SATISFIED';
}

export interface Complaint {
  id: string;
  orderId: string;
  order?: Order;
  buyerId: string;
  reasons: string[];
  description: string;
  images: string[];
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED';
  createdAt: string;
}

export interface SatisfactionRecord {
  id: string;
  orderId: string;
  order?: Order;
  buyerId: string;
  sellerId: string;
  status: 'SATISFIED';
  createdAt: string;
}
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
  whatsapp: string;
  houseAddress: string;
  substituteAddress: string;
  bankAccount: string;
  bankName: string;
}

export interface SellerStats {
  itemsListed: number;
  itemsSold: number;
  activeListings: number;
  revenue: number;
}
