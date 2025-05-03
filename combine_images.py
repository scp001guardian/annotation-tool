import os
from PIL import Image
import glob

def get_content_bounds(img):
    # Convert to grayscale for finding content
    gray = img.convert('L')
    # Get the bounding box of non-black pixels
    bbox = gray.getbbox()
    if bbox is None:
        return (0, 0, img.width, img.height)
    return bbox

def combine_images(directory):
    # Find all image files in the directory (both PNG and JPG)
    image_files = glob.glob(os.path.join(directory, "*.png")) + glob.glob(os.path.join(directory, "*.jpg"))
    
    # Filter out interior.png if it exists
    image_files = [f for f in image_files if not f.endswith('interior.png')]
    
    if len(image_files) != 2:
        print(f"Skipping {directory} - expected 2 image files, found {len(image_files)}")
        return
    
    # Sort files to ensure -c file is second
    image_files.sort(key=lambda x: '-c' in x.lower())
    
    # Open the images
    images = [Image.open(img_file) for img_file in image_files]
    
    # Get content bounds for each image
    bounds = [get_content_bounds(img) for img in images]
    
    # Calculate the maximum width needed
    max_width = max(b[2] - b[0] for b in bounds)
    
    # Calculate the total height needed
    total_height = sum(b[3] - b[1] for b in bounds)
    
    # Create a new image with minimal dimensions
    combined = Image.new('RGB', (max_width, total_height))
    
    # Current y position for pasting
    current_y = 0
    
    # Paste each image
    for i, (img, bbox) in enumerate(zip(images, bounds)):
        # Crop the image to its content bounds
        cropped = img.crop(bbox)
        
        # Calculate x offset to center the cropped image
        x_offset = (max_width - cropped.width) // 2
        
        # Paste the cropped image
        combined.paste(cropped, (x_offset, current_y))
        
        # Update y position for next image
        current_y += cropped.height
    
    # Save the combined image
    output_path = os.path.join(directory, "interior.png")
    combined.save(output_path)
    print(f"Created {output_path}")

def process_brand(brand_path):
    # Process each model directory
    for model_dir in os.listdir(brand_path):
        model_path = os.path.join(brand_path, model_dir)
        if os.path.isdir(model_path):
            print(f"\nProcessing {model_dir}...")
            combine_images(model_path)

def main():
    # Get the script's directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    buick_dir = os.path.join(script_dir, "public", "Dataset", "Buick")
    
    if not os.path.exists(buick_dir):
        print(f"Error: Buick directory not found at {buick_dir}")
        return
        
    print(f"\nProcessing Buick directory...")
    process_brand(buick_dir)

if __name__ == "__main__":
    main() 