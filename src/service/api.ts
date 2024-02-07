import axios from 'axios';
import Swal from 'sweetalert2';

const Api = axios.create({
    baseURL: 'http://localhost:3333'
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
