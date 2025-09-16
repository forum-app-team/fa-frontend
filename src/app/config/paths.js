const PATHS = {
  // Public paths
  ROOT: "/",
  REGISTER: "/users/register",
  LOGIN: "/users/login",
  CONTACT_US: "/contactus",

  // Authenticated user paths
  HOME: "/home",
  PROFILE: "/users/:id/profile",
  POST_DETAIL: "posts/:id",
  POST_NEW: "/posts/new",
  FILES_TEST: "/files/test",

  // Admin paths
  MESSAGES: "/messages",
  USERS: "/users",

  // Error paths
  ERROR: "*",
};

export { PATHS };
