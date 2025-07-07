"use client";

import { motion } from 'framer-motion';
import { useStrava } from '@/contexts/StravaContext';

export default function StravaConnect() {
  const { isConnected, athlete, loading, error, connectToStrava, disconnect } = useStrava();

  if (loading) {
    return (
      <div className="card-modern glass p-6 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white">Connecting to Strava...</span>
        </div>
      </div>
    );
  }

  if (isConnected && athlete) {
    return (
      <motion.div
        className="card-modern glass-strong p-6 rounded-xl border border-orange-500/30"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7 13.828h4.916"/>
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold">Connected to Strava</h3>
              <p className="text-gray-300 text-sm">{athlete.firstname} {athlete.lastname}</p>
            </div>
          </div>
          <button
            onClick={disconnect}
            className="btn-modern px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30"
          >
            Disconnect
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="card-modern glass p-6 rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7 13.828h4.916"/>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Connect to Strava</h3>
        <p className="text-gray-300 mb-6 text-sm">
          Sync your real workout data to automatically complete challenges and track your progress.
        </p>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <motion.button
          onClick={connectToStrava}
          className="btn-modern bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7 13.828h4.916"/>
            </svg>
            Connect with Strava
          </div>
        </motion.button>

        <div className="mt-4 text-xs text-gray-400">
          <p>We&apos;ll only access your activity data to verify challenges.</p>
        </div>
      </div>
    </motion.div>
  );
}