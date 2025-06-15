// src/components/Services.jsx (Versión V3.0 Completa)

import React from 'react';
import { Box, Heading, Text, SimpleGrid, Tag, HStack, VStack, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ProjectMatchmaker } from './ProjectMatchmaker.jsx';

// Importamos todos los íconos que vamos a necesitar
import { FaCode, FaProjectDiagram, FaChartBar, FaCheckCircle } from 'react-icons/fa';
import { AiOutlineRobot } from 'react-icons/ai';
import { MdSecurity } from 'react-icons/md';

const MotionBox = motion(Box);

// Mapeo para convertir el nombre del ícono (texto) en un componente de React
const iconMap = {
  FaCode,
  AiOutlineRobot,
  FaProjectDiagram,
  FaChartBar,
  MdSecurity
};

export function Services({ services, profile }) {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>

      {/* --- SECCIÓN QUIÉN SOY (Extracto del Perfil) --- */}
      <MotionBox variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} bg="gray.800" p={8} borderRadius="lg" mb={20}>
          <Box textAlign="center">
            <Heading as="h2" size="xl" color="white" mb={4} borderBottom="2px" borderColor="cyan.400" pb={2} display="inline-block">Quién Soy</Heading>
          </Box>
          <Text fontSize="xl" lineHeight="tall" textAlign="center">{profile.summaries.who_am_i}</Text>
      </MotionBox>
      
      {/* --- SECCIÓN PORTAFOLIO DE SERVICIOS --- */}
      <MotionBox variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} mb={20}>
        <Box textAlign="center" mb={12}>
          <Heading as="h2" size="xl" color="white" mb={4} borderBottom="2px" borderColor="cyan.400" pb={2} display="inline-block">Portafolio de Servicios</Heading>
        </Box>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {services.map((service, index) => {
            const ServiceIcon = iconMap[service.icon];
            return (
              <MotionBox key={index} bg="gray.800" p={8} borderRadius="lg" borderTop="4px" borderColor="cyan.400" whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(56, 178, 172, 0.3)' }} textAlign="center">
                {ServiceIcon && <Icon as={ServiceIcon} boxSize={12} color="cyan.400" mb={6} />}
                <Heading as="h3" size="lg" color="cyan.400" mb={4} minH={{base: "auto", md:"50px"}}>{service.title}</Heading>
                <Text mb={6} minH={{base: "auto", md:"150px"}} textAlign="justify">{service.description}</Text>
                <HStack wrap="wrap" justifyContent="center">
                  {service.skills_and_technologies.map((skill, i) => <Tag key={i} size="sm" variant="solid" bg="gray.700" color="cyan.300" m={1}>{skill}</Tag>)}
                </HStack>
              </MotionBox>
            )
          })}
        </SimpleGrid>
      </MotionBox>
      
      {/* --- SECCIÓN METODOLOGÍA DE TRABAJO --- */}
      <MotionBox variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} bg="gray.800" p={8} borderRadius="lg" mb={20}>
          <Box textAlign="center">
            <Heading as="h2" size="xl" color="white" mb={4} borderBottom="2px" borderColor="cyan.400" pb={2} display="inline-block">Metodología de Trabajo</Heading>
          </Box>
          <Text fontSize="lg" lineHeight="tall" textAlign="center">
            Trabajo con metodologías ágiles, principalmente SCRUM, para optimizar procesos y garantizar eficiencia. Esto me permite evaluar cada proyecto puntualmente, analizar tiempos, prever imprevistos y mantener una comunicación constante y transparente contigo, resultando en mejores productos y tiempos de entrega más rápidos.
          </Text>
      </MotionBox>

      {/* --- SECCIÓN VICTORIAS TEMPRANAS --- */}
      <MotionBox variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} mb={20}>
          <Box textAlign="center">
            <Heading as="h2" size="xl" color="white" mb={4} borderBottom="2px" borderColor="cyan.400" pb={2} display="inline-block">Victorias Tempranas</Heading>
          </Box>
          <Text fontSize="lg" lineHeight="tall" textAlign="center" mb={6}>Defino los proyectos por etapas claras. Esto nos ofrece beneficios clave:</Text>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} textAlign="center">
              <VStack><Icon as={FaCheckCircle} boxSize={8} color="cyan.400" mb={2}/><Text>Mayor control del desarrollo del proyecto.</Text></VStack>
              <VStack><Icon as={FaCheckCircle} boxSize={8} color="cyan.400" mb={2}/><Text>Entregas de avances significativos y funcionales.</Text></VStack>
              <VStack><Icon as={FaCheckCircle} boxSize={8} color="cyan.400" mb={2}/><Text>Mayor precisión en los tiempos de desarrollo definidos.</Text></VStack>
          </SimpleGrid>
      </MotionBox>

      {/* --- SECCIÓN PROJECT MATCHMAKER --- */}
      <MotionBox initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} bg="gray.800" p={8} borderRadius="lg">
        <Box textAlign="center">
          <Heading as="h3" size="lg" color="white" mb={4} borderBottom="2px" borderColor="cyan.400" pb={2} display="inline-block">¿Tienes una Idea?</Heading>
          <Text fontSize="lg" mb={6} mt={4}>Describe tu proyecto y deja que mi IA te muestre cómo mis habilidades encajan perfectamente con tus necesidades.</Text>
        </Box>
        <ProjectMatchmaker />
      </MotionBox>

    </MotionBox>
  );
}