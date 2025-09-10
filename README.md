# Forum Frontend (React + Vite)

This is the frontend for the Forum application.  
It is built with **React (Vite)** and follows the **Bulletproof-React architecture** for scalability and clarity.

---

## Project Structure

```
src/
    app/ # Entry point for the application logic
    assets/ # Images, fonts, icons
    components/ # Reusable UI components (Button, Modal, Table)
    config/ # Global constants and settings (roles, routes, env)
    features/ # Domain-specific code (posts, users, messages, etc.)
    hooks/ # Cross-feature reusable hooks (usePagination)
    libs/ # Utilities (axios client, date helpers, storage)
    providers/ # Global context providers (AuthProvider, ThemeProvider)
    stores/ # Global state (only if cross-feature)
    testing/ # Test setup
```

### Feature structure

```
features/<domain>/
    api/         # API calls with axios
    components/  # UI components tied to this domain
    hooks/       # Domain-specific hooks
    model/       # Constants, mappers, shape docs
    pages/       # Routed pages for this feature
    index.js     # Public exports
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
