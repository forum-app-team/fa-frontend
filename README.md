# Forum Frontend (React + Vite)

This is the frontend for the Forum application.  
It is built with **React (Vite)** and follows the <a href="https://github.com/alan2207/bulletproof-react" target="_blank" rel="noopener noreferrer">**Bulletproof-React architecture**</a> for scalability and clarity.

---

## Pages and Routes

### Public Routes

```
| Route                 | Description                           |
| --------------------- | ------------------------------------- |
| /users/login	        | User login page                       |
| /users/register       |    User registration page             |
| /contactus	        | Contact admin page                    |
```

### Protected Routes (Requires Authentication)

```
| Route                 | Description                           |
| --------------------- | ------------------------------------- |
| /home 	            | User home page                        |
| /users/:id/profile    | User profile page                     |
| /posts/:id	        | Post detail page                      |
```

### Admin Routes (Requires Admin Role)

```
| Route                 | Description                           |
| --------------------- | ------------------------------------- |
| /home 	            | Admin home page                       |
| /messages 	        | Message management page               |
| /users	            | User management page                  |
```

---

## Project Structure

```
src/
├── app/        # Application core setup
│   ├── config/
│   │   └── paths.js            # Route path constants
│   └── routes/
│       ├── HomeRoute.jsx       # Home page routing
│       ├── index.jsx           # Main router setup
│       └── ProtectedRoute.jsx  # Auth protection wrapper
├── assets/     # Images, fonts, icons
├── components/ # Shared components (Button, Modal, Table)
│   ├── GlobalLayout.jsx    # Main layout wrapper
│   ├── NavigationBar.jsx   # Global navigation
│   └── NotFound.jsx        # 404 page
├── config/     # Global constants and settings (roles, routes, env)
│   ├── .env                # Environment variables
│   └── api.config.js       # API settings
├── features/   # Domain-specific code (posts, users, messages, etc.)
│   ├── auth/
│   │   ├── api/
│   │   │   └── auth.api.js    # Auth API calls
│   │   ├── hooks/
│   │   │   └── useAuth.js     # Auth custom hook
│   │   └── pages/
│   │       ├── Login.jsx      # Login page
│   │       └── Register.jsx   # Registration page
├── hooks/      # Cross-feature reusable hooks (usePagination)
├── libs/       # Utilities (axios client, date helpers, storage)
│   └── axios.js       # Axios instance config
├── providers/  # Global context providers (AuthProvider, ThemeProvider)
│   └── AuthProvider.jsx # Authentication context
├── stores/     # Global state (only if cross-feature)
└── App.jsx     # Root component
```

### Feature structure

```
features/<domain>/
├── api/         # API calls with axios
├── components/  # UI components tied to this domain
├── hooks/       # Domain-specific hooks
├── model/       # Constants, mappers, shape docs
└── pages/       # Routed pages for this feature
```

---

## Getting Started

### Prerequisites

- Node.js (>= 18)
- npm

### Installation

```bash
git clone https://github.com/forum-app-team/fa-frontend.git
cd fa-frontend
npm install
```

### Running the app

```bash
npm run dev
```

## Environment Setup

1. Copy .env.example to .env
2. Configure environment variables:
   - VITE_API_BASE_URL
   - VITE_API_TIMEOUT
   - VITE_SKIP_AUTH (development only)

## Development Testing

For quick endpoint testing, you can bypass authentication:

1. Set `VITE_SKIP_AUTH=true` in `.env`
2. This will:
   - Skip token checks in API calls
   - Bypass protected route restrictions
   - Allow direct access to all endpoints

⚠️ **WARNING**: Never enable this in production!
