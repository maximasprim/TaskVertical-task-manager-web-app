import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

// Add the token to the request header
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401 errors (Unauthorized)
api.interceptors.response.use(
  response => response, 
  async error => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        try {
          const { data } = await axios.post('http://localhost:8000/api/token/refresh/', {
            refresh: refreshToken,
          });

          // Save new access token
          localStorage.setItem('access_token', data.access);

          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // Optionally log out the user if the refresh token is invalid
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';  // Redirect to login
        }
      }
    }

    return Promise.reject(error);
  }
);


export const getTasksApi = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

// Add the token to the request header
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default api;
