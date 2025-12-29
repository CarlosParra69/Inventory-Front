# Inventory Management System Shopping Online - Frontend

## Project Overview

This is a frontend application for an online inventory management system. It provides a user-friendly interface for managing products, categories, inventory stock levels, movements, audits, and user authentication.

The application is built with React, TypeScript, Vite, and Tailwind CSS, following component-based architecture with modern development practices and responsive design.

## System Features

- User Authentication: Registration and login with JWT-based authentication
- Session Management: Automatic session timeout with idle detection
- Category Management: Create, read, update, and delete product categories
- Product Management: Manage products with prices, SKU codes, and categories
- Inventory Management: View and manage product stock levels
- Movement Tracking: View history of inventory entries and exits
- Audit Logging: Track all user actions and system changes
- Responsive Design: Works seamlessly on desktop, tablet, and mobile devices
- Real-time Updates: Instant feedback on all operations
- Error Handling: User-friendly error messages and notifications

## Project Structure

```
src/
├── App.tsx                # Main application component
├── main.tsx               # React entry point
├── api/                   # API services and HTTP client
│   ├── client.ts          # Axios configuration and interceptors
│   ├── auth.service.ts    # Authentication service
│   ├── categories.service.ts
│   ├── products.service.ts
│   ├── inventory.service.ts
│   ├── movements.service.ts
│   ├── audits.service.ts
│   └── index.ts           # Service exports
├── components/            # Reusable components
│   ├── common/            # Common UI components
│   │   ├── Button/        # Button component with variants
│   │   ├── Card/          # Card component for content display
│   │   ├── Input/         # Input component for forms
│   │   ├── Modal/         # Modal base component
│   │   ├── Loading/       # Loading spinner component
│   │   └── Modals/        # Specialized modal components
│   │       ├── auth/      # Authentication modals
│   │       ├── categories/
│   │       ├── products/
│   │       └── inventory/
│   └── layout/            # Layout components
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       ├── Layout.tsx
│       └── styles/
├── pages/                 # Page components
│   ├── Dashboard.tsx
│   ├── auth/              # Login and register pages
│   ├── categories/
│   ├── products/
│   ├── inventory/
│   ├── movements/
│   ├── audits/
│   └── info-me/
├── contexts/              # React context for global state
│   └── AuthContext.tsx    # Authentication context
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts         # Authentication hook
│   └── useIdleTimeout.ts  # Session timeout hook
├── routes/                # Route configuration
│   └── index.tsx
├── services/              # Utility services
│   └── token.service.ts   # Token management
├── styles/                # Global styles
│   ├── globals.css
│   └── shared.css
├── types/                 # TypeScript interfaces
│   ├── api.types.ts
│   ├── auth.types.ts
│   ├── category.types.ts
│   ├── inventory.types.ts
│   ├── product.types.ts
│   └── index.ts
└── utils/                 # Utility functions
    ├── constants.ts
    ├── helpers.ts
    └── validators.ts
```

## Prerequisites

Before running this project, ensure you have the following installed on your system:

- Node.js (v16 or higher)
- npm (Node Package Manager)
- A backend API server running on localhost:5000 (or configured URL)
- Modern web browser with ES6 support

## Installation Guide

### Step 1: Clone or Download the Project

Clone the repository or download the project files to your local machine:

```bash
git clone <https://github.com/CarlosParra69/Inventory-Front.git>
cd Inventory-Front
```

### Step 2: Install Dependencies

Install all required npm packages:

```bash
npm install
```

This will install the following dependencies:
- react: JavaScript library for building user interfaces
- react-dom: React package for working with the DOM
- react-router-dom: Client-side routing
- axios: HTTP client for API requests
- react-icons: Icon library
- sweetalert2: Beautiful alerts and notifications
- tailwindcss: Utility-first CSS framework
- vite: Fast build tool and dev server

### Step 3: Set Up Environment Variables

Create a .env file in the root directory of the project with the following variables:

```
VITE_API_BASE_URL=http://localhost:5000
VITE_API_TIMEOUT=10000
VITE_IDLE_TIMEOUT=900000
VITE_IDLE_WARNING=120000
```

Explanation of variables:
- VITE_API_BASE_URL: Base URL of the backend API server
- VITE_API_TIMEOUT: HTTP request timeout in milliseconds (default: 10000ms)
- VITE_IDLE_TIMEOUT: Session timeout after inactivity in milliseconds (default: 900000ms = 15 minutes)
- VITE_IDLE_WARNING: Warning before session timeout in milliseconds (default: 120000ms = 2 minutes)

