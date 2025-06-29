"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [isBlinking, setIsBlinking] = useState(false);
  const [mood, setMood] = useState('determined');

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 2000 + Math.random() * 3000);

    const moodInterval = setInterval(() => {
      const moods = ['determined', 'focused', 'pumped', 'resilient', 'beast_mode'];
      setMood(moods[Math.floor(Math.random() * moods.length)]);
    }, 4000);

    return () => {
      clearInterval(blinkInterval);
      clearInterval(moodInterval);
    };
  }, []);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) {
      console.error('Login error:', error);
      alert('Login failed. Try again.');
      return;
    }
    // On successful login, Supabase redirects to /dashboard
  };

  useEffect(() => {
    // Initialize user in database on first login
    const initUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .single();
        if (!data) {
          await supabase
            .from('users')
            .insert({ id: user.id, username: user.email || 'User' });
        }
      }
    };
    initUser();
  }, []);

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
          width="220"
          height="220"
          viewBox="0 0 220 220"
          className="mx-auto filter drop-shadow-2xl"
          animate={{
            y: [0, -8, 0],
            rotate: [0, 1, -1, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <ellipse cx="110" cy="200" rx="45" ry="12" fill="rgba(0,0,0,0.3)" />

          {/* Squirtle Shell - more rounded and Squirtle-like */}
          <motion.circle
            cx="110"
            cy="110"
            r="42"
            fill="url(#squirtleShellGradient)"
            stroke="rgba(59, 130, 246, 0.8)"
            strokeWidth="2"
            animate={{
              scale: mood === 'beast_mode' ? [1, 1.05, 1] : 1
            }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />

          {/* Shell Pattern - Squirtle's hexagonal segments */}
          <circle cx="110" cy="90" r="12" fill="rgba(255,255,255,0.4)" stroke="#3b82f6" strokeWidth="2" />
          <circle cx="95" cy="110" r="10" fill="rgba(255,255,255,0.3)" stroke="#3b82f6" strokeWidth="1.5" />
          <circle cx="125" cy="110" r="10" fill="rgba(255,255,255,0.3)" stroke="#3b82f6" strokeWidth="1.5" />
          <circle cx="95" cy="130" r="8" fill="rgba(255,255,255,0.25)" stroke="#3b82f6" strokeWidth="1" />
          <circle cx="125" cy="130" r="8" fill="rgba(255,255,255,0.25)" stroke="#3b82f6" strokeWidth="1" />
          <circle cx="110" cy="135" r="6" fill="rgba(255,255,255,0.2)" stroke="#3b82f6" strokeWidth="1" />

          {/* Pixar-style Head - bigger and more endearing */}
          <motion.ellipse
            cx="110"
            cy="60"
            rx="38"
            ry="35"
            fill="url(#squirtleHeadGradient)"
            animate={{
              scaleX: mood === 'focused' ? [1, 1.03, 1] : 1,
              scaleY: mood === 'determined' ? [1, 0.98, 1] : 1
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          {/* Squirtle's characteristic head curves */}
          <path d="M85 42 Q95 38 105 42" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="2" fill="none" />
          <path d="M115 42 Q125 38 135 42" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="2" fill="none" />

          {/* HUGE Adorable Eyes - much bigger like the turtle image */}
          <motion.ellipse
            cx="95"
            cy="55"
            rx="18"
            ry="16"
            fill="white"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="1.5"
            animate={{
              scaleY: isBlinking ? 0.1 : 1
            }}
            transition={{ duration: 0.1 }}
          />
          <motion.ellipse
            cx="125"
            cy="55"
            rx="18"
            ry="16"
            fill="white"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="1.5"
            animate={{
              scaleY: isBlinking ? 0.1 : 1
            }}
            transition={{ duration: 0.1 }}
          />

          {/* Large Pupils for maximum cuteness */}
          <circle cx="95" cy="55" r="8" fill="#1e40af" />
          <circle cx="125" cy="55" r="8" fill="#1e40af" />

          {/* Smaller inner pupils */}
          <circle cx="95" cy="55" r="5" fill="black" />
          <circle cx="125" cy="55" r="5" fill="black" />

          {/* Big eye shine/reflection for that adorable look */}
          <ellipse cx="97" cy="51" rx="4" ry="3" fill="rgba(255,255,255,0.9)" />
          <ellipse cx="127" cy="51" rx="4" ry="3" fill="rgba(255,255,255,0.9)" />
          <ellipse cx="99" cy="53" rx="2" ry="1.5" fill="rgba(255,255,255,0.7)" />
          <ellipse cx="129" cy="53" rx="2" ry="1.5" fill="rgba(255,255,255,0.7)" />

          {/* Cute little nostrils - moved down slightly */}
          <ellipse cx="106" cy="73" rx="1.5" ry="2" fill="rgba(0,0,0,0.6)" />
          <ellipse cx="114" cy="73" rx="1.5" ry="2" fill="rgba(0,0,0,0.6)" />

          {/* More expressive mouth - moved down to accommodate bigger eyes */}
          <motion.path
            d={mood === 'determined' ? "M100 82 L120 82" :
              mood === 'focused' ? "M102 82 Q110 80 118 82" :
                mood === 'pumped' ? "M100 80 Q110 86 120 80" :
                  mood === 'beast_mode' ? "M98 81 Q110 89 122 81" :
                    "M102 83 Q110 81 118 83"}
            stroke="rgba(0,0,0,0.8)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* MASSIVE ARMS - positioned better */}
          <motion.ellipse
            cx="70"
            cy="95"
            rx="22"
            ry="16"
            fill="url(#squirtleMuscleGradient)"
            animate={{
              scaleX: mood === 'beast_mode' ? [1, 1.25, 1] : [1, 1.08, 1],
              scaleY: mood === 'pumped' ? [1, 1.15, 1] : 1
            }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <motion.ellipse
            cx="150"
            cy="95"
            rx="22"
            ry="16"
            fill="url(#squirtleMuscleGradient)"
            animate={{
              scaleX: mood === 'beast_mode' ? [1, 1.25, 1] : [1, 1.08, 1],
              scaleY: mood === 'pumped' ? [1, 1.15, 1] : 1
            }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />

          {/* Forearms */}
          <motion.ellipse
            cx="68"
            cy="118"
            rx="18"
            ry="13"
            fill="url(#squirtleMuscleGradient)"
            animate={{
              rotate: mood === 'pumped' ? [0, 8, -8, 0] : [0, 2, -2, 0]
            }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          <motion.ellipse
            cx="152"
            cy="118"
            rx="18"
            ry="13"
            fill="url(#squirtleMuscleGradient)"
            animate={{
              rotate: mood === 'pumped' ? [0, -8, 8, 0] : [0, -2, 2, 0]
            }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />

          {/* MASSIVE LEGS */}
          <motion.ellipse
            cx="88"
            cy="155"
            rx="20"
            ry="22"
            fill="url(#squirtleMuscleGradient)"
            animate={{
              scaleX: mood === 'beast_mode' ? [1, 1.2, 1] : 1
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.ellipse
            cx="132"
            cy="155"
            rx="20"
            ry="22"
            fill="url(#squirtleMuscleGradient)"
            animate={{
              scaleX: mood === 'beast_mode' ? [1, 1.2, 1] : 1
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          {/* Feet */}
          <ellipse cx="82" cy="180" rx="16" ry="10" fill="url(#squirtleMuscleGradient)" />
          <ellipse cx="138" cy="180" rx="16" ry="10" fill="url(#squirtleMuscleGradient)" />

          {/* Muscle definition lines */}
          <path d="M65 90 Q70 95 75 90" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1.5" />
          <path d="M145 90 Q150 95 155 90" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1.5" />
          <path d="M83 150 Q88 155 93 150" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1.5" />
          <path d="M127 150 Q132 155 137 150" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1.5" />

          <defs>
            <radialGradient id="squirtleShellGradient" cx="0.3" cy="0.2">
              <stop offset="0%" stopColor="#a7f3d0" />
              <stop offset="30%" stopColor="#6ee7b7" />
              <stop offset="60%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </radialGradient>
            <radialGradient id="squirtleHeadGradient" cx="0.3" cy="0.3">
              <stop offset="0%" stopColor="#dbeafe" />
              <stop offset="40%" stopColor="#93c5fd" />
              <stop offset="70%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </radialGradient>
            <radialGradient id="squirtleMuscleGradient" cx="0.3" cy="0.3">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="80%" stopColor="#1e40af" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </radialGradient>
          </defs>
        </motion.svg>

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