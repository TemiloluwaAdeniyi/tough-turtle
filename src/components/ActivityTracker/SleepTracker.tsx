'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { activities } from '@/lib/activities';
import { challenges } from '@/lib/challenges';
import { useAuth } from '@/contexts/AuthContext';

interface SleepTrackerProps {
  onActivityLogged?: () => void;
}

export default function SleepTracker({ onActivityLogged }: SleepTrackerProps) {
  const { user } = useAuth();
  const [hours, setHours] = useState('');
  const [quality, setQuality] = useState<'poor' | 'fair' | 'good' | 'excellent'>('good');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const qualityOptions = [
    { id: 'poor', name: 'Poor', icon: '😴', color: 'text-red-400' },
    { id: 'fair', name: 'Fair', icon: '😐', color: 'text-yellow-400' },
    { id: 'good', name: 'Good', icon: '😊', color: 'text-green-400' },
    { id: 'excellent', name: 'Excellent', icon: '🤩', color: 'text-emerald-400' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !hours) return;

    setLoading(true);
    try {
      await activities.logSleep(
        user.id,
        parseFloat(hours),
        'hours',
        notes ? `Quality: ${quality}. ${notes}` : `Quality: ${quality}`
      );

      const xpGain = 20;
      await challenges.updateUserXP(user.id, xpGain);

      setSuccess(true);
      setHours('');
      setNotes('');
      setTimeout(() => setSuccess(false), 3000);
      onActivityLogged?.();
    } catch (error) {
      console.error('Error logging sleep:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="text-3xl">😴</div>
        <h3 className="text-2xl font-bold text-white">Sleep Tracker</h3>
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 mb-6 text-green-200 text-sm"
        >
          Sleep logged successfully! +20 XP
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Hours of Sleep
          </label>
          <input
            type="number"
            step="0.5"
            min="0"
            max="24"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            required
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-colors"
            placeholder="e.g., 7.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Sleep Quality
          </label>
          <div className="grid grid-cols-2 gap-3">
            {qualityOptions.map((option) => (
              <motion.button
                key={option.id}
                type="button"
                onClick={() => setQuality(option.id as typeof quality)}
                className={`p-4 rounded-xl border transition-all ${
                  quality === option.id
                    ? 'bg-blue-500/20 border-blue-400 text-blue-300'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-2xl mb-1">{option.icon}</div>
                <div className={`text-sm font-medium ${option.color}`}>{option.name}</div>
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Sleep Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-colors resize-none"
            placeholder="Dreams, wake-ups, how you feel..."
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading || !hours}
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? 'Logging...' : 'Log Sleep'}
        </motion.button>
      </form>
    </motion.div>
  );
}