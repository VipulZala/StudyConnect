# AI Image Generation Setup Guide

## How to Enable DALL-E 3 AI Image Generation

The Projects page now supports **real AI image generation** using OpenAI's DALL-E 3 API!

### Setup Instructions:

1. **Get an OpenAI API Key:**
   - Visit https://platform.openai.com/api-keys
   - Sign up or log in to your OpenAI account
   - Create a new API key
   - Copy the key (it starts with `sk-...`)

2. **Add the API Key to Your Project:**
   - Create a `.env` file in the root directory (copy from `.env.example`)
   - Add your API key:
     ```
     VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
     ```

3. **Restart Your Development Server:**
   ```bash
   npm run dev
   ```

### How It Works:

- When you create a new project and enter a keyword or title, click "🎨 Generate Image"
- The system will call DALL-E 3 to create a unique, custom thumbnail
- If no API key is provided, it falls back to high-quality Unsplash images

### Pricing:

- DALL-E 3 Standard Quality (1792x1024): **$0.080 per image**
- You only pay for images you generate
- The fallback Unsplash images are completely free

### Features:

✅ Real AI-generated project thumbnails
✅ Custom keyword support (e.g., "blockchain", "cloud", "gaming")
✅ Automatic fallback to Unsplash if API fails
✅ 16:9 aspect ratio optimized for project cards
✅ Vivid, professional, technology-themed designs

**Note:** Keep your API key secure and never commit it to version control!
