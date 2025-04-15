from flask import Flask
from flask_cors import CORS
from api.routes import api_bp
import config

def create_app():
    """Initialize and configure the Flask application"""
    app = Flask(__name__)
    CORS(app)  # Enable Cross-Origin Resource Sharing
    
    # Load configuration
    app.config.from_object(config.Config)
    
    # Register blueprints
    app.register_blueprint(api_bp, url_prefix='/api')
    
    @app.route('/')
    def health_check():
        return {"status": "ok", "message": "Voice Bot API is running"}
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)