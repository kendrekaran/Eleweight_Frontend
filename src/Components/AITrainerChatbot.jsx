import React, { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Webcam from "react-webcam";
import { FiSend, FiX, FiCamera, FiUpload, FiChevronDown, FiChevronUp, FiTrash2 } from "react-icons/fi";
import { FaDumbbell, FaRegUserCircle, FaRobot } from "react-icons/fa";
import { TbMessageChatbotFilled } from "react-icons/tb";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

const AITrainerChatbot = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [showTips, setShowTips] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const typingIntervalRef = useRef(null);

  // Initialize the Gemini API with your API key from .env
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  // The fitness-specific prompt that restricts the AI to fitness topics
  const fitnessPrompt = `
    You are an AI Gym Trainer specializing in fitness, gym workouts, and healthcare. You are NOT allowed to talk about anything unrelated to these topics.  

    ### User Inputs You Can Handle:
    - Answer gym and workout-related questions.
    - Provide exercise tutorials based on user queries.
    - Analyze images of gym machines and explain how to use them.
    - Suggest fitness routines and diet plans.
    - DO NOT discuss politics, entertainment, or any non-health topics.

    ### Image Processing:
    If the user uploads an image of a gym machine, identify it and provide:
    1. Usage Instructions for that machine.
    2. Exercise Benefits (which muscles it targets).

    ### Response Format:
    - Use markdown formatting for clarity
    - Use bold text for section headers
    - Use bullet points for lists
    - Include emoji where appropriate

    If the image is NOT related to fitness/gym, politely decline:  
    "I can only assist with gym equipment and fitness-related images."
  `;

  // Suggested questions for users
  const suggestedQuestions = [
    "How do I perform a proper squat?",
    "What's a good beginner workout routine?",
    "How often should I train each muscle group?",
    "What's the best way to lose belly fat?",
  ];

  // Effect to focus on input when chat is opened
  useEffect(() => {
    if (chatOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [chatOpen]);

  // Function to scroll to the bottom of the chat container
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // Effect to scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, typingText]);

  // Function to clear chat history
  const clearChat = () => {
    setMessages([]);
    setTypingText("");
    setIsTyping(false);
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }
  };

  // Function to simulate typing effect
  const simulateTyping = (text) => {
    setIsTyping(true);
    setTypingText("");
    
    let i = 0;
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }
    
    typingIntervalRef.current = setInterval(() => {
      if (i < text.length) {
        setTypingText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typingIntervalRef.current);
        setIsTyping(false);
        setMessages((prev) => [...prev, { role: "bot", content: text }]);
        setTypingText("");
      }
    }, 15); // Speed of typing
  };

  // Cleanup typing effect on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  // Function to send a message to the Gemini API
  const sendMessage = async (text, imageBase64 = null) => {
    if (!text && !imageBase64) return;

    // Add user message to chat
    const userMessage = text || "What is this gym equipment?";
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInputText("");
    setIsLoading(true);
    setImageData(null);

    try {
      // Configure the model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Prepare the chat history with the fitness prompt
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: fitnessPrompt }],
          },
          {
            role: "model",
            parts: [{ text: "I'll be your AI Gym Trainer, focused only on fitness, workouts, and health topics. How can I help you today?" }],
          },
        ],
      });

      // Prepare the message parts
      const messageParts = [];
      
      // Add image if provided
      if (imageBase64) {
        messageParts.push({
          inlineData: {
            mimeType: "image/jpeg",
            data: imageBase64,
          },
        });
      }
      
      // Add text
      messageParts.push({ text: userMessage });

      // Send the message to the API
      const result = await chat.sendMessage(messageParts);
      const response = await result.response;
      const botReply = response.text();

      // Start typing effect instead of immediately adding the message
      simulateTyping(botReply);
    } catch (error) {
      console.error("Error sending message to Gemini API:", error);
      simulateTyping("Sorry, I encountered an error. Please try again.");
    } finally {
      setIsLoading(false);
      setShowCamera(false);
    }
  };

  // Function to handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1];
      setImageData(base64String);
      sendMessage("", base64String);
    };
    reader.readAsDataURL(file);
  };

  // Function to capture image from webcam
  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      const base64String = imageSrc.split(",")[1];
      setImageData(base64String);
      sendMessage("", base64String);
    }
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      sendMessage(inputText);
    }
  };

  // Function to handle suggested question click
  const handleSuggestedQuestionClick = (question) => {
    setInputText(question);
    sendMessage(question);
  };

  return (
    <div className="relative z-50">
      {/* Floating Chat Button */}
      <button
        className="flex fixed right-4 bottom-4 justify-center items-center p-3 text-white bg-gradient-to-r from-purple-600 to-purple-700 rounded-full shadow-lg transition-all duration-300 transform sm:right-5 sm:bottom-5 sm:p-4 hover:from-purple-700 hover:to-purple-800 hover:scale-105"
        onClick={() => setChatOpen(!chatOpen)}
        aria-label="Toggle AI Trainer Chat"
      >
        {chatOpen ? <FiX size={22} /> : <TbMessageChatbotFilled size={22} />}
      </button>

      {/* Chat Window */}
      {chatOpen && (
        <div className="fixed bottom-16 sm:bottom-20 right-2 sm:right-5 w-[calc(100%-16px)] sm:w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col max-h-[80vh] sm:max-h-[600px] overflow-hidden transition-all duration-300 animate-slideIn">
          {/* Chat Header */}
          <div className="flex justify-between items-center p-3 text-white bg-gradient-to-r from-purple-600 to-purple-800 rounded-t-xl sm:p-4">
            <div className="flex items-center">
              <FaDumbbell className="mr-2 text-yellow-300" size={20} />
              <h3 className="text-base font-bold sm:text-lg">AI Gym Trainer</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={clearChat}
                className="text-white transition-colors hover:text-gray-200"
                aria-label="Clear chat"
                title="Clear chat"
              >
                <FiTrash2 size={18} />
              </button>
              <button
                onClick={() => setChatOpen(false)}
                className="text-white transition-colors hover:text-gray-200"
                aria-label="Close chat"
              >
                <FiX size={18} />
              </button>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-purple-50 border-b border-purple-100">
            <button 
              className="flex justify-between items-center px-3 py-2 w-full text-purple-700 transition-colors sm:px-4 hover:bg-purple-100"
              onClick={() => setShowTips(!showTips)}
            >
              <span className="text-sm font-medium sm:text-base">Tips for better results</span>
              {showTips ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {showTips && (
              <div className="px-3 py-2 text-xs text-purple-800 sm:px-4 sm:py-3 sm:text-sm">
                <ul className="pl-4 space-y-1 list-disc sm:pl-5">
                  <li>Be specific about your fitness goals</li>
                  <li>Mention any limitations or injuries</li>
                  <li>Take clear photos of equipment</li>
                  <li>Ask about proper form to avoid injuries</li>
                </ul>
              </div>
            )}
          </div>

          {/* Chat Messages */}
          <div 
            ref={chatContainerRef}
            className="overflow-y-auto flex-1 p-3 space-y-3 bg-gray-50 sm:p-4 sm:space-y-4"
          >
            {/* Welcome Message */}
            {messages.length === 0 && (
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-100 sm:p-4">
                <h4 className="mb-2 text-sm font-semibold text-purple-800 sm:text-base">
                  👋 Welcome to your AI Gym Trainer!
                </h4>
                <p className="mb-3 text-xs text-gray-700 sm:text-sm">
                  Ask me anything about workouts, exercise technique, or upload a photo of gym equipment for guidance.
                </p>
                <div className="mt-2 sm:mt-3">
                  <p className="mb-2 text-xs font-medium text-purple-700 sm:text-sm">Try asking:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestedQuestionClick(question)}
                        className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 bg-white text-purple-700 rounded-full border border-purple-200 hover:bg-purple-100 transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Message Bubbles */}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className="flex items-start max-w-[90%] sm:max-w-[85%]">
                  {msg.role !== "user" && (
                    <div className="mr-1 sm:mr-2 mt-1 bg-purple-600 text-white p-1 sm:p-1.5 rounded-full">
                      <FaRobot size={12} className="sm:hidden" />
                      <FaRobot size={14} className="hidden sm:block" />
                    </div>
                  )}
                  <div
                    className={`p-2 sm:p-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-purple-600 text-white rounded-tr-none"
                        : "bg-white text-gray-800 rounded-tl-none border border-gray-200 shadow-sm"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <div className="text-sm sm:text-base">{msg.content}</div>
                    ) : (
                      <div className="max-w-none markdown-body prose prose-sm">
                        <ReactMarkdown 
                          rehypePlugins={[rehypeRaw]} 
                          remarkPlugins={[remarkGfm]}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="ml-1 sm:ml-2 mt-1 bg-gray-300 text-gray-700 p-1 sm:p-1.5 rounded-full">
                      <FaRegUserCircle size={12} className="sm:hidden" />
                      <FaRegUserCircle size={14} className="hidden sm:block" />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start max-w-[90%] sm:max-w-[85%]">
                  <div className="mr-1 sm:mr-2 mt-1 bg-purple-600 text-white p-1 sm:p-1.5 rounded-full">
                    <FaRobot size={12} className="sm:hidden" />
                    <FaRobot size={14} className="hidden sm:block" />
                  </div>
                  <div className="p-2 text-gray-800 bg-white rounded-lg rounded-tl-none border border-gray-200 shadow-sm sm:p-3">
                    <div className="max-w-none markdown-body prose prose-sm">
                      <ReactMarkdown 
                        rehypePlugins={[rehypeRaw]} 
                        remarkPlugins={[remarkGfm]}
                      >
                        {typingText}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start max-w-[90%] sm:max-w-[85%]">
                  <div className="mr-1 sm:mr-2 mt-1 bg-purple-600 text-white p-1 sm:p-1.5 rounded-full">
                    <FaRobot size={12} className="sm:hidden" />
                    <FaRobot size={14} className="hidden sm:block" />
                  </div>
                  <div className="p-3 text-gray-800 bg-white rounded-lg rounded-tl-none border border-gray-200 shadow-sm">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Webcam View */}
          {showCamera && (
            <div className="p-3 bg-gray-50 border-t border-gray-200 sm:p-4">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "environment" }}
                className="w-full rounded-lg shadow-md"
              />
              <div className="flex justify-center mt-2 space-x-2 sm:mt-3 sm:space-x-3">
                <button
                  onClick={captureImage}
                  className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-sm text-white bg-purple-600 rounded-lg transition-colors hover:bg-purple-700"
                >
                  <FiCamera className="mr-1 sm:mr-2" /> Capture
                </button>
                <button
                  onClick={() => setShowCamera(false)}
                  className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-sm text-gray-700 bg-gray-200 rounded-lg transition-colors hover:bg-gray-300"
                >
                  <FiX className="mr-1 sm:mr-2" /> Cancel
                </button>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-200 sm:p-4">
            <form onSubmit={handleSubmit} className="flex gap-2 items-center">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about fitness or workouts..."
                className="flex-1 p-2 text-sm rounded-l-lg border border-gray-300 sm:p-3 sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="p-3 text-white bg-purple-600 rounded-r-lg sm:p-4 hover:bg-purple-700"
                disabled={isLoading || isTyping}
              >
                <FiSend size={18} />
              </button>
            </form>

            {/* Image Upload Options */}
            <div className="flex mt-2 space-x-2">
              <button
                onClick={() => setShowCamera(!showCamera)}
                className="flex justify-center items-center px-2 py-1 text-xs text-gray-700 bg-gray-200 rounded-lg sm:px-3 sm:text-sm hover:bg-gray-300"
                disabled={isLoading || isTyping}
              >
                <FiCamera className="mr-1" /> Camera
              </button>
              <button
                onClick={() => fileInputRef.current.click()}
                className="flex justify-center items-center px-2 py-1 text-xs text-gray-700 bg-gray-200 rounded-lg sm:px-3 sm:text-sm hover:bg-gray-300"
                disabled={isLoading || isTyping}
              >
                <FiUpload className="mr-1" /> Upload
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AITrainerChatbot; 