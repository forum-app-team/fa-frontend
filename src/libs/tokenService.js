let token = null;

// On app start (or after /auth/refresh), call tokenService.set(accessToken)
export const tokenService = {
  get: () => token,
  set: (t) => { token = t; },
  clear: () => { token = null; },
};