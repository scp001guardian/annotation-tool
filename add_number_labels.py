import json
import os
import string

def add_labels(json_path, use_alphabets=False):
    # Read the components.json file
    with open(json_path, 'r') as f:
        components = json.load(f)
    
    # Clean existing labels from components
    cleaned_components = []
    for component in components:
        # Remove any existing labels (numbers or letters) and dots from the start
        parts = component.split('.', 2)
        if len(parts) > 1:
            # If it has a label, take the last part
            cleaned_components.append(parts[-1])
        else:
            cleaned_components.append(component)
    
    # Add new labels to each component
    if use_alphabets:
        # Use uppercase letters (A, B, C, ...)
        labeled_components = [f"{string.ascii_uppercase[i]}.{component}" for i, component in enumerate(cleaned_components)]
    else:
        # Use numbers (1, 2, 3, ...)
        labeled_components = [f"{i+1}.{component}" for i, component in enumerate(cleaned_components)]
    
    # Save back to the original file
    with open(json_path, 'w') as f:
        json.dump(labeled_components, f, indent=2)
    
    print(f"Updated components file: {json_path}")

def process_brand(brand_path, use_alphabets=False):
    # Get all model directories
    model_dirs = [d for d in os.listdir(brand_path) if os.path.isdir(os.path.join(brand_path, d))]
    
    for model in model_dirs:
        model_path = os.path.join(brand_path, model)
        json_path = os.path.join(model_path, "components.json")
        
        if os.path.exists(json_path):
            print(f"Processing {model}...")
            add_labels(json_path, use_alphabets)
        else:
            print(f"Skipping {model}: No components.json file found")

if __name__ == "__main__":
    # Path to your dataset directory
    dataset_path = "public/Dataset"
    
    # Process only Nissan and Toyota with numbers
    for brand in ["Nissan", "Toyota"]:
        brand_path = os.path.join(dataset_path, brand)
        if os.path.exists(brand_path):
            print(f"\nProcessing {brand}...")
            process_brand(brand_path, use_alphabets=False)
        else:
            print(f"Brand directory not found: {brand}") 