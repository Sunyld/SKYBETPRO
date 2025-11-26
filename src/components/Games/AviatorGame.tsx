import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useGame } from '../../contexts/GameContext';
import { 
  ArrowLeftIcon, 
  CurrencyDollarIcon,
  PlayIcon,
  PauseIcon,
  ChartBarIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon
} from '@heroicons/react/24/outline';

const AviatorGame: React.FC = () => {
  const { user, updateBalance } = useAuth();
  const { addBet } = useGame();
  
  const [betAmount, setBetAmount] = useState(25);
  const [multiplier, setMultiplier] = useState(1.00);
  const [isFlying, setIsFlying] = useState(false);
  const [gameState, setGameState] = useState<'waiting' | 'flying' | 'crashed'>('waiting');
  const [cashedOut, setCashedOut] = useState(false);
  const [cashoutMultiplier, setCashoutMultiplier] = useState(0);
  const [crashPoint, setCrashPoint] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [betPlaced, setBetPlaced] = useState(false);
  const [history, setHistory] = useState<number[]>([2.47, 1.23, 3.89, 1.45, 5.67, 1.78, 2.34, 9.63, 1.15, 4.22]);
  const [recentPlayers, setRecentPlayers] = useState([
    { name: 'João M***', avatar: '👨🏿‍💼', bet: 125, cashout: 2.34, win: 292.5 },
    { name: 'Maria S***', avatar: '👩🏿‍🎓', bet: 62.5, cashout: 1.78, win: 111.25 },
    { name: 'Pedro L***', avatar: '👨🏿‍🔧', bet: 250, cashout: 3.45, win: 862.5 },
    { name: 'Ana C***', avatar: '👩🏿‍💻', bet: 87.5, cashout: 5.67, win: 496.125 },
    { name: 'Carlos R***', avatar: '👨🏿‍🌾', bet: 175, cashout: 1.45, win: 253.75 },
  ]);

  const intervalRef = useRef<NodeJS.Timeout>();
  const gameRef = useRef<NodeJS.Timeout>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Função para criar sons
  const playSound = (frequency: number, duration: number, type: 'takeoff' | 'crash' | 'cashout' = 'takeoff') => {
    if (!soundEnabled) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      if (type === 'takeoff') {
        oscillator.frequency.setValueAtTime(200, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + duration);
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      } else if (type === 'crash') {
        oscillator.frequency.setValueAtTime(400, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + duration);
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      } else if (type === 'cashout') {
        oscillator.frequency.setValueAtTime(600, ctx.currentTime);
        oscillator.frequency.setValueAtTime(800, ctx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      }
      
      oscillator.type = 'sine';
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  useEffect(() => {
    startNewRound();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (gameRef.current) clearTimeout(gameRef.current);
    };
  }, []);

  const generateCrashPoint = () => {
    const random = Math.random();
    if (random < 0.4) return 1 + Math.random() * 1; // 1.00 - 2.00 (40%)
    if (random < 0.7) return 2 + Math.random() * 3; // 2.00 - 5.00 (30%)
    if (random < 0.9) return 5 + Math.random() * 5; // 5.00 - 10.00 (20%)
    return 10 + Math.random() * 40; // 10.00+ (10%)
  };

  const startNewRound = () => {
    setGameState('waiting');
    setIsFlying(false);
    setCashedOut(false);
    setBetPlaced(false);
    setMultiplier(1.00);
    setCashoutMultiplier(0);
    setCrashPoint(generateCrashPoint());
    
    setCountdown(7);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          startFlight();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startFlight = () => {
    setGameState('flying');
    setIsFlying(true);
    playSound(200, 2, 'takeoff');
    
    let startTime = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const newMultiplier = Math.pow(1.0024, elapsed * 100);
      
      setMultiplier(newMultiplier);
      
      if (newMultiplier >= crashPoint) {
        clearInterval(intervalRef.current!);
        crash();
        return;
      }
    }, 50);
  };

  const crash = () => {
    setGameState('crashed');
    setIsFlying(false);
    playSound(400, 1, 'crash');
    
    setHistory(prev => [crashPoint, ...prev.slice(0, 9)]);
    
    // Simula outros jogadores
    const newPlayers = recentPlayers.map(player => ({
      ...player,
      bet: Math.floor(Math.random() * 300) + 25,
      cashout: Math.random() < 0.7 ? Math.random() * (crashPoint - 1) + 1 : 0,
      win: 0
    })).map(player => ({
      ...player,
      win: player.cashout > 0 ? player.bet * player.cashout : 0
    }));
    
    setRecentPlayers(newPlayers);
    
    gameRef.current = setTimeout(() => {
      startNewRound();
    }, 4000);
  };

  const placeBet = () => {
    if (!user || gameState !== 'waiting' || betAmount > user.balance || betPlaced) return;
    
    updateBalance(-betAmount);
    setBetPlaced(true);
    
    addBet({
      game: 'Aviator',
      amount: betAmount,
      result: 'pending',
      details: { crashPoint, betPlaced: true }
    });
  };

  const cashOut = () => {
    if (!isFlying || cashedOut || !betPlaced) return;
    
    setCashedOut(true);
    setCashoutMultiplier(multiplier);
    playSound(600, 0.5, 'cashout');
    
    const winnings = betAmount * multiplier;
    updateBalance(winnings);
    
    addBet({
      game: 'Aviator',
      amount: betAmount,
      result: 'win',
      payout: winnings,
      details: { cashoutMultiplier: multiplier }
    });
  };

  // Desenhar gráfico no canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    // Limpar canvas
    ctx.clearRect(0, 0, width, height);
    
    // Gradiente de fundo
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
    gradient.addColorStop(1, 'rgba(147, 51, 234, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    if (gameState === 'flying' || gameState === 'crashed') {
      // Desenhar linha do gráfico
      const maxMultiplier = Math.max(multiplier, 2);
      const points: [number, number][] = [];
      
      for (let i = 0; i <= 100; i++) {
        const x = (i / 100) * width;
        const mult = Math.pow(1.0024, i * (multiplier / 2));
        const y = height - (mult / maxMultiplier) * height * 0.8;
        points.push([x, y]);
      }
      
      // Gradiente da linha
      const lineGradient = ctx.createLinearGradient(0, 0, width, 0);
      if (gameState === 'crashed') {
        lineGradient.addColorStop(0, '#10b981');
        lineGradient.addColorStop(0.8, '#ef4444');
        lineGradient.addColorStop(1, '#dc2626');
      } else {
        lineGradient.addColorStop(0, '#10b981');
        lineGradient.addColorStop(1, '#059669');
      }
      
      ctx.strokeStyle = lineGradient;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
      }
      ctx.stroke();
      
      // Área sob a curva
      const areaGradient = ctx.createLinearGradient(0, 0, 0, height);
      if (gameState === 'crashed') {
        areaGradient.addColorStop(0, 'rgba(239, 68, 68, 0.3)');
        areaGradient.addColorStop(1, 'rgba(239, 68, 68, 0.05)');
      } else {
        areaGradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
        areaGradient.addColorStop(1, 'rgba(16, 185, 129, 0.05)');
      }
      
      ctx.fillStyle = areaGradient;
      ctx.beginPath();
      ctx.moveTo(points[0][0], height);
      for (const point of points) {
        ctx.lineTo(point[0], point[1]);
      }
      ctx.lineTo(points[points.length - 1][0], height);
      ctx.closePath();
      ctx.fill();
    }
  }, [multiplier, gameState]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="p-6 border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="p-2 text-blue-400 hover:text-white transition-colors">
              <ArrowLeftIcon className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-bold text-white">🚀 Aviator</h1>
            <div className="text-sm text-gray-400">Moçambique</div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {soundEnabled ? (
                <SpeakerWaveIcon className="w-6 h-6" />
              ) : (
                <SpeakerXMarkIcon className="w-6 h-6" />
              )}
            </button>
            
            <div className="bg-black/20 backdrop-blur-sm px-6 py-3 rounded-lg border border-green-500/30">
              <div className="text-center">
                <div className="text-green-400 font-bold text-xl">{user?.balance.toLocaleString()} MZN</div>
                <div className="text-gray-400 text-sm">Saldo</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Game Area */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-black rounded-2xl overflow-hidden border border-blue-500/30 relative">
              {/* Game Canvas */}
              <div className="h-96 relative overflow-hidden">
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full"
                />

                {/* Multiplier Display */}
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
                  <motion.div
                    className={`text-6xl font-bold text-center ${
                      gameState === 'flying' ? 'text-green-400' : 
                      gameState === 'crashed' ? 'text-red-400' : 'text-white'
                    }`}
                    animate={isFlying ? { 
                      scale: [1, 1.05, 1],
                      textShadow: ["0 0 20px rgba(34, 197, 94, 0.5)", "0 0 30px rgba(34, 197, 94, 0.8)", "0 0 20px rgba(34, 197, 94, 0.5)"]
                    } : {}}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    {multiplier.toFixed(2)}x
                  </motion.div>
                </div>

                {/* Airplane */}
                <motion.div
                  className="absolute text-4xl"
                  initial={{ x: 50, y: 320 }}
                  animate={isFlying ? {
                    x: [50, 150, 300, 500, 700],
                    y: [320, 280, 200, 120, 50],
                    rotate: [0, -5, -10, -15, -20]
                  } : gameState === 'crashed' ? {
                    opacity: [1, 0.5, 0],
                    scale: [1, 1.2, 0.8]
                  } : { x: 50, y: 320, rotate: 0 }}
                  transition={{
                    duration: gameState === 'crashed' ? 1 : Math.max(crashPoint * 0.8, 3),
                    ease: gameState === 'crashed' ? "easeIn" : "easeOut"
                  }}
                >
                  ✈️
                </motion.div>

                {/* Waiting State */}
                <AnimatePresence>
                  {gameState === 'waiting' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center bg-black/20"
                    >
                      <div className="text-6xl font-bold text-white mb-4">{countdown}</div>
                      <div className="text-xl text-blue-300">Próximo voo em...</div>
                      <div className="text-sm text-gray-400 mt-2">Faça sua aposta agora!</div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Crash Message */}
                <AnimatePresence>
                  {gameState === 'crashed' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center bg-red-900/20"
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
                      exit={{ opacity: 0 }}
                      className="absolute top-20 right-6 bg-green-500/20 backdrop-blur-sm p-4 rounded-lg border border-green-500/30"
                    >
                      <div className="text-green-400 font-bold text-xl">
                        Retirado em {cashoutMultiplier.toFixed(2)}x!
                      </div>
                      <div className="text-white">
                        Ganho: {(betAmount * cashoutMultiplier).toFixed(0)} MZN
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Controls */}
              <div className="p-6 bg-black/40 border-t border-blue-500/30">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Valor da Aposta (MZN)</label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(Number(e.target.value))}
                        className="flex-1 p-3 bg-black/20 border border-blue-500/30 rounded-lg text-white"
                        min="25"
                        max={user?.balance || 0}
                        step="25"
                      />
                      <button
                        onClick={() => setBetAmount(prev => Math.min(prev * 2, user?.balance || 0))}
                        className="px-4 py-3 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                      >
                        2x
                      </button>
                      <button
                        onClick={() => setBetAmount(Math.floor((user?.balance || 0) / 2))}
                        className="px-4 py-3 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                      >
                        Max
                      </button>
                    </div>
                  </div>

                  <div className="flex items-end">
                    {gameState === 'waiting' ? (
                      <motion.button
                        onClick={placeBet}
                        disabled={betAmount > (user?.balance || 0) || betAmount < 25 || betPlaced}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full py-4 font-bold text-lg rounded-lg transition-all ${
                          betPlaced 
                            ? 'bg-yellow-600 text-white cursor-default' 
                            : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed'
                        }`}
                      >
                        {betPlaced ? (
                          <>
                            <PlayIcon className="w-6 h-6 inline mr-2" />
                            Aposta Feita: {betAmount} MZN
                          </>
                        ) : (
                          <>
                            <PlayIcon className="w-6 h-6 inline mr-2" />
                            Apostar {betAmount} MZN
                          </>
                        )}
                      </motion.button>
                    ) : isFlying && !cashedOut && betPlaced ? (
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
                        Retirar {(betAmount * multiplier).toFixed(0)} MZN
                      </motion.button>
                    ) : (
                      <div className="w-full py-4 bg-gray-600 text-gray-300 font-bold text-lg rounded-lg text-center">
                        {cashedOut ? `Retirado @ ${cashoutMultiplier.toFixed(2)}x` : 
                         !betPlaced ? 'Faça sua aposta primeiro' : 'Aguarde próxima rodada...'}
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
            <div className="bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-blue-500/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <ChartBarIcon className="w-6 h-6" />
                <span>Histórico</span>
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {history.map((crash, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-3 rounded-lg text-center font-bold ${
                      crash >= 10 ? 'bg-purple-500/20 text-purple-400' :
                      crash >= 5 ? 'bg-blue-500/20 text-blue-400' :
                      crash >= 2 ? 'bg-green-500/20 text-green-400' : 
                      crash >= 1.5 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {crash.toFixed(2)}x
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recent Players */}
            <div className="bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-blue-500/20">
              <h3 className="text-xl font-bold text-white mb-4">Jogadores Recentes</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {recentPlayers.map((player, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex justify-between items-center p-3 bg-black/10 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{player.avatar}</div>
                      <div>
                        <div className="text-white font-semibold text-sm">{player.name}</div>
                        <div className="text-gray-400 text-xs">{player.bet} MZN</div>
                      </div>
                    </div>
                    <div className="text-right">
                      {player.cashout > 0 ? (
                        <>
                          <div className="text-green-400 font-bold text-sm">{player.cashout.toFixed(2)}x</div>
                          <div className="text-white text-xs">{player.win.toFixed(0)} MZN</div>
                        </>
                      ) : (
                        <div className="text-red-400 font-bold text-sm">Perdeu</div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Bet Buttons */}
            <div className="bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-blue-500/20">
              <h3 className="text-xl font-bold text-white mb-4">Apostas Rápidas</h3>
              <div className="grid grid-cols-2 gap-3">
                {[25, 50, 125, 250].map(amount => (
                  <motion.button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors font-semibold"
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

export default AviatorGame;