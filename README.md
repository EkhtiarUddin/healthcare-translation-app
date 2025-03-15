## Technology Stacks

- **Frontend**: React, Tailwind CSS
- **Backend**: Python, Flask, OpenAI API 
- **AI Translation**: OpenAI GPT-4 API 
- **Speech Recognition**: Web Speech API
- **Text-to-Speech**: SpeechSynthesis API
- **Deployment**: Vercel

## Setup Instructions

### Prerequisites
Before starting, ensure you have the following installed on your system:
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- OpenAI API key

### Clone the Repository

### Backend Setup
1. Navigate to the Backend Folder: 
    cd backend
2. Install the required Python packages: 
    pip install flask flask-cors openai python-dotenv gunicorn
3. Create a .env file in the backend folder: 
    OPENAI_API_KEY=your_openai_api_key_here
    PORT=5000
4. Run the Backend Server: 
    python app.py or flask run

The backend will run at http://localhost:5000

### Frontend Setup
1. Navigate to the Frontend Folder: 
    cd frontend
2. Install Frontend Dependencies from package.json: 
    npm install or yarn install
3. Create a .env file in the frontend folder: 
    REACT_APP_API_URL=http://localhost:5000
4. Run the React development server: 
    npm start

The frontend will open at http://localhost:3000

Live Demo Link(vercel): https://healthcare-translation-9b02dptho-ekhtiar-uddins-projects.vercel.app/
