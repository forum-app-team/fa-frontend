import { createListenerMiddleware } from '@reduxjs/toolkit';
import { loginSuccess, updateIdentitySuccess, logout } from './auth.slice';
import { tokenService } from '@/libs/tokenService'

const authListenerMiddleware = createListenerMiddleware();

authListenerMiddleware.startListening({
  actionCreator: loginSuccess,
  effect: async (action, { extra }) => {
    const token = action.payload.accessToken;
    localStorage.setItem('token', token);
    tokenService.set(token);
  }
});

authListenerMiddleware.startListening({
  actionCreator: logout,
  effect: async (action, { extra }) => {
    localStorage.removeItem('token');
    tokenService.clear();
  }
});

authListenerMiddleware.startListening({
  actionCreator: updateIdentitySuccess,
  effect: async (action, { extra }) => {
    const token = action.payload.accessToken;
    localStorage.setItem('token', token);
    tokenService.set(token);
  }
});

export default authListenerMiddleware;