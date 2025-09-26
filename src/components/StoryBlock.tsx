import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import React from 'react';
import { StoryEntry } from '../types/story';
import { formatTimestamp } from '../lib/utils';
import { useTypewriter, useAudioPlayer } from '../hooks/useTypewriter';
import { Play, Pause, User, Bot } from 'lucide-react';
import { useStoryState } from '../hooks/useStoryState';

interface StoryBlockProps {
  entry: StoryEntry;
  darkMode: boolean;
  autoPlay?: boolean;
  onAudioPlay?: (entryId: string) => void;
}

export function StoryBlock({ entry, darkMode, autoPlay = false, onAudioPlay }: StoryBlockProps) {
  const { displayedText, isTyping } = useTypewriter(entry.storyText, 30, !entry.isGenerating);
  const { isPlaying, playAudio, stopAudio, playingId } = useAudioPlayer();
  const { state, actions } = useStoryState();
  const wasTyping = React.useRef<boolean>(false);
  const isThisEntryPlaying = playingId === entry.id;

  const handlePlayAudio = () => {
    if (!entry.audioUrl) return;

    if (isThisEntryPlaying) {

      if (isPlaying) {
        stopAudio();
      } else {
        playAudio(entry.audioUrl, entry.id);
        onAudioPlay?.(entry.id);
      }
    } else {

      stopAudio();
      playAudio(entry.audioUrl, entry.id);
      onAudioPlay?.(entry.id);
    }
  };





  React.useEffect(() => {

    if (!autoPlay || !entry.audioUrl) return;


    if (wasTyping.current && !isTyping && !entry.isGenerating && !isThisEntryPlaying) {
      console.log("AI finished typing, playing audio:", entry.audioUrl);

      const timer = setTimeout(() => {
        playAudio(entry.audioUrl!, entry.id);
        onAudioPlay?.(entry.id);
      }, 500);


      return () => clearTimeout(timer);
    }


    wasTyping.current = isTyping;
  }, [isTyping, entry.isGenerating, entry.audioUrl, autoPlay, playAudio, onAudioPlay, entry.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-6"
    >
      {/* User Action Block */}
      {entry.userAction && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-4"
        >
          <Card className={`${darkMode ? 'bg-blue-900/20 border-blue-500/20' : 'bg-blue-50 border-blue-200'}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                      Your Action
                    </span>
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
              <p className={`ml-11 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {entry.userAction}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Story Response Block */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className={`${darkMode ? 'bg-purple-900/20 border-purple-500/20' : 'bg-purple-50 border-purple-200'}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>
                    Story Narrator
                  </span>
                  <div className="flex items-center gap-2">
                    {entry.audioUrl && state.audioEnabled && !entry.isGenerating && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handlePlayAudio}
                        className={`h-8 px-3 ${isThisEntryPlaying
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            : darkMode
                              ? 'hover:bg-purple-800/50 text-purple-400 hover:text-purple-300'
                              : 'hover:bg-purple-100 text-purple-600 hover:text-purple-700'
                          } transition-all duration-200`}
                      >
                        {isThisEntryPlaying ? (
                          <Pause className="w-4 h-4 mr-1" />
                        ) : (
                          <Play className="w-4 h-4 mr-1" />
                        )}
                        {isThisEntryPlaying ? 'Pause' : 'Play Voice'}
                      </Button>
                    )}
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="ml-11">
              {entry.isGenerating ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 py-4"
                >
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-purple-400 rounded-full"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    ))}
                  </div>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Generating story...
                  </span>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  <p className={`${darkMode ? 'text-gray-200' : 'text-gray-800'} leading-relaxed text-lg`}>
                    {displayedText}
                    {isTyping && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="ml-1 text-purple-400"
                      >
                        |
                      </motion.span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}