'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { activities } from '@/lib/activities';
import { challenges } from '@/lib/challenges';
import { useAuth } from '@/contexts/AuthContext';

interface BiohackingTrackerProps {
  onActivityLogged?: () => void;
}

const biohackingTypes = [
  { id: 'cold_therapy', name: 'Cold Therapy', icon: '🧊', unit: 'minutes' },
  { id: 'red_light', name: 'Red Light Therapy', icon: '🔴', unit: 'minutes' },
  { id: 'sauna', name: 'Sauna', icon: '🔥', unit: 'minutes' },
  { id: 'fasting', name: 'Intermittent Fasting', icon: '⏰', unit: 'hours' },
  { id: 'meditation', name: 'Meditation', icon: '🧘', unit: 'minutes' },
  { id: 'breathwork', name: 'Breathwork', icon: '🫁', unit: 'minutes' },
  { id: 'supplements', name: 'Supplements', icon: '💊', unit: 'dosage' },
  { id: 'grounding', name: 'Grounding', icon: '🌱', unit: 'minutes' },
];

export default function BiohackingTracker({ onActivityLogged }: BiohackingTrackerProps) {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState(biohackingTypes[0]);
  const [value, setValue] = useState('');
  const [intensity, setIntensity] = useState<'low' | 'medium' | 'high'>('medium');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const intensityOptions = [
    { id: 'low', name: 'Low', icon: '🟢', color: 'text-green-400' },
    { id: 'medium', name: 'Medium', icon: '🟡', color: 'text-yellow-400' },
    { id: 'high', name: 'High', icon: '🔴', color: 'text-red-400' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !value) return;

    setLoading(true);
    try {
      await activities.logBiohacking(
        user.id,
        selectedType.id,
        parseFloat(value),
        selectedType.unit,
        notes ? `Intensity: ${intensity}. ${notes}` : `Intensity: ${intensity}`
      );

      const xpGain = 20;
      await challenges.updateUserXP(user.id, xpGain);

      setSuccess(true);
      setValue('');
      setNotes('');
      setTimeout(() => setSuccess(false), 3000);
      onActivityLogged?.();
    } catch (error) {
      console.error('Error logging biohacking:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-emerald-900/50 to-teal-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="text-3xl">🧬</div>
        <h3 className="text-2xl font-bold text-white">Biohacking Tracker</h3>
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 mb-6 text-green-200 text-sm"
        >
          Biohacking session logged! +20 XP
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Biohacking Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {biohackingTypes.map((type) => (
              <motion.button
                key={type.id}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`p-3 rounded-xl border transition-all ${
                  selectedType.id === type.id
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-xl mb-1">{type.icon}</div>
                <div className="text-xs font-medium">{type.name}</div>
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
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-emerald-400 focus:outline-none transition-colors"
            placeholder={`Enter ${selectedType.unit}...`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Intensity Level
          </label>
          <div className="grid grid-cols-3 gap-3">
            {intensityOptions.map((option) => (
              <motion.button
                key={option.id}
                type="button"
                onClick={() => setIntensity(option.id as typeof intensity)}
                className={`p-3 rounded-xl border transition-all ${
                  intensity === option.id
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-xl mb-1">{option.icon}</div>
                <div className={`text-sm font-medium ${option.color}`}>{option.name}</div>
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-emerald-400 focus:outline-none transition-colors resize-none"
            placeholder="How did you feel? Effects noticed?"
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading || !value}
          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? 'Logging...' : 'Log Session'}
        </motion.button>
      </form>
    </motion.div>
  );
}