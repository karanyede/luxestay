# LuxeStay - Hotel Reservation System

A modern, responsive hotel reservation system built with React and Supabase, featuring a professional UI with dark/light theme support and real-time functionality.

## 🚀 Features

### ✨ Core Features

- **Modern UI/UX**: Professional interface with Ant Design components
- **Responsive Design**: Optimized for both mobile and desktop devices
- **Dark/Light Theme**: Seamless theme switching with consistent colors
- **Authentication**: Secure user registration and login with Supabase Auth
- **Real-time Updates**: Live booking updates using Supabase real-time subscriptions
- **Interactive Animations**: Smooth transitions with Framer Motion

### 🏨 Hotel Management

- **Room Browsing**: Browse available rooms with detailed information
- **Advanced Search**: Filter rooms by dates, price, and amenities
- **Booking System**: Complete reservation workflow with payment integration
- **User Dashboard**: Manage bookings, view history, and account settings
- **Admin Panel**: Hotel and room management for administrators

### 🛠 Technical Features

- **Supabase Integration**: PostgreSQL database with Row Level Security
- **State Management**: Zustand for efficient global state handling
- **Styled Components**: CSS-in-JS for component styling
- **Form Validation**: Robust form handling with validation
- **Error Handling**: Comprehensive error boundaries and user feedback

## 📱 Responsive Design

The application is fully responsive and provides an optimal experience across all devices:

- **Mobile**: Touch-friendly interface with collapsible navigation
- **Tablet**: Optimized layout for medium screens
- **Desktop**: Full-featured interface with sidebar navigation
- **Consistent Theming**: Unified color scheme across all breakpoints

## 🎨 Theme System

### Light Theme

- Primary: #1890ff (Professional Blue)
- Background: #f5f5f5 (Light Gray)
- Surface: #ffffff (White)
- Text: #262626 (Dark Gray)

### Dark Theme

- Primary: #1890ff (Consistent Blue)
- Background: #141414 (Dark Background)
- Surface: #1f1f1f (Dark Surface)
- Text: #ffffff (White)

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd hotel-reservation-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**

   - Create a new Supabase project
   - Run the SQL schema from `schema.sql` in your Supabase SQL editor
   - Enable Row Level Security on all tables

5. **Start the development server**

   ```bash
   npm start
   ```

   The application will open at [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Layout/          # Layout components (MainLayout, AuthLayout)
│   └── ...              # Other shared components
├── pages/               # Application pages
│   ├── Auth/           # Authentication pages
│   ├── Dashboard/      # User dashboard
│   ├── Booking/        # Booking related pages
│   └── ...             # Other pages
├── store/              # Zustand state management
├── lib/                # Utility libraries and configurations
│   └── supabase.js     # Supabase client and helpers
├── styles/             # Global styles and theme
└── utils/              # Helper functions
```

## 🛠 Available Scripts

### Development

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

### Production

- `npm run build` - Creates optimized production build
- `npm run serve` - Serves the production build locally

## 🔧 Technologies Used

### Frontend

- **React 18** - Modern React with hooks and concurrent features
- **Ant Design** - Professional UI component library
- **Styled Components** - CSS-in-JS styling solution
- **Framer Motion** - Animation library for smooth interactions
- **React Router** - Client-side routing with protected routes
- **Zustand** - Lightweight state management
- **Day.js** - Date manipulation library

### Backend & Services

- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Supabase Auth** - Authentication and user management
- **Supabase Storage** - File storage for images
- **Row Level Security** - Database security policies

### Development Tools

- **Create React App** - React application boilerplate
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting

## 📊 Database Schema

The application uses a comprehensive PostgreSQL schema with the following main tables:

- **hotels** - Hotel information and metadata
- **rooms** - Room details, pricing, and availability
- **users** - User profiles and preferences
- **reservations** - Booking information and status
- **payments** - Payment records and transactions
- **reviews** - User reviews and ratings

## 🔐 Authentication Flow

1. **Registration**: Users create accounts with email verification
2. **Login**: Secure authentication with Supabase Auth
3. **Protected Routes**: Route guards for authenticated pages
4. **Role-based Access**: Different permissions for users and admins
5. **Session Management**: Automatic token refresh and logout

## 📱 Mobile Responsiveness

### Breakpoints

- **xs**: < 576px (Mobile)
- **sm**: ≥ 576px (Small tablets)
- **md**: ≥ 768px (Tablets)
- **lg**: ≥ 992px (Small desktops)
- **xl**: ≥ 1200px (Large desktops)

### Mobile Features

- Collapsible navigation drawer
- Touch-optimized form inputs
- Responsive grid layouts
- Optimized image loading
- Gesture-friendly interactions

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

### Netlify

1. Build the project: `npm run build`
2. Deploy the `build` folder to Netlify
3. Configure environment variables

### Manual Deployment

1. Run `npm run build`
2. Upload the `build` folder to your hosting provider
3. Configure environment variables on your server

## 🐛 Troubleshooting

### Common Issues

- **Build Errors**: Ensure all dependencies are installed with `npm install`
- **Supabase Connection**: Verify environment variables are correctly set
- **Authentication Issues**: Check Supabase Auth settings and redirect URLs
- **Styling Issues**: Clear browser cache and restart development server

### Getting Help

- Check the browser console for error messages
- Review Supabase logs for backend issues
- Ensure all environment variables are properly configured
- Verify database schema is correctly applied

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Ant Design](https://ant.design/) for the beautiful UI components
- [Supabase](https://supabase.com/) for the powerful backend services
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [React](https://reactjs.org/) for the amazing frontend framework
