import os
import base64
import re
import argparse

def main():
    parser = argparse.ArgumentParser(description="Batch encode images to base64 and add them to GPE Gallery.")
    parser.add_argument("image_dir", help="Directory containing new GPE images to add.")
    parser.add_argument("--html-file", default=r"c:\Users\Shivkumar\.antigravity\ssb-nextgen-pro\frontend\public\gpe_gallery.html", help="Path to gpe_gallery.html")
    args = parser.parse_args()

    image_dir = args.image_dir
    html_file = args.html_file

    if not os.path.exists(image_dir):
        print(f"Error: Directory {image_dir} does not exist.")
        return

    if not os.path.exists(html_file):
        print(f"Error: HTML file {html_file} does not exist.")
        return

    # Gather images
    valid_exts = {".jpg", ".jpeg", ".png", ".gif"}
    new_images = {}
    for filename in sorted(os.listdir(image_dir)):
        ext = os.path.splitext(filename)[1].lower()
        if ext in valid_exts:
            filepath = os.path.join(image_dir, filename)
            with open(filepath, "rb") as f:
                encoded = base64.b64encode(f.read()).decode('utf-8')
                mime_type = f"image/{ext[1:]}"
                if ext == '.jpg':
                    mime_type = "image/jpeg"
                
                data_uri = f"data:{mime_type};base64,{encoded}"
                new_images[filename] = data_uri

    if not new_images:
        print("No images found to add.")
        return

    with open(html_file, "r", encoding="utf-8") as f:
        content = f.read()

    # Update photo count
    count_pattern = r'(<span class="n" id="photoCount">)(\d+)(</span>)'
    match = re.search(count_pattern, content)
    if not match:
        print("Could not find photo count in HTML.")
        return

    current_count = int(match.group(2))
    new_count = current_count + len(new_images)
    content = re.sub(count_pattern, fr'\g<1>{new_count}\g<3>', content)

    # Insert into imageData
    insert_str = ""
    for filename, data_uri in new_images.items():
        insert_str += f'\n            "{filename}": "{data_uri}",'
    
    target_str = "const imageData = {"
    if target_str not in content:
        print("Could not find 'const imageData = {' in HTML.")
        return
    
    content = content.replace(target_str, target_str + insert_str)

    with open(html_file, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"Successfully added {len(new_images)} images. New total: {new_count} photos.")

if __name__ == "__main__":
    main()
