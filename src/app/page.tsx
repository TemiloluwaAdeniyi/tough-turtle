"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isBlinking, setIsBlinking] = useState(false);
  const [mood, setMood] = useState('determined');

  useEffect(() => {
    // Random blinking animation
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 2000 + Math.random() * 3000);

    // Random mood changes
    const moodInterval = setInterval(() => {
      const moods = ['determined', 'focused', 'pumped', 'resilient', 'beast_mode'];
      setMood(moods[Math.floor(Math.random() * moods.length)]);
    }, 4000);

    return () => {
      clearInterval(blinkInterval);
      clearInterval(moodInterval);
    };
  }, []);

  const handleLogin = () => {
    // Using React state instead of localStorage for artifact compatibility
    window.location.href = '/dashboard';
  };

  const getEyeExpression = () => {
    if (isBlinking) return 'M';
    switch (mood) {
      case 'determined': return '●';
      case 'focused': return '◆';
      case 'pumped': return '★';
      case 'resilient': return '▲';
      case 'beast_mode': return '◉';
      default: return '●';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-emerald-900 p-4 text-center flex flex-col items-center justify-center">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-8"
      >
        <h1 className="text-6xl font-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent mb-2 tracking-tight">
          TOUGH TURTLE
        </h1>
        <p className="text-xl text-gray-300 font-semibold tracking-wide">FORGE YOUR RESILIENCE</p>
      </motion.div>

      <motion.div
        className="relative mb-8"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        {/* Floating elements */}
        <motion.div
          className="absolute -top-6 -left-6 text-orange-400 text-3xl"
          animate={{ 
            rotate: [0, 360], 
            scale: [1, 1.3, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          💪
        </motion.div>
        <motion.div
          className="absolute -top-4 -right-8 text-red-400 text-2xl"
          animate={{ 
            rotate: [360, 0], 
            scale: [1, 1.4, 1],
            opacity: [0.5, 0.9, 0.5]
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        >
          🔥
        </motion.div>
        <motion.div
          className="absolute -bottom-6 -right-4 text-yellow-400 text-2xl"
          animate={{ 
            y: [0, -10, 0],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{ duration: 1.8, repeat: Infinity, delay: 0.5 }}
        >
          ⚡
        </motion.div>

        <motion.svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          className="mx-auto filter drop-shadow-lg"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          {/* Shadow */}
          <ellipse cx="100" cy="185" rx="45" ry="12" fill="rgba(0,0,0,0.3)" />
          
          {/* Shell - more angular and robust */}
          <motion.path
            d="M100 70 L140 95 L135 140 L100 155 L65 140 L60 95 Z"
            fill="url(#toughShellGradient)"
            stroke="rgba(0,0,0,0.2)"
            strokeWidth="2"
            animate={{ 
              scale: mood === 'beast_mode' ? [1, 1.05, 1] : 1
            }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
          
          {/* Shell armor plates */}
          <path d="M85 85 L100 75 L115 85 L100 100 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
          <path d="M75 110 L100 100 L125 110 L100 125 Z" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
          <path d="M80 135 L100 125 L120 135 L100 145 Z" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
          
          {/* Battle scars */}
          <path d="M70 100 L75 105" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5"/>
          <path d="M130 115 L125 120" stroke="rgba(0,0,0,0.3)" strokeWidth="1"/>
          
          {/* Head - more determined expression */}
          <motion.ellipse 
            cx="100" 
            cy="60" 
            rx="28" 
            ry="22" 
            fill="url(#toughHeadGradient)"
            animate={{ 
              scaleX: mood === 'focused' ? [1, 1.1, 1] : 1,
              scaleY: mood === 'determined' ? [1, 0.95, 1] : 1
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          
          {/* Tough brow ridge */}
          <path d="M85 50 Q100 45 115 50" stroke="rgba(0,0,0,0.4)" strokeWidth="2" fill="none"/>
          
          {/* Eyes - more intense */}
          <motion.ellipse 
            cx="90" 
            cy="58" 
            rx="5" 
            ry="4" 
            fill="white"
            animate={{ 
              scaleY: isBlinking ? 0.1 : 1
            }}
            transition={{ duration: 0.1 }}
          />
          <motion.ellipse 
            cx="110" 
            cy="58" 
            rx="5" 
            ry="4" 
            fill="white"
            animate={{ 
              scaleY: isBlinking ? 0.1 : 1
            }}
            transition={{ duration: 0.1 }}
          />
          
          {/* Eye pupils - more focused */}
          <text x="90" y="61" textAnchor="middle" fontSize="7" fill="black" fontWeight="bold">{getEyeExpression()}</text>
          <text x="110" y="61" textAnchor="middle" fontSize="7" fill="black" fontWeight="bold">{getEyeExpression()}</text>
          
          {/* Determined nostril flare */}
          <ellipse cx="97" cy="65" rx="1.5" ry="2" fill="rgba(0,0,0,0.6)" />
          <ellipse cx="103" cy="65" rx="1.5" ry="2" fill="rgba(0,0,0,0.6)" />
          
          {/* Mouth - gritty expressions */}
          <motion.path 
            d={mood === 'determined' ? "M92 72 L108 72" : 
                mood === 'focused' ? "M94 72 Q100 70 106 72" :
                mood === 'pumped' ? "M92 70 Q100 76 108 70" :
                mood === 'beast_mode' ? "M90 71 Q100 78 110 71" : 
                "M94 73 Q100 71 106 73"}
            stroke="rgba(0,0,0,0.8)" 
            strokeWidth="2" 
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Muscular legs */}
          <ellipse cx="65" cy="130" rx="18" ry="12" fill="url(#muscleGradient)" />
          <ellipse cx="135" cy="130" rx="18" ry="12" fill="url(#muscleGradient)" />
          <ellipse cx="75" cy="155" rx="15" ry="10" fill="url(#muscleGradient)" />
          <ellipse cx="125" cy="155" rx="15" ry="10" fill="url(#muscleGradient)" />
          
          {/* Muscle definition lines */}
          <path d="M60 125 Q65 130 70 125" stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
          <path d="M130 125 Q135 130 140 125" stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
          
          {/* Powerful tail */}
          <motion.ellipse 
            cx="100" 
            cy="170" 
            rx="8" 
            ry="15" 
            fill="url(#muscleGradient)"
            animate={{ 
              rotate: mood === 'pumped' ? [0, 15, -15, 0] : [0, 5, -5, 0],
              scaleX: mood === 'beast_mode' ? [1, 1.3, 1] : 1
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          {/* Gradients */}
          <defs>
            <radialGradient id="toughShellGradient" cx="0.3" cy="0.2">
              <stop offset="0%" stopColor="#1f2937" />
              <stop offset="30%" stopColor="#374151" />
              <stop offset="60%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </radialGradient>
            <radialGradient id="toughHeadGradient" cx="0.3" cy="0.3">
              <stop offset="0%" stopColor="#6b7280" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#065f46" />
            </radialGradient>
            <radialGradient id="muscleGradient" cx="0.3" cy="0.3">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="70%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </radialGradient>
          </defs>
        </motion.svg>

        {/* Mood indicator */}
        <motion.div
          className="mt-6 text-lg font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span className="bg-black/40 backdrop-blur-sm px-5 py-2 rounded-full shadow-lg text-white border border-gray-600">
            {mood === 'determined' && '💪 DETERMINED'}
            {mood === 'focused' && '🎯 FOCUSED'}
            {mood === 'pumped' && '🔥 PUMPED'}
            {mood === 'resilient' && '⚡ RESILIENT'}
            {mood === 'beast_mode' && '🦾 BEAST MODE'}
          </span>
        </motion.div>
      </motion.div>

      <motion.button 
        onClick={handleLogin} 
        className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-black py-5 px-10 rounded-full text-xl shadow-2xl transform transition-all duration-200 hover:scale-105 hover:shadow-orange-500/25 border-2 border-orange-400/50"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        💥 UNLEASH YOUR POTENTIAL
      </motion.button>

      <motion.p
        className="mt-8 text-gray-300 max-w-lg mx-auto text-lg leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        Train your digital warrior companion while building real-world resilience. 
        <span className="text-emerald-400 font-semibold"> Challenge yourself. Track progress. Stay unstoppable.</span>
      </motion.p>
    </div>
  );
}