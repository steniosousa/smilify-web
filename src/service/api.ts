import axios from 'axios';

const Api = axios.create({
    baseURL: 'https://smilify-api.onrender.com'
});



Api.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        

        if (error.response && error.response.status === 401) {
            localStorage.clear()
            window.location.reload()
        }

        return Promise.reject(error);
    }
);

export default Api;
