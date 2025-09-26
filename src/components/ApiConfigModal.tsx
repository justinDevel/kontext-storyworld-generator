import { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Settings, Key, Eye, EyeOff, Save, X } from 'lucide-react';

interface ApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

interface ApiConfig {
  falApiKey: string;
  elevenLabsApiKey: string;
  elevenLabsVoiceId: string;
}

export function ApiConfigModal({ isOpen, onClose, darkMode }: ApiConfigModalProps) {
  const [config, setConfig] = useState<ApiConfig>({
    falApiKey: localStorage.getItem('fal_api_key') || '',
    elevenLabsApiKey: localStorage.getItem('elevenlabs_api_key') || '',
    elevenLabsVoiceId: localStorage.getItem('elevenlabs_voice_id') || 'EXAVITQu4vr4xnSDxMaL'
  });

  const [showKeys, setShowKeys] = useState({
    fal: false,
    elevenlabs: false
  });

  const handleSave = () => {
    localStorage.setItem('fal_api_key', config.falApiKey);
    localStorage.setItem('elevenlabs_api_key', config.elevenLabsApiKey);
    localStorage.setItem('elevenlabs_voice_id', config.elevenLabsVoiceId);
    
   
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300`;
    toast.textContent = 'API configuration saved successfully!';
    document.body.appendChild(toast);
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 3000);
    
    onClose();
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className={`max-w-2xl ${
        darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200'
      }`}>
        <ModalHeader>
          <ModalTitle className={`text-2xl font-bold flex items-center gap-3 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <Settings className="w-6 h-6 text-blue-500" />
            API Configuration
          </ModalTitle>
          <ModalDescription className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Configure your API keys for FAL.ai and ElevenLabs to enable all features
          </ModalDescription>
        </ModalHeader>
        
        <div className="p-6 space-y-6">
         
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <label className={`text-sm font-semibold flex items-center gap-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <Key className="w-4 h-4 text-purple-500" />
              FAL.ai API Key
            </label>
            <div className="relative">
              <Input
                type={showKeys.fal ? 'text' : 'password'}
                value={config.falApiKey}
                onChange={(e) => setConfig(prev => ({ ...prev, falApiKey: e.target.value }))}
                placeholder="fal_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className={`pr-10 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-600 text-white placeholder:text-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setShowKeys(prev => ({ ...prev, fal: !prev.fal }))}
              >
                {showKeys.fal ? 
                  <EyeOff className="w-4 h-4" /> : 
                  <Eye className="w-4 h-4" />
                }
              </Button>
            </div>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Get your API key from <a href="https://fal.ai" target="_blank" className="text-purple-500 hover:underline">fal.ai</a>
            </p>
          </motion.div>

         
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <label className={`text-sm font-semibold flex items-center gap-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <Key className="w-4 h-4 text-green-500" />
              ElevenLabs API Key
            </label>
            <div className="relative">
              <Input
                type={showKeys.elevenlabs ? 'text' : 'password'}
                value={config.elevenLabsApiKey}
                onChange={(e) => setConfig(prev => ({ ...prev, elevenLabsApiKey: e.target.value }))}
                placeholder="sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className={`pr-10 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-600 text-white placeholder:text-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setShowKeys(prev => ({ ...prev, elevenlabs: !prev.elevenlabs }))}
              >
                {showKeys.elevenlabs ? 
                  <EyeOff className="w-4 h-4" /> : 
                  <Eye className="w-4 h-4" />
                }
              </Button>
            </div>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Get your API key from <a href="https://elevenlabs.io" target="_blank" className="text-green-500 hover:underline">elevenlabs.io</a>
            </p>
          </motion.div>

         
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <label className={`text-sm font-semibold flex items-center gap-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <Key className="w-4 h-4 text-orange-500" />
              ElevenLabs Voice ID
            </label>
            <Input
              type="text"
              value={config.elevenLabsVoiceId}
              onChange={(e) => setConfig(prev => ({ ...prev, elevenLabsVoiceId: e.target.value }))}
              placeholder="EXAVITQu4vr4xnSDxMaL"
              className={darkMode 
                ? 'bg-gray-800 border-gray-600 text-white placeholder:text-gray-400' 
                : 'bg-white border-gray-300 text-gray-900'
              }
            />
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Choose from your available voices in ElevenLabs (default: Sarah)
            </p>
          </motion.div>

         
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={onClose}
              className={darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : ''}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Configuration
              </Button>
            </motion.div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}