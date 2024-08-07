import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

export const checkUsername = async (username) => {
    const response = await axios.get(`${API_URL}/check-username`, { params: { username } });
    return response.data;
};

export const checkEmail = async (email) => {
    const response = await axios.get(`${API_URL}/check-email`, { params: { email } });
    return response.data;
};

export const registerUser = async (userData) => {
    const response = await axios.post(`${API_URL}/signup`, userData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

export const loginUser = async (userData) => {
    const response = await axios.post(`${API_URL}/signin`, userData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};