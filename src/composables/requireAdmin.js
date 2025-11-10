
import axios from 'axios';


export const requireAdmin = (to, from, next) => {
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  if (user && user.type === 0) {
    return next();
  } else {

    axios.get('/logout').catch(() => {});

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('institution');
    axios.defaults.headers.common['Authorization'] = undefined;

    return next('/signin');
  }
};
