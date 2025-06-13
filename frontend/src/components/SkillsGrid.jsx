// src/components/SkillsGrid.jsx (Versión Final y Segura)
import React from 'react';
import { SimpleGrid, Box, Text, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';

// Importamos los íconos de diferentes sets
import { FaReact, FaPython, FaNodeJs, FaDatabase, FaAws, FaDocker, FaCloud } from 'react-icons/fa'; // Añadimos FaCloud
import { SiPostgresql, SiMongodb, SiGooglecloud, SiBlockchaindotcom } from 'react-icons/si'; // Eliminamos el ícono problemático
import { AiOutlineRobot } from 'react-icons/ai';

const MotionBox = motion(Box);

// Mapeo de nombres de habilidades a íconos
const skillIcons = {
  'react': FaReact,
  'python': FaPython,
  'node.js': FaNodeJs,
  'sql': FaDatabase,
  'postgresql': SiPostgresql,
  'mongodb': SiMongodb,
  'inteligencia artificial': AiOutlineRobot,
  'aws': FaAws,
  'azure': FaCloud, // <-- IMPORTANTE: Usamos el ícono genérico FaCloud como reemplazo
  'google cloud': SiGooglecloud,
  'blockchain': SiBlockchaindotcom,
  'docker': FaDocker,
};

const displayedSkills = [
    'React', 'Python', 'Node.js', 'PostgreSQL', 'MongoDB', 
    'Inteligencia Artificial', 'AWS', 'Azure', 'Google Cloud', 
    'Blockchain', 'Docker'
];

export function SkillsGrid() {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={8}>
      {displayedSkills.map((skill, index) => {
        const IconComponent = skillIcons[skill.toLowerCase()] || AiOutlineRobot;
        return (
          <MotionBox
            key={index}
            bg="gray.800"
            p={6}
            borderRadius="lg"
            textAlign="center"
            variants={cardVariants}
            whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(56, 178, 172, 0.6)' }}
            transition={{ duration: 0.2 }}
          >
            <Icon as={IconComponent} boxSize={12} color="cyan.400" mb={4} />
            <Text color="white" fontWeight="bold">{skill}</Text>
          </MotionBox>
        );
      })}
    </SimpleGrid>
  );
}