import axios from "axios";

const BASE_URL= import.meta.env.VITE_API_URL ?? 'https://todoback-xkpn.onrender.com';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 35000,
    headers:{'Content-Type': 'application/json'},
});

// Se ejecuta antes de cada petición: inyecta JWT
api.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem('userToken');
        if (token){
            config.headers.Authorization=`Bearer ${token}`;
        }
        return config;
    },
    (error )=>Promise.reject(error)
);

//Se ejecuta DESPUÉS de cada respuesta
api.interceptors.response.use(
    (response)=>response,
    (error)=>{
        if(error.response?.status==401){
            localStorage.removeItem('userToken');
            // Desde fuera de react, window.location para redirigir 
            window.location.href='/login';
        }
        return Promise.reject(error);
    }
);

export default api;