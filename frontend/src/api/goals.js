import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

export const saveGoals = async (userId, goalType, goalValue) => {
    try {
        const response = await axios.post(`${API_URL}/goals/save/${goalType}`, {
            userId,
            goalType,
            goalValue,
            achieved: false
        });
        return response.data;
    } catch (error) {
        console.error(`Error saving ${goalType} goals:`, error);
        throw error;
    }
};