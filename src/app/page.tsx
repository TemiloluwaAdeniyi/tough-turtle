"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe with your publishable key (store in .env)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SubscriptionForm: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [plan, setPlan] = useState<'monthly' | 'annual'>('monthly');
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      // Create payment method
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) return;

      const { paymentMethod, error: paymentError } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: { email },
      });

      if (paymentError) {
        setError(paymentError.message || 'Payment failed');
        setProcessing(false);
        return;
      }

      // Call your backend to create subscription
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethodId: paymentMethod?.id,
          email,
          plan,
        }),
      });

      const { clientSecret, subscriptionId } = await response.json();

      if (!response.ok) {
        setError('Failed to create subscription');
        setProcessing(false);
        return;
      }

      // Confirm the payment
      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret);

      if (confirmError) {
        setError(confirmError.message || 'Payment confirmation failed');
        setProcessing(false);
        return;
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-2xl p-8 max-w-md w-full mx-4"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Join Tough Turtle</h2>
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setPlan('monthly')}
                className={`flex-1 py-3 rounded-lg ${plan === 'monthly' ? 'bg-emerald-600' : 'bg-gray-700'} text-white font-semibold`}
              >
                Monthly ($9.99)
              </button>
              <button
                onClick={() => setPlan('annual')}
                className={`flex-1 py-3 rounded-lg ${plan === 'annual' ? 'bg-emerald-600' : 'bg-gray-700'} text-white font-semibold`}
              >
                Annual ($99.99)
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full p-3 rounded-lg bg-gray-800 text-white mb-4"
                required
              />
              <CardElement
                options={{
                  style: {
                    base: {
                      color: '#fff',
                      fontSize: '16px',
                      '::placeholder': { color: '#aab7c4' },
                    },
                    invalid: { color: '#ef4444' },
                  },
                }}
                className="p-3 bg-gray-800 rounded-lg mb-4"
              />
              {error && <p className="text-red-400 mb-4">{error}</p>}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 bg-gray-700 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing || !stripe || !elements}
                  className="flex-1 py-3 bg-emerald-600 text-white rounded-lg disabled:opacity-50"
                >
                  {processing ? 'Processing...' : 'Subscribe'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function Home() {
  const [isBlinking, setIsBlinking] = useState(false);
  const [mood, setMood] = useState('determined');
  const [showSubscription, setShowSubscription] = useState(false);

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

  const handleButtonClick = () => {
    setShowSubscription(true);
  };

  const handleSubscriptionSuccess = () => {
    window.location.href = '/dashboard';
  };

  const features = [
    { icon: '🧠', title: 'Track Progress', desc: 'Monitor habits in real life' },
    { icon: '🐢', title: 'Train Your Turtle', desc: 'Hatchling to Titan evolution' },
    { icon: '🎯', title: 'Micro-Challenges', desc: 'Clean dopamine hits' },
    { icon: '🥇', title: 'Battle Rivals', desc: 'Real-time fitness duels' },
    { icon: '🔥', title: 'Quest-Like Routines', desc: 'Not chores, adventures' },
  ];

  const principles = [
    { icon: '🎯', text: 'Win battles, not validation' },
    { icon: '🐢', text: 'Evolve a turtle, not an online persona' },
    { icon: '🧱', text: 'Stack skills, not social metrics' },
    { icon: '⚡', text: 'Dopamine from consistency—not chaos' },
  ];

  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white relative overflow-hidden">
        {/* Modern floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 p-4 text-center flex flex-col items-center justify-center min-h-screen">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-black text-gradient mb-2 tracking-tight">
              🐢 TOUGH TURTLE
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-semibold tracking-wide">
              Train Your Turtle. Transform Your Life.
            </p>
          </motion.div>

          <motion.div
            className="relative mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {/* Turtle SVG (unchanged) */}
            <motion.svg
              width="220"
              height="220"
              viewBox="0 0 220 220"
              className="mx-auto filter drop-shadow-2xl"
              animate={{
                y: [0, -8, 0],
                rotate: [0, 1, -1, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <ellipse cx="110" cy="200" rx="45" ry="12" fill="rgba(0,0,0,0.3)" />
              <motion.circle
                cx="110"
                cy="110"
                r="42"
                fill="url(#squirtleShellGradient)"
                stroke="rgba(59, 130, 246, 0.8)"
                strokeWidth="2"
                animate={{
                  scale: mood === 'beast_mode' ? [1, 1.05, 1] : 1,
                }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
              <circle cx="110" cy="90" r="12" fill="rgba(255,255,255,0.4)" stroke="#3b82f6" strokeWidth="2" />
              <circle cx="95" cy="110" r="10" fill="rgba(255,255,255,0.3)" stroke="#3b82f6" strokeWidth="1.5" />
              <circle cx="125" cy="110" r="10" fill="rgba(255,255,255,0.3)" stroke="#3b82f6" strokeWidth="1.5" />
              <circle cx="95" cy="130" r="8" fill="rgba(255,255,255,0.25)" stroke="#3b82f6" strokeWidth="1" />
              <circle cx="125" cy="130" r="8" fill="rgba(255,255,255,0.25)" stroke="#3b82f6" strokeWidth="1" />
              <circle cx="110" cy="135" r="6" fill="rgba(255,255,255,0.2)" stroke="#3b82f6" strokeWidth="1" />
              <motion.ellipse
                cx="110"
                cy="60"
                rx="38"
                ry="35"
                fill="url(#squirtleHeadGradient)"
                animate={{
                  scaleX: mood === 'focused' ? [1, 1.03, 1] : 1,
                  scaleY: mood === 'determined' ? [1, 0.98, 1] : 1,
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <path d="M85 42 Q95 38 105 42" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="2" fill="none" />
              <path d="M115 42 Q125 38 135 42" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="2" fill="none" />
              <motion.ellipse
                cx="95"
                cy="55"
                rx="18"
                ry="16"
                fill="white"
                stroke="rgba(59, 130, 246, 0.3)"
                strokeWidth="1.5"
                animate={{
                  scaleY: isBlinking ? 0.1 : 1,
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
                  scaleY: isBlinking ? 0.1 : 1,
                }}
                transition={{ duration: 0.1 }}
              />
              <circle cx="95" cy="55" r="8" fill="#1e40af" />
              <circle cx="125" cy="55" r="8" fill="#1e40af" />
              <circle cx="95" cy="55" r="5" fill="black" />
              <circle cx="125" cy="55" r="5" fill="black" />
              <ellipse cx="97" cy="51" rx="4" ry="3" fill="rgba(255,255,255,0.9)" />
              <ellipse cx="127" cy="51" rx="4" ry="3" fill="rgba(255,255,255,0.9)" />
              <ellipse cx="99" cy="53" rx="2" ry="1.5" fill="rgba(255,255,255,0.7)" />
              <ellipse cx="129" cy="53" rx="2" ry="1.5" fill="rgba(255,255,255,0.7)" />
              <ellipse cx="106" cy="73" rx="1.5" ry="2" fill="rgba(0,0,0,0.6)" />
              <ellipse cx="114" cy="73" rx="1.5" ry="2" fill="rgba(0,0,0,0.6)" />
              <motion.path
                d={
                  mood === 'determined'
                    ? 'M100 82 L120 82'
                    : mood === 'focused'
                    ? 'M102 82 Q110 80 118 82'
                    : mood === 'pumped'
                    ? 'M100 80 Q110 86 120 80'
                    : mood === 'beast_mode'
                    ? 'M98 81 Q110 89 122 81'
                    : 'M102 83 Q110 81 118 83'
                }
                stroke="rgba(0,0,0,0.8)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
              <motion.ellipse
                cx="70"
                cy="95"
                rx="22"
                ry="16"
                fill="url(#squirtleMuscleGradient)"
                animate={{
                  scaleX: mood === 'beast_mode' ? [1, 1.25, 1] : [1, 1.08, 1],
                  scaleY: mood === 'pumped' ? [1, 1.15, 1] : 1,
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
                  scaleY: mood === 'pumped' ? [1, 1.15, 1] : 1,
                }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <motion.ellipse
                cx="68"
                cy="118"
                rx="18"
                ry="13"
                fill="url(#squirtleMuscleGradient)"
                animate={{
                  rotate: mood === 'pumped' ? [0, 8, -8, 0] : [0, 2, -2, 0],
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
                  rotate: mood === 'pumped' ? [0, -8, 8, 0] : [0, -2, 2, 0],
                }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <motion.ellipse
                cx="88"
                cy="155"
                rx="20"
                ry="22"
                fill="url(#squirtleMuscleGradient)"
                animate={{
                  scaleX: mood === 'beast_mode' ? [1, 1.2, 1] : 1,
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
                  scaleX: mood === 'beast_mode' ? [1, 1.2, 1] : 1,
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <ellipse cx="82" cy="180" rx="16" ry="10" fill="url(#squirtleMuscleGradient)" />
              <ellipse cx="138" cy="180" rx="16" ry="10" fill="url(#squirtleMuscleGradient)" />
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
            onClick={handleButtonClick}
            className="btn-modern bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-black py-6 px-12 rounded-2xl text-xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-orange-500/25 border border-orange-400/50 mb-16 glass-strong"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            💥 START YOUR JOURNEY
          </motion.button>
        </div>

        <motion.section
          className="px-4 py-16 max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="card-modern glass-strong rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl font-black mb-6 text-gradient-warm">
              💥 FORGE A MINDSET. BUILD A BODY. LEVEL UP YOUR SHELL.
            </h2>
            <p className="text-lg text-gray-200 leading-relaxed mb-6">
              This isn&apos;t just another fitness app. It&apos;s your arena for growth, challenge, and evolution. Every habit strengthens your digital warrior—and your real-world self.
            </p>
            <div className="glass rounded-2xl p-6 border-l-4 border-orange-500">
              <p className="text-gray-300 italic text-lg leading-relaxed">
                &quot;You are in danger of living a life so comfortable and soft, that you will die without ever realizing your true potential.&quot;
              </p>
              <p className="text-orange-400 font-bold mt-2">— David Goggins</p>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="px-4 py-16 max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-black text-center mb-12 text-gradient">
            💪 NURTURE YOUR INNER BEAST
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="card-modern glass rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-300 group hover:scale-105 hover:shadow-emerald-500/10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-emerald-400 mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="px-4 py-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="card-modern glass-strong rounded-3xl p-8 shadow-2xl border-purple-500/20">
            <h2 className="text-4xl font-black text-center mb-8 text-gradient">
              🧠 DOING DOPAMINE DIFFERENTLY
            </h2>
            <p className="text-lg text-gray-200 text-center mb-8 leading-relaxed">
              Not addicted. <span className="text-emerald-400 font-bold">Activated</span>. We&apos;ve replaced infinite scrolls and mindless likes with mission-based dopamine that rewards movement, resilience, and real progress.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {principles.map((principle, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3 glass rounded-xl p-4 border border-purple-500/30"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <span className="text-2xl">{principle.icon}</span>
                  <span className="text-gray-200 font-medium">{principle.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          className="px-4 py-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="card-modern glass-strong rounded-3xl p-8 shadow-2xl border-red-500/20 text-center">
            <h2 className="text-4xl font-black mb-6 text-gradient-warm">
              ⚔️ OUTLAST. OUTLIFT. OUTLEVEL.
            </h2>
            <p className="text-lg text-gray-200 mb-6 leading-relaxed">
              It&apos;s not social media. It&apos;s <span className="text-red-400 font-bold">social stamina</span>. Cheer on rivals. Hype your squad. Unlock badge-worthy habits. Fuel real connection through competition, grit, and growth—not likes.
            </p>
            <div className="glass rounded-2xl p-6 inline-block">
              <p className="text-xl font-bold text-orange-400">
                Tough Turtle isn&apos;t about vanity metrics.<br />
                It&apos;s about becoming <span className="text-red-400">unbreakable</span>, one rep at a time.
              </p>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="px-4 py-20 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black mb-8 text-gradient">
              🚀 START YOUR SHELLQUEST
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
              Challenge your body. Train your turtle. Track your triumphs.<br />
              <span className="text-emerald-400 font-bold">Become the legend.</span>
            </p>
            <motion.button
              onClick={handleButtonClick}
              className="btn-modern bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-black py-4 px-8 md:py-6 md:px-12 rounded-2xl text-lg md:text-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/25 border border-emerald-400/50 glass-strong"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🐢 BEGIN EVOLUTION
            </motion.button>
          </div>
        </motion.section>

        <SubscriptionForm
          isOpen={showSubscription}
          onClose={() => setShowSubscription(false)}
          onSuccess={handleSubscriptionSuccess}
        />
      </div>
    </Elements>
  );
}