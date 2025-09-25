# API Integration Guide - Festivo Event Planning Application

## Backend API Endpoints

### Authentication APIs
- `POST /auth/register/customer` - Register new customer
- `POST /auth/register/vendor` - Register new vendor  
- `POST /auth/logout` - Logout user

### Vendor APIs
- `GET /vendors` - Get all vendors (with filters: city, vendorType, minRating, page, size)
- `GET /vendors/{id}` - Get vendor by ID
- `GET /vendors/{id}/services` - Get vendor services
- `GET /vendors/{id}/time-slots` - Get vendor time slots (with optional date filter)
- `POST /vendors/{id}/services` - Create new service for vendor
- `POST /vendors/{id}/time-slots` - Create new time slot for vendor
- `PUT /vendors/{id}` - Update vendor information

### Booking APIs
- `POST /bookings` - Create new booking
- `GET /bookings/customer/{customerId}` - Get bookings by customer
- `GET /bookings/vendor/{vendorId}` - Get bookings by vendor
- `GET /bookings/{id}` - Get booking by ID
- `PUT /bookings/{id}/status` - Update booking status
- `PUT /bookings/{id}/cancel` - Cancel booking
- `POST /bookings/{id}/payment` - Process advance payment

### Message APIs
- `POST /messages` - Send message
- `GET /messages/conversation/{userId1}/{userId2}` - Get conversation between users
- `GET /messages/unread/{userId}` - Get unread messages for user
- `GET /messages/user/{userId}` - Get all messages for user
- `PUT /messages/{messageId}/read` - Mark message as read
- `PUT /messages/conversation/{userId1}/{userId2}/read` - Mark conversation as read
- `DELETE /messages/{messageId}` - Delete message

### Review APIs
- `POST /reviews` - Create new review
- `GET /reviews/vendor/{vendorId}` - Get reviews by vendor
- `GET /reviews/{id}` - Get review by ID
- `PUT /reviews/{id}` - Update review
- `DELETE /reviews/{id}` - Delete review
- `GET /reviews/rating/{minRating}` - Get reviews by minimum rating

## Frontend API Integration

### API Service Setup
The frontend uses a centralized API service (`src/lib/api.ts`) that provides:

1. **Type Safety**: All API responses are typed with TypeScript interfaces
2. **Error Handling**: Centralized error handling for all API calls
3. **Consistent Response Format**: All APIs return a standardized response format
4. **Environment Configuration**: API base URL can be configured via environment variables

### Usage Example

```typescript
import { apiService } from '@/lib/api';

// Get vendors with filters
const response = await apiService.getVendors({
  city: 'Colombo',
  vendorType: 'CATERING',
  minRating: 4.0,
  page: 0,
  size: 10
});

if (response.success) {
  const vendors = response.vendors;
  const totalElements = response.totalElements;
  const totalPages = response.totalPages;
}

// Create a booking
const bookingResponse = await apiService.createBooking({
  customerId: 1,
  vendorId: 2,
  serviceDate: '2024-02-15T10:00:00',
  totalAmount: 1000,
  advancePayment: 300,
  specialRequests: 'Please arrive 30 minutes early'
});
```

### Response Format
All API responses follow this format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any; // Additional fields like totalElements, totalPages, etc.
}
```

## Fixed Backend Issues

### 1. MessageService.java
**Issue**: Missing `Optional` import
**Fix**: Added `import java.util.Optional;`

### 2. VendorController.java  
**Issue**: Incomplete logic in `getAllVendors` method
**Fix**: Properly handled filtered results and pagination for different filter combinations

## Frontend Integration Status

### ✅ Completed
- API service setup with TypeScript types
- Vendor search and filtering integration
- Booking creation integration
- Error handling and fallback to mock data

### 🔄 In Progress
- Message system integration
- Review system integration
- Authentication integration
- Real-time WebSocket integration

### 📋 To Do
- Payment gateway integration
- File upload for attachments
- Push notifications
- Advanced search and filtering

## Environment Configuration

Create a `.env.local` file in the frontend root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Development vs Production

The API service includes fallback to mock data when the backend is not available, making development easier. In production, all API calls will use the real backend endpoints.

## Error Handling

The API service includes comprehensive error handling:
- Network errors
- HTTP status errors  
- Backend validation errors
- Graceful fallbacks to mock data in development

## Type Safety

All API calls are fully typed with TypeScript interfaces that match the backend entity structures, ensuring compile-time type checking and better developer experience.


