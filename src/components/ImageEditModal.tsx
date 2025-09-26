import { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Wand2, Loader2, X, CreditCard as Edit3, Sparkles } from 'lucide-react';

interface ImageEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (prompt: string) => void;
  imageUrl: string;
  isEditing: boolean;
  darkMode: boolean;
}

export function ImageEditModal({
  isOpen,
  onClose,
  onEdit,
  imageUrl,
  isEditing,
  darkMode
}: ImageEditModalProps) {
  const [prompt, setPrompt] = useState('');
  const [tokenCount, setTokenCount] = useState(0);

  const handlePromptChange = (value: string) => {
    setPrompt(value);
    
    setTokenCount(Math.ceil(value.length / 4));
  };

  const handleEdit = () => {
    if (prompt.trim() && tokenCount <= 512) {
      onEdit(prompt.trim());
    }
  };

  const examplePrompts = [
    "Change the setting to daytime with bright sunlight",
    "Add more people walking on the sidewalk",
    "Transform this into a winter scene with snow",
    "Make it look like a vintage 1980s photograph",
    "Add rain and reflections on the street"
  ];

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className={`max-w-4xl ${
        darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200'
      }`}>
        <ModalHeader>
          <ModalTitle className={`text-2xl font-bold flex items-center gap-3 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <Edit3 className="w-6 h-6 text-purple-500" />
            Edit Scene with FLUX.1 Kontext
          </ModalTitle>
          <ModalDescription className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Transform your scene with AI-powered image editing. Maximum 512 tokens.
          </ModalDescription>
        </ModalHeader>
        
        <div className="p-6 space-y-6">
        
          <div className="flex gap-6">
            <div className="flex-1">
              <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Original Scene
              </h3>
              <motion.div
                className="relative rounded-xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={imageUrl}
                  alt="Original scene"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </motion.div>
            </div>
            
            <div className="flex-1">
              <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Edited Preview
              </h3>
              <div className={`h-64 rounded-xl border-2 border-dashed ${
                darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'
              } flex items-center justify-center`}>
                {isEditing ? (
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="w-12 h-12 mx-auto mb-3 text-purple-500" />
                    </motion.div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Editing scene...
                    </p>
                  </motion.div>
                ) : (
                  <div className="text-center">
                    <Sparkles className={`w-12 h-12 mx-auto mb-3 ${
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Edited scene will appear here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Editing Instructions
              </h3>
              <div className={`text-sm px-3 py-1 rounded-full ${
                tokenCount > 512 
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                  : tokenCount > 400
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                    : 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              }`}>
                {tokenCount}/512 tokens
              </div>
            </div>
            
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => handlePromptChange(e.target.value)}
                placeholder="Describe how you want to transform this scene..."
                className={`w-full min-h-[120px] p-4 rounded-lg border resize-none ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-600 text-white placeholder:text-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                disabled={isEditing}
              />
            </div>
            
            <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Be specific about changes you want while maintaining the scene's style and composition.
            </p>
          </div>
          
        
          <div>
            <h4 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Example Transformations:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {examplePrompts.map((example, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`text-left p-3 rounded-lg border text-sm transition-colors ${
                    darkMode
                      ? 'border-gray-700 hover:border-purple-500 hover:bg-gray-800/50 text-gray-300'
                      : 'border-gray-200 hover:border-purple-500 hover:bg-purple-50 text-gray-600'
                  }`}
                  onClick={() => handlePromptChange(example)}
                  disabled={isEditing}
                >
                  {example}
                </motion.button>
              ))}
            </div>
          </div>
          
        
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isEditing}
              className={darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : ''}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleEdit}
                disabled={!prompt.trim() || tokenCount > 512 || isEditing}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 min-w-[140px]"
              >
                {isEditing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Editing...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Edit Scene
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}