import { fal } from '@fal-ai/client';

interface VideoGenerationInput {
  prompt: string;
  image_url: string;
  model: string;
}
 function getFalClient() {
  const apiKey = localStorage.getItem('fal_api_key');
  if (!apiKey) {
    throw new Error('FAL.ai API key not configured. Please set your API key in settings.');
  }
  console.log('fal apiKey:: ',apiKey);

  fal.config({ credentials: apiKey });
  return { apiKey };
}
export async function generateVideo(
  imageUrl: string,
  prompt: string,
  model: string = 'fal-ai/kling-video/v1/standard/image-to-video'
): Promise<{ video_url: string; credits_used: number }> {
  try {
    getFalClient();
    const result = await fal.subscribe(model, {
      input: {
        prompt: prompt,
        image_url: imageUrl,
        
        fps: 24,
        duration: 5,
        aspect_ratio: "16:9"
      }
    });

    return {
      video_url: result.data.video?.url || result.data.video_url || '',
      credits_used: result.data.credits_used || 2
    };
  } catch (error) {
    console.error('FAL Video API Error:', error);
    throw new Error('Failed to generate video');
  }
}

export async function combineVideoWithAudio(
  videoUrl: string,
  audioUrl: string
): Promise<string> {
  try {
   
    
    const result = await fal.subscribe('fal-ai/ffmpeg-api/merge-audio-video', {
      input: {
        video_url: videoUrl,
        audio_url: audioUrl,
       
      }
    });
    
    console.log('combined_video_url:: ', JSON.stringify(result));
    return result.data.combined_video_url;
  } catch (error) {
    console.error('Video-Audio Combination Error:', error);
   
    return videoUrl;
  }
}
