// src/App.jsx (Versión Final Definitiva a Prueba de Errores)

import React, { useState, useEffect } from 'react';
import { Box, Container, Heading, Text, Image, HStack, VStack, Link, Icon, SimpleGrid, Spinner } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { getProfile, getExperience, getSkills, getEducation } from './services/api.js';
import { Chatbot } from './components/Chatbot.jsx';
import { ExperienceTimeline } from './components/ExperienceTimeline.jsx';
import { SkillsGrid } from './components/SkillsGrid.jsx';
import { ParticlesBackground } from './components/ParticlesBackground.jsx';
import { ProjectMatchmaker } from './components/ProjectMatchmaker.jsx';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const MotionBox = (props) => <Box as={motion.div} {...props} />;

function App() {
  const [profile, setProfile] = useState(null);
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Nuevo estado para manejar errores

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileRes, experienceRes, skillsRes, educationRes] = await Promise.all([
          getProfile(),
          getExperience(),
          getSkills(),
          getEducation(),
        ]);

        setProfile(profileRes.data);

        // --- AÑADE ESTA LÍNEA DE DEPURACIÓN AQUÍ ---
        console.log("DATOS RECIBIDOS DEL PERFIL:", profileRes.data);

        setExperience(experienceRes.data.experience);
        setSkills(skillsRes.data.skills);
        setEducation(educationRes.data.education);
      } catch (error) { 
        console.error("Error al cargar los datos desde la API:", error); 
      } finally { 
        setLoading(false); 
      }
    };
    loadData();
  }, []);

  // --- BARRERA DE SEGURIDAD MEJORADA ---
  // Esta es la parte más importante.
  if (loading) {
    return (
      <Box bg="gray.900" color="white" minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="cyan.400" />
          <Text>Cargando perfil...</Text>
        </VStack>
      </Box>
    );
  }

  if (error || !profile) {
    return (
      <Box bg="gray.900" color="white" minH="100vh" display="flex" alignItems="center" justifyContent="center" p={5} textAlign="center">
        <VStack spacing={4}>
          <Heading color="red.400">Error de Conexión</Heading>
          <Text>{error || "No se pudieron cargar los datos del perfil. Verifica que el servidor de back-end esté activo y sin errores."}</Text>
        </VStack>
      </Box>
    );
  }

  const sectionVariants = { /* ... */ };
  
  return (
    <Box bg="gray.900" color="gray.300" fontFamily="sans-serif">
      <ParticlesBackground />
      <Container maxW="container.lg" pt={16} pb={24} position="relative" zIndex={1}>
        
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
          <VStack align={'center'} spacing={3} textAlign="center">
            <Heading as="h1" size="2xl" color="white">{profile.personal_info.name}</Heading>
            <Heading as="h2" size="md" color="cyan.400" fontWeight="normal">{profile.personal_info.title}</Heading>
            {/* Íconos sociales restaurados */}
            <HStack spacing={5} pt={2}>
              <Link href="https://www.linkedin.com/in/iazr96/" isExternal><Icon as={FaLinkedin} boxSize={6} color="gray.400" _hover={{ color: 'cyan.400' }} /></Link>
              <Link href="https://github.com/andreszuniga96" isExternal><Icon as={FaGithub} boxSize={6} color="gray.400" _hover={{ color: 'cyan.400' }} /></Link>
              <Link href={`mailto:${profile.personal_info.contact.email}`} fontSize="sm" color="gray.400" _hover={{ color: 'cyan.400' }}>{profile.personal_info.contact.email}</Link>
            </HStack>
          </VStack>
        </MotionBox>

        {/* --- SECCIÓN PERFIL PROFESIONAL (CON IDIOMAS DENTRO) --- */}
        <MotionBox initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants} bg="gray.800" p={8} borderRadius="lg" mb={20}>
          <Box textAlign="center">
            <Heading as="h3" size="lg" color="white" mb={4} borderBottom="2px" borderColor="cyan.400" pb={2} display="inline-block">
              Perfil Profesional
            </Heading>
          </Box>
          <Text fontSize="lg" lineHeight="tall" textAlign="justify">{profile.professionalProfile}</Text>
          <Box mt={8} textAlign="center">
            <Heading as="h4" size="md" color="white" mb={4} display="inline-block">Idiomas</Heading>
            <HStack spacing={6} justifyContent="center">
              {profile.personal_info.languages.map((lang, index) => (
                <Box key={index} bg="gray.700" px={4} py={2} borderRadius="md">
                  <Text fontWeight="bold">{lang.language}: <Text as="span" color="cyan.400" fontWeight="normal">{lang.level}</Text></Text>
                </Box>
              ))}
            </HStack>
          </Box>
        </MotionBox>
        
        {/* --- SECCIÓN HABILIDADES TÉCNICAS --- */}
        <MotionBox initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants} mb={20}>
          <Box textAlign="center">
            <Heading as="h3" size="lg" color="white" mb={8} borderBottom="2px" borderColor="cyan.400" pb={2} display="inline-block">
              Habilidades Técnicas
            </Heading>
          </Box>
          <SkillsGrid />
        </MotionBox>

        {/* --- SECCIÓN EXPERIENCIA LABORAL --- */}
        <MotionBox initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={sectionVariants} mb={20}>
          <Box textAlign="center">
            <Heading as="h3" size="lg" color="white" mb={8} borderBottom="2px" borderColor="cyan.400" pb={2} display="inline-block">
              Experiencia Laboral
            </Heading>
          </Box>
          <ExperienceTimeline experience={experience} />
        </MotionBox>
        
        {/* --- SECCIÓN EDUCACIÓN Y CERTIFICACIONES --- */}
        <MotionBox initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants} mb={20}>
          <Box textAlign="center">
            <Heading as="h3" size="lg" color="white" mb={8} borderBottom="2px" borderColor="cyan.400" pb={2} display="inline-block">
              Educación y Certificaciones
            </Heading>
          </Box>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {education.map((edu, index) => (
              <MotionBox as={motion.div} key={index} p={5} bg="gray.800" borderRadius="lg" borderLeft="4px" borderColor="cyan.400" whileHover={{ scale: 1.05, shadow: 'lg' }}>
                <Heading as="h4" size="sm" color="white">{edu.degree}</Heading>
                <Text color="gray.400" mt={1}>{edu.institution}</Text>
                <Text color="gray.500" fontSize="sm">{edu.dates}</Text>
              </MotionBox>
            ))}
          </SimpleGrid>
        </MotionBox>

        {/* --- SECCIÓN PROJECT MATCHMAKER --- */}
        <MotionBox initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants} bg="gray.800" p={8} borderRadius="lg" mb={20}>
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
      
      {/* El chatbot flotante se renderiza aquí para que su posición sea relativa a toda la página */}
      <Chatbot />
    </Box>
  );
}

export default App;