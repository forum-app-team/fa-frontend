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


## 🔐 Authentication

Our app uses **JWT-based authentication** with short-lived access tokens (stored in Redux) and a long-lived refresh token (HttpOnly cookie).

### Token Refresh

* **Reactive refresh (interceptor)**

  * Every API request attaches the current access token.
  * On `401 Unauthorized`:

    1. Requests are paused.
    2. A single refresh call (`/api/auth/refresh`) is made with the refresh cookie.
    3. Redux is updated with the new access token.
    4. Paused requests are retried with the new token.
  * If refresh fails, the user is logged out.

  ```mermaid
  sequenceDiagram
    participant C as Component
    participant A as Axios Client
    participant S as Server

    C->>A: Send request with access token
    A->>S: API call (Authorization: Bearer <token>)
    S-->>A: 401 Unauthorized (token expired)

    A->>S: POST /auth/refresh (with refresh cookie)
    S-->>A: 200 OK (new access token)

    A->>C: Update Redux store with new token
    A->>S: Retry original request with new token
    S-->>A: 200 OK (data)
    A-->>C: Response delivered
  ```

* **App-level silent refresh (on reload)**

  * On initial page load, a one-time `useEffect` calls `/api/auth/refresh`.
  * If valid, Redux is hydrated with a new access token before any user interaction.
  * If invalid, the user stays logged out.

### Redux Auth State

* **`state.auth.user`** -> stores user info:

  ```js
  {
    id: string,
    email: string,
    role: "normal" | "admin" | "super",
    emailVerified: boolean
  }
  ```

* **Access token retrieval (compatibility only)**

  * `tokenService.get()` from `@/libs/tokenService`
  * `localStorage.get("token")` (legacy fallback)

⚠️ In practice, do **not** fetch the token directly. All API calls should use the shared Axios client (`apiClient` from `@/libs/axios`), which automatically attaches and refreshes tokens.
