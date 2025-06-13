// src/services/api.js
import axios from 'axios';

// La URL base de nuestra API de FastAPI para desarrollo
const apiClient = axios.create({
    baseURL: 'https://portafolio-api-8bfm.onrender.com',
    headers: {
        'Content-Type': 'application/json'
    }
});


export const getProfile = () => {
    return apiClient.get('/profile');
};

export const getExperience = () => {
    return apiClient.get('/experience');
};

export const getEducation = () => {
    return apiClient.get('/education');
};

export const getSkills = () => {
    return apiClient.get('/skills');
};

// ESTA ES LA FUNCIÓN QUE PROBABLEMENTE FALTABA O TENÍA UN ERROR
export const getAchievements = () => {
    return apiClient.get('/achievements');
};

// ESTA TAMBIÉN PODRÍA HABER FALTADO
export const getCourses = () => {
    return apiClient.get('/courses');
};

export const askChatbot = (queryText) => {
    return apiClient.post('/ask', { text: queryText });
};

// src/services/api.js (añade esta función)

export const matchProject = (description) => {
    return apiClient.post('/match-project', { description: description });
};