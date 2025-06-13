// src/components/Chatbot.jsx
import { useState } from 'react';
import { askChatbot } from '../services/api';

export function Chatbot() {
    const [messages, setMessages] = useState([{ text: '¡Hola! Soy el asistente digital de Ivan. ¿En qué puedo ayudarte?', sender: 'bot' }]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (input.trim() === '') return;

        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await askChatbot(input);
            const botMessage = { text: response.data.answer, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage = { text: 'Lo siento, tuve un problema para conectarme. Intenta de nuevo.', sender: 'bot' };
            setMessages(prev => [...prev, errorMessage]);
            console.error("Error al contactar al chatbot:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chatbot-window">
            <div className="messages-area">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        <p>{msg.text}</p>
                    </div>
                ))}
                {isLoading && <div className="message bot"><p>Pensando...</p></div>}
            </div>
            <div className="input-area">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Pregúntame algo..."
                />
                <button onClick={handleSend} disabled={isLoading}>Enviar</button>
            </div>
        </div>
    );
}