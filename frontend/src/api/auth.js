import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

export const loginUser = async (userData) => {
    const response = await axios.post(`${API_URL}/signin`, userData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};
