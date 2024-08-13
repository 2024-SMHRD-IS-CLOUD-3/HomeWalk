import axios from 'axios';

const API_URL = 'http://localhost:8081/api'; // 실제 API URL을 넣으세요

// 특정 구성원의 모든 걸음 수 데이터를 가져오는 함수
export const getStepsData = async (memberId) => {
    try {
        const response = await axios.get(`${API_URL}/steps/${memberId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching steps data:', error);
        throw error;
    }
};

// 특정 구성원의 오늘 걸음 수 데이터를 가져오는 함수
export const getTodayStepsData = async (memberId) => {
    try {
        const response = await axios.get(`${API_URL}/steps/${memberId}/today`);
        return response.data;
    } catch (error) {
        console.error('Error fetching today steps data:', error);
        throw error;
    }
};

// 특정 구성원의 어제 걸음 수 데이터를 가져오는 함수
export const getYesterdayStepsData = async (memberId) => {
    try {
        const response = await axios.get(`${API_URL}/steps/${memberId}/yesterday`);
        return response.data;
    } catch (error) {
        console.error('Error fetching yesterday steps data:', error);
        throw error;
    }
};

// 특정 구성원의 오늘과 어제 걸음 수 데이터를 한 번에 가져오는 함수
export const getStepsComparisonData = async (memberId) => {
    try {
        const response = await axios.get(`${API_URL}/steps/${memberId}/comparison`);
        return response.data;
    } catch (error) {
        console.error('Error fetching steps comparison data:', error);
        throw error;
    }
};

// 특정 구성원의 주간 걸음 수 데이터를 가져오는 함수
export const getWeeklyStepsData = async (memberId) => {
    try {
        const response = await axios.get(`${API_URL}/steps/${memberId}/weekly`);
        return response.data;
    } catch (error) {
        console.error('Error fetching weekly steps data:', error);
        throw error;
    }
};