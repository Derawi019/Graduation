// Chatbot Module - Separate file to avoid breaking existing functionality
(function() {
    'use strict';
    
    let chatbotContext = null;
    let chatbotTopic = null;
    let conversationHistory = []; // Store conversation history for context
    
    // Initialize chatbot when translation completes
    function initializeChatbot(originalText, translatedText) {
        const chatbotContainer = document.getElementById('chatbot-container');
        if (!chatbotContainer) return;
        
        chatbotContainer.classList.remove('hidden');
        
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.innerHTML = `
            <div class="chatbot-message chatbot-assistant">
                <div class="chatbot-avatar">🤖</div>
                <div class="chatbot-content">
                    <p>Analyzing the topic of your translation...</p>
                </div>
            </div>
        `;
        
        document.getElementById('chatbot-loading').classList.remove('hidden');
        
        fetch('/api/chatbot/context', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({text: originalText, translated_text: translatedText})
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('chatbot-loading').classList.add('hidden');
            if (data.error) {
                addChatbotMessage('assistant', `Error: ${data.error}`);
                return;
            }
            chatbotTopic = data.topic;
            chatbotContext = data.context;
            // Reset conversation history for new translation
            conversationHistory = [];
            const welcomeMsg = `I detected you're translating about **${data.topic}**. Here's helpful context:\n\n${data.context}`;
            addChatbotMessage('assistant', welcomeMsg);
            // Add welcome message to conversation history
            conversationHistory.push({role: 'assistant', content: welcomeMsg});
        })
        .catch(error => {
            document.getElementById('chatbot-loading').classList.add('hidden');
            addChatbotMessage('assistant', 'Sorry, encountered an error. Please try again.');
            console.error('Chatbot error:', error);
        });
    }
    
    function addChatbotMessage(sender, message) {
        const messagesContainer = document.getElementById('chatbot-messages');
        if (!messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message chatbot-${sender}`;
        const avatar = sender === 'user' ? '👤' : '🤖';
        messageDiv.innerHTML = `
            <div class="chatbot-avatar">${avatar}</div>
            <div class="chatbot-content"><p>${formatMessage(message)}</p></div>
        `;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    function formatMessage(message) {
        return message
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    }
    
    window.toggleChatbot = function() {
        const chatbotContainer = document.getElementById('chatbot-container');
        if (chatbotContainer) chatbotContainer.classList.toggle('hidden');
    };
    
    window.handleChatbotKeyPress = function(event) {
        if (event.key === 'Enter') sendChatbotMessage();
    };
    
    async function sendChatbotMessage() {
        const input = document.getElementById('chatbot-input');
        if (!input) return;
        
        const message = input.value.trim();
        if (!message) return;
        
        addChatbotMessage('user', message);
        // Add user message to conversation history
        conversationHistory.push({role: 'user', content: message});
        
        input.value = '';
        input.disabled = true;
        const sendBtn = document.querySelector('.chatbot-send');
        if (sendBtn) sendBtn.disabled = true;
        
        document.getElementById('chatbot-loading').classList.remove('hidden');
        
        try {
            // Send conversation history excluding the current message (which was just added)
            const historyToSend = conversationHistory.slice(0, -1);
            console.log('Sending conversation history:', historyToSend.length, 'messages');
            console.log('Current conversation history:', conversationHistory.length, 'messages total');
            
            const response = await fetch('/api/chatbot/ask', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    question: message,
                    topic: chatbotTopic,
                    context: chatbotContext,
                    conversation_history: historyToSend // Send all previous messages except the current one
                })
            });
            
            const data = await response.json();
            document.getElementById('chatbot-loading').classList.add('hidden');
            
            if (!response.ok || data.error) {
                const errorMsg = data.error || 'Unknown error occurred';
                console.error('Chatbot error:', errorMsg);
                addChatbotMessage('assistant', `Error: ${errorMsg}`);
                conversationHistory.push({role: 'assistant', content: `Error: ${errorMsg}`});
            } else {
                addChatbotMessage('assistant', data.response);
                // Add assistant response to conversation history
                conversationHistory.push({role: 'assistant', content: data.response});
                console.log('Conversation history updated. Total messages:', conversationHistory.length);
            }
        } catch (error) {
            document.getElementById('chatbot-loading').classList.add('hidden');
            addChatbotMessage('assistant', 'Network error. Please try again.');
        } finally {
            input.disabled = false;
            if (sendBtn) sendBtn.disabled = false;
            input.focus();
        }
    }
    
    window.sendChatbotMessage = sendChatbotMessage;
    
    // Export function to be called from main script
    window.initChatbot = function(originalText, translatedText) {
        if (originalText && originalText.trim().length > 10) {
            initializeChatbot(originalText, translatedText);
        }
    };
})();

