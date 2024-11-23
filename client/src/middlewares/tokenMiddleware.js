import { getAuth } from 'firebase/auth';

export const tokenMiddleware = (store) => (next) => (action) => {
  if (action.type === 'SET_USER' && action.user) {
    const refreshTime = 10 * 60 * 1000;
    setTimeout(async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const newToken = await user.getIdToken(true);
        localStorage.setItem('authToken', newToken);
      }
    }, refreshTime);
  }
  return next(action);
};
