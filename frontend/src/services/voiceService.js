/**
 * Start recording audio from microphone
 * 
 * @returns {Promise} - Object containing the MediaRecorder and audio chunks array
 */
export const startRecording = async () => {
    // Request microphone access
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // Create array to store audio chunks
    const chunks = [];
    
    // Create MediaRecorder instance
    const recorder = new MediaRecorder(stream);
    
    // Add data to chunks when available
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };
    
    // Start recording
    recorder.start();
    
    return { recorder, chunks };
  };
  
  /**
   * Stop audio recording
   * 
   * @param {MediaRecorder} recorder - The active MediaRecorder instance
   */
  export const stopRecording = (recorder) => {
    // Stop the recorder if it's recording
    if (recorder && recorder.state === 'recording') {
      recorder.stop();
      
      // Stop all audio tracks to release the microphone
      recorder.stream.getTracks().forEach(track => track.stop());
    }
  };
  
  /**
   * Convert audio data to WAV format
   * (Note: In a production app, you might want a more robust solution)
   * 
   * @param {Blob} audioBlob - The audio data as a Blob
   * @returns {Promise} - Promise resolving to WAV blob
   */
  export const convertToWav = async (audioBlob) => {
    // In a real application, you'd do proper audio conversion here.
    // For this demo, we'll just return the blob as we're using WAV format by default.
    return audioBlob;
  };
  
  /**
   * Play audio from base64 string
   * 
   * @param {string} base64Audio - Base64 encoded audio data
   * @returns {HTMLAudioElement} - The audio element playing the sound
   */
  export const playAudioFromBase64 = (base64Audio) => {
    // Create audio element
    const audio = new Audio(`data:audio/mpeg;base64,${base64Audio}`);
    
    // Play the audio
    audio.play().catch(err => {
      console.error('Failed to play audio:', err);
    });
    
    return audio;
  };