// src/components/AnalysisDisplay.jsx (Versión Final con Alineación Corregida)

import React from 'react';
import { Box, Heading, Text, List, ListItem, ListIcon } from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';

export function AnalysisDisplay({ analysisText }) {
  if (!analysisText) return null;

  const lines = analysisText.split('\n');

  return (
    <Box>
      {lines.map((line, index) => {
        if (line.startsWith('###')) {
          return (
            <Heading key={index} as="h4" size="md" color="cyan.400" mt={6} mb={3}>
              {line.substring(4)}
            </Heading>
          );
        }
        if (line.startsWith('- ')) {
          return (
            <List key={index} spacing={2}>
                {/* LA MODIFICACIÓN ESTÁ AQUÍ: de 'center' a 'flex-start' */}
                <ListItem display="flex" alignItems="flex-start">
                    <ListIcon as={FaCheckCircle} color="cyan.500" mt={1} />
                    {line.substring(2)}
                </ListItem>
            </List>
          );
        }
        if (line.trim() !== '') {
          return (
            <Text key={index} mb={4} lineHeight="tall">
              {line}
            </Text>
          );
        }
        return null;
      })}
    </Box>
  );
}