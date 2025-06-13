// src/components/Chatbot.jsx
import React, { useState, useEffect, useRef } from 'react';
import { askChatbot } from '../services/api';
// Importamos componentes de Chakra y un nuevo ícono
import { Box, VStack, Text, Input, Button, IconButton, Fade, HStack } from '@chakra-ui/react';
import { FaCommentDots, FaTimes } from 'react-icons/fa';

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{ text: '¡Hola! Soy el asistente digital de Ivan. Pregúntame sobre su experiencia, habilidades o proyectos.', sender: 'bot' }]);
        }
    }, [isOpen, messages.length]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;
        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await askChatbot(input);
            const botMessage = { text: response.data.answer.replace(/\n/g, '<br />'), sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage = { text: 'Lo siento, tuve un problema para conectarme.', sender: 'bot' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* CORRECCIÓN 7: El botón ahora es un IconButton de Chakra, muy visible */}
            <IconButton
                isRound
                size="lg"
                fontSize="24px"
                colorScheme="cyan"
                position="fixed"
                bottom="20px"
                right="20px"
                boxShadow="lg"
                zIndex={1001}
                icon={isOpen ? <FaTimes /> : <FaCommentDots />}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Abrir chatbot"
            />
            
            <Fade in={isOpen}>
                <Box
                    position="fixed"
                    bottom="100px"
                    right="20px"
                    width="350px"
                    height="500px"
                    bg="gray.800"
                    borderRadius="lg"
                    boxShadow="dark-lg"
                    display="flex"
                    flexDirection="column"
                    zIndex={1000}
                >
                    <VStack spacing={4} p={4} flexGrow={1} overflowY="auto" align="stretch">
                        {messages.map((msg, index) => (
                            <Box
                                key={index}
                                bg={msg.sender === 'user' ? 'cyan.500' : 'gray.700'}
                                color={msg.sender === 'user' ? 'black' : 'white'}
                                p={3}
                                borderRadius="lg"
                                alignSelf={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
                                maxW="80%"
                            >
                                <Text dangerouslySetInnerHTML={{ __html: msg.text }} />
                            </Box>
                        ))}
                        {isLoading && <Text alignSelf="flex-start" bg="gray.700" p={3} borderRadius="lg">Pensando...</Text>}
                        <div ref={messagesEndRef} />
                    </VStack>
                    <Box p={4} borderTop="1px" borderColor="gray.700">
                        <HStack>
                            <Input
                                placeholder="Pregúntame algo..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                disabled={isLoading}
                                variant="filled"
                                bg="gray.700"
                                _hover={{ bg: 'gray.600' }}
                                _focus={{ bg: 'gray.600', borderColor: 'cyan.500' }}
                            />
                            <Button colorScheme="cyan" onClick={handleSend} isLoading={isLoading}>Enviar</Button>
                        </HStack>
                    </Box>
                </Box>
            </Fade>
        </>
    );
}