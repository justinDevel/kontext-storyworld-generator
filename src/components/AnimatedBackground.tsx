import { motion } from 'framer-motion';

export function AnimatedBackground({ darkMode }: { darkMode: boolean }) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
     
      <div className={`absolute inset-0 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900'
          : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
      }`} />
      
     
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 rounded-full ${
            darkMode ? 'bg-white/10' : 'bg-purple-300/20'
          }`}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: 20 + Math.random() * 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
      
   
      <motion.div
        className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full ${
          darkMode 
            ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10' 
            : 'bg-gradient-to-r from-blue-200/30 to-purple-200/30'
        } blur-3xl`}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className={`absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full ${
          darkMode 
            ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10' 
            : 'bg-gradient-to-r from-purple-200/30 to-pink-200/30'
        } blur-3xl`}
        animate={{
          scale: [1, 1.1, 1],
          x: [0, -40, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}