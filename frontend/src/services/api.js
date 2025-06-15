// src/services/api.js
import axios from 'axios';

// Asegurándonos de que apunta a tu servidor local para el desarrollo
const apiClient = axios.create({
    baseURL: 'https://portafolio-api-8bfm.onrender.com', 
    headers: {
        'Content-Type': 'application/json'
    }
});

// Exportamos todas las funciones que la aplicación necesita
export const getProfile = () => apiClient.get('/profile');
export const getExperience = () => apiClient.get('/experience');
export const getEducation = () => apiClient.get('/education');
export const getSkills = () => apiClient.get('/skills');
export const getAchievements = () => apiClient.get('/achievements');
export const getCourses = () => apiClient.get('/courses');
export const matchProject = (description) => apiClient.post('/match-project', { description });
export const askChatbot = (text) => apiClient.post('/ask', { text });
export const getServices = () => apiClient.get('/services');