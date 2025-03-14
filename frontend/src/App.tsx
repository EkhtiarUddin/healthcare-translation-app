import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import LanguageSelector from './components/LanguageSelector';
import TranscriptDisplay from './components/TranscriptDisplay';
import RecordButton from './components/RecordButton';
import SpeakButton from './components/SpeakButton';
import SubmitButton from './components/SubmitButton';
import './App.css';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionError extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionError) => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

function App() {
  const [isListening, setIsListening] = useState(false);
  const [originalText, setOriginalText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en-US');
  const [targetLanguage, setTargetLanguage] = useState('es-ES');
  const [error, setError] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // New state for speech synthesis

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const API_URL = process.env.REACT_APP_API_URL;

  const handleOriginalTextChange = (text: string) => {
    setOriginalText(text);
  };

  const handleSubmit = () => {
    if (originalText.trim()) {
      translateText(originalText);
    } else {
      setError('Please enter some text to translate.');
    }
  };

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionConstructor =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionConstructor) {
        recognitionRef.current = new SpeechRecognitionConstructor();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = sourceLanguage;

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0])
            .map((result) => result.transcript)
            .join('');

          setOriginalText(transcript);
          translateText(transcript);
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionError) => {
          console.error('Speech recognition error', event.error);
          setError(`Error: ${event.error}`);
          setIsListening(false);
        };
      }
    } else {
      setError('Speech recognition not supported in this browser.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [sourceLanguage]);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = sourceLanguage;
    }
  }, [sourceLanguage]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setError('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const translateText = async (text: string) => {
    if (!text.trim()) return;

    setIsTranslating(true);
    try {
      const sourceLangCode = sourceLanguage.split('-')[0];
      const targetLangCode = targetLanguage.split('-')[0];

      if (!API_URL) {
        setError('API URL is not defined.');
        return;
      }

      const response = await axios.post(
        `${API_URL}/translate`,
        {
          text,
          source_language: sourceLangCode,
          target_language: targetLangCode,
        },
      );

      setTranslatedText(response.data.translated_text);
    } catch (err) {
      console.error('Translation error:', err);
      if (axios.isAxiosError(err)) {
        setError(`Translation error: ${err.response?.data?.error || err.message}`);
      } else {
        setError(`Translation error: ${(err as Error).message}`);
      }
    } finally {
      setIsTranslating(false);
    }
  };

  const speakText = (text: string, language: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setError('Text-to-speech failed.');
        setIsSpeaking(false);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      setError('Text-to-speech not supported in this browser.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">Healthcare Translation App</h1>
        <p className="text-center text-blue-100">Real-time medical translation service</p>
      </header>

      <main className="flex-grow p-4 container mx-auto max-w-4xl">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <LanguageSelector
            label="Source Language"
            value={sourceLanguage}
            onChange={setSourceLanguage}
            disabled={isListening}
          />
          <LanguageSelector
            label="Target Language"
            value={targetLanguage}
            onChange={setTargetLanguage}
            disabled={isListening}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <TranscriptDisplay
            title="Original Text"
            text={originalText}
            isLoading={isListening}
            loadingText="Listening..."
            isEditable={true}
            onTextChange={handleOriginalTextChange}
          />
          <TranscriptDisplay
            title="Translated Text"
            text={translatedText}
            isLoading={isTranslating}
            loadingText="Translating..."
          />
        </div>

        <div className="flex justify-center space-x-6">
          <RecordButton
            isListening={isListening}
            onClick={toggleListening}
            disabled={false}
          />
          <SubmitButton
            onClick={handleSubmit}
            disabled={!originalText || isTranslating}
          />
          <SpeakButton
            onClick={() => speakText(translatedText, targetLanguage)}
            disabled={!translatedText || isTranslating || isSpeaking}
          />
        </div>
      </main>

      <footer className="bg-gray-100 p-4 text-center text-gray-600 text-sm mt-auto">
        <p>Healthcare Translation App | Medical Privacy Protected</p>
      </footer>
    </div>
  );
}

export default App;
