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
      EMAIL_VERIFICATION_SEND: "/api/auth/verify-email/send",
      EMAIL_VERIFICATION_VERIFY: "/api/auth/verify-email/verify",
    },
    ADMIN: {
      USERS: "/api/auth/admin/users",
    },
    POSTS: {
      LIST: "/api/posts", // GET
      DETAIL: (id) => `/api/posts/${id}`, // GET
      CREATE: "/api/posts", // POST
      UPDATE: (id) => `/api/posts/${id}`, // PUT
      DELETE: (id) => `/api/posts/${id}`, // DELETE

      PUBLISH: (id) => `/api/posts/${id}/publish`, // PUT
      ARCHIVE: (id) => `/api/posts/${id}/archive`, // POST
      UNARCHIVE: (id) => `/api/posts/${id}/unarchive`, // POST
      HIDE: (id) => `/api/posts/${id}/hide`, // POST
      UNHIDE: (id) => `/api/posts/${id}/unhide`, // POST

      BAN: (id) => `/api/posts/${id}/ban`, // POST, Admin
      UNBAN: (id) => `/api/posts/${id}/unban`, // POST, Admin
      RECOVER: (id) => `/api/posts/${id}/recover`, // POST, Admin
    },
    MESSAGES: {
      SEND: "/api/messages", // POST
      LIST: "/api/messages", // GET, Admin
      PATCH: (id) => `/api/messages/${id}`, //PATCH, Admin
    },
    FILES: {
      // PRESIGN: "/api/files/presign",  // POST
      DIRECT_UPLOAD: "/api/files/upload",  // POST
      RETRIEVE: (objectKey) => `/api/files/retrieve/${objectKey}`,  // GET
    },
    // etc...
  },
};

export { API_CONFIG };
