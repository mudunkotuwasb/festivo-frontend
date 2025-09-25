// API Configuration and Service Functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// API Response Types
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  userType: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
}

export interface Customer extends User {
  address?: string;
  city?: string;
  postalCode?: string;
}

export interface Vendor extends User {
  businessName: string;
  businessRegistrationNumber: string;
  address: string;
  city: string;
  postalCode: string;
  description: string;
  website?: string;
  vendorType: string;
  isVerified: boolean;
  rating: number;
  totalReviews: number;
}

// Service Types
export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  isActive: boolean;
  vendor: Vendor;
  createdAt: string;
  updatedAt: string;
}

// TimeSlot Types
export interface TimeSlot {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  status: 'AVAILABLE' | 'BOOKED' | 'BLOCKED';
  isRecurring: boolean;
  recurringPattern: string;
  vendor: Vendor;
  bookingId?: number;
  customerName?: string;
  serviceName?: string;
  createdAt: string;
}

// Booking Types
export interface Booking {
  id: number;
  bookingDate: string;
  serviceDate: string;
  totalAmount: number;
  advancePayment: number;
  remainingAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PARTIAL' | 'COMPLETED' | 'REFUNDED';
  specialRequests?: string;
  customer: Customer;
  vendor: Vendor;
  service: Service;
  timeSlot?: TimeSlot;
  cancellationReason?: string;
  cancelledAt?: string;
}

// Message Types
export interface Message {
  id: number;
  content: string;
  sender: User;
  receiver: User;
  isRead: boolean;
  readAt?: string;
  messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';
  attachmentUrl?: string;
  createdAt: string;
}

// Review Types
export interface Review {
  id: number;
  rating: number;
  comment?: string;
  isVerified: boolean;
  customer: Customer;
  vendor: Vendor;
  booking: Booking;
  createdAt: string;
}

// Event Types
export interface Event {
  id: number;
  name: string;
  description: string;
  eventDate: string;
  eventTime: string;
  location: string;
  guestCount: number;
  eventType: string;
  status: string;
  totalBudget: number;
  spentAmount: number;
  customer: Customer;
  bookings: Booking[];
  createdAt: string;
}

