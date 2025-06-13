// src/components/ProjectMatchmaker.jsx
import { AnalysisDisplay } from './AnalysisDisplay.jsx';
import React, { useState } from 'react';
import { Box, Heading, Text, Textarea, Button, VStack, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { matchProject } from '../services/api';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export function ProjectMatchmaker() {
    const [description, setDescription] = useState('');
    const [analysis, setAnalysis] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (description.trim() === '') return;
        setIsLoading(true);
        setError('');
        setAnalysis('');
        
        // ¡LA MODIFICACIÓN ESTÁ AQUÍ! Limpiamos el textarea inmediatamente.
        setDescription('');

        try {
            const response = await matchProject(description);
            setAnalysis(response.data.analysis);
        } catch (err) {
            setError('Ocurrió un error al generar el análisis. Inténtalo de nuevo.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <VStack spacing={6} align="stretch">
            <Textarea
                placeholder="Describe brevemente tu idea o proyecto aquí. Por ejemplo: 'Necesito una tienda online para mi marca de café' o 'Quiero automatizar los reportes de mi empresa'."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                size="lg"
                bg="gray.700"
                minHeight="150px"
            />
            <Button
                colorScheme="cyan"
                size="lg"
                onClick={handleSubmit}
                isLoading={isLoading}
                loadingText="Analizando..."
            >
                Analizar mi Proyecto con IA
            </Button>

            {analysis && (
                <MotionBox 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    bg="gray.700" 
                    p={6} 
                    borderRadius="md"
                    mt={4}
                >
                    <Heading size="md" mb={4}>Análisis Personalizado:</Heading>
                    <AnalysisDisplay analysisText={analysis} />
                </MotionBox>
            )}
            {error && (
                <Alert status="error" borderRadius="md" mt={4}>
                    <AlertIcon />
                    {error}
                </Alert>
            )}
        </VStack>
    );
}