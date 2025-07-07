"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStrava } from '@/contexts/StravaContext';
import { StravaActivity } from '@/lib/strava';

interface ChallengeMappingType {
  cardio: 'distance';
  strength: 'activities';
  sleep: 'activities';
  hydration: 'activities';
  meditation: 'activities';
}

interface Challenge {
  id: string;
  type: keyof ChallengeMappingType;
  title: string;
  target: number;
  current: number;
  unit: string;
  completed: boolean;
  streak: number;
  icon: string;
}

interface StravaChallengeVerificationProps {
  challenge: Challenge;
  onVerificationComplete: (verified: boolean, progress: number) => void;
}

export default function StravaChallengeVerification({ 
  challenge, 
  onVerificationComplete 
}: StravaChallengeVerificationProps) {
  const { isConnected, verifyChallenge } = useStrava();
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    completed: boolean;
    progress: number;
    activities: StravaActivity[];
  } | null>(null);

  const challengeMapping: ChallengeMappingType = {
    cardio: 'distance',
    strength: 'activities',
    sleep: 'activities',
    hydration: 'activities',
    meditation: 'activities'
  };

  const handleVerifyFromStrava = async () => {
    if (!isConnected) return;

    setVerifying(true);
    try {
      const stravaType = challengeMapping[challenge.type];
      const result = await verifyChallenge(stravaType, challenge.target, 'today');
      
      setVerificationResult(result);
      onVerificationComplete(result.completed, result.progress);
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setVerifying(false);
    }
  };

  // Only show Strava verification for cardio challenges
  if (challenge.type !== 'cardio' || !isConnected) {
    return null;
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <svg className="w-4 h-4 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7 13.828h4.916"/>
          </svg>
          <span>Verify with Strava</span>
        </div>
        
        <motion.button
          onClick={handleVerifyFromStrava}
          disabled={verifying}
          className="btn-modern px-3 py-1 bg-orange-500/20 text-orange-300 rounded-lg hover:bg-orange-500/30 transition-colors border border-orange-500/30 text-sm disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {verifying ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border border-orange-300 border-t-transparent rounded-full animate-spin"></div>
              Checking...
            </div>
          ) : (
            'Sync Now'
          )}
        </motion.button>
      </div>

      {verificationResult && (
        <motion.div
          className={`glass rounded-lg p-3 border ${
            verificationResult.completed 
              ? 'border-emerald-500/30 bg-emerald-500/10' 
              : 'border-blue-500/30 bg-blue-500/10'
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">
              Strava Verification
            </span>
            {verificationResult.completed ? (
              <span className="text-emerald-400 text-sm">✅ Completed</span>
            ) : (
              <span className="text-blue-400 text-sm">📊 In Progress</span>
            )}
          </div>
          
          <div className="text-sm text-gray-300">
            Found: {verificationResult.progress.toFixed(1)} {challenge.unit}
            {verificationResult.activities.length > 0 && (
              <span className="text-gray-400"> from {verificationResult.activities.length} activities</span>
            )}
          </div>

          {verificationResult.activities.length > 0 && (
            <div className="mt-2 space-y-1">
              {verificationResult.activities.slice(0, 3).map((activity, index) => (
                <div key={index} className="text-xs text-gray-400 flex justify-between">
                  <span>{activity.name}</span>
                  <span>{(activity.distance / 1000).toFixed(1)}km</span>
                </div>
              ))}
              {verificationResult.activities.length > 3 && (
                <div className="text-xs text-gray-500">
                  +{verificationResult.activities.length - 3} more activities
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}