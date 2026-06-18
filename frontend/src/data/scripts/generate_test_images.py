#!/usr/bin/env python3
"""
Generate pre-generated images for TAT, PPDT, and GPE tests using pollinations.ai
Downloads and saves 60 images for each test type (180 total) to public/images directory
"""

import os
import sys
import json
import urllib.request
import time
from pathlib import Path

# Configuration
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent.parent.parent
PUBLIC_IMAGES_DIR = PROJECT_ROOT / "frontend" / "public" / "images"

# Image generation settings
IMAGE_WIDTH = 800
IMAGE_HEIGHT = 600
DELAY_BETWEEN_REQUESTS = 2  # seconds to avoid rate limiting

# TAT Image Prompts (60 unique scenarios commonly asked in SSB)
TAT_PROMPTS = [
    "A young person studying late at night with books and determination",
    "Two people working together on a challenging project",
    "A person helping an elderly individual cross a busy road",
    "A team celebrating after winning a sports competition",
    "A person receiving an award on stage with pride",
    "A family gathered around a dinner table sharing a meal",
    "Someone reading a book peacefully under a tree",
    "A person comforting a friend who is crying",
    "A young person planting a tree sapling",
    "A teacher explaining a concept to attentive students",
    "A person standing at a mountain peak looking at the view",
    "Two colleagues having a serious discussion in an office",
    "A person standing at a fork in a forest path",
    "A leader addressing a group of people confidently",
    "Someone working late at night in an office building",
    "A person helping a fallen cyclist get back up",
    "A team celebrating the completion of a project",
    "A person practicing a skill repeatedly with focus",
    "Someone giving a confident public speech",
    "A person donating to charity with a smile",
    "A person standing alone looking at a stormy sea",
    "Two people in a heated but constructive argument",
    "Someone making a difficult phone call with courage",
    "A person witnessing injustice and deciding to act",
    "A leader making a tough decision that affects many",
    "Someone saying goodbye to family for an important mission",
    "A person facing failure but getting back up determined",
    "Someone choosing between personal gain and ethical action",
    "A team working together during a crisis situation",
    "A person mentoring a younger individual",
    "Children playing together happily in a park",
    "A person cooking a meal for their family",
    "Someone receiving a gift with genuine gratitude",
    "A person exercising in the early morning",
    "Friends studying together in a library",
    "Someone feeding stray animals with care",
    "A person watering plants in a garden peacefully",
    "A family going for a walk together in nature",
    "Someone writing in a personal diary thoughtfully",
    "A person sharing lunch with a colleague",
    "Someone presenting an idea to skeptical colleagues",
    "A person training for a marathon with determination",
    "Someone organizing a community event",
    "A person learning a new skill from a mentor",
    "A team working on a challenging puzzle together",
    "Someone starting their own business venture",
    "A person volunteering at a hospital",
    "Someone negotiating a business deal",
    "A person overcoming a deep-seated fear",
    "Someone balancing work and family responsibilities",
    "A leader facing a moral dilemma with integrity",
    "Someone whistleblowing on organizational misconduct",
    "A person losing everything but maintaining hope",
    "Someone making a sacrifice for the greater good",
    "A team dealing with a catastrophic failure",
    "A person standing up against peer pressure",
    "Someone forgiving a major betrayal with grace",
    "A leader taking responsibility for team failure",
    "Someone choosing principle over profit",
    "A person building bridges between conflicting groups",
]

