import axios from 'axios';

const API_URL = 'http://192.168.219.55:8085/api';

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

export const fetchGoals = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/goals/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching goals:', error);
      throw error;
    }
  };
