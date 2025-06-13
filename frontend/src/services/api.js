// src/services/api.js
import axios from 'axios';

// La URL base de nuestra API de FastAPI
const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Función para obtener los datos del perfil
export const getProfile = () => {
    return apiClient.get('/profile');
};

// Función para obtener la experiencia laboral
export const getExperience = () => {
    return apiClient.get('/experience');
};

// Función para obtener la educación
export const getEducation = () => {
    return apiClient.get('/education');
};

// Función para obtener las habilidades
export const getSkills = () => {
    return apiClient.get('/skills');
};

// Función para obtener las certificaciones
export const getCertifications = () => {
    return apiClient.get('/certifications');
};

// Función para hacer una pregunta al chatbot
export const askChatbot = (queryText) => {
    return apiClient.post('/ask', { text: queryText });
};