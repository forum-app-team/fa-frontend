const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  TIMEOUT: import.meta.env.VITE_API_TIMEOUT,
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/api/auth/login",
      REGISTER: "/api/auth/register",
    },
    // Add your endpoints here
    // POSTS: {
    //   LIST: "/api/posts",
    // },
    // etc...
  },
};

export { API_CONFIG };