# PPDT Image Prompts (60 ambiguous scenarios for picture perception)
PPDT_PROMPTS = [
    "Hazy black and white image of two people in conversation near a building",
    "Blurry monochrome scene of a person standing alone at a crossroads",
    "Foggy grayscale image of a group working together on something",
    "Hazy black and white picture of someone helping another person",
    "Blurred monochrome scene of a person looking at something in distance",
    "Foggy grayscale image of two people in a tense discussion",
    "Hazy black and white picture of a person in a thoughtful pose",
    "Blurry monochrome scene of a group celebrating something",
    "Foggy grayscale image of someone working hard at a task",
    "Hazy black and white picture of a person making a decision",
    "Blurry monochrome scene of two people in conflict",
    "Foggy grayscale image of someone leading a group",
    "Hazy black and white picture of a person in a moment of triumph",
    "Blurry monochrome scene of someone teaching or guiding",
    "Foggy grayscale image of a person facing a challenge",
    "Hazy black and white picture of two people cooperating",
    "Blurry monochrome scene of someone in a moment of reflection",
    "Foggy grayscale image of a person helping someone in need",
    "Hazy black and white picture of a group planning something",
    "Blurry monochrome scene of someone overcoming an obstacle",
    "Foggy grayscale image of a person in a leadership role",
    "Hazy black and white picture of two people resolving differences",
    "Blurry monochrome scene of someone in a moment of courage",
    "Foggy grayscale image of a person making a sacrifice",
    "Hazy black and white picture of a group working under pressure",
    "Blurry monochrome scene of someone showing compassion",
    "Foggy grayscale image of a person in a moment of discovery",
    "Hazy black and white picture of two people in agreement",
    "Blurry monochrome scene of someone taking initiative",
    "Foggy grayscale image of a person demonstrating skill",
    "Hazy black and white picture of a group in a crisis",
    "Blurry monochrome scene of someone showing determination",
    "Foggy grayscale image of a person in a moment of choice",
    "Hazy black and white picture of two people sharing something",
    "Blurry monochrome scene of someone protecting another",
    "Foggy grayscale image of a person achieving a goal",
    "Hazy black and white picture of a group in celebration",
    "Blurry monochrome scene of someone in a moment of learning",
    "Foggy grayscale image of a person showing creativity",
    "Hazy black and white picture of two people in competition",
    "Blurry monochrome scene of someone showing responsibility",
    "Foggy grayscale image of a person in a moment of truth",
    "Hazy black and white picture of a group facing adversity",
    "Blurry monochrome scene of someone showing empathy",
    "Foggy grayscale image of a person making an ethical choice",
    "Hazy black and white picture of two people building something",
    "Blurry monochrome scene of someone showing perseverance",
    "Foggy grayscale image of a person in a moment of realization",
    "Hazy black and white picture of a group solving a problem",
    "Blurry monochrome scene of someone showing integrity",
    "Foggy grayscale image of a person taking a stand",
    "Hazy black and white picture of two people reconciling",
    "Blurry monochrome scene of someone showing innovation",
    "Foggy grayscale image of a person demonstrating loyalty",
    "Hazy black and white picture of a group in unity",
    "Blurry monochrome scene of someone showing humility",
    "Foggy grayscale image of a person showing resilience",
    "Hazy black and white picture of two people collaborating",
    "Blurry monochrome scene of someone showing wisdom",
    "Foggy grayscale image of a person in a moment of transformation",
]

