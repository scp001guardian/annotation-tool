import os
import json

def generate_models_json():
    # Get the script's directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_dir = os.path.join(script_dir, "public", "Dataset")
    
    # Process each brand directory
    for brand in os.listdir(dataset_dir):
        brand_path = os.path.join(dataset_dir, brand)
        if os.path.isdir(brand_path) and brand not in ['.', '..']:
            # Get all model directories
            models = [d for d in os.listdir(brand_path) 
                     if os.path.isdir(os.path.join(brand_path, d)) 
                     and not d.startswith('.')]
            
            # Sort models
            models.sort()
            
            # Write to models.json
            models_json_path = os.path.join(brand_path, "models.json")
            with open(models_json_path, 'w') as f:
                json.dump(models, f, indent=2)
            
            print(f"Created models.json for {brand} with {len(models)} models")

if __name__ == "__main__":
    generate_models_json() 