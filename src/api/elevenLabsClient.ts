interface ElevenLabsConfig {
  apiKey: string;
  voiceId: string;
}



export async function generateSpeech(
  text: string,
  config?: Partial<ElevenLabsConfig>
): Promise<string> {
  try {
    
    const apiKey =
      config?.apiKey || localStorage.getItem("elevenlabs_api_key") || "";
    const voiceId =
      config?.voiceId ||
      localStorage.getItem("elevenlabs_voice_id") ||
      "EXAVITQu4vr4xnSDxMaL";

    if (!apiKey) {
      console.warn("No ElevenLabs API key found, using mock speech generator.");
      return await generateSpeechMock(text);
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.5,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      console.warn(
        `ElevenLabs API error: ${response.status} ${response.statusText}`
      );
      return await generateSpeechMock(text);
    }

    const audioBlob = await response.blob();
    return URL.createObjectURL(audioBlob);
  } catch (error) {
    console.error("ElevenLabs API Error:", error);
    return await generateSpeechMock(text);
  }
}


export async function generateSpeechMock(text: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return 'data:audio/mpeg;base64,mock-audio-data';
}