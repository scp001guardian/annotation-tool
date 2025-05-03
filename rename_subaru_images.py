import os
import glob

def rename_images():
    # Get the script's directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Process Ford and Chevrolet directories
    for brand in ['Ford', 'Chevrolet']:
        brand_dir = os.path.join(script_dir, "public", "Dataset", brand)
        
        if not os.path.exists(brand_dir):
            print(f"Error: {brand} directory not found at {brand_dir}")
            continue
            
        print(f"\nProcessing {brand} directory...")
        
        # Process each model directory
        for model_dir in os.listdir(brand_dir):
            model_path = os.path.join(brand_dir, model_dir)
            if os.path.isdir(model_path):
                old_path = os.path.join(model_path, "image.png")
                new_path = os.path.join(model_path, "interior.png")
                
                if os.path.exists(old_path):
                    try:
                        os.rename(old_path, new_path)
                        print(f"Renamed {old_path} to {new_path}")
                    except Exception as e:
                        print(f"Error renaming {old_path}: {e}")
                else:
                    print(f"No image.png found in {model_path}")

    # Process Nissan directory separately due to different naming pattern
    nissan_dir = os.path.join(script_dir, "public", "Dataset", "Nissan")
    if os.path.exists(nissan_dir):
        print("\nProcessing Nissan directory...")
        for model_dir in os.listdir(nissan_dir):
            model_path = os.path.join(nissan_dir, model_dir)
            if os.path.isdir(model_path):
                # Find the main PNG file (excluding -c files)
                png_files = [f for f in glob.glob(os.path.join(model_path, "*.png")) 
                           if not f.endswith('-c.png')]
                
                if len(png_files) == 1:
                    old_path = png_files[0]
                    new_path = os.path.join(model_path, "interior.png")
                    try:
                        os.rename(old_path, new_path)
                        print(f"Renamed {old_path} to {new_path}")
                    except Exception as e:
                        print(f"Error renaming {old_path}: {e}")
                else:
                    print(f"Unexpected number of PNG files in {model_path}: {len(png_files)}")

if __name__ == "__main__":
    rename_images() 