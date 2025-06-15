// src/components/Profile.jsx

import React from 'react';
import { Box, Heading, Text, Image, HStack, VStack, Link, Icon, SimpleGrid } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ExperienceTimeline } from './ExperienceTimeline.jsx';
import { SkillsGrid } from './SkillsGrid.jsx';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const MotionBox = (props) => <Box as={motion.div} {...props} />;

// Este componente solo recibe datos (props) y los muestra
export function Profile({ profile, experience, skills, education }) {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      
      {/* --- SECCIÓN PERFIL PROFESIONAL (CON IDIOMAS DENTRO) --- */}
      <MotionBox initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants} bg="gray.800" p={8} borderRadius="lg" mb={20}>
        <Box textAlign="center">
          <Heading as="h3" size="lg" color="white" mb={4} borderBottom="2px" borderColor="cyan.400" pb={2} display="inline-block">Perfil Profesional</Heading>
        </Box>
        <Text fontSize="lg" lineHeight="tall" textAlign="center">{profile.summaries.professional_profile}</Text>
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
        <Box textAlign="center"><Heading as="h3" size="lg" color="white" mb={8} borderBottom="2px" borderColor="cyan.400" pb={2} display="inline-block">Habilidades Técnicas</Heading></Box>
        <SkillsGrid skills={skills.technical} />
      </MotionBox>

      {/* --- SECCIÓN EXPERIENCIA LABORAL --- */}
      <MotionBox initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={sectionVariants} mb={20}>
        <Box textAlign="center"><Heading as="h3" size="lg" color="white" mb={8} borderBottom="2px" borderColor="cyan.400" pb={2} display="inline-block">Experiencia Laboral</Heading></Box>
        <ExperienceTimeline experience={experience} />
      </MotionBox>
      
      {/* --- SECCIÓN EDUCACIÓN Y CERTIFICACIONES --- */}
      <MotionBox initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants} mb={20}>
        <Box textAlign="center"><Heading as="h3" size="lg" color="white" mb={8} borderBottom="2px" borderColor="cyan.400" pb={2} display="inline-block">Educación y Certificaciones</Heading></Box>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {education.map((edu, index) => (
              <MotionBox key={index} p={5} bg="gray.800" borderRadius="lg" borderLeft="4px" borderColor="cyan.400" whileHover={{ scale: 1.05, shadow: 'lg' }}>
                <Heading as="h4" size="sm" color="white">{edu.degree}</Heading>
                <Text color="gray.400" mt={1}>{edu.institution}</Text>
                <Text color="gray.500" fontSize="sm">{edu.dates}</Text>
              </MotionBox>
            ))}
        </SimpleGrid>
      </MotionBox>

    </MotionBox>
  );
}

export default Profile;