import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://edge.qiwi.com',
});

export default instance;