'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { activities } from '@/lib/activities';
import { challenges } from '@/lib/challenges';
import { useAuth } from '@/contexts/AuthContext';

interface ExerciseTrackerProps {
  onActivityLogged?: () => void;
}

const exerciseTypes = [
  { id: 'cardio', name: 'Cardio', icon: '🏃', unit: 'minutes' },
  { id: 'strength', name: 'Strength Training', icon: '💪', unit: 'sets' },
  { id: 'yoga', name: 'Yoga', icon: '🧘', unit: 'minutes' },
  { id: 'running', name: 'Running', icon: '🏃‍♂️', unit: 'km' },
  { id: 'cycling', name: 'Cycling', icon: '🚴', unit: 'km' },
  { id: 'swimming', name: 'Swimming', icon: '🏊', unit: 'laps' },
];

export default function ExerciseTracker({ onActivityLogged }: ExerciseTrackerProps) {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState(exerciseTypes[0]);
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !value) return;

    setLoading(true);
    try {
      await activities.logExercise(
        user.id,
        selectedType.id,
        parseFloat(value),
        selectedType.unit,
        notes || undefined
      );

      const xpGain = 25;
      await challenges.updateUserXP(user.id, xpGain);

      setSuccess(true);
      setValue('');
      setNotes('');
      setTimeout(() => setSuccess(false), 3000);
      onActivityLogged?.();
    } catch (error) {
      console.error('Error logging exercise:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="text-3xl">🏋️</div>
        <h3 className="text-2xl font-bold text-white">Exercise Tracker</h3>
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 mb-6 text-green-200 text-sm"
        >
          Exercise logged successfully! +25 XP
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Exercise Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {exerciseTypes.map((type) => (
              <motion.button
                key={type.id}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`p-4 rounded-xl border transition-all ${
                  selectedType.id === type.id
                    ? 'bg-blue-500/20 border-blue-400 text-blue-300'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-2xl mb-1">{type.icon}</div>
                <div className="text-sm font-medium">{type.name}</div>
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Value ({selectedType.unit})
          </label>
          <input
            type="number"
            step="0.1"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-colors"
            placeholder={`Enter ${selectedType.unit}...`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-colors resize-none"
            placeholder="How did it feel? Any achievements?"
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading || !value}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? 'Logging...' : 'Log Exercise'}
        </motion.button>
      </form>
    </motion.div>
  );
}