# SSB Test Image Generation Guide

This guide explains how to generate and use pre-generated images for TAT, PPDT, and GPE tests.

## Overview

The SSB NextGen Pro application now supports **60 pre-generated images** for each test type:

- **TAT (Thematic Apperception Test)**: 60 images
- **PPDT (Picture Perception and Description Test)**: 60 images
- **GPE (Group Planning Exercise)**: 60 images

**Total**: 180 images stored locally in `/frontend/public/images/`

## Quick Start

### 1. Generate Images

Run the image generation script to download all 180 images from pollinations.ai:

```bash
cd frontend/src/data/scripts
python generate_test_images.py
```

**What this does:**

- Creates directory structure: `/public/images/tat/`, `/public/images/ppdt/`, `/public/images/gpe/`
- Downloads 60 images for each test type (800x600 resolution)
- Updates JSON files with local image URLs
- Includes fallback to pollinations.ai if local images fail

**Time required**: ~12 minutes (2 seconds delay between requests to avoid rate limiting)

### 2. Verify Installation

After generation, you should have:

```
frontend/public/images/
├── tat/
│   ├── tat_001.jpg
│   ├── tat_002.jpg
│   └── ... (60 total)
├── ppdt/
│   ├── ppdt_001.jpg
│   ├── ppdt_002.jpg
│   └── ... (60 total)
└── gpe/
    ├── gpe_001.jpg
    ├── gpe_002.jpg
    └── ... (60 total)
```

### 3. Update Git (Optional)

If you want to commit the images to your repository:

```bash
cd frontend
git add public/images/
git commit -m "Add pre-generated images for TAT, PPDT, GPE tests"
```

**Note**: This will increase your repository size by approximately 15-20MB.

## Image Specifications

- **Resolution**: 800x600 pixels
- **Format**: JPEG
- **Style**:
  - TAT: Clear scenarios with human subjects
  - PPDT: Hazy black and white ambiguous scenes
  - GPE: Aerial/map views of locations

## Fallback Mechanism

The application includes a fallback system:

1. First tries to load pre-generated local image
2. If local image fails (404, etc.), falls back to pollinations.ai
3. Ensures tests always have images available

## JSON File Updates

The script automatically updates these files:

- `tat_60_sets.json` - Adds `image_url` to each scenario
- `ppdt_60_sets.json` - Adds `image_url` to each image entry
- `gpe_60_sets.json` - Adds `image_url` to each scenario

Example structure after update:

```json
{
  "sets": [
    {
      "set_id": 1,
      "scenarios": [
        {
          "description": "...",
          "image_url": "/images/tat/tat_001.jpg",
          ...
        }
      ]
    }
  ]
}
```

## Customization

### Changing Image Styles

Edit the prompts in `generate_test_images.py`:

```python
TAT_PROMPTS = [
    "Your custom prompt here",
    # ... 59 more prompts
]
```

### Different Image Dimensions

Modify these constants:

```python
IMAGE_WIDTH = 800
IMAGE_HEIGHT = 600
```

### Regenerating Images

To regenerate all images (e.g., with different prompts):

```bash
# Delete existing images
rm -rf frontend/public/images/tat/*
rm -rf frontend/public/images/ppdt/*
rm -rf frontend/public/images/gpe/*

# Regenerate
python frontend/src/data/scripts/generate_test_images.py
```

## Troubleshooting

### Images Not Loading

1. Check if images exist:

   ```bash
   ls frontend/public/images/tat/
   ```

2. Verify file permissions:

   ```bash
   chmod 644 frontend/public/images/*/*.jpg
   ```

3. Check Next.js is serving static files correctly

### Script Fails to Download

1. Check internet connection
2. Verify pollinations.ai is accessible
3. Try increasing delay between requests:
   ```python
   DELAY_BETWEEN_REQUESTS = 3  # Increase from 2 to 3 seconds
   ```

### TypeScript Errors

If you see TypeScript errors about missing `image_url` property:

1. Run the generation script to update JSON files
2. Or manually add `image_url` fields to JSON files
3. Or add TypeScript interface declaration for the dynamic property

## Performance Benefits

**Before (On-demand generation)**:

- Image load time: 2-5 seconds per image
- Depends on pollinations.ai response time
- May fail if service is down

**After (Pre-generated)**:

- Image load time: <100ms (local file)
- No external dependencies
- Works offline after initial generation

## Storage Considerations

- **Total images**: 180
- **Average size per image**: ~100-150KB
- **Total storage**: ~18-27MB
- **CDN friendly**: Yes, can be served via CDN

## Best Practices

1. **Generate once**: Run the script once and commit images to repo
2. **Use version control**: Track image changes in git
3. **Backup images**: Keep a backup of generated images
4. **Test locally**: Verify images load correctly before deployment
5. **Monitor size**: Be aware of repository size increase

## Alternative: Using External URLs

If you prefer not to store images locally, you can:

1. Host images on a CDN (Cloudinary, AWS S3, etc.)
2. Update JSON files with CDN URLs
3. Modify `getCurrentTatImageUrl()` functions to use CDN

Example:

```javascript
return `https://your-cdn.com/images/tat/tat_${imageNum}.jpg`;
```

## Support

For issues or questions:

1. Check this README
2. Review `generate_test_images.py` comments
3. Examine the JSON structure in `*_60_sets.json` files
4. Check browser console for specific error messages

---

**Last Updated**: 2026-05-20
**Version**: 1.0
