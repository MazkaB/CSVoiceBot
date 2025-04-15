import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaMicrophone, FaStop, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { sendVoiceQuery } from '../services/api';
import { startRecording, stopRecording } from '../services/voiceService';

function VoiceBot({ onClose }) {
  // State variables
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioResponse, setAudioResponse] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [error, setError] = useState(null);
  
  // References
  const audioPlayer = useRef(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  
  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
        mediaRecorder.current.stop();
      }
      if (audioPlayer.current) {
        audioPlayer.current.pause();
      }
    };
  }, []);
  
  // Handle recording start
  const handleStartRecording = async () => {
    try {
      setError(null);
      setIsRecording(true);
      
      const { recorder, chunks } = await startRecording();
      mediaRecorder.current = recorder;
      audioChunks.current = chunks;
      
      // Handle recording stop event
      mediaRecorder.current.onstop = async () => {
        setIsRecording(false);
        setIsProcessing(true);
        
        try {
          // Create audio blob and send to server
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
          
          // Send audio to backend
          const response = await sendVoiceQuery(audioBlob, conversationHistory);
          
          // Update state with response
          setTranscript(response.transcript);
          setAudioResponse(response.audio_response);
          setConversationHistory(JSON.parse(response.conversation_history));
          setIsProcessing(false);
          
          // Play audio response if available
          if (response.audio_response) {
            playAudioResponse(response.audio_response);
          }
        } catch (error) {
          console.error('Error processing voice:', error);
          setError('Failed to process your request. Please try again.');
          setIsProcessing(false);
        }
      };
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Could not access microphone. Please check your browser permissions.');
      setIsRecording(false);
    }
  };
  
  // Handle recording stop
  const handleStopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      stopRecording(mediaRecorder.current);
    }
  };
  
  // Play audio response
  const playAudioResponse = (base64Audio) => {
    const audio = new Audio(`data:audio/mpeg;base64,${base64Audio}`);
    audioPlayer.current = audio;
    
    audio.onplay = () => setIsPlaying(true);
    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => {
      setIsPlaying(false);
      setError('Failed to play audio response.');
    };
    
    audio.play();
  };
  
  // Toggle audio playback
  const toggleAudioPlayback = () => {
    if (audioPlayer.current) {
      if (isPlaying) {
        audioPlayer.current.pause();
        setIsPlaying(false);
      } else {
        audioPlayer.current.play();
      }
    } else if (audioResponse) {
      playAudioResponse(audioResponse);
    }
  };
  
  return (
    <div className="voice-bot-container">
      <div className="voice-bot-header">
        <h2>Customer Service Assistant</h2>
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>
      </div>
      
      <div className="voice-bot-content">
        {/* Conversation area */}
        <div className="conversation-area">
          {conversationHistory.map((message, index) => (
            <div 
              key={index} 
              className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
            >
              <div className="message-bubble">
                {message.content}
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="processing-indicator">
              <div className="spinner"></div>
              <p>Processing your request...</p>
            </div>
          )}
        </div>
        
        {/* Error message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {/* Transcript area - only show during/after recording */}
        {(isRecording || transcript) && (
          <div className="transcript-area">
            <h3>You said:</h3>
            <p>{isRecording ? 'Listening...' : transcript}</p>
          </div>
        )}
      </div>
      
      <div className="voice-bot-controls">
        {/* Recording button */}
        <button 
          className={`record-btn ${isRecording ? 'recording' : ''}`}
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          disabled={isProcessing}
        >
          {isRecording ? <FaStop /> : <FaMicrophone />}
          <span>{isRecording ? 'Stop' : 'Speak'}</span>
        </button>
        
        {/* Playback button - only show when there's an audio response */}
        {audioResponse && (
          <button 
            className="playback-btn"
            onClick={toggleAudioPlayback}
          >
            {isPlaying ? <FaVolumeMute /> : <FaVolumeUp />}
            <span>{isPlaying ? 'Mute' : 'Listen'}</span>
          </button>
        )}
      </div>
      
      <div className="voice-bot-footer">
        <p>Ask about products, order status, returns, or shipping</p>
      </div>
    </div>
  );
}

export default VoiceBot;