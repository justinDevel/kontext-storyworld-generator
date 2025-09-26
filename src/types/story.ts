export interface StoryEntry {
  id: string;
  timestamp: number;
  userAction?: string;
  storyText: string;
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  videoPrompt?: string;
  isGeneratingVideo?: boolean;
  isEditing?: boolean;
  isGenerating?: boolean;
}

export interface StoryState {
  entries: StoryEntry[];
  isGenerating: boolean;
  totalCreditsUsed: number;
  darkMode: boolean;
  audioEnabled: boolean;
}

export interface FALResponse {
  story_text: string;
  image_url: string;
  credits_used: number;
}

export interface ElevenLabsResponse {
  audio_url: string;
}

export interface VideoGenerationRequest {
  imageUrl: string;
  prompt: string;
  model: string;
}

export interface FALVideoResponse {
  video_url: string;
  credits_used: number;
}

export const VIDEO_MODELS = [
  { id: 'fal-ai/minimax-video', name: 'Minimax Video (Recommended)', description: 'High-quality image-to-video generation' },
  { id: 'fal-ai/luma-dream-machine', name: 'luma Dream  Machine', description: 'Fast video generation with good quality' },
  { id: 'fal-ai/kling-video/v1/standard/image-to-video', name: 'kling Video', description: 'Advanced video generation model' },
] as const;