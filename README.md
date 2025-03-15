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
- Navigate to the Backend Folder
cd backend
- Install the required Python packages:
pip install flask flask-cors openai python-dotenv gunicorn
- Set Up Environment Variables: Create a .env file in the backend folder
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
- Run the Backend Server
python app.py or flask run
The backend will run at http://localhost:5000

### Frontend Setup
- Navigate to the Frontend Folder
cd frontend
- Install Frontend Dependencies from package.json
npm install or yarn install
- Set Up Environment Variables: Create a .env file in the frontend folder
REACT_APP_API_URL=http://localhost:5000
- Run the React development server:
npm start
The frontend will open at http://localhost:3000
