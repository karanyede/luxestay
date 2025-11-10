# User Dashboard PRD

## Feature Overview

Personal user dashboard with booking statistics, recent bookings, booking trends chart, and quick actions.

## User Stories

### View Dashboard Overview

- **As a** logged-in user
- **I want to** see my dashboard overview
- **So that** I can quickly understand my booking status

**Acceptance Criteria:**

- Welcome message with user name
- Total bookings statistic
- Active reservations count
- Total amount spent
- Responsive card layout

### View Recent Bookings

- **As a** user
- **I want to** see my recent bookings
- **So that** I can quickly access current reservations

**Acceptance Criteria:**

- List of recent bookings (3-5 most recent)
- Hotel name and room type
- Check-in/check-out dates
- Booking status badge
- Quick action buttons

### View Booking Trends

- **As a** user
- **I want to** see my booking trends over time
- **So that** I can understand my travel patterns

**Acceptance Criteria:**

- Line/bar chart showing bookings by month
- Last 6 months data displayed
- Interactive chart with tooltips
- Responsive chart sizing

### Quick Actions

- **As a** user
- **I want to** access common actions quickly
- **So that** I can navigate efficiently

**Acceptance Criteria:**

- "Browse Hotels" button
- "View Rooms" button
- "My Bookings" button
- "My Profile" button
- Clear visual hierarchy

## Technical Requirements

- Real-time data from Supabase
- Recharts library for visualizations
- Zustand for state management
- Responsive grid layouts
- Loading states

## Files Involved

- src/pages/Dashboard/DashboardPage.js
