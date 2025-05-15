from flask import Flask, render_template, request, jsonify
import cv2
import numpy as np
from ultralytics import YOLO
import base64
import os

app = Flask(__name__)
model = YOLO("model_1.pt")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/resources')
def resources():
    return render_template('resources.html')

@app.route('/process', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']
    img_np = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(img_np, cv2.IMREAD_COLOR)
    
    results = model(img)
    annotated = results[0].plot()
    
    _, buffer = cv2.imencode('.jpg', annotated)
    img_base64 = base64.b64encode(buffer).decode('utf-8')
    
    return jsonify({'image': img_base64})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)