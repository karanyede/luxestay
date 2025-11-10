# Hotel Reservation System - Complete Implementation

## Project Overview

A full-stack hotel reservation system built with React frontend and Java Spring Boot backend, integrated with Supabase for database and authentication.

## Features Implemented

### ✅ Authentication System

- User registration and login with Supabase Auth
- Google OAuth integration
- Protected routes and user sessions
- Password reset functionality

### ✅ Advanced Booking System

- **Real-time room availability checking**
- **Dynamic pricing calculation** (weekend rates, holidays, peak seasons)
- **Comprehensive search filters** (dates, guests, room types)
- **Interactive booking workflow** with detailed forms
- **Booking confirmation and reference generation**

### ✅ User Booking Management

- **View all user bookings** with status tracking
- **Filter bookings** by status (upcoming, current, past, cancelled)
- **Detailed booking information** with hotel and room details
- **Booking cancellation** with business rules (24-hour policy)
- **Booking statistics** and spending tracking

### ✅ Responsive Design

- **Mobile-first approach** with responsive layouts
- **Optimized login page** - fits in single viewport without scrolling
- **Adaptive components** for different screen sizes
- **Touch-friendly interface** for mobile devices

### ✅ Database Integration

- **Supabase integration** with real-time capabilities
- **Comprehensive booking service** with availability checking
- **Database schema** for hotels, rooms, reservations, and payments
- **Real-time updates** for booking status changes

## Tech Stack

### Frontend

- **React 18** - Modern hooks-based components
- **Ant Design** - Professional UI component library
- **Styled Components** - CSS-in-JS with theming
- **Framer Motion** - Smooth animations and transitions
- **Zustand** - State management
- **Day.js** - Date manipulation and formatting
- **React Router** - Client-side routing

### Backend Integration

- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - File storage
  - Row-level security

### Development Tools

- **ESLint** - Code linting
- **Create React App** - Build tooling
- **VS Code** - Development environment

## Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the frontend root:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Install Dependencies

```bash
cd hotel-reservation-frontend
npm install
```

### 3. Start Development Server

```bash
npm start
```

## Key Features

### Advanced Booking System (`/booking/advanced`)

- Real-time room availability checking
- Dynamic pricing with weekend/holiday rates
- Comprehensive search and filtering
- Interactive booking workflow

### User Bookings Management (`/my-bookings`)

- View all reservations with status tracking
- Filter by upcoming, current, past, cancelled
- Detailed booking information
- Cancellation with business rules

### Responsive Login (`/login`)

- Fixed mobile responsiveness issues
- Single viewport display without scrolling
- Optimized for all screen sizes

## Architecture

- **Component-based** React architecture
- **Supabase integration** for backend services
- **Real-time updates** for booking status
- **Responsive design** with mobile-first approach
- **State management** with Zustand
- **Authentication** with protected routes

## Usage

1. **Login/Register** - Access the system with authentication
2. **Browse Rooms** - Search available rooms with filters
3. **Make Booking** - Complete reservation with dynamic pricing
4. **Manage Bookings** - View and manage your reservations

## Recent Updates

### Login Page Responsiveness ✅

- **Fixed height/scrolling issues** on mobile devices
- **Optimized AuthLayout.js** with responsive design patterns
- **Conditional content display** for better mobile experience
- **Mobile-first approach** with proper viewport constraints

### Advanced Booking System Implementation ✅

- **Complete booking workflow** with real-time availability
- **Dynamic pricing engine** with multiple rate factors
- **Comprehensive room search** with filters and sorting
- **Booking confirmation** with reference generation
- **User booking management** with status tracking

## Database Schema

```sql
-- Core tables for the booking system
hotels (id, name, address, phone, email, rating, amenities)
rooms (id, hotel_id, room_number, category, capacity, base_price, amenities)
reservations (id, booking_reference, user_id, room_id, dates, amount, status)
payments (id, reservation_id, amount, status, payment_method)
```

## API Integration

The system integrates with Supabase for:

- **Authentication** - User management and sessions
- **Database** - PostgreSQL with real-time capabilities
- **Storage** - File uploads for room images
- **Real-time** - Live updates for booking status

## Future Enhancements

- Payment integration (Stripe/PayPal)
- Email notifications
- Admin dashboard
- Reviews and ratings
- Multi-language support

## Support

For setup or usage questions, check the console for error messages and ensure Supabase configuration is correct.
