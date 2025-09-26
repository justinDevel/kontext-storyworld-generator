import { fal } from '@fal-ai/client';

function getFalClient() {
  const apiKey = localStorage.getItem('fal_api_key');
  if (!apiKey) {
    throw new Error('FAL.ai API key not configured. Please set your API key in settings.');
  }
  console.log('fal apiKey:: ',apiKey);

  fal.config({ credentials: apiKey });
  return { apiKey };
}

interface FalFluxResponse {
  story_text: string;
  image_url: string;
  credits_used: number;
}

export async function generateStoryContent(
  userAction: string,
  storyHistory: string[]
): Promise<FalFluxResponse> {
  try {
    getFalClient(); 
    const result = await fal.subscribe('fal-ai/flux-1/dev', {
      input: {
        prompt: `Continue this interactive story based on user action: "${userAction}". 
                 Story history: ${storyHistory.join(' ')}. 
                 Generate both narrative continuation and scene description for image.`,
        image_size: "landscape_4_3",
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 1,
        enable_safety_checker: true
      }
    });
    console.log('result from generate story:: ', JSON.stringify(result));
    return {
      story_text: result.data.story_text || userAction,
      image_url: result.data.images[0]?.url || "",
      credits_used: result.data.credits_used || 1
    };
  } catch (error) {
    console.error('FAL API Error:', error);
    throw new Error('Failed to generate story content');
  }
}


export async function editImage(
  imageUrl: string,
  prompt: string
): Promise<{ image_url: string; credits_used: number }> {
  try {
    getFalClient(); 
    const result = await fal.subscribe('fal-ai/flux-kontext/dev', {
      input: {
        prompt: prompt,
        image_url: imageUrl,
        num_inference_steps: 28,
        guidance_scale: 3.5,
        enable_safety_checker: true
      }
    });

    console.log('result:: ', JSON.stringify(result));
    return {
      image_url: result.data.images[0]?.url || "",
      credits_used: result.data.credits_used || 1
    };
  } catch (error) {
    console.error('FAL Image Edit Error:', error);
    throw new Error('Failed to edit image');
  }
}
