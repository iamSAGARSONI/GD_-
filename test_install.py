import torch
from ultralytics import YOLO

print(f"PyTorch version: {torch.__version__}")
print(f"CUDA available: {torch.cuda.is_available()}")
print(f"torch.load exists: {hasattr(torch, 'load')}")

# Test YOLO
model = YOLO('yolov8n.pt')  # Test with default model
print("YOLO loaded successfully!")