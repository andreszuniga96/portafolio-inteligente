// chatbot
import { Chatbot } from './components/Chatbot';

// src/App.jsx
import { useState, useEffect } from 'react';
import './App.css';

// Importamos nuestras funciones de servicio
import { getProfile, getExperience } from './services/api.js';

function App() {
  // Estados para almacenar los datos que vienen de la API
  const [profile, setProfile] = useState(null);
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect se ejecuta una vez cuando el componente se monta
  useEffect(() => {
    // Usamos una función asíncrona para cargar todos los datos
    const loadData = async () => {
      try {
        const profileRes = await getProfile();
        setProfile(profileRes.data);

        const experienceRes = await getExperience();
        setExperience(experienceRes.data.workExperience);

      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false); // Terminamos la carga
      }
    };

    loadData();
  }, []); // El array vacío asegura que se ejecute solo una vez

  // Mostramos un mensaje de carga mientras los datos llegan
  if (loading) {
    return <div>Cargando perfil...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>{profile.personalInfo.name}</h1>
        <h2>{profile.personalInfo.title}</h2>
        <p>{profile.professionalSummary}</p>
      </header>

      <main>
        <section id="experience">
          <h2>Experiencia Laboral</h2>
          <div className="experience-list">
            {experience.map((job, index) => (
              <div key={index} className="experience-card">
                <h3>{job.role}</h3>
                <h4>{job.company} | {job.period}</h4>
                <p>{job.description}</p>
                <ul>
                  {job.keyFunctions.map((func, i) => <li key={i}>{func}</li>)}
                </ul>
                <div className="technologies">
                  {job.technologiesUsed.map((tech, i) => <span key={i} className="tech-tag">{tech}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Aquí añadiremos más secciones después (Educación, Skills, etc.) */}
      </main>
      <Chatbot />
    </div>
  );
}

export default App;