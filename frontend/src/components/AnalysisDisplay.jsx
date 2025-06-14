// src/components/AnalysisDisplay.jsx (Versión Final con Parseo Universal de Negritas)

import React from 'react';
import { Box, Heading, Text, List, ListItem, ListIcon } from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';

// --- NUEVA FUNCIÓN AYUDANTE PARA RENDERIZAR NEGRITAS ---
// Esta función toma una línea de texto y la convierte en componentes de React,
// poniendo en negrita cualquier cosa que esté entre **...**
const renderWithBold = (text) => {
  // Dividimos el texto por el patrón de negritas, pero mantenemos el patrón en el resultado
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      // Si la parte está encerrada en **, la renderizamos como texto en negrita
      return <Text as="span" key={i} fontWeight="bold" color="white">{part.slice(2, -2)}</Text>;
    }
    // Si no, la renderizamos como texto normal
    return part;
  });
};


export function AnalysisDisplay({ analysisText }) {
  if (!analysisText) return null;

  const cleanedText = analysisText.replace(/^###?\s*Análisis Personalizado:?\s*\n/i, '').trim();
  const lines = cleanedText.split('\n');

  // La lógica para agrupar las listas no cambia
  const contentBlocks = [];
  let currentListItems = [];

  lines.forEach(line => {
    if (line.trim().startsWith('- ')) {
      currentListItems.push(line.trim().substring(2));
    } else {
      if (currentListItems.length > 0) {
        contentBlocks.push({ type: 'list', items: currentListItems });
        currentListItems = [];
      }
      contentBlocks.push({ type: 'line', content: line });
    }
  });

  if (currentListItems.length > 0) {
    contentBlocks.push({ type: 'list', items: currentListItems });
  }

  // --- RENDERIZADO DE LOS BLOQUES USANDO LA NUEVA FUNCIÓN ---
  return (
    <Box>
      {contentBlocks.map((block, index) => {
        // --- Renderizado para Bloques de Lista ---
        if (block.type === 'list') {
          return (
            <List key={index} spacing={3} mb={4} pl={2}>
              {block.items.map((item, itemIndex) => (
                <ListItem key={itemIndex} display="flex" alignItems="flex-start">
                  <ListIcon as={FaCheckCircle} color="cyan.500" mt={1} />
                  {/* Usamos nuestra nueva función para renderizar el contenido del item */}
                  <Text as="span" ml={2}>{renderWithBold(item)}</Text>
                </ListItem>
              ))}
            </List>
          );
        }

        const line = block.content;
        
        // --- Renderizado para Líneas Individuales ---
        if (line.startsWith('###')) {
          return (
            <Heading key={index} as="h4" size="md" color="cyan.400" mt={6} mb={4}>
              {renderWithBold(line.substring(4))}
            </Heading>
          );
        }
        
        if (line.trim() !== '') {
          return (
            <Text key={index} mb={4} lineHeight="tall">
              {/* Usamos nuestra nueva función para cualquier otra línea */}
              {renderWithBold(line)}
            </Text>
          );
        }
        return null;
      })}
    </Box>
  );
}