# GPE Image Prompts (60 planning exercise scenarios)
GPE_PROMPTS = [
    "Aerial view of a college campus with multiple buildings and pathways",
    "Map view of a rural village with limited infrastructure",
    "Overhead view of a disaster affected area with damaged buildings",
    "Bird's eye view of a school ground with various facilities",
    "Aerial perspective of a tech conference venue with multiple halls",
    "Map view of an industrial exhibition complex",
    "Overhead view of a community center with surrounding areas",
    "Bird's eye view of a city park with multiple activity zones",
    "Aerial view of a hospital complex with emergency services",
    "Map view of a flood-affected region with rescue routes",
    "Overhead view of a sports stadium with surrounding infrastructure",
    "Bird's eye view of a market area with crowd management needs",
    "Aerial perspective of a transportation hub with multiple platforms",
    "Map view of a mountainous region with trekking routes",
    "Overhead view of a residential colony with community facilities",
    "Bird's eye view of a factory complex with safety considerations",
    "Aerial view of a coastal area with fishing community",
    "Map view of a forest area with eco-tourism potential",
    "Overhead view of a railway station with passenger flow",
    "Bird's eye view of a university campus with multiple departments",
    "Aerial perspective of a slum area needing development",
    "Map view of a border area with security considerations",
    "Overhead view of a shopping complex with emergency exits",
    "Bird's eye view of a farm with irrigation systems",
    "Aerial view of a hill station with tourist facilities",
    "Map view of a river basin with flood control measures",
    "Overhead view of an airport with terminal operations",
    "Bird's eye view of a research facility with laboratories",
    "Aerial perspective of a tribal village with traditional huts",
    "Map view of a pilgrimage site with crowd management",
    "Overhead view of a sports academy with training facilities",
    "Bird's eye view of a warehouse complex with logistics",
    "Aerial view of a heritage site with conservation needs",
    "Map view of a mining area with environmental concerns",
    "Overhead view of a bus terminal with route planning",
    "Bird's eye view of an IT park with multiple buildings",
    "Aerial perspective of a dam project with rehabilitation",
    "Map view of a wildlife sanctuary with eco-zones",
    "Overhead view of a medical college with hospital",
    "Bird's eye view of a seaport with cargo operations",
    "Aerial view of a drought-affected village with water scarcity",
    "Map view of a hill station with landslide prone areas",
    "Overhead view of a cultural center with event spaces",
    "Bird's eye view of an agricultural university with farms",
    "Aerial perspective of a refugee camp with basic amenities",
    "Map view of a industrial zone with pollution control",
    "Overhead view of a metro station with connectivity",
    "Bird's eye view of a disaster management center",
    "Aerial view of a remote island with limited resources",
    "Map view of a earthquake affected area with reconstruction",
    "Overhead view of a science city with interactive exhibits",
    "Bird's eye view of a border haat market with security",
    "Aerial perspective of a cyclone shelter network",
    "Map view of a water scarcity region with conservation",
    "Overhead view of a skill development center",
    "Bird's eye view of a renewable energy park",
    "Aerial view of a smart city proposal area",
    "Map view of a coral reef conservation zone",
    "Overhead view of a startup incubator complex",
    "Bird's eye view of a integrated check post",
]

def create_directory_structure():
    """Create the directory structure for images"""
    for test_type in ['tat', 'ppdt', 'gpe']:
        dir_path = PUBLIC_IMAGES_DIR / test_type
        dir_path.mkdir(parents=True, exist_ok=True)
        print(f"Created directory: {dir_path}")

def download_image(prompt, output_path, width=IMAGE_WIDTH, height=IMAGE_HEIGHT):
    """Download an image from pollinations.ai"""
    try:
        # Encode the prompt for URL
        encoded_prompt = prompt.replace(' ', '%20')
        url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width={width}&height={height}&nologo=true&seed={int(time.time() * 1000)}"
        
        # Create request with proper headers to avoid 403 errors
        req = urllib.request.Request(url)
        req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
        req.add_header('Accept', 'image/webp,image/apng,image/*,*/*;q=0.8')
        req.add_header('Referer', 'https://pollinations.ai/')
        
        # Download the image
        with urllib.request.urlopen(req) as response, open(output_path, 'wb') as out_file:
            out_file.write(response.read())
        return True
    except Exception as e:
        print(f"Error downloading image for prompt '{prompt[:50]}...': {e}")
        return False

def generate_tat_images():
    """Generate 60 TAT images"""
    print("\n=== Generating TAT Images ===")
    tat_dir = PUBLIC_IMAGES_DIR / "tat"
    
    for i, prompt in enumerate(TAT_PROMPTS, 1):
        filename = f"tat_{i:03d}.jpg"
        output_path = tat_dir / filename
        
        print(f"Generating TAT image {i}/60: {filename}")
        
        if download_image(prompt, output_path):
            print(f"✓ Saved: {output_path}")
        else:
            print(f"✗ Failed: {filename}")
        
        time.sleep(DELAY_BETWEEN_REQUESTS)

