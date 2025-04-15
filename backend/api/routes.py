from flask import Blueprint, request, jsonify
from api.controllers import process_voice_query, get_products, get_product, get_order_status

# Create a blueprint for API routes
api_bp = Blueprint('api', __name__)

@api_bp.route('/voice', methods=['POST'])
def voice_query():
    """Endpoint for processing voice queries"""
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400
        
    audio_file = request.files['audio']
    user_id = request.form.get('user_id', 'anonymous')
    
    # Get conversation history if available
    conversation_history = request.form.get('conversation_history', '[]')
    
    # Process the voice query
    response = process_voice_query(audio_file, user_id, conversation_history)
    return jsonify(response)

@api_bp.route('/products', methods=['GET'])
def products():
    """Endpoint to get all products"""
    category = request.args.get('category', None)
    search = request.args.get('search', None)
    return jsonify(get_products(category, search))

@api_bp.route('/products/<product_id>', methods=['GET'])
def product(product_id):
    """Endpoint to get a specific product"""
    product = get_product(product_id)
    if product:
        return jsonify(product)
    return jsonify({"error": "Product not found"}), 404

@api_bp.route('/orders/<order_id>', methods=['GET'])
def order_status(order_id):
    """Endpoint to get order status"""
    status = get_order_status(order_id)
    if status:
        return jsonify(status)
    return jsonify({"error": "Order not found"}), 404