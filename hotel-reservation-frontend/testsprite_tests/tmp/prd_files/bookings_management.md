# User Bookings Management PRD

## Feature Overview

View and manage user reservations with status tracking (upcoming, current, past, cancelled), booking details, and cancellation functionality.

## User Stories

### View All Bookings

- **As a** user
- **I want to** view all my bookings
- **So that** I can track my reservations

**Acceptance Criteria:**

- List of all user bookings displayed
- Bookings grouped by status (upcoming, current, past, cancelled)
- Booking cards show key information
- Search/filter functionality
- Responsive design for mobile

### View Booking Details

- **As a** user
- **I want to** view detailed booking information
- **So that** I can see all reservation details

**Acceptance Criteria:**

- Booking reference number
- Hotel and room details
- Check-in/check-out dates
- Guest count
- Total amount paid
- Special requests

### Cancel Booking

- **As a** user
- **I want to** cancel my reservation
- **So that** I can change my travel plans

**Acceptance Criteria:**

- Cancel button available for eligible bookings
- Confirmation dialog before cancellation
- Cancellation policy displayed
- Booking status updated immediately
- Cancellation confirmation shown

### Filter Bookings

- **As a** user
- **I want to** filter my bookings by status
- **So that** I can easily find specific reservations

**Acceptance Criteria:**

- Tab navigation for status filters
- Upcoming bookings highlighted
- Past bookings archived view
- Cancelled bookings separate tab

## Technical Requirements

- Integration with Supabase reservations table
- Real-time booking updates
- Status transition logic
- Cancellation business rules
- Responsive card layouts

## Files Involved

- src/pages/Booking/UserBookingsPage.js
