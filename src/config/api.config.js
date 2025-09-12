const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  TIMEOUT: import.meta.env.VITE_API_TIMEOUT,
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/api/auth/login",
      REGISTER: "/api/auth/register",
      LOGOUT: "/api/auth/logout",
      REFRESH: "/api/auth/refresh",
      UPDATE_IDENTITY: "/api/auth/identity",
    },
    // Add your endpoints here
    // POSTS: {
    //   LIST: "/api/posts",
    // },
    // etc...
  },
};

export { API_CONFIG };
