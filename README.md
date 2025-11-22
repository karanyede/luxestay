# LuxeStay – Hotel Reservation System

A modern, full-stack hotel reservation platform built as a personal project. Features real-time room availability, secure authentication, and payment integration with a professional UI.

## 🚀 Features

-   **Room Browsing & Search**: Real-time availability with advanced filtering by dates, guests, price, and amenities
-   **Booking Management**: Complete reservation workflow from search to confirmation
-   **User Dashboard**: Manage bookings, view history, and handle cancellations
-   **Secure Authentication**: JWT-based auth with role-based access control
-   **Payment Integration**: Razorpay payment processing with refund support
-   **Responsive Design**: Optimized for mobile, tablet, and desktop with dark/light theme
-   **Admin Features**: Hotel and room management panel

## 🛠 Tech Stack

### Backend
-   **Framework**: Spring Boot 3.2.5
-   **Language**: Java 17
-   **Database**: PostgreSQL (Production), H2 (Development)
-   **Security**: Spring Security with JWT
-   **Payment**: Razorpay Java SDK
-   **Build Tool**: Maven 3.9+

### Frontend
-   **Framework**: React 18
-   **UI Library**: Ant Design
-   **State Management**: Zustand
-   **Styling**: Styled Components
-   **Animations**: Framer Motion
-   **HTTP Client**: Axios
-   **Routing**: React Router Dom
-   **Build Tool**: Create React App

### DevOps & Deployment
-   **Containerization**: Docker
-   **Deployment**: Render (Backend), Vercel (Frontend)

## 📂 Project Structure

```
HotelReservationSystem/
├── src/                          # Spring Boot Backend
│   ├── main/java/com/hotel/
│   │   └── reservation/
│   │       ├── controller/       # REST API Controllers
│   │       ├── service/          # Business Logic
│   │       ├── repository/       # Data Access Layer
│   │       ├── model/            # Entity Models
│   │       ├── config/           # Security & CORS Config
│   │       └── security/         # JWT Implementation
│   └── main/resources/
│       └── application.properties # Configuration
├── hotel-reservation-frontend/   # React Frontend
│   ├── src/
│   │   ├── components/           # Reusable UI Components
│   │   ├── pages/                # Application Pages
│   │   ├── store/                # State Management
│   │   └── lib/                  # API & Utilities
│   └── public/
├── Dockerfile                    # Backend Container
├── pom.xml                       # Maven Dependencies
└── test_backend_comprehensive.sh # Backend Test Script
```

## 🚀 Getting Started

### Prerequisites
-   Java 17 SDK
-   Maven 3.9+
-   Node.js 18+
-   npm 9+

### Backend Setup

1. **Navigate to project root**
```bash
cd HotelReservationSystem
```

2. **Configure Razorpay** (Optional for payment testing)
   
   Update `src/main/resources/application.properties`:
```properties
razorpay.key.id=your_key_id
razorpay.key.secret=your_key_secret
```

3. **Run the backend**
```bash
mvn clean install -DskipTests
mvn spring-boot:run
```

Server starts on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd hotel-reservation-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm start
```

App opens at `http://localhost:3000`

## 📊 Database Schema

The application uses a relational database with the following core tables:

-   **users** - User profiles and authentication
-   **hotels** - Hotel information and amenities
-   **rooms** - Room inventory and pricing
-   **reservations** - Booking records and status
-   **payments** - Payment transactions

## 🌍 Deployment

-   **Backend**: Deployed on Render (Free tier)
-   **Frontend**: Deployed on Vercel
-   **Database**: PostgreSQL (Supabase/Render Postgres)

The project uses Docker for backend containerization and environment variables for configuration management.

## 📝 API Endpoints

### Authentication
-   `POST /api/auth/register` - User registration
-   `POST /api/auth/login` - User login
-   `POST /api/auth/check-email` - Email availability

### Hotels & Rooms
-   `GET /api/hotels` - List all hotels
-   `GET /api/rooms` - List all rooms
-   `GET /api/rooms/available` - Search available rooms

### Reservations
-   `POST /api/reservations` - Create booking
-   `GET /api/reservations/user/{userId}` - User bookings
-   `POST /api/reservations/{id}/cancel` - Cancel booking


## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 👨‍💻 Author

**Karan Yede**

-   GitHub: [@karanyede](https://github.com/karanyede)
-   Repository: [luxestay](https://github.com/karanyede/luxestay)

## 🙏 Acknowledgments

Built with modern technologies and best practices:
-   Spring Boot for robust backend architecture
-   React and Ant Design for beautiful UI
-   Razorpay for secure payment processing