def generate_ppdt_images():
    """Generate 60 PPDT images"""
    print("\n=== Generating PPDT Images ===")
    ppdt_dir = PUBLIC_IMAGES_DIR / "ppdt"
    
    for i, prompt in enumerate(PPDT_PROMPTS, 1):
        filename = f"ppdt_{i:03d}.jpg"
        output_path = ppdt_dir / filename
        
        print(f"Generating PPDT image {i}/60: {filename}")
        
        if download_image(prompt, output_path):
            print(f"✓ Saved: {output_path}")
        else:
            print(f"✗ Failed: {filename}")
        
        time.sleep(DELAY_BETWEEN_REQUESTS)

def generate_gpe_images():
    """Generate 60 GPE images"""
    print("\n=== Generating GPE Images ===")
    gpe_dir = PUBLIC_IMAGES_DIR / "gpe"
    
    for i, prompt in enumerate(GPE_PROMPTS, 1):
        filename = f"gpe_{i:03d}.jpg"
        output_path = gpe_dir / filename
        
        print(f"Generating GPE image {i}/60: {filename}")
        
        if download_image(prompt, output_path):
            print(f"✓ Saved: {output_path}")
        else:
            print(f"✗ Failed: {filename}")
        
        time.sleep(DELAY_BETWEEN_REQUESTS)

def update_json_files():
    """Update the JSON files with local image URLs"""
    print("\n=== Updating JSON Files ===")
    
    # Update TAT JSON
    tat_json_path = SCRIPT_DIR.parent / "tat_60_sets.json"
    if tat_json_path.exists():
        with open(tat_json_path, 'r') as f:
            tat_data = json.load(f)
        
        for i, scenario_set in enumerate(tat_data['sets']):
            for j, scenario in enumerate(scenario_set['scenarios']):
                # Map each scenario to an image (cycle through 60 images)
                image_num = ((i * 12 + j) % 60) + 1
                scenario['image_url'] = f"/images/tat/tat_{image_num:03d}.jpg"
        
        with open(tat_json_path, 'w') as f:
            json.dump(tat_data, f, indent=2)
        print("✓ Updated tat_60_sets.json")
    
    # Update PPDT JSON
    ppdt_json_path = SCRIPT_DIR.parent / "ppdt_60_sets.json"
    if ppdt_json_path.exists():
        with open(ppdt_json_path, 'r') as f:
            ppdt_data = json.load(f)
        
        for i, image_set in enumerate(ppdt_data['sets']):
            for j, image_info in enumerate(image_set['images']):
                image_num = i + 1  # One image per set
                image_info['image_url'] = f"/images/ppdt/ppdt_{image_num:03d}.jpg"
        
        with open(ppdt_json_path, 'w') as f:
            json.dump(ppdt_data, f, indent=2)
        print("✓ Updated ppdt_60_sets.json")
    
    # Update GPE JSON
    gpe_json_path = SCRIPT_DIR.parent / "gpe_60_sets.json"
    if gpe_json_path.exists():
        with open(gpe_json_path, 'r') as f:
            gpe_data = json.load(f)
        
        for i, scenario_set in enumerate(gpe_data['sets']):
            for j, scenario in enumerate(scenario_set['scenarios']):
                image_num = i + 1
                scenario['image_url'] = f"/images/gpe/gpe_{image_num:03d}.jpg"
        
        with open(gpe_json_path, 'w') as f:
            json.dump(gpe_data, f, indent=2)
        print("✓ Updated gpe_60_sets.json")

def main():
    """Main execution function"""
    print("=" * 60)
    print("SSB Test Image Generator")
    print("Generating 60 images each for TAT, PPDT, and GPE")
    print("=" * 60)
    
    # Create directory structure
    create_directory_structure()
    
    # Generate images
    generate_tat_images()
    generate_ppdt_images()
    generate_gpe_images()
    
    # Update JSON files
    update_json_files()
    
    print("\n" + "=" * 60)
    print("Image generation complete!")
    print(f"Images saved to: {PUBLIC_IMAGES_DIR}")
    print("=" * 60)

if __name__ == "__main__":
    main()