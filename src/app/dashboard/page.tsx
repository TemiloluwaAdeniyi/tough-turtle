"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const [user, setUser] = useState({ xp: 0, stage: 'Tiny Hatchling', skin: 'default', username: '', skin_expiry: null });
  const [challenge, setChallenge] = useState({ progress: 0, completed: false });
  const [sleepHours, setSleepHours] = useState('');
  const [mood, setMood] = useState('determined');
  const [distance, setDistance] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [timeLeft, setTimeLeft] = useState(7 * 24 * 60 * 60);

  useEffect(() => {
    const init = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        window.location.href = '/';
        return;
      }
      const { data: userData } = await supabase
        .from('users')
        .select('xp, stage, skin, username, skin_expiry')
        .eq('id', authUser.id)
        .single();
      if (userData) {
        setUser(userData);
        if (userData.skin_expiry) {
          const expiry = new Date(userData.skin_expiry).getTime();
          const now = new Date().getTime();
          setTimeLeft(Math.max(0, Math.floor((expiry - now) / 1000)));
        }
      }

      const { data: challengeData } = await supabase
        .from('challenges')
        .select('progress, completed')
        .eq('user_id', authUser.id)
        .eq('name', 'Sprint to Spry Snapper')
        .single();
      if (challengeData) {
        setChallenge(challengeData);
      } else {
        await supabase
          .from('challenges')
          .insert({ user_id: authUser.id, name: 'Sprint to Spry Snapper', goal: 5 });
      }

      const { data: leaderboardData } = await supabase
        .from('users')
        .select('username, xp')
        .order('xp', { ascending: false })
        .limit(5);
      setLeaderboard(leaderboardData || []);

      // Subscribe to auth state changes
      const { subscription } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') {
          window.location.href = '/';
        }
      });
      return () => subscription.unsubscribe();
    };
    init();

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 0) {
          supabase
            .from('users')
            .update({ skin: 'default', skin_expiry: null })
            .eq('id', user.id)
            .then(() => setUser(u => ({ ...u, skin: 'default', skin_expiry: null })));
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [user.id]);

  const turtleVariants = {
    hatchling: { d: 'M100 70 L130 90 L125 130 L100 140 L75 130 L70 90 Z', rx: 28, ry: 22, scale: 0.8 },
    snapper: { d: 'M100 60 L140 95 L135 140 L100 155 L65 140 L60 95 Z', rx: 32, ry: 26, scale: 1 },
  };

  const handleDistance = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return;
    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ distance: parseFloat(distance), userId: authUser.id }),
      });
      if (!res.ok) throw new Error('Failed to log activity');
      const updatedUser = await res.json();
      setUser({ ...user, xp: updatedUser.xp, stage: updatedUser.stage });
      const { data: challengeData } = await supabase
        .from('challenges')
        .select('progress, completed')
        .eq('user_id', authUser.id)
        .eq('name', 'Sprint to Spry Snapper')
        .single();
      setChallenge(challengeData);
      setDistance('');
    } catch (error) {
      console.error('Error logging distance:', error);
      alert('Failed to log run. Try again.');
    }
  };

  const handleWellness = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return;
    try {
      const res = await fetch('/api/wellness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sleep_hours: parseFloat(sleepHours), mood, userId: authUser.id }),
      });
      if (!res.ok) throw new Error('Failed to log wellness');
      const updatedUser = await res.json();
      if (updatedUser.xp) {
        setUser({ ...user, xp: updatedUser.xp, stage: updatedUser.stage });
      }
      setSleepHours('');
      setMood('determined');
    } catch (error) {
      console.error('Error logging wellness:', error);
      alert('Failed to log wellness. Try again.');
    }
  };

  const handleShare = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return;
    try {
      const res = await fetch('/api/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `I’m a ${user.stage}! #ToughTurtle`, userId: authUser.id }),
      });
      if (!res.ok) throw new Error('Failed to share');
      alert('Shared to feed!');
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Failed to share. Try again.');
    }
  };

  const buySkin = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return;
    try {
      alert('Purchased Glow Snapper Shell for $1.99!');
      const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      await supabase
        .from('users')
        .update({ skin: 'glow', skin_expiry: expiry })
        .eq('id', authUser.id);
      setUser({ ...user, skin: 'glow', skin_expiry: expiry });
      setTimeLeft(7 * 24 * 60 * 60);
    } catch (error) {
      console.error('Error buying skin:', error);
      alert('Failed to purchase skin. Try again.');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-emerald-900 p-4 flex flex-col items-center">
      <motion.div
        className="w-full max-w-md text-center mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-black text-white">Welcome, {user.username}!</h1>
        <button
          onClick={handleSignOut}
          className="mt-2 text-sm text-gray-400 hover:text-gray-200"
        >
          Sign Out
        </button>
      </motion.div>

      <motion.svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        className="mx-auto filter drop-shadow-lg"
        key={user.stage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ellipse cx="100" cy="185" rx="45" ry="12" fill="rgba(0,0,0,0.3)" />
        <motion.path
          d={user.stage === 'Tiny Hatchling' ? turtleVariants.hatchling.d : turtleVariants.snapper.d}
          fill={user.skin === 'glow' ? 'lime' : 'url(#toughShellGradient)'}
          stroke="rgba(0,0,0,0.2)"
          strokeWidth="2"
          variants={turtleVariants}
          initial={user.stage === 'Tiny Hatchling' ? 'hatchling' : 'snapper'}
          animate={user.stage === 'Tiny Hatchling' ? 'hatchling' : 'snapper'}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
        <motion.ellipse
          cx="100"
          cy="60"
          rx={user.stage === 'Tiny Hatchling' ? turtleVariants.hatchling.rx : turtleVariants.snapper.rx}
          ry={user.stage === 'Tiny Hatchling' ? turtleVariants.hatchling.ry : turtleVariants.snapper.ry}
          fill="url(#toughHeadGradient)"
          variants={turtleVariants}
          initial={user.stage === 'Tiny Hatchling' ? 'hatchling' : 'snapper'}
          animate={user.stage === 'Tiny Hatchling' ? 'hatchling' : 'snapper'}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
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
        </defs>
      </motion.svg>
      <p className="text-center text-xl text-gray-300 mt-2">XP: {user.xp} | Stage: {user.stage}</p>

      <div className="my-4 w-full max-w-md">
        <h2 className="text-lg font-bold text-white">FitZone 5K Challenge</h2>
        <p className="text-gray-300">Progress: {challenge.progress}/5 km</p>
        {challenge.completed && (
          <motion.svg
            width="50"
            height="50"
            viewBox="0 0 50 50"
            className="mx-auto mt-2"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <path d="M25 5 L30 20 L45 20 L35 30 L40 45 L25 35 L10 45 L15 30 L5 20 L20 20 Z" fill="gold" />
          </motion.svg>
        )}
      </div>

      <div className="my-4 w-full max-w-md">
        <h2 className="text-lg font-bold text-white">Log Run</h2>
        <input
          type="number"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          placeholder="Distance (km)"
          className="border p-2 w-full rounded bg-gray-800 text-white"
        />
        <button
          onClick={handleDistance}
          className="bg-blue-500 text-white p-2 mt-2 w-full rounded hover:bg-blue-600"
          disabled={!distance}
        >
          Log Run
        </button>
      </div>

      <div className="my-4 w-full max-w-md">
        <h2 className="text-lg font-bold text-white">Log Wellness</h2>
        <input
          type="number"
          value={sleepHours}
          onChange={(e) => setSleepHours(e.target.value)}
          placeholder="Sleep (hours)"
          className="border p-2 w-full rounded bg-gray-800 text-white"
        />
        <select
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="border p-2 w-full mt-2 rounded bg-gray-800 text-white"
        >
          <option value="determined">Determined</option>
          <option value="focused">Focused</option>
          <option value="pumped">Pumped</option>
          <option value="resilient">Resilient</option>
          <option value="beast_mode">Beast Mode</option>
        </select>
        <button
          onClick={handleWellness}
          className="bg-blue-500 text-white p-2 mt-2 w-full rounded hover:bg-blue-600"
          disabled={!sleepHours && !mood}
        >
          Log Wellness
        </button>
      </div>

      <button
        onClick={handleShare}
        className="bg-green-500 text-white p-2 w-full max-w-md rounded hover:bg-green-600"
      >
        Share Stage
      </button>

      <div className="my-4 w-full max-w-md">
        <h2 className="text-lg font-bold text-white">Shop</h2>
        <p className="text-gray-300">
          {user.skin === 'glow' ? `${Math.floor(timeLeft / 86400)} days left` : 'Get the Glow Snapper Shell!'}
        </p>
        <button
          onClick={buySkin}
          className="bg-yellow-500 text-white p-2 w-full rounded hover:bg-yellow-600"
          disabled={user.skin === 'glow'}
        >
          Buy Glow Snapper Shell ($1.99)
        </button>
      </div>

      <div className="my-4 w-full max-w-md">
        <h2 className="text-lg font-bold text-white">Leaderboard</h2>
        <ul className="text-gray-300">
          {leaderboard.map((entry, index) => (
            <li key={index} className="py-1 flex justify-between">
              <span>{entry.username}</span>
              <span>{entry.xp} XP</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}