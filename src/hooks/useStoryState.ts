import { useState, useCallback } from 'react';
import { StoryEntry, StoryState } from '../types/story';
import { generateStoryContent, editImage } from '../api/falClient';
import { generateSpeech } from '../api/elevenLabsClient';
import { generateVideo, combineVideoWithAudio } from '../api/falVideoClient';
import { generateId } from '../lib/utils';

export function useStoryState() {
  const [state, setState] = useState<StoryState>({
    entries: [],
    isGenerating: false,
    totalCreditsUsed: 0,
    darkMode: false,
    audioEnabled: true
  });

  const addUserAction = useCallback(async (userAction: string) => {
    if (state.isGenerating) return;

    setState(prev => ({ ...prev, isGenerating: true }));

     let newEntry: StoryEntry;

    try {
   
      newEntry = {
        id: generateId(),
        timestamp: Date.now(),
        userAction,
        storyText: '',
        isGenerating: true
      };

      setState(prev => ({
        ...prev,
        entries: [...prev.entries, newEntry]
      }));

     
      const storyHistory = state.entries.map(entry => entry.storyText);
      const response = await generateStoryContent(userAction, storyHistory);

     
      let audioUrl: string | undefined;
      if (state.audioEnabled) {
        try {
          audioUrl = await generateSpeech(response.story_text);
        } catch (audioError) {
          console.warn('Audio generation failed:', audioError);
        }
      }

      
      setState(prev => ({
        ...prev,
        isGenerating: false,
        totalCreditsUsed: prev.totalCreditsUsed + response.credits_used,
        entries: prev.entries.map(entry =>
          entry.id === newEntry.id
            ? {
                ...entry,
                storyText: response.story_text,
                imageUrl: response.image_url,
                audioUrl,
                isGenerating: false
              }
            : entry
        )
      }));

    } catch (error) {
      console.error('Story generation failed:', error);
      setState(prev => ({
        ...prev,
        isGenerating: false,
        entries: prev.entries.map(entry =>
          entry.id === newEntry.id
            ? {
                ...entry,
                storyText: 'Something went wrong generating the story. Please try again.',
                isGenerating: false
              }
            : entry
        )
      }));
    }
  }, [state.entries, state.isGenerating, state.audioEnabled]);

  const toggleDarkMode = useCallback(() => {
    setState(prev => ({ ...prev, darkMode: !prev.darkMode }));
  }, []);

  const toggleAudio = useCallback(() => {
    setState(prev => ({ ...prev, audioEnabled: !prev.audioEnabled }));
  }, []);

  const exportStory = useCallback(() => {
    const exportData = {
      title: 'Kontext Storyworld Export',
      timestamp: new Date().toISOString(),
      entries: state.entries,
      totalCreditsUsed: state.totalCreditsUsed
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `storyworld-export-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [state.entries, state.totalCreditsUsed]);

  const generateVideoForEntry = useCallback(async (
    entryId: string, 
    prompt: string, 
    model: string
  ) => {
    const entry = state.entries.find(e => e.id === entryId);
    if (!entry || !entry.imageUrl) return;

   
    setState(prev => ({
      ...prev,
      entries: prev.entries.map(e =>
        e.id === entryId
          ? { ...e, isGeneratingVideo: true, videoPrompt: prompt }
          : e
      )
    }));

    try {
  
      const videoResponse = await generateVideo(entry.imageUrl, prompt, model);
      
     
      // let finalVideoUrl = videoResponse.video_url;
      // if (entry.audioUrl && entry.audioUrl !== 'data:audio/mpeg;base64,mock-audio-data') {
      //   try {
      //     finalVideoUrl = await combineVideoWithAudio(videoResponse.video_url, entry.audioUrl);
      //   } catch (error) {
      //     console.warn('Failed to combine video with audio:', error);
      //   }
      // }

     
      setState(prev => ({
        ...prev,
        totalCreditsUsed: prev.totalCreditsUsed + videoResponse.credits_used,
        entries: prev.entries.map(e =>
          e.id === entryId
            ? {
                ...e,
                videoUrl: videoResponse.video_url,
                isGeneratingVideo: false
              }
            : e
        )
      }));

    } catch (error) {
      console.error('Video generation failed:', error);
      setState(prev => ({
        ...prev,
        entries: prev.entries.map(e =>
          e.id === entryId
            ? { ...e, isGeneratingVideo: false }
            : e
        )
      }));
    }
  }, [state.entries]);

  const editImageForEntry = useCallback(async (
    entryId: string, 
    prompt: string
  ) => {
    const entry = state.entries.find(e => e.id === entryId);
    if (!entry || !entry.imageUrl) return;

  
    setState(prev => ({
      ...prev,
      entries: prev.entries.map(e =>
        e.id === entryId
          ? { ...e, isEditing: true }
          : e
      )
    }));

    try {
    
      const editResponse = await editImage(entry.imageUrl, prompt);
      
      
      setState(prev => ({
        ...prev,
        totalCreditsUsed: prev.totalCreditsUsed + editResponse.credits_used,
        entries: prev.entries.map(e =>
          e.id === entryId
            ? {
                ...e,
                imageUrl: editResponse.image_url,
                isEditing: false
              }
            : e
        )
      }));

    } catch (error) {
      console.error('Image editing failed:', error);
      setState(prev => ({
        ...prev,
        entries: prev.entries.map(e =>
          e.id === entryId
            ? { ...e, isEditing: false }
            : e
        )
      }));
    }
  }, [state.entries]);

  return {
    state,
    actions: {
      addUserAction,
      toggleDarkMode,
      toggleAudio,
      exportStory,
      generateVideoForEntry,
      editImageForEntry
    }
  };
}