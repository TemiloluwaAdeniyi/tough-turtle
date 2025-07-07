"use client";

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useStrava } from '@/contexts/StravaContext';
import { StravaActivity } from '@/lib/strava';

interface StravaActivityFeedProps {
  maxActivities?: number;
}

export default function StravaActivityFeed({ maxActivities = 5 }: StravaActivityFeedProps) {
  const { isConnected, activities, loading, refreshActivities } = useStrava();

  useEffect(() => {
    if (isConnected && activities.length === 0) {
      refreshActivities();
    }
  }, [isConnected, activities.length, refreshActivities]);

  const formatActivity = (activity: StravaActivity) => {
    const distance = activity.distance > 0 ? `${(activity.distance / 1000).toFixed(1)}km` : '';
    const time = `${Math.floor(activity.moving_time / 60)}min`;
    const date = new Date(activity.start_date).toLocaleDateString();
    
    return { distance, time, date };
  };

  const getActivityIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      'Run': '🏃‍♂️',
      'Ride': '🚴‍♂️',
      'Walk': '🚶‍♂️',
      'Hike': '🥾',
      'Swim': '🏊‍♂️',
      'VirtualRide': '🚴‍♂️',
      'VirtualRun': '🏃‍♂️',
      'EBikeRide': '⚡',
      'Workout': '💪',
      'WeightTraining': '🏋️‍♂️',
      'Crosstraining': '🤸‍♂️',
    };
    return icons[type] || '🏃‍♂️';
  };

  if (!isConnected) {
    return (
      <div className="card-modern glass p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-3">Recent Activities</h3>
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm">Connect to Strava to see your recent activities</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card-modern glass p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-3">Recent Activities</h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass rounded-lg p-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-600 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const displayActivities = activities.slice(0, maxActivities);

  return (
    <div className="card-modern glass p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Recent Activities</h3>
        <button
          onClick={refreshActivities}
          className="btn-modern p-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {displayActivities.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm">No recent activities found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayActivities.map((activity, index) => {
            const { distance, time, date } = formatActivity(activity);
            
            return (
              <motion.div
                key={activity.id}
                className="glass rounded-lg p-3 hover:border-blue-500/30 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">
                      {activity.name}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span>{activity.type}</span>
                      {distance && <span>• {distance}</span>}
                      <span>• {time}</span>
                      <span>• {date}</span>
                    </div>
                  </div>
                  {activity.suffer_score && (
                    <div className="text-right">
                      <div className="text-xs text-gray-400">Suffer Score</div>
                      <div className="text-orange-400 font-semibold">
                        {activity.suffer_score}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}