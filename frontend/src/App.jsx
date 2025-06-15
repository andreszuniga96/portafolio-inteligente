// src/App.jsx (Versión con Banner Fijo)

import React, { useState, useEffect } from 'react';
import { Box, Container, Button, HStack, Spinner, VStack, Text, Heading, Image, Link, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { getProfile, getExperience, getSkills, getEducation, getServices } from './services/api.js';
import { Services } from './components/Services.jsx';
import { Profile } from './components/Profile.jsx';
import { ParticlesBackground } from './components/ParticlesBackground.jsx';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { WhatsAppButton } from './components/WhatsAppButton.jsx';

const MotionBox = (props) => <Box as={motion.div} {...props} />;

function App() {
  const [activeView, setActiveView] = useState('services');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState({});
  const [education, setEducation] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    // ... (La lógica de useEffect para cargar datos no cambia) ...
    const loadData = async () => {
      try {
        const [profileRes, experienceRes, skillsRes, educationRes, servicesRes] = await Promise.all([
          getProfile(), getExperience(), getSkills(), getEducation(), getServices(),
        ]);
        setProfile(profileRes.data);
        setExperience(experienceRes.data.experience);
        setSkills(skillsRes.data.skills);
        setEducation(educationRes.data.education);
        setServices(servicesRes.data.services);
      } catch (error) { console.error("Error al cargar los datos:", error); } 
      finally { setLoading(false); }
    };
    loadData();
  }, []);

  if (loading || !profile) {
    return ( <Box bg="gray.900" color="white" minH="100vh" display="flex" alignItems="center" justifyContent="center"> <VStack><Spinner size="xl" color="cyan.400" /><Text mt={4}>Cargando...</Text></VStack> </Box> );
  }

  return (
    <Box bg="gray.900" color="gray.300" minH="100vh" fontFamily="sans-serif"> 
      <ParticlesBackground />
      <Container maxW="container.xl" pt={10} pb={24} position="relative" zIndex={1}>

        {/* --- BANNER ESTÁTICO SIEMPRE VISIBLE --- */}
        <VStack as="header" spacing={4} mb={10} textAlign="center">
          <Image borderRadius="full" boxSize="150px" src="https://i.postimg.cc/cHg755Mk/Chat-GPT-Image-14-jun-2025-10-31-34-p-m.png" alt="Ivan Andres Zuñiga Romo" border="4px" borderColor="white" boxShadow="0 0 25px rgba(56, 178, 172, 0.5)" />
          <VStack spacing={1}>
            <Heading as="h1" size="2xl" color="white">{profile.personal_info.name}</Heading>
            <VStack>
              {profile.personal_info.title.map((title, i) => <Heading key={i} as="h2" size="md" color="cyan.400" fontWeight="normal">{title}</Heading>)}
            </VStack>
          </VStack>
          <HStack spacing={5} pt={2}>
            <Link href={profile.personal_info.contact.socials.linkedin} isExternal><Icon as={FaLinkedin} boxSize={6} color="gray.400" _hover={{ color: 'cyan.400' }} /></Link>
            <Link href={profile.personal_info.contact.socials.github} isExternal><Icon as={FaGithub} boxSize={6} color="gray.400" _hover={{ color: 'cyan.400' }} /></Link>
            <Link href={`mailto:${profile.personal_info.contact.email}`} fontSize="sm" color="gray.400" _hover={{ color: 'cyan.400' }}>{profile.personal_info.contact.email}</Link>
          </HStack>
        </VStack>

        {/* --- NAVEGACIÓN PRINCIPAL --- */}
        <HStack justifyContent="center" mb={10} borderTop="1px" borderBottom="1px" borderColor="gray.700" py={4}>
          <Button colorScheme="cyan" variant={activeView === 'services' ? 'solid' : 'ghost'} onClick={() => setActiveView('services')}>
            Portafolio de Servicios
          </Button>
          <Button colorScheme="cyan" variant={activeView === 'profile' ? 'solid' : 'ghost'} onClick={() => setActiveView('profile')}>
            Perfil Profesional
          </Button>
        </HStack>

        {/* --- RENDERIZADO CONDICIONAL DE LA VISTA --- */}
        {activeView === 'services' && <Services services={services} profile={profile} />}
        {activeView === 'profile' && <Profile profile={profile} experience={experience} skills={skills} education={education} />}
      </Container>
      <WhatsAppButton />
    </Box>
  );
}
export default App;