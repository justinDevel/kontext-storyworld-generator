import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import JSZip from 'jszip';
import { ApiConfigModal } from './ApiConfigModal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Switch } from './ui/Switch';
import { useStoryState } from '../hooks/useStoryState';
import { StoryBlock } from './StoryBlock';
import { ImageGallery } from './ImageGallery';
import { 
  ArrowLeft,
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  Download,
  Loader2,
  BarChart3,
  Sparkles,
  Settings
} from 'lucide-react';

interface StoryInterfaceProps {
  onBack: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function StoryInterface({ onBack, darkMode, onToggleDarkMode }: StoryInterfaceProps) {
  const { state, actions } = useStoryState();
  const [inputValue, setInputValue] = useState('');
  const [currentAudioId, setCurrentAudioId] = useState<string | null>(null);
  const [showApiConfig, setShowApiConfig] = useState(false);
  const storyFeedRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    if (storyFeedRef.current) {
      storyFeedRef.current.scrollTo({
        top: storyFeedRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [state.entries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !state.isGenerating) {
      actions.addUserAction(inputValue.trim());
      setInputValue('');
    }
  };

  const handleExport = async () => {
    const zip = new JSZip();
    
   
    let storyText = 'KONTEXT STORYWORLD STORY\n';
    storyText += '========================\n\n';
    storyText += `Generated on: ${new Date().toLocaleDateString()}\n`;
    storyText += `Total Entries: ${state.entries.length}\n`;
    storyText += `Credits Used: ${state.totalCreditsUsed}\n\n`;
    
    state.entries.forEach((entry, index) => {
      storyText += `--- Chapter ${index + 1} ---\n`;
      if (entry.userAction) {
        storyText += `Your Action: ${entry.userAction}\n\n`;
      }
      storyText += `Story: ${entry.storyText}\n\n`;
    });
    
    zip.file('story.txt', storyText);
    
   
    const imageFolder = zip.folder('images');
    const audioFolder = zip.folder('audio');
    const videoFolder = zip.folder('video');
    
    for (let i = 0; i < state.entries.length; i++) {
      const entry = state.entries[i];
      
     
      if (entry.imageUrl && entry.imageUrl.startsWith('http')) {
        try {
          const imageResponse = await fetch(entry.imageUrl);
          const imageBlob = await imageResponse.blob();
          imageFolder?.file(`scene_${i + 1}.jpg`, imageBlob);
        } catch (error) {
          console.warn(`Failed to download image ${i + 1}:`, error);
        }
      }
      
      
      if (entry.audioUrl && entry.audioUrl !== 'data:audio/mpeg;base64,mock-audio-data') {
        try {
          const audioResponse = await fetch(entry.audioUrl);
          const audioBlob = await audioResponse.blob();
          audioFolder?.file(`narration_${i + 1}.mp3`, audioBlob);
        } catch (error) {
          console.warn(`Failed to download audio ${i + 1}:`, error);
        }
      }

      if (
    entry.videoUrl &&
    entry.videoUrl !== "data:video/mp4;base64,mock-video-data"
  ) {
    try {
      const videoResponse = await fetch(entry.videoUrl);
      if (!videoResponse.ok) throw new Error(`HTTP ${videoResponse.status}`);
      const videoBlob = await videoResponse.blob();

     
      const videoExt =
        videoBlob.type.split("/")[1] || "mp4";

      videoFolder?.file(`clip_${i + 1}.${videoExt}`, videoBlob);
    } catch (error) {
      console.warn(`⚠️ Failed to download video ${i + 1}:`, error);
    }
  }


    }
    
  
    const readme = `# Kontext Storyworld Story Export

This package contains:
- story.txt: Your complete story in readable format
- images/: All generated scene images
- audio/: Voice narrations (if available)
- video/: Generated video (if available)

Generated on: ${new Date().toLocaleDateString()}
Total Story Entries: ${state.entries.length}
Credits Used: ${state.totalCreditsUsed}
`;
    zip.file('README.md', readme);
    
    try {
     
      const content = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kontext-story-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      
      const toast = document.createElement('div');
      toast.className = `fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300`;
      toast.textContent = 'Story exported successfully!';
      document.body.appendChild(toast);
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 3000);
      
    } catch (error) {
      console.error('Export failed:', error);
    
      const toast = document.createElement('div');
      toast.className = `fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300`;
      toast.textContent = 'Export failed. Please try again.';
      document.body.appendChild(toast);
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 3000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen relative overflow-hidden"
    >
      {/* Animated Background */}
      <motion.div 
        className={`absolute inset-0 ${
          darkMode 
            ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900'
            : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
        }`}
        animate={{
          background: darkMode ? [
            'linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #7c3aed 100%)',
            'linear-gradient(135deg, #1e293b 0%, #7c3aed 50%, #db2777 100%)',
            'linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #7c3aed 100%)'
          ] : [
            'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 50%, #fdf2f8 100%)',
            'linear-gradient(135deg, #dbeafe 0%, #fdf2f8 50%, #fce7f3 100%)',
            'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 50%, #fdf2f8 100%)'
          ]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Animated particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 rounded-full ${
            darkMode ? 'bg-white/10' : 'bg-purple-300/30'
          }`}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
            ],
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
            ],
          }}
          transition={{
            duration: 25 + Math.random() * 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 border-b border-white/10 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Kontext Storyworld
                  </h1>
                  <p className="text-white/70 text-sm">
                    Interactive AI Story Generator
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Credits Counter */}
              <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">
                <BarChart3 className="w-4 h-4 text-white/80" />
                <span className="text-white/80 text-sm font-medium">
                  {state.totalCreditsUsed} credits
                </span>
              </div>
              
              {/* API Config Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowApiConfig(true)}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <Settings className="w-4 h-4" />
              </Button>

              {/* Audio Toggle */}
              <div className="flex items-center gap-2">
                {state.audioEnabled ? 
                  <Volume2 className="w-4 h-4 text-white/80" /> : 
                  <VolumeX className="w-4 h-4 text-white/80" />
                }
                <Switch
                  checked={state.audioEnabled}
                  onCheckedChange={actions.toggleAudio}
                />
              </div>
              
              {/* Dark Mode Toggle */}
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-white/80" />
                <Switch
                  checked={darkMode}
                  onCheckedChange={onToggleDarkMode}
                />
                <Moon className="w-4 h-4 text-white/80" />
              </div>
              
              {/* Export Button */}
              {state.entries.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content - Split Layout */}
      <div className="relative z-10 flex h-[calc(100vh-140px)]">
        {/* Left Panel - Story Feed */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 border-r border-white/10"
        >
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white mb-2">
                Your Story
              </h2>
              <p className="text-white/70 text-sm">
                Watch your narrative unfold with each action
              </p>
            </div>
            
            <div 
              ref={storyFeedRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 pb-32"
            >
              <AnimatePresence>
                {state.entries.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0] 
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    >
                      <Sparkles className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Ready to Begin?
                    </h3>
                    <p className="text-white/70 max-w-md mx-auto">
                      Start your adventure by describing what you'd like to do. 
                      Our AI will craft an immersive story with visuals and narration.
                    </p>
                  </motion.div>
                ) : (
                  state.entries.map((entry) => (
                    <StoryBlock
                      key={entry.id}
                      entry={entry}
                      darkMode={darkMode}
                      autoPlay={state.audioEnabled}
                      onAudioPlay={() => setCurrentAudioId(entry.id)}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Right Panel - Image Gallery */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-80 bg-black/10 backdrop-blur-sm"
        >
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white mb-2">
                Scene Gallery
              </h2>
              <p className="text-white/70 text-sm">
                Visual moments from your story
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4">
              <ImageGallery 
                entries={state.entries} 
                darkMode={darkMode} 
                onGenerateVideo={actions.generateVideoForEntry}
                onEditImage={actions.editImageForEntry}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Input Bar */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="fixed bottom-0 left-0 right-0 z-20 p-6 bg-gradient-to-t from-black/60 via-black/30 to-transparent backdrop-blur-lg border-t border-white/10"
      >
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="flex gap-4 items-end">
              <div className="flex-1 relative">
                <motion.div
                  className="relative"
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="What happens next in the story?"
                    disabled={state.isGenerating}
                    className={`h-14 text-lg pr-4 ${
                      darkMode 
                        ? 'bg-white/10 border-white/20 text-white placeholder:text-white/60' 
                        : 'bg-white/90 border-white/40 text-gray-800'
                    } backdrop-blur-sm`}
                  />
                  
                  {state.isGenerating && (
                    <motion.div 
                      className="absolute inset-0 bg-white/5 rounded-lg flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Loader2 className="w-5 h-5 text-white/60" />
                        </motion.div>
                        <span className="text-white/60 text-sm">
                          Generating your story...
                        </span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="submit"
                  disabled={!inputValue.trim() || state.isGenerating}
                  size="lg"
                  className="px-8 h-14 bg-white/20 text-white border border-white/30 hover:bg-white/30 backdrop-blur-sm text-lg font-semibold disabled:opacity-50"
                >
                  {state.isGenerating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Generate'
                  )}
                </Button>
              </motion.div>
            </div>
          </form>
        </div>
      </motion.div>
      
      {/* API Configuration Modal */}
      <ApiConfigModal
        isOpen={showApiConfig}
        onClose={() => setShowApiConfig(false)}
        darkMode={darkMode}
      />
    </motion.div>
  );
}