# LuxeStay – Hotel Reservation System

End-to-end hotel reservation platform that combines a Spring Boot backend, a modern React frontend, and Razorpay-powered payments. Guests can explore room inventory, complete reservations with secure JWT-authenticated sessions, and pay using Razorpay Checkout. The project includes booking management, automated reference generation, and robust error handling across the stack.

## Features

- Room browsing with real-time availability checks and detailed descriptions
- Multi-step booking wizard (details → payment → confirmation) with Ant Design UI
- Secure authentication and authorization using JWT tokens
- Razorpay payment integration with order creation, signature verification, and refund support
- Automated booking reference and confirmation number generation
- User reservation history with cancellation workflow
- Comprehensive error handling, logging, and validation from API to UI

## Tech Stack

- **Backend:** Java 17, Spring Boot 3, Spring Data JPA, Spring Security (JWT), H2/PostgreSQL
- **Frontend:** React 18, Ant Design, Zustand, React Router, Axios/fetch APIs
- **Payments:** Razorpay Java SDK, Razorpay Checkout.js
- **Testing & Tooling:** Maven, TestSprite automation, JUnit, ESLint/Prettier, npm

## Monorepo Structure

```
HotelReservationSystem/
├── src/                       # Spring Boot backend source
├── hotel-reservation-frontend/# React application
├── pom.xml                    # Maven configuration
├── README.md
└── scripts & docs             # Test scripts, setup guides, architecture notes
```

## Prerequisites

- Java 17 SDK and Maven 3.9+
- Node.js 18+ and npm 9+
- Razorpay account (test mode keys are sufficient for development)
- (Optional) PostgreSQL or Supabase if you want to switch from the default H2 in-memory DB

## Backend Setup

```bash
# From repository root
mvn clean install -DskipTests
mvn spring-boot:run
```

The backend starts on `http://localhost:8082` (configured in `application.properties`).

### Environment Configuration

Update `src/main/resources/application.properties` with your Razorpay credentials:

```properties
razorpay.key.id=rzp_test_xxxxxxxxxxxx
razorpay.key.secret=xxxxxxxxxxxxxxxx
```

> **Tip:** Keep test keys in development. Switch to live keys only in production and load them via environment variables or a secrets manager.

## Frontend Setup

```bash
cd hotel-reservation-frontend
npm install
npm start
```

The React app runs on `http://localhost:3000` and proxies API calls to the backend.

### Frontend Environment Variables

Create `hotel-reservation-frontend/.env` if you need to override defaults:

```env
REACT_APP_API_BASE_URL=http://localhost:8082/api
```

## Running End-to-End

1. Start the Spring Boot backend (`mvn spring-boot:run`).
2. Start the React frontend (`npm start`).
3. Register or log in to create a user session (H2 resets on each backend restart).
4. Browse rooms, enter booking details, and complete payment via Razorpay Checkout (test cards supported).

## Testing

- **Backend:** `./test_backend_comprehensive.sh` (requires bash) or `mvn test`
- **Authentication sanity check:** `./test_auth.sh`
- **Frontend:** Use `npm test` or TestSprite plans included in documentation

## Deployment Notes

- Replace H2 with PostgreSQL for persistence (JPA entities already compatible).
- Configure CORS, JWT secrets, and Razorpay keys via environment variables.
- Build React frontend (`npm run build`) and serve via CDN, static host, or integrate with Spring Boot.

## Version Control & GitHub

Before pushing:

```bash
git status
git add .
git commit -m "Describe your change"
git push origin main
```

Target repository: `https://github.com/karanyede/luxestay.git`

## Additional Documentation

- `ARCHITECTURE_GUIDE.md` – High-level system design
- `PAYMENT_INTEGRATION_GUIDE.md` – Razorpay integration steps
- `PAYMENT_SETUP_COMPLETE.md` – Summary of payment features
- `SETUP_GUIDE.md` – Legacy Supabase setup instructions

Feel free to extend the platform with admin dashboards, email notifications, or analytics. Contributions and issues are welcome!
