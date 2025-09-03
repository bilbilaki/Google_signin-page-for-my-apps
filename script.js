document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('send-btn');
    const chatInput = document.getElementById('chat-input');
    const chatWindow = document.getElementById('chat-window');
    const loader = document.getElementById('loader');

    let conversationHistory = [
        {
            role: 'system',
            content: 'You are a helpful and friendly AI assistant. Keep your responses concise.'
        }
    ];
    
    // Add initial AI message to history for context, but it's already in the DOM
    conversationHistory.push({ role: 'assistant', content: 'Hello! How can I help you today?' });

    const addMessage = (role, content) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${role}-message`);
        
        const p = document.createElement('p');
        p.textContent = content;
        messageDiv.appendChild(p);

        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll to the latest message
    };

    const handleSend = async () => {
        const userMessage = chatInput.value.trim();
        if (!userMessage) {
            return;
        }

        // Add user message to UI and history
        addMessage('user', userMessage);
        conversationHistory.push({ role: 'user', content: userMessage });
        chatInput.value = '';

        loader.style.display = 'block';
        sendBtn.disabled = true;
        chatInput.disabled = true;

        try {
            // Keep history from getting too long
            const recentHistory = conversationHistory.slice(-10);
            if(conversationHistory.length > 1 && conversationHistory[0].role === 'system'){
                recentHistory.unshift(conversationHistory[0]);
            }

            // If the `websim` runtime isn't available (for example viewing the
            // static page in a browser), don't attempt the network call and
            // instead show a friendly message.
            if (typeof window.websim === 'undefined' || !window.websim?.chat?.completions?.create) {
                console.warn('websim runtime not available; skipping AI call.');
                const fallback = 'AI backend is not available in this environment.';
                addMessage('ai', fallback);
                conversationHistory.push({ role: 'assistant', content: fallback });
            } else {
                const completion = await websim.chat.completions.create({
                    messages: recentHistory,
                });

                const aiResponse = completion.content;
                
                // Add AI response to UI and history
                addMessage('ai', aiResponse);
                conversationHistory.push({ role: 'assistant', content: aiResponse });
            }

        } catch (error) {
            console.error('Error fetching AI completion:', error);
            addMessage('ai', 'Sorry, an error occurred. Please try again.');
        } finally {
            loader.style.display = 'none';
            sendBtn.disabled = false;
            chatInput.disabled = false;
            chatInput.focus();
        }
    };

    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSend();
        }
    });
});