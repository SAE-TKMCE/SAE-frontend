# Instructions for Adding the Baja Racing Hero Image

## Steps to add the image:

1. **Save the Baja racing image:**
   - Right-click on the Baja racing image you shared
   - Save it as `baja-racing-hero.jpg`
   - Place it in: `d:\Documents\SAE\frontend\sae-website\public\images\baja-racing-hero.png`

2. **Image Requirements:**
   - Format: JPG or PNG
   - Recommended size: 1920x1080 or higher for best quality
   - The image will automatically be used as the hero background

3. **Current Setup:**
   - ✅ Dark gradient overlay applied for text readability
   - ✅ Enhanced text shadows for better contrast
   - ✅ Responsive background positioning
   - ✅ Grease/oil texture overlay for automotive feel

## Alternative: If you want to use a different image

Replace the image path in `src/pages/Home.jsx`:

```jsx
backgroundImage: `url('/images/your-new-image-name.jpg')`,
```

## Image Optimization Tips:

- Compress the image to reduce load times
- Consider using WebP format for better compression
- Make sure the image has good contrast for text overlay

The hero section will show:
- Your real Baja racing action shot as background
- Dark gradient overlay (80% black to 85% black)
- "GREASE MUD GLORY" title with enhanced shadows
- All text optimized for readability over the racing image
