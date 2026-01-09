#!/usr/bin/env python3
"""
Generate OpenAI TTS voice previews for all 9 voices
"""

import asyncio
import os

# Sample text for phone system preview
SAMPLE_TEXT = "Thank you for calling DFW HVAC. Your comfort is our priority. Please hold while we connect you with the next available representative."

# All 9 available voices
VOICES = [
    ("alloy", "Neutral, balanced"),
    ("ash", "Clear, articulate"),
    ("coral", "Warm, friendly"),
    ("echo", "Smooth, calm"),
    ("fable", "Expressive, storytelling"),
    ("nova", "Energetic, upbeat"),
    ("onyx", "Deep, authoritative"),
    ("sage", "Wise, measured"),
    ("shimmer", "Bright, cheerful"),
]

async def generate_previews():
    from emergentintegrations.llm.openai import OpenAITextToSpeech
    
    # Use Emergent LLM key
    api_key = "sk-emergent-78326Ae47Be2a7dA6A"
    
    tts = OpenAITextToSpeech(api_key=api_key)
    
    output_dir = "/app/frontend/public/voice-previews"
    os.makedirs(output_dir, exist_ok=True)
    
    print("=" * 60)
    print("GENERATING OPENAI TTS VOICE PREVIEWS")
    print("=" * 60)
    print(f"\nSample text: \"{SAMPLE_TEXT}\"\n")
    print(f"Using model: tts-1-hd (high quality)\n")
    
    results = []
    
    for voice, description in VOICES:
        print(f"Generating {voice} ({description})...", end=" ")
        try:
            audio_bytes = await tts.generate_speech(
                text=SAMPLE_TEXT,
                model="tts-1-hd",
                voice=voice,
                response_format="mp3"
            )
            
            filename = f"voice-{voice}.mp3"
            filepath = os.path.join(output_dir, filename)
            
            with open(filepath, "wb") as f:
                f.write(audio_bytes)
            
            file_size = len(audio_bytes) / 1024
            print(f"✓ ({file_size:.1f} KB)")
            results.append((voice, description, filename, True))
            
        except Exception as e:
            print(f"✗ Error: {e}")
            results.append((voice, description, None, False))
    
    print("\n" + "=" * 60)
    print("PREVIEW FILES GENERATED")
    print("=" * 60)
    print(f"\nLocation: {output_dir}/")
    print("\nFiles:")
    for voice, description, filename, success in results:
        if success:
            print(f"  • {filename} - {voice.title()}: {description}")
    
    return results

if __name__ == "__main__":
    asyncio.run(generate_previews())
