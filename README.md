# Voice-Enabled Customer Service Bot for E-Commerce

This project implements a voice-based customer service bot for an e-commerce platform. The bot uses advanced AI to understand and respond to customer inquiries naturally, providing a seamless shopping experience.

https://github.com/user-attachments/assets/7847e0d5-e0c7-45ca-bfe7-eb9a99662fd6

## Features

- **Voice-Based Interaction**: Customers can speak naturally to ask questions and get assistance
- **Intent Recognition**: Automatically identifies the purpose of customer inquiries
- **Multi-Turn Dialogue**: Supports complex conversations with context retention
- **Product Catalog**: Browse through a selection of products
- **Order Status Tracking**: Check on existing orders
- **Shipping & Return Information**: Get details on shipping options and return policies
- **Responsive Design**: Works well on both desktop and mobile devices

## Technologies Used

### Backend
- **Python/Flask**: API development
- **OpenAI GPT-4-turbo**: Natural language understanding and generation
- **OpenAI Whisper**: Speech-to-text transcription
- **ElevenLabs**: Text-to-speech synthesis

### Frontend
- **React**: User interface development
- **Node.js v22.14.0**: JavaScript runtime
- **Axios**: API requests
- **Web Audio API**: Audio recording and playback

## Project Structure

The project is organized into two main directories:

- `backend/`: Contains the Flask API
- `frontend/`: Contains the React application

## Installation

### Prerequisites
- Python 3.9+ 
- Node.js v22.14.0
- API keys for OpenAI and ElevenLabs

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

4. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Create a `.env` file with your API keys:
   ```
   OPENAI_API_KEY=your_openai_api_key
   ELEVENLABS_API_KEY=your_elevenlabs_api_key
   ELEVENLABS_VOICE_ID=your_preferred_voice_id
   SECRET_KEY=your_secret_key
   DEBUG=True
   ```

6. Start the Flask server:
   ```
   python app.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```
   REACT_APP_API_BASE_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```
   npm start
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Browse the product catalog or click on the microphone icon to start a voice conversation
3. Ask questions like:
   - "What electronics do you have in stock?"
   - "Can you check the status of my order ORD-12345?"
   - "What's your return policy?"
   - "How much is shipping?"

## Demo Accounts and Data

For testing purposes, the application includes:

- Sample products across multiple categories
- Demo order IDs:
  - ORD-12345 (shipped)
  - ORD-23456 (processing)
  - ORD-34567 (delivered)

## Limitations

- The voice bot uses dummy data for demonstration purposes
- Real-world implementation would require integration with actual inventory and order systems
- Speech recognition might struggle with heavy accents or background noise

## Future Enhancements

- Integration with actual payment processing
- User authentication and personalized recommendations
- Chat history persistence
- Multi-language support
- Voice biometrics for authentication

## Author
Mazka Buana Hidayat
