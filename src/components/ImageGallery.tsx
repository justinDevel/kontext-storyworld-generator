import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { StoryEntry } from '../types/story';
import { Modal, ModalContent, ModalTrigger, ModalTitle } from './ui/Modal';
import { VideoGenerationModal } from './VideoGenerationModal';
import { ImageEditModal } from './ImageEditModal';
import ReactPlayer, { ReactPlayerProps } from "react-player";


import { Loader2, Image as ImageIcon, Expand, Video, Play, CreditCard as Edit, X } from 'lucide-react'
import { useState } from 'react';

interface ImageGalleryProps {
  entries: StoryEntry[];
  darkMode: boolean;
  onGenerateVideo?: (entryId: string, prompt: string, model: string) => void;
  onEditImage?: (entryId: string, prompt: string) => void;
}

export function ImageGallery({ entries, darkMode, onGenerateVideo, onEditImage }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [videoModalEntry, setVideoModalEntry] = useState<StoryEntry | null>(null);
  const [editModalEntry, setEditModalEntry] = useState<StoryEntry | null>(null);
  const imagesEntries = entries.filter(entry => entry.imageUrl || entry.isGenerating);
  const [isOpen, setIsOpen] = useState(false);

  return (

    <div className="space-y-4">
      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} px-4`}>
        Scene Gallery
      </h3>

      <div className="grid gap-4 px-4">
        <AnimatePresence>
          {imagesEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="group relative"
            >
              <Card className={`overflow-hidden ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                } shadow-lg hover:shadow-xl transition-all duration-300`}>
                <div className="aspect-[4/3] relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                  {entry.isGenerating ? (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="text-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Loader2 className="w-8 h-8 mx-auto mb-3 text-purple-400" />
                        </motion.div>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Generating scene...
                        </p>
                      </div>
                    </motion.div>
                  ) : entry.imageUrl ? (
                    <>
                      <motion.img
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        src={entry.imageUrl}
                        alt="Generated scene"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Hover overlay with video and expand buttons */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 transition-opacity duration-300"
                      >
                        {/* Edit Image Button */}
                        {onEditImage && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-orange-600 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-orange-700 transition-colors duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditModalEntry(entry);
                            }}
                          >
                            <Edit className="w-4 h-4 text-white" />
                          </motion.button>
                        )}

                        {/* Generate Video Button */}
                        {!entry.videoUrl && !entry.isGeneratingVideo && onGenerateVideo && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 backdrop-blur-sm rounded-full p-2 shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              setVideoModalEntry(entry);
                            }}
                          >
                            <Video className="w-4 h-4 text-white" />
                          </motion.button>
                        )}

                        {/* Play Video Button (if video exists) */}
                        {entry.videoUrl && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-green-600 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-green-700 transition-colors duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                            
                              setIsOpen(true);
                              // window.open(entry.videoUrl, '_blank');
                            }}
                          >
                            <Play className="w-4 h-4 text-white" />
                          </motion.button>
                        )}



                        {isOpen && (
                          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                            <div className="relative w-[90%] max-w-3xl aspect-video">

                              <button
                                onClick={() => setIsOpen(false)}
                                className="absolute -top-10 right-0 text-white hover:text-red-500 transition"
                              >
                                <X size={28} />
                              </button>

                              <ReactPlayer
                                src={entry.videoUrl}
                                playing={true}
                                controls={true}
                                width="100%"
                                height="100%"
                                className="rounded-xl overflow-hidden shadow-2xl"
                              />
                            </div>
                          </div>
                        )}

                        <Modal>
                          <ModalTrigger asChild>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors duration-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage(entry.imageUrl!);
                              }}
                            >
                              <Expand className="w-4 h-4 text-gray-800" />
                            </motion.button>
                          </ModalTrigger>
                          <ModalContent
                            className={`max-w-4xl max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white'
                              }`}
                          >
                            <ModalTitle className="sr-only">Scene Gallery</ModalTitle>

                            <div className="p-4 space-y-6">

                              <div>
                                <img
                                  src={entry.imageUrl}
                                  alt="Main expanded scene"
                                  className="w-full h-auto rounded-lg shadow-2xl"
                                />
                              </div>


                              {entry.videoUrl && (
                                <div>
                                  <h3
                                    className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'
                                      }`}
                                  >
                                    Generated Video
                                  </h3>
                                  <video
                                    controls
                                    className="w-full rounded-lg shadow-lg"
                                    poster={entry.imageUrl}
                                  >
                                    <source src={entry.videoUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                  </video>
                                </div>
                              )}


                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[...Array(6)].map((_, idx) => (
                                  <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="relative group cursor-pointer"
                                  >
                                    <img
                                      src={entry.imageUrl}
                                      alt={`Scene variation ${idx + 1}`}
                                      className="w-full h-24 object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div
                                      className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                                    />
                                  </motion.div>
                                ))}
                              </div>

                              {entry.userAction && (
                                <div
                                  className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'
                                    }`}
                                >
                                  <p
                                    className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'
                                      }`}
                                  >
                                    <strong>Scene Context:</strong> {entry.userAction}
                                  </p>
                                </div>
                              )}
                            </div>
                          </ModalContent>

                        </Modal>

                      </motion.div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Entry metadata */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`p-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  {entry.userAction && (
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                      <strong></strong> {entry.userAction}
                    </p>
                  )}

                  {/* Video generation status */}
                  {entry.isGeneratingVideo && (
                    <div className="flex items-center gap-2 mb-2 mt-2">
                      <Loader2 className="w-3 h-3 animate-spin text-purple-500" />
                      <span className={`text-xs ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                        Generating video...
                      </span>
                    </div>
                  )}

                  {entry.videoUrl && (
                    <div className="flex items-center gap-2">
                      <Video className="w-3 h-3 text-green-500" />
                      <span className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                        Video available
                      </span>
                    </div>
                  )}
                </motion.div>
              </Card>

            </motion.div>
          ))}

        </AnimatePresence>
      </div>

      {/* Video Generation Modal */}
      {videoModalEntry && (
        <VideoGenerationModal
          isOpen={true}
          onClose={() => setVideoModalEntry(null)}
          onGenerate={async (prompt, model) => {

            try {
              setVideoModalEntry(prev => prev ? { ...prev, isGenerating: true } : prev);
              if (onGenerateVideo) {
                await onGenerateVideo(videoModalEntry.id, prompt, model);
              }
            } catch (error) {
              console.error("Failed to generate the video:", error);
            } finally {
              setVideoModalEntry(prev => prev ? { ...prev, isGenerating: false } : prev);
              setVideoModalEntry(null)
            }
          }
          }
          imageUrl={videoModalEntry.imageUrl!}
          defaultPrompt={videoModalEntry.storyText}
          isGenerating={videoModalEntry.isGeneratingVideo || false}
          darkMode={darkMode}
        />
      )}

      {editModalEntry && (
        <ImageEditModal
          isOpen={true}
          onClose={() => setEditModalEntry(null)}
          onEdit={async (prompt) => {
            if (!editModalEntry) return;

            try {
            
              setEditModalEntry(prev => prev ? { ...prev, isEditing: true } : prev);

              try {
                if (onEditImage) {
                  await onEditImage(editModalEntry.id, prompt); 
                }
              } catch (error) {
                console.error("Failed to edit image:", error);
              } finally {
               
                setEditModalEntry(prev => prev ? { ...prev, isEditing: false } : prev);
                setEditModalEntry(null)
              }
            } catch (error) {
              console.error("Failed to edit image:", error);

             
              setEditModalEntry(prev => prev ? { ...prev, isEditing: false } : prev);
            }
          }}
          imageUrl={editModalEntry.imageUrl!}
          isEditing={editModalEntry.isEditing || false}
          darkMode={darkMode}
        />
      )}


      {imagesEntries.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4"
        >
          <Card className={`p-8 text-center ${darkMode ? 'bg-gray-800/30 border-gray-700' : 'bg-white/50 border-gray-200'
            }`}>
            <motion.div
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <ImageIcon className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'
                }`} />
            </motion.div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Scene images will appear here as your story unfolds
            </p>
          </Card>
        </motion.div>
      )}
    </div>


  );
}