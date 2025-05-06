import cv2
import numpy as np
import json
import os
from pathlib import Path
import pytesseract  # For OCR to read numbers

def detect_numbered_labels(image_path):
    # Read the image
    img = cv2.imread(image_path)
    if img is None:
        print(f"Error: Could not read image {image_path}")
        return None
    
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Apply adaptive thresholding to handle different lighting conditions
    binary = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                 cv2.THRESH_BINARY_INV, 11, 2)
    
    # Apply morphological operations to clean up the image
    kernel = np.ones((3,3), np.uint8)
    binary = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)
    
    # Find contours
    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Filter contours by size and shape
    number_regions = []
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        # Adjust these parameters based on your image
        if 5 < w < 50 and 5 < h < 50 and 0.5 < w/h < 2:
            # Extract the region
            roi = binary[y:y+h, x:x+w]
            # Use OCR to read the number
            try:
                number = pytesseract.image_to_string(roi, config='--psm 7 -c tessedit_char_whitelist=0123456789')
                number = number.strip()
                if number.isdigit():
                    number_regions.append((int(number), x, y, w, h))
            except:
                continue
    
    return number_regions

def process_brand_images(brand_path):
    # Get all model directories
    model_dirs = [d for d in os.listdir(brand_path) if os.path.isdir(os.path.join(brand_path, d))]
    
    for model in model_dirs:
        model_path = os.path.join(brand_path, model)
        image_path = os.path.join(model_path, "interior.png")
        json_path = os.path.join(model_path, "components.json")
        
        if not os.path.exists(image_path) or not os.path.exists(json_path):
            print(f"Skipping {model}: Missing image or JSON file")
            continue
        
        print(f"Processing {model}...")
        
        # Detect numbered labels in the image
        number_regions = detect_numbered_labels(image_path)
        if not number_regions:
            print(f"No number regions found in {model}")
            continue
        
        # Read components.json
        with open(json_path, 'r') as f:
            components = json.load(f)
        
        # Group components by their number
        number_groups = {}
        for number, x, y, w, h in number_regions:
            if number not in number_groups:
                number_groups[number] = []
            number_groups[number].append((x, y, w, h))
        
        # Keep only the first occurrence of each number (top to bottom, left to right)
        first_occurrences = {}
        for number, regions in number_groups.items():
            # Sort by y-coordinate (top to bottom) and then x-coordinate (left to right)
            sorted_regions = sorted(regions, key=lambda r: (r[1], r[0]))
            first_occurrences[number] = sorted_regions[0]
        
        # Create a new components list with only the first occurrences
        filtered_components = []
        for i, component in enumerate(components):
            # Check if this component's number is in first_occurrences
            if i + 1 in first_occurrences:  # Assuming components are 1-indexed
                filtered_components.append(component)
        
        # Create new JSON file with "_filtered" suffix
        filtered_json_path = os.path.join(model_path, "components_filtered.json")
        with open(filtered_json_path, 'w') as f:
            json.dump(filtered_components, f, indent=2)
        
        print(f"Processed {model}: {len(components)} -> {len(filtered_components)} components")
        print(f"Created new file: {filtered_json_path}")

if __name__ == "__main__":
    # Path to your dataset directory
    dataset_path = "public/Dataset"
    
    # Process each brand
    for brand in ["Cadillac", "Chevrolet", "Ford"]:
        brand_path = os.path.join(dataset_path, brand)
        if os.path.exists(brand_path):
            print(f"Processing {brand}...")
            process_brand_images(brand_path)
        else:
            print(f"Brand directory not found: {brand}") 