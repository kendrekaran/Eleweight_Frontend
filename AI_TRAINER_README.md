# AI Gym Trainer Chatbot

## Overview
The AI Gym Trainer Chatbot is a specialized assistant that helps users with fitness, gym workouts, and healthcare-related questions. It's powered by Google's Gemini AI and is designed to provide personalized workout guidance, exercise tutorials, and equipment usage instructions.

## Features

### 1. Fitness Knowledge Base
- Answers questions about workouts, exercises, and fitness routines
- Provides guidance on proper form and technique
- Offers diet and nutrition advice related to fitness goals
- Suggests workout plans based on user goals and equipment availability

### 2. Gym Equipment Recognition
- Upload or capture images of gym machines
- AI identifies the equipment and provides:
  - Usage instructions
  - Target muscle groups
  - Exercise benefits
  - Proper form guidance

### 3. Restricted to Fitness Topics
- The AI is programmed to only discuss topics related to fitness, gym, and healthcare
- It will politely decline to answer questions outside these domains

## How to Use

### Text Queries
1. Click the dumbbell icon in the bottom-right corner of any page
2. Type your fitness-related question in the text input
3. Press Enter or click the send button
4. Receive personalized fitness guidance

### Image Analysis
1. Open the chatbot by clicking the dumbbell icon
2. Click the "Camera" button to use your device's camera or "Upload" to select an image
3. If using the camera, click "Capture" when the gym equipment is in frame
4. The AI will analyze the image and provide detailed information about the equipment

## Technical Implementation

The AI Trainer Chatbot is built using:
- React for the frontend UI
- Google Gemini API for AI processing
- React Webcam for camera functionality
- Tailwind CSS for styling

The chatbot is designed to be non-intrusive, appearing as a floating button that expands into a chat window when clicked.

## Privacy Note

Images uploaded or captured are only used for the immediate analysis and are not stored on our servers. All processing is done via the Google Gemini API with appropriate privacy measures in place.

## Feedback and Improvements

We're constantly working to improve the AI Trainer's knowledge and capabilities. If you have suggestions or encounter any issues, please let us know through the feedback form in the app settings. 