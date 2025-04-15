import openai
from flask import current_app

def recognize_intent(transcript):
    """
    Recognize the intent of the user's query using GPT-4-turbo
    
    Possible intents:
    - product_inquiry: Questions about products, features, availability
    - order_status: Questions about order tracking, shipping, delivery
    - return_policy: Questions about returns, exchanges, refunds
    - shipping_info: Questions about shipping options, costs, timeframes
    - general_question: General information about the store
    - complaint: Customer expressing dissatisfaction
    - greeting: Customer starting conversation
    - goodbye: Customer ending conversation
    
    Args:
        transcript (str): The user's speech transcript
        
    Returns:
        str: The recognized intent
    """
    openai.api_key = current_app.config['OPENAI_API_KEY']
    
    prompt = f"""
    You are an AI assistant for an e-commerce store. Based on the customer query below, identify the primary intent.
    Choose one of the following intents:
    - product_inquiry: Questions about product details, availability, features
    - order_status: Questions about order tracking, delivery, shipment
    - return_policy: Questions about returns, exchanges, refunds
    - shipping_info: Questions about shipping methods, costs, timeframes
    - general_question: General information about the store, policies
    - complaint: Customer expressing dissatisfaction
    - greeting: Customer greeting or starting conversation
    - goodbye: Customer ending conversation
    
    Customer query: "{transcript}"
    
    Respond with only the intent name.
    """
    
    response = openai.chat.completions.create(
        model=current_app.config['GPT_MODEL'],
        messages=[
            {"role": "system", "content": "You are a helpful assistant that classifies customer queries into intents."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,
        max_tokens=20
    )
    
    intent = response.choices[0].message.content.strip().lower()
    
    # Validate the intent is one of our expected types
    valid_intents = [
        "product_inquiry", "order_status", "return_policy", 
        "shipping_info", "general_question", "complaint",
        "greeting", "goodbye"
    ]
    
    if intent not in valid_intents:
        intent = "general_question"  # Default to general question if we can't classify
    
    return intent