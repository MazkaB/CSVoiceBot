import json
import openai
from flask import current_app

def process_dialogue(transcript, intent, conversation_history, user_id):
    """
    Process the dialogue based on the recognized intent and conversation history
    
    Args:
        transcript (str): The user's speech transcript
        intent (str): The recognized intent
        conversation_history (list): Previous conversation messages
        user_id (str): Identifier for the user
        
    Returns:
        dict: Response details including the assistant's reply and updated conversation history
    """
    openai.api_key = current_app.config['OPENAI_API_KEY']
    
    # Add the current user message to the conversation history
    conversation_history.append({"role": "user", "content": transcript})
    
    # Prepare system message based on intent
    system_message = get_system_message(intent)
    
    # Prepare messages for GPT
    messages = [
        {"role": "system", "content": system_message}
    ]
    
    # Add conversation history (limit to last 5 exchanges for token efficiency)
    messages.extend(conversation_history[-10:])
    
    # Get response from GPT
    response = openai.chat.completions.create(
        model=current_app.config['GPT_MODEL'],
        messages=messages,
        temperature=0.7,
        max_tokens=200
    )
    
    assistant_response = response.choices[0].message.content
    
    # Add assistant response to conversation history
    conversation_history.append({"role": "assistant", "content": assistant_response})
    
    return {
        "response": assistant_response,
        "conversation_history": conversation_history
    }

def get_system_message(intent):
    """
    Generate appropriate system message based on intent
    
    Args:
        intent (str): The recognized intent
        
    Returns:
        str: System message for GPT
    """
    
    base_message = "You are a helpful customer service assistant for an e-commerce store called 'Shop Smart'. Be friendly, concise, and helpful."
    
    intent_messages = {
        "product_inquiry": base_message + " You help customers find the right products and provide information about product features, specifications, and availability. The store sells electronics, clothing, furniture, and kitchen items.",
        
        "order_status": base_message + " You help customers track their orders and provide shipping information. For this demo, use these dummy order IDs: ORD-12345 (shipped on May 10, 2023), ORD-23456 (processing, estimated shipping: May 15, 2023), ORD-34567 (delivered on May 8, 2023).",
        
        "return_policy": base_message + " You explain the store's return policy clearly. The store allows returns within 30 days of purchase with receipt, and offers full refunds or exchanges. Items must be in original condition with packaging.",
        
        "shipping_info": base_message + " You provide information about shipping options and timeframes. Standard shipping (3-5 business days) is $5.99, Express shipping (1-2 business days) is $12.99, and orders over $50 qualify for free standard shipping.",
        
        "complaint": base_message + " You apologize for any inconvenience and assure the customer that you'll help resolve their issue. Be empathetic and solution-oriented. For immediate assistance, offer to connect them with a human representative by calling 1-800-SHOP-SMART.",
        
        "greeting": base_message + " Greet the customer warmly and ask how you can help them today with their shopping needs.",
        
        "goodbye": base_message + " Thank the customer for contacting Shop Smart support and invite them to reach out again if they need additional assistance.",
        
        "general_question": base_message + " Answer general questions about the store, policies, and services. The store has been in business since 2010 and has physical locations in major cities as well as an online presence."
    }
    
    return intent_messages.get(intent, base_message)