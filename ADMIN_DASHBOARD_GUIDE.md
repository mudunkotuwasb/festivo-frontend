# Admin Dashboard Guide

## Overview
The Festivo Admin Dashboard provides comprehensive management capabilities for monitoring and controlling the event planning platform. It includes user management, booking oversight, message monitoring, analytics, and system settings.

## Features

### 1. Dashboard Overview
- **Location**: `/admin/dashboard`
- **Features**:
  - Real-time statistics (total users, bookings, revenue, ratings)
  - User breakdown (customers vs vendors, active vs inactive)
  - Booking status overview
  - Recent user registrations
  - Revenue tracking

### 2. User Management
- **Location**: `/admin/users`
- **Features**:
  - View all users (customers and vendors)
  - Search and filter users by type, status, and other criteria
  - Activate/deactivate user accounts
  - Delete user accounts
  - View detailed user information
  - Sort users by various criteria

### 3. Booking Management
- **Location**: `/admin/bookings`
- **Features**:
  - View all bookings across the platform
  - Filter by status (pending, confirmed, completed, cancelled)
  - Search by customer, vendor, or service
  - Monitor payment status
  - Track booking dates and amounts

### 4. Message Management
- **Location**: `/admin/messages`
- **Features**:
  - Monitor all messages between users
  - Filter by message type (text, image, file, system)
  - View read/unread status
  - Delete inappropriate messages
  - View message content and details

### 5. Analytics Dashboard
- **Location**: `/admin/analytics`
- **Features**:
  - Revenue tracking and trends
  - User registration analytics
  - Booking statistics
  - Top performing vendors and customers
  - Time-based filtering (7 days, 30 days, 90 days, 1 year)

### 6. System Settings
- **Location**: `/admin/settings`
- **Features**:
  - System configuration (maintenance mode, registration)
  - Business information management
  - Feature flags (enable/disable platform features)
  - System limits configuration
  - Danger zone for critical operations

## Authentication

### Demo Credentials
- **Admin**: `admin@festivo.com` (any password)
- **Vendor**: `vendor@festivo.com` (any password)
- **Customer**: `customer@festivo.com` (any password)

### Access Control
- Admin routes are protected and require admin authentication
- Non-admin users are automatically redirected to login
- Session management with configurable timeout

## API Integration

The admin dashboard is designed to work with the following backend endpoints:

### User Management APIs
- `GET /admin/users` - Get all users with filtering
- `GET /admin/users/{id}` - Get user by ID
- `PUT /admin/users/{id}/status` - Update user status
- `DELETE /admin/users/{id}` - Delete user

### Dashboard APIs
- `GET /admin/dashboard/stats` - Get dashboard statistics
- `GET /admin/bookings` - Get all bookings
- `GET /admin/messages` - Get all messages
- `GET /admin/analytics` - Get analytics data

### Settings APIs
- `GET /admin/settings` - Get system settings
- `PUT /admin/settings` - Update system settings

## Navigation

The admin dashboard uses a consistent navigation structure:
- **Sidebar Navigation**: Fixed sidebar with main sections
- **Breadcrumbs**: Clear indication of current location
- **Responsive Design**: Mobile-friendly with collapsible sidebar

## Security Features

- **Route Protection**: All admin routes require authentication
- **Role-based Access**: Only admin users can access admin features
- **Session Management**: Automatic logout on session expiry
- **Input Validation**: All forms include proper validation

## Future Enhancements

Planned features for future releases:
- Real-time notifications
- Advanced reporting and exports
- Bulk operations for user management
- Integration with external analytics tools
- Advanced security logging and monitoring

## Technical Notes

- Built with Next.js 14 and TypeScript
- Uses Chakra UI for consistent design
- Implements client-side authentication context
- Mock data currently used (replace with actual API calls)
- Responsive design for all screen sizes
