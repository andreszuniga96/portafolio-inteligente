// src/components/SkillsGrid.jsx (Versión Final a Prueba de Errores)

import React from 'react';
import { SimpleGrid, Box, Text, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';

// Importamos un set de íconos seguros y añadimos FaChartBar
import { FaReact, FaPython, FaNodeJs, FaDatabase, FaAws, FaDocker, FaCloud, FaLinux, FaProjectDiagram, FaChartBar } from 'react-icons/fa';
import { SiPostgresql, SiMongodb, SiGooglecloud, SiBlockchaindotcom, SiMysql } from 'react-icons/si'; 
import { AiOutlineRobot, AiOutlineSecurityScan } from 'react-icons/ai';
import { MdOutlineAssessment } from "react-icons/md";

const MotionBox = motion(Box);

// Mapeo de nombres de habilidades a íconos
const skillIcons = {
  'react': FaReact,
  'python': FaPython,
  'node.js': FaNodeJs,
  'aws': FaAws,
  'google cloud': SiGooglecloud,
  'docker': FaDocker,
  'linux': FaLinux,
  'sql': FaDatabase,
  'mysql': SiMysql,
  'postgresql': SiPostgresql,
  'mongodb': SiMongodb,
  'power bi': FaChartBar, // <-- CAMBIO DEFINITIVO: Usamos un ícono de gráfico que no falla.
  'ciberseguridad': AiOutlineSecurityScan,
  'inteligencia artificial': AiOutlineRobot,
  'blockchain': SiBlockchaindotcom,
  'proyectos de inversión': FaProjectDiagram,
  'mga': MdOutlineAssessment,
  'planes de desarrollo': MdOutlineAssessment,
};

// Lista curada y expandida de habilidades
const displayedSkills = [
    'Python', 'Inteligencia Artificial', 'React', 'Node.js', 
    'SQL', 'PostgreSQL', 'MongoDB', 'Power BI', 
    'Ciberseguridad', 'Blockchain', 'Docker', 'Linux', 
    'AWS', 'Google Cloud', 'MGA', 'Planes de Desarrollo'
];

export function SkillsGrid() {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={6}>
      {displayedSkills.map((skill, index) => {
        const IconComponent = skillIcons[skill.toLowerCase()] || FaCloud;
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
            border="1px solid"
            borderColor="gray.700"
          >
            <Icon as={IconComponent} boxSize={10} color="cyan.400" mb={3} />
            <Text color="white" fontWeight="bold" fontSize="sm">{skill}</Text>
          </MotionBox>
        );
      })}
    </SimpleGrid>
  );
}