// API Service Class
class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Authentication APIs
  async login(email: string, password: string): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async registerCustomer(customerData: Partial<Customer>): Promise<ApiResponse<Customer>> {
    return this.request<Customer>('/auth/register/customer', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  }

  async registerVendor(vendorData: Partial<Vendor>): Promise<ApiResponse<Vendor>> {
    return this.request<Vendor>('/auth/register/vendor', {
      method: 'POST',
      body: JSON.stringify(vendorData),
    });
  }

  async logout(): Promise<ApiResponse<any>> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Vendor APIs
  async getVendors(params?: {
    city?: string;
    vendorType?: string;
    minRating?: number;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<{ vendors: Vendor[]; totalElements: number; totalPages: number }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/vendors?${queryParams.toString()}`);
  }

  async getVendorById(id: number): Promise<ApiResponse<Vendor>> {
    return this.request<Vendor>(`/vendors/${id}`);
  }

  async getVendorServices(id: number): Promise<ApiResponse<Service[]>> {
    return this.request<Service[]>(`/vendors/${id}/services`);
  }

  async getVendorTimeSlots(id: number, date?: string): Promise<ApiResponse<TimeSlot[]>> {
    const queryParams = date ? `?date=${date}` : '';
    return this.request<TimeSlot[]>(`/vendors/${id}/time-slots${queryParams}`);
  }

  async createService(vendorId: number, service: Partial<Service>): Promise<ApiResponse<Service>> {
    return this.request<Service>(`/vendors/${vendorId}/services`, {
      method: 'POST',
      body: JSON.stringify(service),
    });
  }

  async createTimeSlot(vendorId: number, timeSlot: Partial<TimeSlot>): Promise<ApiResponse<TimeSlot>> {
    return this.request<TimeSlot>(`/vendors/${vendorId}/time-slots`, {
      method: 'POST',
      body: JSON.stringify(timeSlot),
    });
  }

  async updateVendor(id: number, vendor: Partial<Vendor>): Promise<ApiResponse<Vendor>> {
    return this.request<Vendor>(`/vendors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vendor),
    });
  }

  // Booking APIs
  async createBooking(booking: Partial<Booking>): Promise<ApiResponse<Booking>> {
    return this.request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(booking),
    });
  }

  async getBookingsByCustomer(customerId: number): Promise<ApiResponse<Booking[]>> {
    return this.request<Booking[]>(`/bookings/customer/${customerId}`);
  }

  async getBookingsByVendor(vendorId: number): Promise<ApiResponse<Booking[]>> {
    return this.request<Booking[]>(`/bookings/vendor/${vendorId}`);
  }

  async getBookingById(id: number): Promise<ApiResponse<Booking>> {
    return this.request<Booking>(`/bookings/${id}`);
  }

  async updateBookingStatus(id: number, status: string): Promise<ApiResponse<Booking>> {
    return this.request<Booking>(`/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async cancelBooking(id: number, reason: string): Promise<ApiResponse<Booking>> {
    return this.request<Booking>(`/bookings/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  }

  async processAdvancePayment(bookingId: number, amount: number, paymentId: string): Promise<ApiResponse<Booking>> {
    return this.request<Booking>(`/bookings/${bookingId}/payment`, {
      method: 'POST',
      body: JSON.stringify({ amount, paymentId }),
    });
  }

  // Message APIs
  async sendMessage(message: {
    senderId: number;
    receiverId: number;
    content: string;
    messageType?: string;
    attachmentUrl?: string;
  }): Promise<ApiResponse<Message>> {
    return this.request<Message>('/messages', {
      method: 'POST',
      body: JSON.stringify(message),
    });
  }

  async getConversation(userId1: number, userId2: number): Promise<ApiResponse<Message[]>> {
    return this.request<Message[]>(`/messages/conversation/${userId1}/${userId2}`);
  }

  async getUnreadMessages(userId: number): Promise<ApiResponse<Message[]>> {
    return this.request<Message[]>(`/messages/unread/${userId}`);
  }

  async getUserMessages(userId: number): Promise<ApiResponse<Message[]>> {
    return this.request<Message[]>(`/messages/user/${userId}`);
  }

  async markMessageAsRead(messageId: number): Promise<ApiResponse<Message>> {
    return this.request<Message>(`/messages/${messageId}/read`, {
      method: 'PUT',
    });
  }

  async markConversationAsRead(userId1: number, userId2: number): Promise<ApiResponse<any>> {
    return this.request(`/messages/conversation/${userId1}/${userId2}/read`, {
      method: 'PUT',
    });
  }

  async deleteMessage(messageId: number): Promise<ApiResponse<any>> {
    return this.request(`/messages/${messageId}`, {
      method: 'DELETE',
    });
  }

  // Review APIs
  async createReview(review: {
    customerId: number;
    vendorId: number;
    rating: number;
    comment?: string;
    bookingId: number;
  }): Promise<ApiResponse<Review>> {
    return this.request<Review>('/reviews', {
      method: 'POST',
      body: JSON.stringify(review),
    });
  }

  async getReviewsByVendor(vendorId: number): Promise<ApiResponse<Review[]>> {
    return this.request<Review[]>(`/reviews/vendor/${vendorId}`);
  }

  async getReviewById(id: number): Promise<ApiResponse<Review>> {
    return this.request<Review>(`/reviews/${id}`);
  }

  async updateReview(id: number, review: { rating: number; comment?: string }): Promise<ApiResponse<Review>> {
    return this.request<Review>(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(review),
    });
  }

  async deleteReview(id: number): Promise<ApiResponse<any>> {
    return this.request(`/reviews/${id}`, {
      method: 'DELETE',
    });
  }

  async getReviewsByMinRating(minRating: number): Promise<ApiResponse<Review[]>> {
    return this.request<Review[]>(`/reviews/rating/${minRating}`);
  }

  // Admin APIs
  async getAllUsers(params?: {
    userType?: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
    isActive?: boolean;
    page?: number;
    size?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ApiResponse<{ users: User[]; totalElements: number; totalPages: number }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/admin/users?${queryParams.toString()}`);
  }

  async getUserById(id: number): Promise<ApiResponse<User>> {
    return this.request<User>(`/admin/users/${id}`);
  }

  async updateUserStatus(id: number, isActive: boolean): Promise<ApiResponse<User>> {
    return this.request<User>(`/admin/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ isActive }),
    });
  }

  async deleteUser(id: number): Promise<ApiResponse<any>> {
    return this.request(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getDashboardStats(): Promise<ApiResponse<{
    totalUsers: number;
    totalCustomers: number;
    totalVendors: number;
    activeUsers: number;
    inactiveUsers: number;
    totalBookings: number;
    pendingBookings: number;
    completedBookings: number;
    totalRevenue: number;
    monthlyRevenue: number;
    averageRating: number;
    totalMessages: number;
  }>> {
    return this.request('/admin/dashboard/stats');
  }

  async getAllBookings(params?: {
    status?: string;
    customerId?: number;
    vendorId?: number;
    page?: number;
    size?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ApiResponse<{ bookings: Booking[]; totalElements: number; totalPages: number }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/admin/bookings?${queryParams.toString()}`);
  }

  async getAllMessages(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ApiResponse<{ messages: Message[]; totalElements: number; totalPages: number }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/admin/messages?${queryParams.toString()}`);
  }

  async deleteMessage(messageId: number): Promise<ApiResponse<any>> {
    return this.request(`/admin/messages/${messageId}`, {
      method: 'DELETE',
    });
  }

  async getAnalytics(params?: {
    startDate?: string;
    endDate?: string;
    groupBy?: 'day' | 'week' | 'month';
  }): Promise<ApiResponse<{
    userRegistrations: Array<{ date: string; count: number }>;
    bookings: Array<{ date: string; count: number; revenue: number }>;
    revenue: Array<{ date: string; amount: number }>;
    topVendors: Array<{ vendor: Vendor; bookings: number; revenue: number }>;
    topCustomers: Array<{ customer: Customer; bookings: number; spent: number }>;
  }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/admin/analytics?${queryParams.toString()}`);
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;


