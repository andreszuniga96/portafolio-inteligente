// src/components/WhatsAppButton.jsx (Versión Final con Animaciones y Funcionalidad)

import React from 'react';
import { IconButton } from '@chakra-ui/react';
import { FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Creamos la versión animada del botón de Chakra
const MotionIconButton = motion(IconButton);

export function WhatsAppButton() {
  const whatsappNumber = "573229132643";
  const message = "Hola Iván, vi tu portafolio, y me encuentro interesado en tus servicios.";
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  const handleClick = () => {
    // La función segura que abre el enlace en una nueva pestaña
    window.open(whatsappURL, '_blank', 'noopener,noreferrer');
  };

  return (
    <MotionIconButton
      // La funcionalidad correcta que ya probamos
      onClick={handleClick}
      
      // Todos los estilos y animaciones que queríamos
      isRound={true}
      size="lg"
      fontSize="32px"
      bg="#0bc5ea"
      color="gray.800"
      position="fixed"
      bottom="30px"
      right="30px"
      boxShadow="dark-lg"
      zIndex={1001}
      aria-label="Contactar por WhatsApp"
      icon={<FaWhatsapp />}
      
      // --- ANIMACIONES RESTAURADAS ---
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1, rotate: 15 }}
      whileTap={{ scale: 0.9 }}
    />
  );
}