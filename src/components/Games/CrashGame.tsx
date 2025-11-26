import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useGame } from '../../contexts/GameContext';
import { ArrowLeftIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/outline';

const CrashGame: React.FC = () => {
  const { user, updateBalance } = useAuth();
  const { addBet } = useGame();
  
  const [betAmount, setBetAmount] = useState(10);
  const [multiplier, setMultiplier] = useState(1.00);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'crashed'>('waiting');
  const [cashedOut, setCashedOut] = useState(false);
  const [cashoutMultiplier, setCashoutMultiplier] = useState(0);
  const [crashPoint, setCrashPoint] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [history, setHistory] = useState<number[]>([1.23, 3.45, 2.67, 1.89, 4.12, 1.45, 2.98]);
  const [chartData, setChartData] = useState<{ x: number; y: number }[]>([]);

  const intervalRef = useRef<NodeJS.Timeout>();
  const gameRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    startNewRound();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (gameRef.current) clearTimeout(gameRef.current);
    };
  }, []);

  const generateCrashPoint = () => {
    // Algoritmo para gerar ponto de crash
    const random = Math.random();
    if (random < 0.4) return 1 + Math.random() * 1; // 1.00 - 2.00 (40%)
    if (random < 0.7) return 2 + Math.random() * 3; // 2.00 - 5.00 (30%)
    if (random < 0.9) return 5 + Math.random() * 10; // 5.00 - 15.00 (20%)
    return 15 + Math.random() * 85; // 15.00+ (10%)
  };

  const startNewRound = () => {
    setGameState('waiting');
    setIsPlaying(false);
    setCashedOut(false);
    setMultiplier(1.00);
    setCashoutMultiplier(0);
    setCrashPoint(generateCrashPoint());
    setChartData([{ x: 0, y: 1 }]);
    
    // Countdown
    setCountdown(5);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          startGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startGame = () => {
    setGameState('playing');
    setIsPlaying(true);
    
    let time = 0;
    intervalRef.current = setInterval(() => {
      time += 0.1;
      const newMultiplier = 1 + (Math.pow(1.05, time) - 1);
      
      setMultiplier(newMultiplier);
      setChartData(prev => [...prev, { x: time, y: newMultiplier }]);
      
      if (newMultiplier >= crashPoint) {
        clearInterval(intervalRef.current!);
        crash();
        return;
      }
    }, 100);
  };

  const crash = () => {
    setGameState('crashed');
    setIsPlaying(false);
    
    setHistory(prev => [crashPoint, ...prev.slice(0, 6)]);
    
    gameRef.current = setTimeout(() => {
      startNewRound();
    }, 3000);
  };

  const placeBet = () => {
    if (!user || gameState !== 'waiting' || betAmount > user.balance) return;
    
    updateBalance(-betAmount);
    
    addBet({
      game: 'Crash',
      amount: betAmount,
      result: 'pending'
    });
  };

  const cashOut = () => {
    if (!isPlaying || cashedOut) return;
    
    setCashedOut(true);
    setCashoutMultiplier(multiplier);
    
    const winnings = betAmount * multiplier;
    updateBalance(winnings);
    
    addBet({
      game: 'Crash',
      amount: betAmount,
      result: 'win',
      payout: winnings,
      details: { cashoutMultiplier: multiplier }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900">
      {/* Header */}
      <header className="p-6 border-b border-orange-500/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="p-2 text-orange-400 hover:text-white transition-colors">
              <ArrowLeftIcon className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-bold text-white">📈 Crash</h1>
          </div>
          
          <div className="bg-black/20 backdrop-blur-sm px-6 py-3 rounded-lg border border-green-500/30">
            <div className="text-center">
              <div className="text-green-400 font-bold text-xl">{user?.balance.toLocaleString()} MZN</div>
              <div className="text-gray-400 text-sm">Saldo</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Game Area */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 rounded-2xl overflow-hidden border border-orange-500/30 relative">
              <div className="h-96 p-6 relative">
                {/* Chart Background */}
                <svg className="absolute inset-6 w-full h-full" viewBox="0 0 400 300">
                  {/* Grid */}
                  <defs>
                    <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#ffffff20" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  
                  {/* Chart Line */}
                  {chartData.length > 1 && (
                    <motion.path
                      d={`M ${chartData.map((point, index) => 
                        `${(point.x / Math.max(...chartData.map(p => p.x))) * 380 + 10},${300 - (Math.log(point.y) / Math.log(Math.max(...chartData.map(p => p.y)))) * 280 - 10}`
                      ).join(' L ')}`}
                      fill="none"
                      stroke={gameState === 'crashed' ? '#ef4444' : '#10b981'}
                      strokeWidth="3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.1 }}
                    />
                  )}
                </svg>

                {/* Game State Overlays */}
                <AnimatePresence>
                  {gameState === 'waiting' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex flex-col items-center justify-center"
                    >
                      <div className="text-6xl font-bold text-white mb-4">{countdown}</div>
                      <div className="text-xl text-orange-300">Próximo crash em...</div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Multiplier Display */}
                <div className="absolute top-6 left-6">
                  <motion.div
                    className={`text-6xl font-bold ${
                      gameState === 'playing' ? 'text-green-400' : 
                      gameState === 'crashed' ? 'text-red-400' : 'text-white'
                    }`}
                    animate={isPlaying ? { 
                      scale: [1, 1.05, 1],
                    } : {}}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    {multiplier.toFixed(2)}x
                  </motion.div>
                </div>

                {/* Crash Message */}
                <AnimatePresence>
                  {gameState === 'crashed' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="text-center">
                        <div className="text-6xl font-bold text-red-500 mb-4">CRASHED!</div>
                        <div className="text-3xl text-red-400">@ {crashPoint.toFixed(2)}x</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Cashout Success */}
                <AnimatePresence>
                  {cashedOut && (
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-20 right-6 bg-green-500/20 backdrop-blur-sm p-4 rounded-lg border border-green-500/30"
                    >
                      <div className="text-green-400 font-bold text-xl">
                        Você saiu em {cashoutMultiplier.toFixed(2)}x!
                      </div>
                      <div className="text-white">
                        Ganho: {(betAmount * cashoutMultiplier).toFixed(0)} MZN
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Controls */}
              <div className="p-6 bg-black/20 border-t border-orange-500/30">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Valor da Aposta (MZN)</label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(Number(e.target.value))}
                        className="flex-1 p-3 bg-black/20 border border-orange-500/30 rounded-lg text-white"
                        min="25"
                        max={user?.balance || 0}
                        step="25"
                      />
                      <button
                        onClick={() => setBetAmount(prev => Math.min(prev * 2, user?.balance || 0))}
                        className="px-4 py-3 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors"
                      >
                        2x
                      </button>
                      <button
                        onClick={() => setBetAmount(Math.floor((user?.balance || 0) / 2))}
                        className="px-4 py-3 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors"
                      >
                        Max
                      </button>
                    </div>
                  </div>

                  <div className="flex items-end">
                    {gameState === 'waiting' ? (
                      <motion.button
                        onClick={placeBet}
                        disabled={betAmount > (user?.balance || 0) || betAmount < 25}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <PlayIcon className="w-6 h-6 inline mr-2" />
                        Apostar {betAmount} MZN
                      </motion.button>
                    ) : isPlaying && !cashedOut ? (
                      <motion.button
                        onClick={cashOut}
                        animate={{ 
                          backgroundColor: ["#10b981", "#059669", "#10b981"],
                          boxShadow: ["0 0 10px rgba(16, 185, 129, 0.5)", "0 0 20px rgba(16, 185, 129, 0.8)", "0 0 10px rgba(16, 185, 129, 0.5)"]
                        }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="w-full py-4 bg-green-500 text-white font-bold text-lg rounded-lg hover:bg-green-600 transition-all"
                      >
                        <PauseIcon className="w-6 h-6 inline mr-2" />
                        Sacar @ {multiplier.toFixed(2)}x
                      </motion.button>
                    ) : (
                      <div className="w-full py-4 bg-gray-600 text-gray-300 font-bold text-lg rounded-lg text-center">
                        {cashedOut ? `Sacou @ ${cashoutMultiplier.toFixed(2)}x` : 'Aguarde próxima rodada...'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* History */}
            <div className="bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-orange-500/20">
              <h3 className="text-xl font-bold text-white mb-4">Histórico</h3>
              <div className="space-y-2">
                {history.map((crash, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-3 rounded-lg text-center font-bold ${
                      crash >= 2 ? 'bg-green-500/20 text-green-400' : 
                      crash >= 1.5 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {crash.toFixed(2)}x
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-orange-500/20">
              <h3 className="text-xl font-bold text-white mb-4">Estatísticas</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Média dos crashes:</span>
                  <span className="text-white font-bold">
                    {(history.reduce((a, b) => a + b, 0) / history.length).toFixed(2)}x
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Maior crash:</span>
                  <span className="text-green-400 font-bold">{Math.max(...history).toFixed(2)}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Menor crash:</span>
                  <span className="text-red-400 font-bold">{Math.min(...history).toFixed(2)}x</span>
                </div>
              </div>
            </div>

            {/* Quick Bet Buttons */}
            <div className="bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-orange-500/20">
              <h3 className="text-xl font-bold text-white mb-4">Apostas Rápidas</h3>
              <div className="grid grid-cols-2 gap-3">
                {[25, 50, 125, 250].map(amount => (
                  <motion.button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors font-semibold"
                  >
                    {amount} MZN
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrashGame;