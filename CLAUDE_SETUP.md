# Claude AI Integration Setup

This document explains how to set up Claude AI for SVG icon generation in your AI Icon Maker app.

## Prerequisites

1. **Anthropic API Account**: Sign up at [https://console.anthropic.com/](https://console.anthropic.com/)
2. **API Key**: Generate an API key from your Anthropic dashboard

## Environment Configuration

Add the following to your `.env.local` file:

```bash
# Anthropic API Key for Claude
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

## Features

### 🎨 AI-Powered Icon Generation
- Uses Claude 3.5 Sonnet for intelligent SVG generation
- Supports multiple styles: Modern, Flat, Metallic, Cartoon, etc.
- Customizable primary colors
- Generates 3 unique variations per prompt

### 🔒 Security & Rate Limiting
- Built-in rate limiting (10 requests/minute per user)
- Input validation and sanitization
- Error handling with fallback mock data

### 🚀 API Endpoints

#### POST `/api/generate-icons`
Generate SVG icons using Claude AI.

**Request Body:**
```json
{
  "prompt": "shopping cart icon",
  "style": "modern",
  "primaryColor": "#FF6C00"
}
```

**Response:**
```json
{
  "success": true,
  "icons": [
    "data:image/svg+xml;base64,...",
    "data:image/svg+xml;base64,...",
    "data:image/svg+xml;base64,..."
  ],
  "message": "Generated 3 icons successfully"
}
```

## Usage

1. **Set up your API key** in `.env.local`
2. **Start the development server**: `npm run dev`
3. **Navigate to the Generate page** (requires active subscription)
4. **Enter your icon description** and select style/color preferences
5. **Click Generate** to create AI-powered SVG icons

## Supported Styles

- **Modern**: Clean and contemporary design
- **Flat**: Minimalist flat design
- **Metallic**: Shiny metallic finish
- **Cartoon**: Fun and playful style
- **Pictogram**: Simple symbolic representation
- **Line Art**: Outline style with clean lines
- **3D**: Three-dimensional appearance
- **Vintage**: Retro and classic style
- **Neon**: Glowing neon effect
- **Hand-drawn**: Sketchy, artistic style

## Error Handling

The system includes robust error handling:
- Falls back to demo icons if Claude API fails
- Rate limiting protection
- Input validation
- User-friendly error messages

## Development Notes

- The Claude service is located in `lib/claude.ts`
- API route is in `app/api/generate-icons/route.ts`
- Integration is in `app/(app)/generate/page.tsx`

## Cost Considerations

Claude API usage is charged per token. Typical icon generation requests cost approximately:
- Input: ~100-200 tokens
- Output: ~500-1000 tokens per icon set
- Total: ~$0.01-0.03 per generation request

Monitor your usage in the Anthropic console.