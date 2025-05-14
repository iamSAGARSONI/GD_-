from flask import Flask, request, jsonify
import cv2
import numpy as np
from ultralytics import YOLO
import base64
import os

app = Flask(__name__)

# Load model
model = YOLO("model_1.pt")  # Ensure model is in same directory

@app.route('/process', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']
    img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
    
    # Process image
    results = model(img)
    annotated = results[0].plot()
    
    # Convert to base64
    _, buffer = cv2.imencode('.jpg', annotated)
    img_base64 = base64.b64encode(buffer).decode('utf-8')
    
    return jsonify({'image': img_base64})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)