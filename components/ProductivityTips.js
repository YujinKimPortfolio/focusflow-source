// Here, I used React and hooks like useState and useEffect to manage the user's conversation history as well as their prompts they input, and the loading state. I wanted this component to work with the local server and the backend route to send prompts to the OpenAI API (additional feature I wanted to implement), and receive personalized productivity advice. 

// This file would also interact with files like App.js, where I managed the overall page view and determine when this screen (productivity tips) would be shown.

// It took me around 4 hours to build and connect this feature, including setting up the backend server and learning how to securely play with OpenAI API key without exposing them on the frontend (the key skill I learned). 

// I also had to review asynchronous concpets like fetch, promises, error handling using try and catch, as an extension of what we did in class. 

// I feel like this is one of the most challenging & rewarding part of my project as I managed to handle the realistic API interaction.

import React, { useState, useEffect } from 'react';

function ProductivityTips({ tasks, onClose }) {
  const [tip, setTip] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userPrompt, setUserPrompt] = useState('');
  const [conversation, setConversation] = useState([]);

  // Helper function = Build a prompt from the user's current tasks
  // I wanted the initial AI message to actually know what tasks the user had
  const generateTaskContext = () => {
    if (tasks.length === 0) {
      return "I don't have any tasks at the moment. Give me general productivity advice.";
    }

    const categories = {};
    tasks.forEach(task => {
      const cat = task.category || 'uncategorized';
      if (!categories[cat]) {
        categories[cat] = [];
      }
      categories[cat].push(task.description);
    });

    let context = "Here are my current tasks by category:\n\n";

    Object.keys(categories).forEach(category => {
      context += `${category.toUpperCase()}:\n`;
      categories[category].forEach(task => {
        context += `- ${task}\n`;
      });
      context += '\n';
    });

    context += "Based on these tasks, can you give me some productivity advice?";

    return context;
  };

  // Actually calling my local server here = calling OpenAI API. Here, I used fetch, async, await like we practiced in class with simpler APIs
  // with organizing the order of functions, I got Chat GPT's help by a little
  const callOpenAIAPI = async (prompt) => {
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();

      // Updating the chat history with both user prompt and AI response - this one was made by genAI
      setConversation(prev => [
        ...prev,
        { role: 'user', content: prompt },
        { role: 'assistant', content: data }
      ]);
      setTip(data);
    } catch (error) {
      console.error('Error communicating with AI server:', error);
      setConversation(prev => [
        ...prev,
        { role: 'assistant', content: "⚠️ Failed to get a response. Please try again later." }
      ]);
    } finally {
      setIsLoading(false);
      setUserPrompt('');
    }
  };

  // Here, I used useEffect to automatically send the user's task list when the tips page first loads
  useEffect(() => {
    const taskContext = generateTaskContext();
    callOpenAIAPI(taskContext);
  }, []);

  // Handle user sending a new prompt
  const handleSendPrompt = (e) => {
    e.preventDefault();
    if (!userPrompt.trim()) return;

    callOpenAIAPI(userPrompt);
  };

  // As I struggled to find errors in the following part, Chat GPT helped a lot with debugging
  return (
    <div className="productivity-tips-screen">
      <div className="tips-header">
        <h2>AI Productivity Assistant</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="conversation-container">
        {conversation.length === 0 ? (
          <div className="loading-message">
            {isLoading ? (
              <p>Analyzing your tasks and generating personalized advice...</p>
            ) : (
              <p>No conversation yet. Ask for productivity advice!</p>
            )}
          </div>
        ) : (
          <div className="conversation">
            {conversation.map((message, index) => (
              <div
                key={index}
                className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
              >
                <div className="message-content">
                  {message.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="message assistant-message loading">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <form className="prompt-form" onSubmit={handleSendPrompt}>
        <input
          type="text"
          placeholder="Ask for specific productivity advice..."
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !userPrompt.trim()}>
          Send
        </button>
      </form>

      <div className="tips-footer">
        <p className="tips-note">
          <strong>Note:</strong> This feature uses a real OpenAI API call through a local server to provide productivity advice based on your tasks.
        </p>
      </div>
    </div>
  );
}

export default ProductivityTips;
