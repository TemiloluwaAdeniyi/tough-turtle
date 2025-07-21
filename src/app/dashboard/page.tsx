"use client";

import React, { useState } from 'react';
import { Zap, Trophy, Swords, Star, FlameKindling, Shield } from 'lucide-react';

interface UserStats {
  challengesCompleted: number;
  level: number;
  experience: number;
  experienceToNext: number;
  availableMoves: number;
  battleWins: number;
}

interface Move {
  level: number;
  move: string;
  challenges: number;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}

interface TurtleFitnessAvatarProps {
  userStats?: UserStats;
  setUserStats?: React.Dispatch<React.SetStateAction<UserStats>>;
}

const TurtleFitnessAvatar: React.FC<TurtleFitnessAvatarProps> = ({ 
  userStats = {
    challengesCompleted: 0,
    level: 1,
    experience: 0,
    experienceToNext: 100,
    availableMoves: 1,
    battleWins: 0
  }, 
  setUserStats = () => {}
}) => {
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [battleMode, setBattleMode] = useState(false);

  // Move unlock progression
  const moveUnlocks: Move[] = [
    { level: 1, move: 'Shell Spin', challenges: 0, icon: Shield, color: '#10B981' },
    { level: 1, move: 'Power Stomp', challenges: 5, icon: Zap, color: '#F59E0B' },
    { level: 2, move: 'Hydro Blast', challenges: 10, icon: FlameKindling, color: '#3B82F6' },
    { level: 3, move: 'Lightning Strike', challenges: 15, icon: Zap, color: '#8B5CF6' },
    { level: 4, move: 'Meteor Shell', challenges: 25, icon: Star, color: '#EF4444' },
    { level: 5, move: 'Ultimate Combo', challenges: 40, icon: Swords, color: '#F97316' },
  ];

  const unlockedMoves = moveUnlocks.filter((move) => userStats.challengesCompleted >= move.challenges);
  const nextMove = moveUnlocks.find((move) => userStats.challengesCompleted < move.challenges);

  // Turtle SVG with evolution stages
  const getTurtleColor = (level: number): string => {
    const colors: { [key: number]: string } = {
      1: '#10B981', // Green
      2: '#3B82F6', // Blue
      3: '#8B5CF6', // Purple
      4: '#F59E0B', // Orange
      5: '#EF4444', // Red
    };
    return colors[Math.min(level, 5)] || colors[1];
  };

  const TurtleSVG = ({ level, isAnimating, selectedMove }: { level: number; isAnimating: boolean; selectedMove: Move | null }) => {
    const shellColor = getTurtleColor(level);
    const size = 120 + level * 10;

    return (
      <div className="relative">
        <svg
          width={size}
          height={size}
          viewBox="0 0 120 120"
          className={`transition-all duration-500 ${isAnimating ? 'animate-pulse scale-110' : ''}`}
        >
          {/* Shell base */}
          <ellipse cx="60" cy="70" rx="35" ry="25" fill={shellColor} opacity="0.8" />

          {/* Shell pattern based on level */}
          {level >= 2 && <polygon points="60,50 70,60 60,70 50,60" fill="rgba(255,255,255,0.3)" />}
          {level >= 3 && (
            <>
              <circle cx="45" cy="60" r="3" fill="rgba(255,255,255,0.4)" />
              <circle cx="75" cy="60" r="3" fill="rgba(255,255,255,0.4)" />
            </>
          )}
          {level >= 4 && (
            <path d="M35 65 Q60 45 85 65" stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="none" />
          )}

          {/* Head */}
          <circle cx="60" cy="35" r="12" fill={shellColor} opacity="0.9" />

          {/* Eyes */}
          <circle cx="56" cy="32" r="2" fill="white" />
          <circle cx="64" cy="32" r="2" fill="white" />
          <circle cx="56" cy="32" r="1" fill="black" />
          <circle cx="64" cy="32" r="1" fill="black" />

          {/* Legs */}
          <ellipse cx="35" cy="75" rx="8" ry="6" fill={shellColor} opacity="0.7" />
          <ellipse cx="85" cy="75" rx="8" ry="6" fill={shellColor} opacity="0.7" />
          <ellipse cx="40" cy="85" rx="6" ry="8" fill={shellColor} opacity="0.7" />
          <ellipse cx="80" cy="85" rx="6" ry="8" fill={shellColor} opacity="0.7" />

          {/* Battle effects */}
          {selectedMove && isAnimating && (
            <>
              <circle
                cx="60"
                cy="60"
                r="40"
                fill="none" 
                stroke={selectedMove.color} 
                strokeWidth="2" 
                opacity="0.6"
              >
                <animate attributeName="r" values="40;50;40" dur="0.5s" repeatCount="2" />
                <animate attributeName="opacity" values="0.6;0.2;0.6" dur="0.5s" repeatCount="2" />
              </circle>
              <circle cx="60" cy="60" r="20" fill={selectedMove.color} opacity="0.3">
                <animate attributeName="opacity" values="0.3;0.7;0.3" dur="0.3s" repeatCount="3" />
              </circle>
            </>
          )}

          {/* Level indicator */}
          <text x="60" y="105" textAnchor="middle" className="text-xs font-bold" fill={shellColor}>
            Lv.{level}
          </text>
        </svg>

        {/* XP Ring */}
        <div className="absolute -top-2 -left-2">
          <svg width={size + 16} height={size + 16} className="transform -rotate-90">
            <circle
              cx={(size + 16) / 2}
              cy={(size + 16) / 2}
              r={size / 2}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="3"
            />
            <circle
              cx={(size + 16) / 2}
              cy={(size + 16) / 2}
              r={size / 2}
              fill="none"
              stroke={shellColor}
              strokeWidth="3"
              strokeDasharray={`${(userStats.experience / userStats.experienceToNext) * (Math.PI * size)} ${Math.PI * size}`}
              className="transition-all duration-700"
            />
          </svg>
        </div>
      </div>
    );
  };

  const executeMove = (move: Move) => {
    setSelectedMove(move);
    setIsAnimating(true);

    setTimeout(() => {
      setIsAnimating(false);
      setSelectedMove(null);
    }, 1500);
  };

  const completeChallenge = () => {
    setUserStats((prev) => {
      const newChallenges = prev.challengesCompleted + 1;
      const newExp = prev.experience + 50;
      const newLevel = newExp >= prev.experienceToNext ? prev.level + 1 : prev.level;

      return {
        ...prev,
        challengesCompleted: newChallenges,
        experience: newLevel > prev.level ? newExp - prev.experienceToNext : newExp,
        level: newLevel,
        experienceToNext: newLevel > prev.level ? prev.experienceToNext + 200 : prev.experienceToNext,
        availableMoves: moveUnlocks.filter((m) => newChallenges >= m.challenges).length,
      };
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Turtle Fighter Evolution</h1>
        <p className="text-gray-600">Complete challenges to unlock new combat moves!</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Turtle Avatar Section */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <TurtleSVG level={userStats.level} isAnimating={isAnimating} selectedMove={selectedMove} />
          </div>

          {/* Stats Display */}
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Level:</span>
                <span className="font-bold text-lg">{userStats.level}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Challenges:</span>
                <span className="font-bold text-lg text-green-600">{userStats.challengesCompleted}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Battle Wins:</span>
                <span className="font-bold text-lg text-blue-600">{userStats.battleWins}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Moves:</span>
                <span className="font-bold text-lg text-purple-600">{userStats.availableMoves}</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>XP: {userStats.experience}</span>
                <span>Next: {userStats.experienceToNext}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${(userStats.experience / userStats.experienceToNext) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={completeChallenge}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Trophy className="w-4 h-4" />
              Complete Challenge
            </button>
            <button
              onClick={() => setBattleMode(!battleMode)}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Swords className="w-4 h-4" />
              Battle Mode
            </button>
          </div>
        </div>

        {/* Moves & Progression Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Combat Moves</h3>

            <div className="space-y-3">
              {unlockedMoves.map((move, index) => {
                const IconComponent = move.icon;
                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-2 transition-all cursor-pointer hover:scale-105 ${
                      battleMode ? 'border-gray-300 hover:border-blue-400 hover:bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => battleMode && executeMove(move)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: move.color + '20' }}>
                        <IconComponent className="w-5 h-5" style={{ color: move.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{move.move}</div>
                        <div className="text-sm text-gray-500">Unlocked at {move.challenges} challenges</div>
                      </div>
                      <div className="text-sm font-bold" style={{ color: move.color }}>
                        Lv.{move.level}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next Unlock */}
          {nextMove && (
            <div className="bg-gray-50 rounded-xl p-6 shadow-lg border-2 border-dashed border-gray-300">
              <h3 className="text-lg font-bold text-gray-600 mb-3">Next Unlock</h3>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-200">
                  <nextMove.icon className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-700">{nextMove.move}</div>
                  <div className="text-sm text-gray-500">
                    {nextMove.challenges - userStats.challengesCompleted} more challenges needed
                  </div>
                </div>
              </div>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(100, (userStats.challengesCompleted / nextMove.challenges) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Battle Instructions */}
          {battleMode && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
                <Swords className="w-5 h-5" />
                Battle Mode Active
              </div>
              <p className="text-red-600 text-sm">
                Click on any unlocked move to see your turtle perform it! Perfect for head-to-head fitness challenges.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TurtleFitnessAvatar;