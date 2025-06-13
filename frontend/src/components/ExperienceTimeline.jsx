// src/components/ExperienceTimeline.jsx (Versión Final con todos los estilos)

import React from 'react';
import { Box, Flex, VStack, Heading, Text, List, ListItem, ListIcon, useBreakpointValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

const MotionBox = motion(Box);

// Componente interno para cada tarjeta de experiencia
const TimelineCard = ({ job, index }) => {
  const isEven = index % 2 === 0;
  
  // En pantallas pequeñas, todas las tarjetas van a la izquierda
  const direction = useBreakpointValue({ base: 'left', md: isEven ? 'left' : 'right' });

  const cardVariants = {
    hidden: { opacity: 0, x: direction === 'left' ? -100 : 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
  };

  return (
    <Flex
      w="100%"
      // En móvil, justificamos al final para que la línea quede a la izquierda
      justifyContent={{ base: 'flex-end', md: isEven ? 'flex-start' : 'flex-end' }}
      mb={4}
      position="relative" // Contenedor relativo para el círculo
    >
      {/* CÍRCULO EN LA LÍNEA DE TIEMPO (VIÑETA) */}
      <Box
        position="absolute"
        left="50%"
        top="1.5rem" // Alinea verticalmente con el título
        transform="translateX(-50%)"
        w="20px"
        h="20px"
        bg="cyan.400"
        borderRadius="full"
        border="4px solid"
        borderColor="gray.900" // El mismo color que el fondo para crear un efecto de "agujero"
        zIndex={2}
        display={{ base: 'none', md: 'block' }} // Oculto en móvil para un diseño más limpio
      />

      <MotionBox
        w={{ base: 'calc(100% - 40px)', md: 'calc(50% - 2rem)' }} // Ajustamos el ancho en móvil
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <Box
          bg="gray.800"
          p={6}
          borderRadius="lg"
          borderTop="4px"
          borderColor="cyan.400"
          position="relative"
        >
          {/* ENCABEZADO CENTRADO */}
          <Box textAlign="center" mb={4}>
            <Text fontSize="md" fontWeight="bold" color="gray.400">{job.dates}</Text>
            <Heading as="h3" size="md" color="cyan.400" mt={2}>{job.position}</Heading>
            <Text as="h4" fontSize="lg" color="white" mt={1}>{job.company}</Text>
          </Box>
          
          <Text mt={4} mb={3} color="gray.400" fontStyle="italic">Responsabilidades:</Text>
          <List spacing={2}>
            {job.responsibilities.map((resp, i) => (
              <ListItem key={i} display="flex" alignItems="flex-start">
                <ListIcon as={FaCheckCircle} color="cyan.500" mt={1} />
                <Text as="span" ml={2} textAlign="justify">{resp}</Text>
              </ListItem>
            ))}
          </List>
        </Box>
      </MotionBox>
    </Flex>
  );
};


// El componente principal que exportamos
export function ExperienceTimeline({ experience }) {
  return (
    <Box position="relative" className="my-16">
      {/* La línea vertical central */}
      <Box
        position="absolute"
        left={{ base: '20px', md: '50%' }} // La línea se mueve a la izquierda en móvil
        top="0"
        bottom="0"
        w="4px"
        bg="gray.700"
        transform={{ md: 'translateX(-50%)' }}
        borderRadius="full"
        zIndex={0} // Detrás de los círculos
      />

      <VStack spacing={{ base: 8, md: 0 }} align="stretch">
        {experience.map((job, index) => (
          <TimelineCard key={index} job={job} index={index} />
        ))}
      </VStack>
    </Box>
  );
}