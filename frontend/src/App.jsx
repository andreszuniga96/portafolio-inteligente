// src/App.jsx (Versión Final - Futurista 2025)

import { ProjectMatchmaker } from './components/ProjectMatchmaker.jsx';

import React, { useState, useEffect } from 'react';

// --- Importaciones de Chakra UI y Framer Motion ---
import { Box, Container, Heading, Text, Image, HStack, VStack, Link, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';

// --- Importaciones de Componentes y Servicios ---
import { getProfile, getExperience, getSkills } from './services/api.js';
import { Chatbot } from './components/Chatbot.jsx';
import { ExperienceTimeline } from './components/ExperienceTimeline.jsx';
import { SkillsGrid } from './components/SkillsGrid.jsx';
import { ParticlesBackground } from './components/ParticlesBackground.jsx';

// --- Importaciones de Íconos ---
import { FaLinkedin, FaGithub } from 'react-icons/fa';

// --- Componente Reutilizable para Secciones Animadas ---
const MotionBox = motion(Box);

function App() {
  // --- Estados para almacenar los datos de la API ---
  const [profile, setProfile] = useState(null);
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Carga de datos desde la API al montar el componente ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileRes, experienceRes, skillsRes] = await Promise.all([
          getProfile(), 
          getExperience(),
          getSkills()
        ]);
        setProfile(profileRes.data);
        setExperience(experienceRes.data.experience);
        setSkills(skillsRes.data.skills);
      } catch (error) { 
        console.error("Error al cargar los datos desde la API:", error); 
      } finally { 
        setLoading(false); 
      }
    };
    loadData();
  }, []);

  // --- Pantalla de Carga ---
  if (loading) {
    return (
      <Box bg="gray.900" color="white" minH="100vh" display="flex" alignItems="center" justifyContent="center">
        Cargando perfil...
      </Box>
    );
  }

  // --- Definición de Variantes para las Animaciones ---
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" } 
    }
  };

  // src/App.jsx (dentro de la función App, reemplaza el return)

return (
  <Box bg="gray.900" color="gray.300" fontFamily="sans-serif">
    <ParticlesBackground />
    <Container maxW="container.md" pt={16} pb={24} position="relative" zIndex={1}>

      {/* --- SECCIÓN HERO --- */}
      <MotionBox 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        display="flex" 
        flexDirection={{ base: 'column', md: 'row' }} 
        alignItems="center" 
        mb={20}
      >
        <Image
          borderRadius="full"
          boxSize="160px"
          src="https://i.postimg.cc/nzrns4WD/H.png"
          alt="Ivan Andres Zuñiga Romo"
          border="4px"
          borderColor="cyan.400"
          boxShadow="0 0 25px rgba(56, 178, 172, 0.5)"
          mr={{ md: 8 }}
          mb={{ base: 6, md: 0 }}
        />
        {/* CORRECCIÓN 1: Centramos el VStack completo */}
        <VStack align={{ base: 'center', md: 'center' }} spacing={3} textAlign="center">
          <Heading as="h1" size="2xl" color="white">{profile.personalInfo.name}</Heading>
          <Heading as="h2" size="md" color="cyan.400" fontWeight="normal">{profile.personalInfo.title}</Heading>
          <HStack spacing={5} pt={2}>
            <Link href="https://www.linkedin.com/in/iazr96/" isExternal><Icon as={FaLinkedin} boxSize={6} color="gray.400" _hover={{ color: 'cyan.400' }} /></Link>
            <Link href="https://github.com/andreszuniga96" isExternal><Icon as={FaGithub} boxSize={6} color="gray.400" _hover={{ color: 'cyan.400' }} /></Link>
            <Link href={`mailto:${profile.personalInfo.contact.email}`} fontSize="sm" color="gray.400" _hover={{ color: 'cyan.400' }}>{profile.personalInfo.contact.email}</Link>
          </HStack>
        </VStack>
      </MotionBox>

      {/* --- SECCIÓN PERFIL PROFESIONAL --- */}
      <MotionBox initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants} bg="gray.800" p={8} borderRadius="lg" mb={20}>
        {/* CORRECCIÓN 2: Título cambiado y centrado */}
        <Box textAlign="center">
          <Heading as="h3" size="lg" color="white" mb={4} borderBottom="2px" borderColor="cyan.400" pb={2} display="inline-block">
            Perfil Profesional
          </Heading>
        </Box>
        {/* CORRECCIÓN 3: Texto justificado */}
        <Text fontSize="lg" lineHeight="tall" textAlign="justify">{profile.professionalProfile}</Text>
      </MotionBox>
      
      {/* --- SECCIÓN HABILIDADES TÉCNICAS --- */}
      <MotionBox initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants} mb={20}>
        {/* CORRECCIÓN 4: Título centrado */}
        <Box textAlign="center">
          <Heading as="h3" size="lg" color="white" mb={8} borderBottom="2px" borderColor="cyan.400" pb={2} display="inline-block">
            Habilidades Técnicas
          </Heading>
        </Box>
        <SkillsGrid />
      </MotionBox>

      {/* --- SECCIÓN EXPERIENCIA LABORAL --- */}
      <MotionBox initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={sectionVariants}>
        {/* CORRECCIÓN 5: Título centrado */}
        <Box textAlign="center">
            <Heading as="h3" size="lg" color="white" mb={8} borderBottom="2px" borderColor="cyan.400" pb={2} display="inline-block">
              Experiencia Laboral
            </Heading>
        </Box>
        <ExperienceTimeline experience={experience} />
      </MotionBox>

      {/* --- SECCIÓN PROJECT MATCHMAKER --- */}
      <MotionBox initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants} bg="gray.800" p={8} borderRadius="lg" mb={20}>
        {/* Envolvemos los títulos en un Box para centrarlos */}
        <Box textAlign="center">
          <Heading as="h3" size="lg" color="white" mb={4} borderBottom="2px" borderColor="cyan.400" pb={2} display="inline-block">
            ¿Tienes una Idea?
          </Heading>
          <Text fontSize="lg" mb={6} mt={4}>
            Describe tu proyecto y deja que mi IA te muestre cómo mis habilidades encajan perfectamente con tus necesidades.
          </Text>
        </Box>
        <ProjectMatchmaker />
      </MotionBox>

    </Container>
    
    <Chatbot />
  </Box>
  );

}

export default App;