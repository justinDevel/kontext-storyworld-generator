import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroSection } from './components/HeroSection';
import { StoryInterface } from './components/StoryInterface';

function App() {
  const [currentView, setCurrentView] = useState<'hero' | 'story'>('hero');
  const [darkMode, setDarkMode] = useState(false);


  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setDarkMode(e.matches);
    mediaQuery.addListener(handler);
    
    return () => mediaQuery.removeListener(handler);
  }, []);

  const startStory = () => {
    setCurrentView('story');
  };

  const goBackToHero = () => {
    setCurrentView('hero');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`relative ${darkMode ? 'dark' : ''}`}>
      <AnimatePresence mode="wait">
        {currentView === 'hero' ? (
          <motion.div
            key="hero"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <HeroSection 
              onStartStory={startStory} 
              darkMode={darkMode}
              onToggleDarkMode={toggleDarkMode}
            />
          </motion.div>
        ) : (
          <motion.div
            key="story"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <StoryInterface 
              onBack={goBackToHero}
              darkMode={darkMode}
              onToggleDarkMode={toggleDarkMode}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;