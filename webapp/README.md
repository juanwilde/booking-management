# Booking Management System

A modern React + Vite + Tailwind CSS application for managing property bookings, expenses, and payment reminders.

## Features

- **Authentication**: Multi-role login system (Admin, Manager, Staff)
- **Dashboard**: Overview with statistics, revenue tracking, and upcoming bookings
- **Bookings Management**: Full CRUD operations with filters and search
- **Expenses Tracking**: Manage property expenses by category
- **Payment Reminders**: Automated reminders 5 days before check-in for pending payments
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## Tech Stack

- **Frontend**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Date Utilities**: date-fns

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd booking-management
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Demo Credentials

Use these credentials to test different user roles:

- **Admin**
  - Email: `admin@example.com`
  - Password: `admin123`

- **Manager**
  - Email: `manager@example.com`
  - Password: `manager123`

- **Staff**
  - Email: `staff@example.com`
  - Password: `staff123`

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components (Button, Input, Modal, etc.)
│   ├── layout/          # Layout components (Sidebar, Navigation)
│   ├── BookingForm.jsx  # Booking creation/edit form
│   └── ExpenseForm.jsx  # Expense creation/edit form
├── context/
│   └── AuthContext.jsx  # Authentication state management
├── pages/
│   ├── Login.jsx        # Login page
│   ├── Dashboard.jsx    # Main dashboard
│   ├── Bookings.jsx     # Bookings management
│   ├── Expenses.jsx     # Expenses management
│   └── Reminders.jsx    # Payment reminders
├── services/
│   ├── api.js           # API service layer (mock)
│   └── mockData.js      # Mock data for development
└── App.jsx              # Main app with routing
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Backend Integration

The application is designed to work with a Cloudflare Workers backend using Hyperdrive for database connections. Current implementation uses mock data for development.

To integrate with your backend:

1. Update the API service layer in `src/services/api.js`
2. Replace mock data calls with actual HTTP requests to your Cloudflare Workers endpoints
3. Configure environment variables for API URLs

Example API integration:

```javascript
// In src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const bookingsAPI = {
  getAll: async (filters = {}) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters),
    });
    return response.json();
  },
  // ... other methods
};
```

## Google Calendar Integration

The reminders feature is designed to sync with Google Calendar. The backend should handle:

1. Creating calendar events for each booking
2. Setting up reminders 5 days before check-in
3. Sending email notifications for payment reminders

The UI provides the interface to view and manage these reminders.

## Features Details

### Dashboard
- Real-time statistics (revenue, expenses, bookings)
- Upcoming bookings table
- Occupancy rate tracking
- Quick stats overview

### Bookings Management
- Create, edit, view, and delete bookings
- Filter by status (confirmed, checked in, completed, cancelled)
- Filter by payment status (paid, partial, pending)
- Search by guest name or email
- Track payment information

### Expenses Management
- Track expenses by category (Maintenance, Utilities, Cleaning, Supplies)
- Monitor paid vs pending expenses
- Total expense calculations
- Vendor tracking

### Payment Reminders
- Automatic reminders 5 days before check-in
- Shows amount due and total booking value
- Mark reminders as completed when payment is charged
- Color-coded urgency (overdue, today, upcoming)

## Customization

### Adding New User Roles

Update `src/context/AuthContext.jsx`:

```javascript
const mockUsers = [
  // Add new user role
  { id: 4, email: 'owner@example.com', password: 'owner123', role: 'owner', name: 'Owner' },
];
```

### Customizing Colors

Tailwind CSS classes are used throughout. Modify colors by changing class names or extending the Tailwind configuration.

### Adding New Features

1. Create new page component in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation link in `src/components/layout/Layout.jsx`
4. Create API methods in `src/services/api.js`

## License

This project is private and proprietary.

## Support

For issues or questions, please contact the development team.