### Step 4: Configure Backend URL

Ensure the API_BASE_URL in .env matches your backend server URL. By default, it should be:

```
VITE_API_BASE_URL=http://localhost:5000
```

If your backend is running on a different host or port, update this URL accordingly.

### Step 5: Verify Backend Connection

Before starting the frontend, ensure your backend server is running. Test the connection by:

1. Starting the backend server
2. Testing an API endpoint in your browser or API client (e.g., Postman)
3. Confirming you can reach http://localhost:5000/api-docs

## Running the Project

### Development Mode

To start the development server with hot module replacement:

```bash
npm run dev
```

Output:
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

The application will be available at http://localhost:5173/

### Build for Production

To create an optimized production build:

```bash
npm run build
```

This generates a dist/ folder with optimized and minified files ready for deployment.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

### Lint Code

To check code quality and style:

```bash
npm run lint
```

## Application Structure

### Pages Overview

- Dashboard: Main overview page showing inventory summary and recent activity
- Login: User authentication page
- Register: New user registration page
- Products: Product list, creation, editing, and deletion
- Categories: Category management
- Inventory: Stock levels and inventory operations
- Movements: History of inventory movements
- Audits: System audit logs
- Profile: User information page

### Component Hierarchy

Common Components:
- Button: Reusable button with variants (primary, secondary, danger)
- Card: Container for content display
- Input: Form input field with validation
- Modal: Dialog component for forms and confirmations
- Loading: Loading spinner indicator

Specialized Modals:
- LogoutModal: Confirm session termination
- CategoryFormModal: Create and edit categories
- DeleteCategoryModal: Confirm category deletion
- ProductFormModal: Create and edit products
- DeleteProductModal: Confirm product deletion
- StockEntryModal: Add inventory to product
- StockExitModal: Remove inventory from product

Layout Components:
- Header: Top navigation bar with user menu
- Sidebar: Left navigation menu with links to sections
- Layout: Main layout wrapper combining header and sidebar

### Services and API Integration

Services:
- auth.service.ts: User registration, login, logout, token refresh
- categories.service.ts: CRUD operations for categories
- products.service.ts: CRUD operations for products
- inventory.service.ts: Stock management and queries
- movements.service.ts: Movement history queries
- audits.service.ts: Audit log queries
- token.service.ts: Token storage and retrieval

HTTP Client (client.ts):
- Centralizes API configuration
- Manages authentication headers
- Handles token refresh automatically
- Configures timeout and error handling

### Context and State Management

AuthContext:
- Stores authenticated user information
- Manages access and refresh tokens
- Provides login, logout, and token refresh methods
- Persists session in localStorage and sessionStorage

useAuth Hook:
- Easy access to authentication context
- Handles loading and error states
- Provides authentication state management

useIdleTimeout Hook:
- Detects user inactivity
- Shows warning before session timeout
- Automatically logs out after timeout period
- Reinitializes timer on user activity

## Environment Configuration

Key environment variables:

- VITE_API_BASE_URL: Backend API URL (required)
- VITE_API_TIMEOUT: Request timeout in milliseconds
- VITE_IDLE_TIMEOUT: Session idle timeout in milliseconds
- VITE_IDLE_WARNING: Warning time before timeout in milliseconds

Note: Variables prefixed with VITE_ are automatically exposed to client-side code by Vite.

## Available Routes

- / - Dashboard (protected)
- /login - Login page (public)
- /register - Register page (public)
- /products - Products management (protected)
- /categories - Categories management (protected)
- /inventory - Inventory management (protected)
- /movements - Movements history (protected)
- /audits - Audit logs (protected)
- /profile - User profile (protected)
- /404 - Not found page

Routes prefixed as protected require user authentication. Unauthenticated users are redirected to login.

## Authentication Flow

1. User enters credentials on login page
2. Frontend sends credentials to /auth/login endpoint
3. Backend returns access token and refresh token
4. Access token is stored in sessionStorage (volatile)
5. Refresh token is stored in localStorage (persistent)
6. Auth context is updated with user information
7. User is redirected to dashboard

## Token Management

Token Storage:
- Access Token: sessionStorage (expires in 15 minutes)
- Refresh Token: localStorage (expires in 7 days)

Token Refresh:
- When access token expires, refresh token is used to obtain new access token
- Refresh happens automatically via axios interceptor
- Failed refresh redirects user to login

Token Cleanup:
- On logout, both tokens are removed from storage
- Auth context is cleared
- User is redirected to login page

