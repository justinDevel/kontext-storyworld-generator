import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/Card';
import { StoryEntry as StoryEntryType } from '../types/story';
import { formatTimestamp } from '../lib/utils';
import { User, Bot, Play, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { useEffect, useState } from 'react';

interface StoryEntryProps {
  entry: StoryEntryType;
  darkMode: boolean;
}

export function StoryEntry({ entry, darkMode }: StoryEntryProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (entry.storyText && !entry.isGenerating) {
      setIsTyping(true);
      setDisplayedText('');
      
      let currentIndex = 0;
      const typewriterInterval = setInterval(() => {
        if (currentIndex < entry.storyText.length) {
          setDisplayedText(entry.storyText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typewriterInterval);
        }
      }, 30);

      return () => clearInterval(typewriterInterval);
    }
  }, [entry.storyText, entry.isGenerating]);

  const playAudio = () => {
    if (entry.audioUrl && entry.audioUrl !== 'data:audio/mpeg;base64,mock-audio-data') {
      const audio = new Audio(entry.audioUrl);
      audio.play();
    } else {
     
      console.log('Playing audio narration for:', entry.storyText.slice(0, 50) + '...');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* User Action */}
      {entry.userAction && (
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-500'}`}>
            <User className="w-4 h-4 text-white" />
          </div>
          <Card className={`flex-1 ${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80'}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  Your Action
                </span>
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formatTimestamp(entry.timestamp)}
                </span>
              </div>
              <p className={darkMode ? 'text-gray-200' : 'text-gray-800'}>
                {entry.userAction}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Story Response */}
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full ${darkMode ? 'bg-purple-600' : 'bg-purple-500'}`}>
          <Bot className="w-4 h-4 text-white" />
        </div>
        <Card className={`flex-1 ${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                Story Continuation
              </span>
              <div className="flex items-center gap-2">
                {entry.audioUrl && !entry.isGenerating && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={playAudio}
                    className="h-8 w-8 p-0"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                )}
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formatTimestamp(entry.timestamp)}
                </span>
              </div>
            </div>
            
            {entry.isGenerating ? (
              <div className="flex items-center gap-2 py-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Generating your story...
                </span>
              </div>
            ) : (
              <p className={`${darkMode ? 'text-gray-200' : 'text-gray-800'} leading-relaxed`}>
                {displayedText}
                {isTyping && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="ml-1"
                  >
                    |
                  </motion.span>
                )}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}