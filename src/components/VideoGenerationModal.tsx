import { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { VIDEO_MODELS } from '../types/story';
import { Play, Wand2, Loader2, X } from 'lucide-react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

interface VideoGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (prompt: string, model: string) => void;
  imageUrl: string;
  defaultPrompt: string;
  isGenerating: boolean;
  darkMode: boolean;
}

export function VideoGenerationModal({
  isOpen,
  onClose,
  onGenerate,
  imageUrl,
  defaultPrompt,
  isGenerating,
  darkMode
}: VideoGenerationModalProps) {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [selectedModel, setSelectedModel] = useState(VIDEO_MODELS[0].id);

  const handleGenerate = () => {
    if (prompt.trim()) {
      onGenerate(prompt.trim(), selectedModel);
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className={`max-w-4xl ${darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200'
        }`}>
        <ModalHeader>
          <ModalTitle className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Generate Scene Video
          </ModalTitle>
          <ModalDescription className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Transform your scene image into a cinematic video using AI
          </ModalDescription>
        </ModalHeader>
        <div className="max-h-[80vh] overflow-y-auto px-4 py-2 space-y-6">
          <PerfectScrollbar
            style={{ maxHeight: '90vh', padding: '1rem' }}
            options={{ suppressScrollX: true }}
          >
            <div className="p-6 space-y-6">
              {/* Image Preview */}
              <div className="flex gap-6">
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Source Scene
                  </h3>
                  <motion.div
                    className="relative rounded-xl overflow-hidden shadow-2xl"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={imageUrl}
                      alt="Source scene"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </motion.div>
                </div>

                <div className="flex-1">
                  <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Generated Video Preview
                  </h3>
                  <div className={`h-48 rounded-xl border-2 border-dashed ${darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'
                    } flex items-center justify-center`}>
                    {isGenerating ? (
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
                          Generating video...
                        </p>
                      </motion.div>
                    ) : (
                      <div className="text-center">
                        <Play className={`w-12 h-12 mx-auto mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'
                          }`} />
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Video will appear here
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Model Selection */}
              <div>
                <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Select AI Model
                </h3>
                <div className="grid gap-3">
                  {VIDEO_MODELS.map((model) => (
                    <motion.label
                      key={model.id}
                      className={`relative flex items-center p-4 rounded-lg border cursor-pointer transition-all ${selectedModel === model.id
                          ? darkMode
                            ? 'border-purple-500 bg-purple-900/20'
                            : 'border-purple-500 bg-purple-50'
                          : darkMode
                            ? 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                            : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                        }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <input
                        type="radio"
                        name="model"
                        value={model.id}
                        checked={selectedModel === model.id}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-semibold ${selectedModel === model.id
                              ? 'text-purple-600'
                              : darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                            {model.name}
                          </h4>
                          {selectedModel === model.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center"
                            >
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </motion.div>
                          )}
                        </div>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                          {model.description}
                        </p>
                      </div>
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Prompt Input */}
              <div>
                <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Video Generation Prompt
                </h3>
                <div className="relative">
                  <Input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the motion and cinematography you want to see..."
                    className={`min-h-[120px] resize-none ${darkMode
                        ? 'bg-gray-800 border-gray-600 text-white placeholder:text-gray-400'
                        : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    style={{ paddingTop: '16px', paddingBottom: '16px', lineHeight: '1.5' }}
                  />
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPrompt(defaultPrompt)}
                      className="text-purple-500 hover:text-purple-600"
                    >
                      <Wand2 className="w-4 h-4 mr-1" />
                      Use Story
                    </Button>
                  </div>
                </div>
                <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Be specific about camera movements, lighting, and atmospheric effects for best results.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isGenerating}
                  className={darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : ''}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 min-w-[140px]"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Generate Video
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>
          </PerfectScrollbar>
        </div>
      </ModalContent>
    </Modal>
  );
}
