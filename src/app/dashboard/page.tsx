"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  xp: number;
  stage: string;
  skin: string;
  username: string;
  skin_expiry: string | null;
}

interface Challenge {
  id: string;
  type: 'cardio' | 'sleep' | 'strength' | 'hydration' | 'meditation';
  title: string;
  target: number;
  current: number;
  unit: string;
  completed: boolean;
  streak: number;
  icon: string;
}

interface LeaderboardEntry {
  username: string;
  xp: number;
  streak: number;
}

interface BiometricData {
  heartRate: number;
  sleepScore: number;
  recoveryScore: number;
  stepsToday: number;
  caloriesBurned: number;
}

export default function Dashboard() {
  const [user, setUser] = useState<User>({
    id: 'biohacker-1',
    xp: 0,
    stage: 'Baseline Human',
    skin: 'cybernetic',
    username: 'Josh42',
    skin_expiry: null,
  });

  const [challenges, setChallenges] = useState<Challenge[]>([
    { id: '1', type: 'sleep', title: 'Deep Sleep Protocol', target: 8, current: 7.2, unit: 'hrs', completed: false, streak: 3, icon: '🧠' },
    { id: '2', type: 'strength', title: 'Power Lifting Circuit', target: 5, current: 3, unit: 'sets', completed: false, streak: 1, icon: '💪' },
    { id: '3', type: 'cardio', title: 'Zone 2 Endurance', target: 45, current: 32, unit: 'min', completed: false, streak: 5, icon: '🏃' },
    { id: '4', type: 'hydration', title: 'Optimal H2O Protocol', target: 3.5, current: 2.8, unit: 'L', completed: false, streak: 2, icon: '💧' },
    { id: '5', type: 'meditation', title: 'Mindfulness Flow', target: 20, current: 15, unit: 'min', completed: false, streak: 7, icon: '🧘' },
  ]);

  const [biometrics] = useState<BiometricData>({
    heartRate: 62,
    sleepScore: 87,
    recoveryScore: 94,
    stepsToday: 8420,
    caloriesBurned: 2840,
  });

  const [leaderboard] = useState<LeaderboardEntry[]>([
    { username: 'CyberAthlete', xp: 450, streak: 12 },
    { username: 'BiohackMaster', xp: 285, streak: 8 },
    { username: 'QuantifiedSelf', xp: 220, streak: 6 },
    { username: 'OptimalHuman', xp: 180, streak: 4 },
    { username: 'FlowStateWarrior', xp: 95, streak: 2 },
  ]);

  const [activeTab, setActiveTab] = useState<'overview' | 'challenges' | 'battles' | 'biometrics'>('overview');
  const [challengeInput, setChallengeInput] = useState<{ [key: string]: string }>({});
  const [isBlinking, setIsBlinking] = useState(false);
  const [mood, setMood] = useState<'determined' | 'focused' | 'pumped' | 'resilient' | 'beast_mode'>('determined');
  const [isHatching, setIsHatching] = useState(false);
  const [crackLevel, setCrackLevel] = useState(0);
  const [lightIntensity, setLightIntensity] = useState(1);

  useEffect(() => {
    const newStage = getTurtleStage(user.xp);
    if (newStage !== user.stage) {
      setUser(prev => ({ ...prev, stage: newStage }));
    }

    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 2000 + Math.random() * 3000);

    const moodInterval = setInterval(() => {
      const moods: ('determined' | 'focused' | 'pumped' | 'resilient' | 'beast_mode')[] = ['determined', 'focused', 'pumped', 'resilient', 'beast_mode'];
      setMood(moods[Math.floor(Math.random() * moods.length)]);
    }, 4000);

    const xpInterval = setInterval(() => {
      setUser(prev => ({ ...prev, xp: Math.min(prev.xp + 2, 600) }));
      setLightIntensity(0.8 + Math.sin(Date.now() * 0.003) * 0.2);
    }, 100);

    return () => {
      clearInterval(blinkInterval);
      clearInterval(moodInterval);
      clearInterval(xpInterval);
    };
  }, [user.xp, user.stage]);

  useEffect(() => {
    if (user.xp >= 150 && user.xp < 300) {
      setIsHatching(true);
      setCrackLevel(Math.floor((user.xp - 150) / 30));
    } else if (user.xp >= 300) {
      setIsHatching(false);
      setCrackLevel(5);
    }
  }, [user.xp]);

  const updateChallenge = (challengeId: string, value: number) => {
    setChallenges(prev => prev.map(challenge => {
      if (challenge.id === challengeId) {
        const newCurrent = Math.min(value, challenge.target);
        const completed = newCurrent >= challenge.target;
        const xpGain = completed && !challenge.completed ? 25 : 0;
        
        if (xpGain > 0) {
          setUser(u => ({ ...u, xp: u.xp + xpGain }));
        }
        
        return {
          ...challenge,
          current: newCurrent,
          completed,
          streak: completed ? challenge.streak + 1 : challenge.streak
        };
      }
      return challenge;
    }));
    setChallengeInput(prev => ({ ...prev, [challengeId]: '' }));
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getTurtleStage = (xp: number) => {
    if (xp >= 500) return 'Tough Turtle Titan';
    if (xp >= 300) return 'Shadow Shell';
    if (xp >= 150) return 'Shelless Seeker';
    if (xp >= 50) return 'Spry Snapper';
    return 'Batchling Hatchling';
  };

  const renderBiometricCard = (title: string, value: number | string, unit: string, icon: string, color: string) => (
    <motion.div
      className={`bg-gradient-to-br ${color} backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl`}
      whileHover={{ scale: 1.02, rotateX: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-300 text-sm font-medium">{title}</p>
          <p className="text-white text-2xl font-bold mt-1">{value}<span className="text-lg text-gray-300 ml-1">{unit}</span></p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </motion.div>
  );

  const renderChallengeCard = (challenge: Challenge) => {
    const progress = getProgressPercentage(challenge.current, challenge.target);
    const isCompleted = challenge.completed;
    
    return (
      <motion.div
        key={challenge.id}
        className={`relative bg-gradient-to-br ${isCompleted ? 'from-emerald-900/50 to-teal-900/50' : 'from-gray-900/50 to-slate-900/50'} 
          backdrop-blur-xl border ${isCompleted ? 'border-emerald-400/30' : 'border-white/10'} rounded-2xl p-6 shadow-2xl overflow-hidden`}
        whileHover={{ scale: 1.02, rotateY: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{challenge.icon}</div>
            <div>
              <h3 className="text-white font-bold text-lg">{challenge.title}</h3>
              <p className="text-gray-400 text-sm">🔥 {challenge.streak} day streak</p>
            </div>
          </div>
          {isCompleted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-emerald-500 rounded-full p-2"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </motion.div>
          )}
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-300">{challenge.current} / {challenge.target} {challenge.unit}</span>
            <span className="text-white font-semibold">{progress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
            <motion.div
              className={`h-full ${isCompleted ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : 'bg-gradient-to-r from-blue-400 to-purple-400'} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            step="0.1"
            value={challengeInput[challenge.id] || ''}
            onChange={(e) => setChallengeInput(prev => ({ ...prev, [challenge.id]: e.target.value }))}
            placeholder={`Add ${challenge.unit}...`}
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-colors"
          />
          <motion.button
            onClick={() => {
              const value = parseFloat(challengeInput[challenge.id] || '0');
              if (value > 0) updateChallenge(challenge.id, challenge.current + value);
            }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Log
          </motion.button>
        </div>
      </motion.div>
    );
  };

  const eggScale = 1 + (isHatching ? Math.sin(Date.now() * 0.008) * 0.15 : 0);
  const shadowOpacity = 0.3 + Math.sin(Date.now() * 0.002) * 0.1;
  const rimLightOpacity = 0.6 + Math.sin(Date.now() * 0.004) * 0.4;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 400}px`,
              top: `${Math.random() * 400}px`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent mb-2">
            {user.username}
          </h1>
          <div className="flex justify-center items-center gap-4 text-gray-300 text-lg">
            <span>Level: {user.stage}</span>
            <div className="flex items-center gap-2">
              <span>XP: {user.xp}/600</span>
              <div className="w-24 h-2 bg-gray-700 rounded-full">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-300"
                  style={{ width: `${(user.xp / 600) * 100}%` }}
                />
              </div>
              {isHatching && <span className="text-yellow-400">🥚 Hatching...</span>}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative">
            <svg width="400" height="400" viewBox="0 0 400 400" className="drop-shadow-2xl">
              <defs>
                <radialGradient id="eggGradient" cx="0.3" cy="0.2" r="0.8">
                  <stop offset="0%" stopColor="#fff8e1" stopOpacity="1" />
                  <stop offset="20%" stopColor="#fff3c4" stopOpacity="1" />
                  <stop offset="50%" stopColor="#ffeaa7" stopOpacity="1" />
                  <stop offset="80%" stopColor="#fdcb6e" stopOpacity="1" />
                  <stop offset="100%" stopColor="#e17055" stopOpacity="1" />
                </radialGradient>
                <linearGradient id="shadowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2d3436" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#636e72" stopOpacity="0.2" />
                </linearGradient>
                <radialGradient id="rimLight" cx="0.8" cy="0.2" r="0.6">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                  <stop offset="30%" stopColor="#ffffff" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="specularHighlight" cx="0.25" cy="0.25" r="0.3">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>
                <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <filter id="crackGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <pattern id="eggTexture" patternUnits="userSpaceOnUse" width="20" height="20">
                  <circle cx="3" cy="3" r="0.8" fill="#ffffff" opacity="0.12"/>
                  <circle cx="15" cy="8" r="0.4" fill="#ffffff" opacity="0.18"/>
                  <circle cx="8" cy="15" r="1.2" fill="#ffffff" opacity="0.08"/>
                  <circle cx="12" cy="2" r="0.3" fill="#ffffff" opacity="0.15"/>
                  <circle cx="18" cy="18" r="0.6" fill="#ffffff" opacity="0.1"/>
                  <circle cx="5" cy="12" r="0.5" fill="#ffffff" opacity="0.2"/>
                </pattern>
                <pattern id="shellGrain" patternUnits="userSpaceOnUse" width="8" height="8">
                  <rect width="8" height="8" fill="none"/>
                  <circle cx="2" cy="2" r="0.3" fill="#f8c471" opacity="0.3"/>
                  <circle cx="6" cy="4" r="0.2" fill="#f5b041" opacity="0.4"/>
                  <circle cx="4" cy="6" r="0.4" fill="#f4d03f" opacity="0.25"/>
                  <circle cx="1" cy="7" r="0.15" fill="#f7dc6f" opacity="0.35"/>
                  <circle cx="7" cy="1" r="0.25" fill="#f8c471" opacity="0.3"/>
                </pattern>
                <pattern id="microTexture" patternUnits="userSpaceOnUse" width="4" height="4">
                  <rect width="4" height="4" fill="none"/>
                  <circle cx="1" cy="1" r="0.15" fill="#ffffff" opacity="0.25"/>
                  <circle cx="3" cy="2" r="0.1" fill="#ffffff" opacity="0.3"/>
                  <circle cx="2" cy="3" r="0.2" fill="#ffffff" opacity="0.2"/>
                </pattern>
                <filter id="bumpMap" x="-50%" y="-50%" width="200%" height="200%">
                  <feTurbulence baseFrequency="0.9" numOctaves="4" result="noise"/>
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="2"/>
                </filter>
                <filter id="surfaceDetail" x="-50%" y="-50%" width="200%" height="200%">
                  <feTurbulence baseFrequency="2.5" numOctaves="3" result="fineTurbulence"/>
                  <feColorMatrix in="fineTurbulence" type="saturate" values="0"/>
                  <feDisplacementMap in="SourceGraphic" in2="fineTurbulence" scale="1"/>
                </filter>
              </defs>

              <ellipse 
                cx="200" 
                cy="350" 
                rx="80" 
                ry="20" 
                fill="url(#shadowGradient)" 
                opacity={shadowOpacity}
                style={{
                  transform: `scale(${1 + eggScale * 0.15})`,
                  transformOrigin: 'center'
                }}
              />

              <g style={{ 
                transform: `translate(200px, 200px) scale(${eggScale}) translate(-200px, -200px)`,
                filter: 'url(#softGlow)'
              }}>
                <ellipse
                  cx="200"
                  cy="200"
                  rx="60"
                  ry="90"
                  fill="url(#eggGradient)"
                  filter="url(#bumpMap)"
                  style={{
                    transform: isHatching ? `rotate(${Math.sin(Date.now() * 0.015) * 5}deg)` : 'none',
                    transformOrigin: 'center'
                  }}
                />
                <ellipse
                  cx="200"
                  cy="200"
                  rx="60"
                  ry="90"
                  fill="url(#shellGrain)"
                  opacity="0.6"
                  filter="url(#surfaceDetail)"
                />
                <ellipse
                  cx="200"
                  cy="200"
                  rx="60"
                  ry="90"
                  fill="url(#microTexture)"
                  opacity="0.4"
                />
                <ellipse
                  cx="200"
                  cy="200"
                  rx="60"
                  ry="90"
                  fill="url(#eggTexture)"
                  opacity="0.5"
                />
                <g opacity="0.3">
                  <ellipse cx="175" cy="180" rx="8" ry="12" fill="#e8b86d" opacity="0.4"/>
                  <ellipse cx="220" cy="200" rx="6" ry="9" fill="#f0c674" opacity="0.3"/>
                  <ellipse cx="190" cy="240" rx="5" ry="8" fill="#e8b86d" opacity="0.5"/>
                  <ellipse cx="210" cy="160" rx="4" ry="6" fill="#f2d78b" opacity="0.4"/>
                  <ellipse cx="185" cy="220" rx="7" ry="10" fill="#ecc94b" opacity="0.3"/>
                </g>
                <ellipse
                  cx="200"
                  cy="200"
                  rx="60"
                  ry="90"
                  fill="url(#rimLight)"
                  opacity={rimLightOpacity}
                />
                <ellipse
                  cx="180"
                  cy="160"
                  rx="25"
                  ry="35"
                  fill="url(#specularHighlight)"
                  opacity={lightIntensity}
                />
                <ellipse
                  cx="170"
                  cy="150"
                  rx="8"
                  ry="12"
                  fill="#ffffff"
                  opacity={0.6 * lightIntensity}
                />
                <ellipse
                  cx="165"
                  cy="145"
                  rx="3"
                  ry="4"
                  fill="#ffffff"
                  opacity={0.8 * lightIntensity}
                />
                <ellipse
                  cx="185"
                  cy="170"
                  rx="4"
                  ry="6"
                  fill="#ffffff"
                  opacity={0.4 * lightIntensity}
                />
              </g>

              {crackLevel > 0 && (
                <g filter="url(#crackGlow)">
                  <path
                    d="M160 170 Q170 160 180 170 Q190 180 200 170 Q210 160 220 170"
                    stroke="#ff6b6b"
                    strokeWidth="3"
                    fill="none"
                    opacity={Math.min(crackLevel * 0.3, 1)}
                    style={{
                      strokeDasharray: '5,3',
                      animation: 'crackPulse 1s ease-in-out infinite alternate'
                    }}
                  />
                  {crackLevel > 1 && (
                    <path
                      d="M170 200 Q180 190 190 200 Q200 210 210 200"
                      stroke="#ff6b6b"
                      strokeWidth="2"
                      fill="none"
                      opacity={Math.min((crackLevel - 1) * 0.4, 1)}
                      style={{
                        strokeDasharray: '3,2',
                        animation: 'crackPulse 1.2s ease-in-out infinite alternate'
                      }}
                    />
                  )}
                  {crackLevel > 2 && (
                    <path
                      d="M150 190 Q160 180 170 190"
                      stroke="#ff6b6b"
                      strokeWidth="2"
                      fill="none"
                      opacity={Math.min((crackLevel - 2) * 0.4, 1)}
                      style={{
                        strokeDasharray: '4,2',
                        animation: 'crackPulse 0.8s ease-in-out infinite alternate'
                      }}
                    />
                  )}
                  {crackLevel > 2 && (
                    <path
                      d="M230 190 Q220 180 210 190"
                      stroke="#ff6b6b"
                      strokeWidth="2"
                      fill="none"
                      opacity={Math.min((crackLevel - 2) * 0.4, 1)}
                      style={{
                        strokeDasharray: '4,2',
                        animation: 'crackPulse 0.9s ease-in-out infinite alternate'
                      }}
                    />
                  )}
                  {crackLevel > 3 && (
                    <path
                      d="M180 150 Q190 140 200 150 Q210 140 220 150"
                      stroke="#ff6b6b"
                      strokeWidth="2"
                      fill="none"
                      opacity={Math.min((crackLevel - 3) * 0.5, 1)}
                      style={{
                        strokeDasharray: '3,2',
                        animation: 'crackPulse 1s ease-in-out infinite alternate'
                      }}
                    />
                  )}
                  {crackLevel > 3 && (
                    <path
                      d="M180 250 Q190 260 200 250 Q210 260 220 250"
                      stroke="#ff6b6b"
                      strokeWidth="2"
                      fill="none"
                      opacity={Math.min((crackLevel - 3) * 0.5, 1)}
                      style={{
                        strokeDasharray: '3,2',
                        animation: 'crackPulse 1.1s ease-in-out infinite alternate'
                      }}
                    />
                  )}
                  {crackLevel > 4 && (
                    <>
                      <path
                        d="M185 175 L195 185 M195 175 L185 185"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        opacity={Math.min((crackLevel - 4) * 0.6, 1)}
                      />
                      <path
                        d="M205 205 L215 215 M215 205 L205 215"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        opacity={Math.min((crackLevel - 4) * 0.6, 1)}
                      />
                    </>
                  )}
                </g>
              )}

              {isHatching && (
                <g>
                  {[...Array(12)].map((_, i) => (
                    <circle
                      key={i}
                      cx={200 + Math.cos(i * Math.PI / 6) * 80}
                      cy={200 + Math.sin(i * Math.PI / 6) * 80}
                      r="3"
                      fill="#74b9ff"
                      opacity="0.6"
                      style={{
                        animation: `orbit ${2 + i * 0.1}s linear infinite`,
                        transformOrigin: '200px 200px'
                      }}
                    />
                  ))}
                </g>
              )}

              {crackLevel >= 3 && (
                <g>
                  <motion.ellipse
                    cx="185"
                    cy="145"
                    rx="18"
                    ry="16"
                    fill="white"
                    stroke="rgba(59, 130, 246, 0.3)"
                    strokeWidth="1.5"
                    animate={{
                      scaleY: isBlinking ? 0.1 : 1
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ transition: 'transform 0.1s ease-in-out' }}
                  />
                  <motion.ellipse
                    cx="215"
                    cy="145"
                    rx="18"
                    ry="16"
                    fill="white"
                    stroke="rgba(59, 130, 246, 0.3)"
                    strokeWidth="1.5"
                    animate={{
                      scaleY: isBlinking ? 0.1 : 1
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ transition: 'transform 0.1s ease-in-out' }}
                  />
                  <circle cx="185" cy="145" r="8" fill="#1e40af" />
                  <circle cx="215" cy="145" r="8" fill="#1e40af" />
                  <circle cx="185" cy="145" r="5" fill="black" />
                  <circle cx="215" cy="145" r="5" fill="black" />
                  <ellipse cx="187" cy="141" rx="4" ry="3" fill="rgba(255,255,255,0.9)" />
                  <ellipse cx="217" cy="141" rx="4" ry="3" fill="rgba(255,255,255,0.9)" />
                </g>
              )}
            </svg>
            
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
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full px-3 py-1 text-sm font-bold text-white shadow-lg">
              L{Math.floor(user.xp / 50) + 1}
            </div>
          </div>
        </motion.div>

        <div className="flex justify-center mb-8">
          <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-2 border border-white/10">
            {(['overview', 'challenges', 'battles', 'biometrics'] as const).map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl font-semibold capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              {renderBiometricCard('Heart Rate', biometrics.heartRate, 'bpm', '💓', 'from-red-900/50 to-pink-900/50')}
              {renderBiometricCard('Sleep Score', biometrics.sleepScore, '%', '😴', 'from-indigo-900/50 to-purple-900/50')}
              {renderBiometricCard('Recovery', biometrics.recoveryScore, '%', '⚡', 'from-emerald-900/50 to-teal-900/50')}
              {renderBiometricCard('Steps Today', biometrics.stepsToday.toLocaleString(), '', '👟', 'from-blue-900/50 to-cyan-900/50')}
            </motion.div>
          )}

          {activeTab === 'challenges' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {challenges.map(renderChallengeCard)}
            </motion.div>
          )}

          {activeTab === 'biometrics' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <div className="bg-gradient-to-br from-gray-900/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6">Performance Metrics</h3>
                <div className="space-y-4">
                  {[
                    { metric: 'VO2 Max', value: 58, unit: 'ml/kg/min', color: 'from-red-400 to-orange-400' },
                    { metric: 'Resting HR', value: 48, unit: 'bpm', color: 'from-blue-400 to-cyan-400' },
                    { metric: 'HRV', value: 42, unit: 'ms', color: 'from-green-400 to-emerald-400' },
                    { metric: 'Body Fat', value: 12.4, unit: '%', color: 'from-purple-400 to-pink-400' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <span className="text-gray-300 font-medium">{item.metric}</span>
                      <span className={`text-xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                        {item.value} {item.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6">Leaderboard</h3>
                <div className="space-y-3">
                  {leaderboard.map((entry, index) => (
                    <motion.div
                      key={index}
                      className={`flex items-center justify-between p-4 rounded-xl ${
                        entry.username === user.username 
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30' 
                          : 'bg-white/5'
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-yellow-500 text-black' :
                          index === 1 ? 'bg-gray-400 text-black' :
                          index === 2 ? 'bg-amber-600 text-black' : 'bg-gray-600 text-white'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="text-white font-medium">{entry.username}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">{entry.xp} XP</div>
                        <div className="text-gray-400 text-sm">🔥 {entry.streak}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes crackPulse {
          0% { opacity: 0.3; stroke-width: 2; }
          100% { opacity: 0.8; stroke-width: 4; }
        }
        
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(80px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
        }
      `}</style>
    </div>
  );
}