import json
import os
import tempfile
import base64
import requests
import openai
from flask import current_app
from bot.intent_recognition import recognize_intent
from bot.dialogue_manager import process_dialogue
from bot.response_generator import generate_response

# Mock database for demo purposes
PRODUCTS = [
    {
        "id": "1", 
        "name": "Premium Wireless Headphones", 
        "price": 159.99, 
        "category": "Electronics", 
        "stock": 45,
        "description": "Immerse yourself in premium sound quality with these wireless headphones featuring noise cancellation and 30-hour battery life.",
        "image": "headphones.jpg"
    },
    {
        "id": "2", 
        "name": "Organic Cotton T-Shirt", 
        "price": 29.99, 
        "category": "Clothing", 
        "stock": 100,
        "description": "Comfortable 100% organic cotton t-shirt, ethically produced and available in multiple colors.",
        "image": "tshirt.jpg"
    },
    {
        "id": "3", 
        "name": "Smart Fitness Watch", 
        "price": 199.99, 
        "category": "Electronics", 
        "stock": 30,
        "description": "Track your fitness goals with this smart watch featuring heart rate monitoring, GPS, and sleep tracking.",
        "image": "watch.jpg"
    },
    {
        "id": "4", 
        "name": "Ergonomic Office Chair", 
        "price": 249.99, 
        "category": "Furniture", 
        "stock": 15,
        "description": "Work in comfort with this adjustable ergonomic chair, featuring lumbar support and breathable mesh design.",
        "image": "chair.jpg"
    },
    {
        "id": "5", 
        "name": "Stainless Steel Water Bottle", 
        "price": 24.99, 
        "category": "Kitchen", 
        "stock": 200,
        "description": "Stay hydrated with this 24oz insulated stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
        "image": "bottle.jpg"
    },
    {
        "id": "6", 
        "name": "Wireless Charging Pad", 
        "price": 39.99, 
        "category": "Electronics", 
        "stock": 60,
        "description": "Charge your compatible devices wirelessly with this sleek and fast charging pad.",
        "image": "charger.jpg"
    },
    {
        "id": "7", 
        "name": "Lightweight Hiking Backpack", 
        "price": 89.99, 
        "category": "Outdoors", 
        "stock": 25,
        "description": "Perfect for day hikes, this lightweight backpack features multiple compartments and a hydration system.",
        "image": "backpack.jpg"
    },
    {
        "id": "8", 
        "name": "Smart LED Bulb Set (4-Pack)", 
        "price": 49.99, 
        "category": "Home", 
        "stock": 40,
        "description": "Control your home lighting with these smart LED bulbs that connect to your home WiFi and voice assistants.",
        "image": "bulbs.jpg"
    }
]

ORDERS = {
    "ORD-12345": {
        "status": "shipped", 
        "items": [
            {"id": "1", "quantity": 1},
            {"id": "5", "quantity": 2}
        ], 
        "shipping_date": "2023-05-10", 
        "tracking_number": "TRK987654321",
        "shipping_method": "Standard",
        "customer_name": "Alex Johnson"
    },
    "ORD-23456": {
        "status": "processing", 
        "items": [
            {"id": "3", "quantity": 1}
        ], 
        "estimated_shipping": "2023-05-15",
        "shipping_method": "Express",
        "customer_name": "Taylor Smith"
    },
    "ORD-34567": {
        "status": "delivered", 
        "items": [
            {"id": "2", "quantity": 2},
            {"id": "4", "quantity": 1}
        ], 
        "delivery_date": "2023-05-08",
        "tracking_number": "TRK123456789",
        "shipping_method": "Standard",
        "customer_name": "Jamie Wilson"
    },
}

