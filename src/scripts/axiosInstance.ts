import axios from 'axios';

// Switch between local and deployed backend URL
const useDeployedBase = import.meta.env.VITE_USE_DEPLOYED_BASE === 'true';

const api = axios.create({
    baseURL: useDeployedBase
    ? import.meta.env.VITE_DEPLOYED_BASE_URL
    : import.meta.env.VITE_LOCAL_BASE_URL
});

export default api;