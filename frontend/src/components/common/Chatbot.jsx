import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

const quickReplies = [
  "Find a doctor",
  "How can I book an appointment?",
  "What specializations are available?",
  "How do I cancel an appointment?",
  "Help me navigate OCS"
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your OCS Health Assistant. How can I help you today?", isUser: false, timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages & listen for custom open trigger
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    const handleOpenEvent = () => setIsOpen(true);
    window.addEventListener('open-ocs-chatbot', handleOpenEvent);
    return () => window.removeEventListener('open-ocs-chatbot', handleOpenEvent);
  }, []);

  const handleSend = (text) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMsg = { text: text.trim(), isUser: true, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Simulate AI response (since we don't have a backend AI endpoint yet)
    // IMPORTANT: Actual AI integration should be done via a backend API.
    // DO NOT hardcode OpenAI/Groq keys here in the React frontend!
    setTimeout(() => {
      let aiText = "I'm a demo assistant. To get real answers, please connect me to the OCS backend AI endpoint.";
      
      const lowerText = text.toLowerCase();
      if (lowerText.includes('find a doctor') || lowerText.includes('specialization')) {
        aiText = "You can find doctors by navigating to the 'Doctors' or 'Search Doctors' section from the top menu. You can filter them by specialization like Cardiology, Dermatology, etc.";
      } else if (lowerText.includes('book an appointment')) {
        aiText = "To book an appointment, please search for a doctor in the directory, click 'Book Appointment', and select an available time slot.";
      } else if (lowerText.includes('cancel')) {
        aiText = "You can cancel your appointment from your Patient Dashboard under 'My Bookings'.";
      }

      setMessages(prev => [...prev, { text: aiText, isUser: false, timestamp: new Date() }]);
    }, 1000);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <button 
        className="chatbot-toggle" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Health Assistant"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <Bot size={20} />
              <span>OCS Health Assistant</span>
            </div>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`chat-message ${msg.isUser ? 'message-user' : 'message-ai'}`}
              >
                {msg.text}
                <div style={{ fontSize: '0.7rem', marginTop: '4px', opacity: 0.8, textAlign: msg.isUser ? 'right' : 'left' }}>
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-quick-replies">
            {quickReplies.map((reply, i) => (
              <button 
                key={i} 
                className="quick-reply-btn"
                onClick={() => handleSend(reply)}
              >
                {reply}
              </button>
            ))}
          </div>

          <form 
            className="chatbot-input" 
            onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}
          >
            <input 
              type="text" 
              placeholder="Type your message..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit" className="chatbot-send" disabled={!inputValue.trim()}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
