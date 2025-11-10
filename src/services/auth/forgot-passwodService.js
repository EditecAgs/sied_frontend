import axios from 'axios';


export function requestResetEmail(email) {
  return new Promise((resolve, reject) => {
    axios
      .post('/forgot-password', { email })
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
}


export function resetPassword(email, token, password, password_confirmation) {
  return new Promise((resolve, reject) => {
    axios
      .post('/reset-password', {
        email,
        token, 
        password,
        password_confirmation
      })
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
}