def process_voice_query(audio_file, user_id, conversation_history=None):
    """
    Process a voice query and return a response
    
    Args:
        audio_file: The uploaded audio file
        user_id: Identifier for the user
        conversation_history: Previous conversation messages
        
    Returns:
        dict: Response details including transcript, text response, and audio response
    """
    try:
        # Save the audio file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as tmp_file:
            audio_file.save(tmp_file.name)
            tmp_filename = tmp_file.name
        
        # Transcribe using Whisper
        transcript = transcribe_audio(tmp_filename)
        
        # Clean up temporary file
        os.unlink(tmp_filename)
        
        # Convert conversation history from string to list if provided
        history = json.loads(conversation_history) if conversation_history else []
        
        # Recognize user intent
        intent = recognize_intent(transcript)
        
        # Process the dialogue based on intent
        dialogue_response = process_dialogue(transcript, intent, history, user_id)
        
        # Generate text response
        text_response = generate_response(dialogue_response, intent)
        
        # Generate voice response using ElevenLabs
        audio_response = synthesize_speech(text_response)
        
        return {
            "transcript": transcript,
            "text_response": text_response,
            "audio_response": audio_response,
            "intent": intent,
            "conversation_history": json.dumps(dialogue_response["conversation_history"])
        }
        
    except Exception as e:
        return {"error": str(e)}

def transcribe_audio(audio_file_path):
    """
    Transcribe audio using OpenAI Whisper
    
    Args:
        audio_file_path: Path to temporary audio file
        
    Returns:
        str: Transcribed text
    """
    openai.api_key = current_app.config['OPENAI_API_KEY']
    
    with open(audio_file_path, 'rb') as audio_file:
        transcript = openai.audio.transcriptions.create(
            model=current_app.config['WHISPER_MODEL'],
            file=audio_file
        )
    
    return transcript.text

def synthesize_speech(text):
    """
    Synthesize speech using ElevenLabs
    
    Args:
        text: Text to convert to speech
        
    Returns:
        str: Base64 encoded audio data
    """
    api_key = current_app.config['ELEVENLABS_API_KEY']
    voice_id = current_app.config['ELEVENLABS_VOICE_ID']
    
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": api_key
    }
    
    data = {
        "text": text,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.5
        }
    }
    
    response = requests.post(url, json=data, headers=headers)
    
    if response.status_code == 200:
        # Convert the audio data to base64 for transmission to frontend
        audio_data = base64.b64encode(response.content).decode('utf-8')
        return audio_data
    else:
        raise Exception(f"Speech synthesis failed: {response.text}")

def get_products(category=None, search=None):
    """
    Get all products, optionally filtered by category or search term
    
    Args:
        category: Category to filter by
        search: Search term to filter by
        
    Returns:
        dict: Products matching the criteria
    """
    filtered_products = PRODUCTS
    
    if category:
        filtered_products = [p for p in filtered_products if p["category"].lower() == category.lower()]
    
    if search:
        search = search.lower()
        filtered_products = [p for p in filtered_products if 
                            search in p["name"].lower() or 
                            search in p["description"].lower() or
                            search in p["category"].lower()]
    
    return {"products": filtered_products}

def get_product(product_id):
    """
    Get a specific product by ID
    
    Args:
        product_id: ID of the product
        
    Returns:
        dict: Product details
    """
    for product in PRODUCTS:
        if product["id"] == product_id:
            return {"product": product}
    return None

def get_order_status(order_id):
    """
    Get order status by order ID
    
    Args:
        order_id: ID of the order
        
    Returns:
        dict: Order details
    """
    if order_id in ORDERS:
        # Enrich order with product details
        order_copy = ORDERS[order_id].copy()
        enriched_items = []
        
        for item in order_copy["items"]:
            product = get_product(item["id"])
            if product:
                product_info = product["product"]
                enriched_items.append({
                    "id": item["id"],
                    "quantity": item["quantity"],
                    "name": product_info["name"],
                    "price": product_info["price"],
                    "image": product_info["image"]
                })
        
        order_copy["items"] = enriched_items
        return {"order": order_id, "details": order_copy}
    
    return None