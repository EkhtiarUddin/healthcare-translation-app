from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from dotenv import load_dotenv
from openai import OpenAI
import os
import logging
import base64

load_dotenv()

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "healthcare-translation-app-secret")

# Enable CORS
CORS(app)

# Initialize SocketIO
socketio = SocketIO(app, cors_allowed_origins="*")

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError(
        "OPENAI_API_KEY is missing. Please set the OPENAI_API_KEY environment variable."
    )

# Initialize OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)
SUPPORTED_LANGUAGES = [
    {"code": "en", "name": "English", "native_name": "English"},
    {"code": "bn", "name": "Bangla", "native_name": "বাংলা"},
    {"code": "es", "name": "Spanish", "native_name": "Español"},
    {"code": "fr", "name": "French", "native_name": "Français"},
    {"code": "de", "name": "German", "native_name": "Deutsch"},
    {"code": "zh", "name": "Chinese", "native_name": "中文"},
    {"code": "hi", "name": "Hindi", "native_name": "हिन्दी"},
    {"code": "ar", "name": "Arabic", "native_name": "العربية"},
    {"code": "ru", "name": "Russian", "native_name": "Русский"},
    {"code": "pt", "name": "Portuguese", "native_name": "Português"},
    {"code": "ja", "name": "Japanese", "native_name": "日本語"},
]

MEDICAL_PROMPT = """
A medical translator specializing in the terminology of health care. 
Proper translation of the following text, preserve medical conditions and their meanings.
Pay special attention to medical jargon, conditions, medicines and procedures.
Just answer with translated text, no explanation or note.
"""

@app.route("/")
def root():
    return jsonify({"message": "Healthcare Translation API"})

@app.route("/languages", methods=["GET"])
def get_languages():
    return jsonify(SUPPORTED_LANGUAGES)


@app.route("/translate", methods=["POST"])
def translate():
    try:
        data = request.get_json()
        if (
            not data
            or "text" not in data
            or "source_language" not in data
            or "target_language" not in data
        ):
            return jsonify({"error": "Missing required fields"}), 400

        text = data["text"]
        source_lang = data["source_language"]
        target_lang = data["target_language"]
        is_medical = data.get("is_medical", True)

        # Skip translation if source and target languages are the same
        if source_lang == target_lang:
            return jsonify(
                {
                    "original_text": text,
                    "translated_text": text,
                    "source_language": source_lang,
                    "target_language": target_lang,
                }
            )

        # Build the prompt based on whether it's medical content
        prompt = MEDICAL_PROMPT if is_medical else "Translate the following text:"

        # Using the OpenAI API
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": f"{prompt} Translate from {source_lang} to {target_lang}.",
                },
                {"role": "user", "content": text},
            ],
        )

        translated_text = response.choices[0].message.content

        return jsonify(
            {
                "original_text": text,
                "translated_text": translated_text,
                "source_language": source_lang,
                "target_language": target_lang,
            }
        )
    except Exception as e:
        logger.error(f"Translation error: {str(e)}")
        return jsonify({"error": f"Translation failed: {str(e)}"}), 500


@app.route("/text-to-speech", methods=["POST"])
def text_to_speech():
    try:
        data = request.get_json()
        if not data or "text" not in data or "language" not in data:
            return jsonify({"error": "Missing required fields"}), 400

        text = data["text"]
        language = data["language"]

        # Use OpenAI's TTS API to convert text to speech
        response = client.audio.speech.create(model="tts-1", voice="alloy", input=text)

        # Get the audio content as bytes
        audio_content = response.content

        # Return the audio content as base64
        audio_base64 = base64.b64encode(audio_content).decode("utf-8")

        return jsonify({"audio": audio_base64, "text": text, "language": language})
    except Exception as e:
        logger.error(f"Text-to-speech error: {str(e)}")
        return jsonify({"error": f"Text-to-speech failed: {str(e)}"}), 500

@socketio.on("connect")
def handle_connect():
    logger.info("Client connected")


@socketio.on("disconnect")
def handle_disconnect():
    logger.info("Client disconnected")


@socketio.on("translate")
def handle_translate(data):
    try:
        if (
            not data
            or "text" not in data
            or "source_language" not in data
            or "target_language" not in data
        ):
            emit("translation_error", {"error": "Missing required fields"})
            return

        text = data["text"]
        source_lang = data["source_language"]
        target_lang = data["target_language"]
        is_medical = data.get("is_medical", True)
        if source_lang == target_lang:
            emit(
                "translation_result",
                {
                    "original_text": text,
                    "translated_text": text,
                    "source_language": source_lang,
                    "target_language": target_lang,
                },
            )
            return

        prompt = MEDICAL_PROMPT if is_medical else "Translate the following text:"
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": f"{prompt} Translate from {source_lang} to {target_lang}.",
                },
                {"role": "user", "content": text},
            ],
        )

        translated_text = response.choices[0].message.content

        emit(
            "translation_result",
            {
                "original_text": text,
                "translated_text": translated_text,
                "source_language": source_lang,
                "target_language": target_lang,
            },
        )
    except Exception as e:
        logger.error(f"WebSocket translation error: {str(e)}")
        emit("translation_error", {"error": f"Translation failed: {str(e)}"})


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    socketio.run(app, host="0.0.0.0", port=port, debug=True)