## Session Timeout

Idle Detection:
- Monitors user keyboard, mouse, and touch events
- Resets timer on any activity
- Configurable timeout period (default: 15 minutes)

Warning and Logout:
- Shows warning modal 2 minutes before timeout
- Allows user to stay logged in by clicking "Stay Logged In"
- Automatically logs out if no response to warning
- Clears all sensitive data on logout

## Project Scripts

- npm run dev - Start development server with hot reload
- npm run build - Build production optimized files
- npm run lint - Lint code with ESLint
- npm run preview - Preview production build

## Technologies Used

- React 19: UI library for building user interfaces
- TypeScript: Static typing for JavaScript
- Vite: Fast build tool and dev server
- React Router: Client-side routing
- Axios: HTTP client for API requests
- Tailwind CSS: Utility-first CSS framework
- React Icons: Icon library
- SweetAlert2: Beautiful notifications and alerts
- ESLint: Code quality and style checking
- Prettier: Code formatter

## Error Handling

The frontend implements comprehensive error handling:

- Network errors: Display connection error messages
- Authentication errors: Redirect to login on 401
- Authorization errors: Show access denied messages
- Validation errors: Display field-specific error messages
- Server errors: Show user-friendly error notifications

All errors are displayed using SweetAlert2 for better user experience.

## API Integration

Backend Connection:
- Base URL configured in .env file
- All requests go through axios instance in client.ts
- Automatic token injection in request headers
- Automatic token refresh on 401 response

Request Headers:
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

Error Responses:
- HTTP status codes are handled appropriately
- Error messages from backend are displayed to user
- Failed operations don't affect application state

## Performance Considerations

- Code splitting: Each page is lazy-loaded
- Vite provides fast development experience with HMR
- Production build is optimized and minified
- Tailwind CSS is purged to include only used styles
- Images and assets are optimized

## Security Considerations

- JWT tokens are used for stateless authentication
- Access tokens stored in sessionStorage (not httpOnly for security trade-off)
- Refresh tokens stored in localStorage with expiration
- CORS is configured to allow requests from authorized origins
- Password validation is enforced on registration
- Session timeout prevents unauthorized access
- API routes are protected by authentication middleware

## Responsive Design

The application is fully responsive:
- Mobile-first approach with Tailwind CSS
- Breakpoints for small, medium, and large screens
- Sidebar collapses on mobile devices
- Touch-friendly button sizes and spacing
- Optimized layouts for all device sizes

## Troubleshooting

### Frontend Cannot Connect to Backend

1. Verify backend server is running on correct port
2. Check VITE_API_BASE_URL in .env file
3. Ensure backend CORS is properly configured
4. Check browser console for error messages
5. Test API directly in browser: http://localhost:5000/api-docs

### Build Fails with TypeScript Errors

1. Run npm install to ensure all dependencies are installed
2. Check tsconfig.json is properly configured
3. Review error messages for type mismatches
4. Ensure all imports use correct file extensions

### Development Server Not Starting

1. Check port 5173 is not already in use
2. Clear node_modules and reinstall: rm -rf node_modules && npm install
3. Clear Vite cache: rm -rf .vite
4. Check Node.js version is v16 or higher

### Session Timeout Not Working

1. Verify VITE_IDLE_TIMEOUT is set correctly in .env
2. Check useIdleTimeout hook is properly initialized
3. Ensure browser allows event listeners (no console errors)
4. Test with different timeout values

### Tokens Not Persisting

1. Check browser storage is enabled
2. Verify localStorage and sessionStorage are accessible
3. Check for browser privacy mode restrictions
4. Review token.service.ts for storage logic

## Development Best Practices

- Keep components small and focused
- Use TypeScript for type safety
- Implement proper error boundaries
- Use React hooks for state management
- Follow component naming conventions
- Document complex logic with comments
- Use environment variables for configuration
- Test API integration before deployment

## Deployment

To deploy the frontend:

1. Build the project: npm run build
2. Upload dist/ folder to hosting service
3. Configure environment variables on hosting platform
4. Update API_BASE_URL to production backend URL
5. Test all features in production environment

Common hosting platforms:
- Vercel
- Netlify
- GitHub Pages
- AWS S3
- DigitalOcean
- Heroku

## Support and Documentation

For more information:
- Review the Prompts.md file for detailed construction steps
- Check backend README.md for API documentation
- Access backend Swagger docs at /api-docs endpoint
- Review code comments in components and services

## License

This project is provided as-is for educational and commercial use.

## Version

Version 1.0.0 - Initial release
