// components/chatbot/ChatbotWidget.js
import { useState, useEffect, useRef } from 'react';
import api from '../../lib/api'; // Our API client to talk to the backend

// --- Reusable Sub-Components for the Chat ---
const BotMessage = ({ text }) => (
  <div className="flex justify-start mb-2">
    <div className="bg-gray-200 text-gray-800 p-2 rounded-lg max-w-xs break-words">{text}</div>
  </div>
);

const UserMessage = ({ text }) => (
  <div className="flex justify-end mb-2">
    <div className="bg-blue-600 text-white p-2 rounded-lg max-w-xs break-words">{text}</div>
  </div>
);

const TypingIndicator = () => (
    <div className="flex justify-start mb-2">
        <div className="bg-gray-200 text-gray-500 p-2 rounded-lg">...</div>
    </div>
);


export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ type: 'bot', text: "Hello! As Alumni Assist, I can answer general questions. How can I help you today?" }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null); // Ref for auto-scrolling

  // This effect will scroll to the bottom of the chat window whenever a new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Add the user's message to the chat immediately
    const userMessage = { type: 'user', text: input };
    const newMessages = [...messages, userMessage]; // Capture the state before the update
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // --- THIS IS THE KEY CHANGE ---
      // We now send the new user query AND the entire conversation history.
      const response = await api.post('/chatbot/query/', { 
        query: input,
        history: newMessages 
      });
      // --- END OF KEY CHANGE ---
      
      const botMessage = { type: 'bot', text: response.data.response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { type: 'bot', text: "Sorry, I'm having trouble connecting. Please try again later." };
      setMessages(prev => [...prev, errorMessage]);
      console.error("Chatbot query failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)} 
        className="fixed bottom-5 right-5 bg-blue-600 text-white w-16 h-16 flex items-center justify-center rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 z-50"
        aria-label="Open Chatbot"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 w-80 h-[450px] bg-white rounded-lg shadow-xl flex flex-col z-50">
      <div className="bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-lg">
        <h3 className="font-semibold">Alumni Assist</h3>
        <button onClick={() => setIsOpen(false)} className="text-2xl font-bold leading-none">&times;</button>
      </div>
      <div className="flex-grow p-3 overflow-y-auto">
        {messages.map((msg, index) => 
          msg.type === 'bot' ? <BotMessage key={index} text={msg.text} /> : <UserMessage key={index} text={msg.text} />
        )}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="p-3 border-t flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="w-full p-2 border rounded-lg"
          disabled={isLoading}
        />
        <button type="submit" className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg" disabled={isLoading}>Send</button>
      </form>
    </div>
  );
}