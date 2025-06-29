import { motion } from 'framer-motion';

export default function Home() {
  const handleLogin = () => {
    localStorage.setItem('userId', '1');
    window.location.href = '/dashboard';
  };

  return (
    <div className="p-4 text-center">
      <h1 className="text-3xl font-bold">Tough Turtle</h1>
      <motion.svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        className="mx-auto mt-4"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
      >
        <circle cx="50" cy="60" r="30" fill="green" />
        <path d="M50 30 C60 10 40 10 50 30" fill="darkgreen" />
      </motion.svg>
      <button onClick={handleLogin} className="bg-blue-500 text-white p-2 mt-4 rounded">Start Your Journey</button>
    </div>
  );
}