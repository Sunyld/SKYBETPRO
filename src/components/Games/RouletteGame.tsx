import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useGame } from '../../contexts/GameContext';
import { ArrowLeftIcon, PlayIcon } from '@heroicons/react/24/outline';

const RouletteGame: React.FC = () => {
  const { user, updateBalance } = useAuth();
  const { addBet } = useGame();
  
  const [betAmount, setBetAmount] = useState(10);
  const [selectedBets, setSelectedBets] = useState<{ type: string; value: any; amount: number }[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);

  const rouletteRef = useRef<HTMLDivElement>(null);

  // Números da roleta (0-36)
  const rouletteNumbers = [
    { number: 0, color: 'green' },
    { number: 32, color: 'red' }, { number: 15, color: 'black' }, { number: 19, color: 'red' },
    { number: 4, color: 'black' }, { number: 21, color: 'red' }, { number: 2, color: 'black' },
    { number: 25, color: 'red' }, { number: 17, color: 'black' }, { number: 34, color: 'red' },
    { number: 6, color: 'black' }, { number: 27, color: 'red' }, { number: 13, color: 'black' },
    { number: 36, color: 'red' }, { number: 11, color: 'black' }, { number: 30, color: 'red' },
    { number: 8, color: 'black' }, { number: 23, color: 'red' }, { number: 10, color: 'black' },
    { number: 5, color: 'red' }, { number: 24, color: 'black' }, { number: 16, color: 'red' },
    { number: 33, color: 'black' }, { number: 1, color: 'red' }, { number: 20, color: 'black' },
    { number: 14, color: 'red' }, { number: 31, color: 'black' }, { number: 9, color: 'red' },
    { number: 22, color: 'black' }, { number: 18, color: 'red' }, { number: 29, color: 'black' },
    { number: 7, color: 'red' }, { number: 28, color: 'black' }, { number: 12, color: 'red' },
    { number: 35, color: 'black' }, { number: 3, color: 'red' }, { number: 26, color: 'black' }
  ];

  const addToBet = (type: string, value: any) => {
    if (!user || betAmount > user.balance) return;
    
    setSelectedBets(prev => {
      const existing = prev.find(bet => bet.type === type && bet.value === value);
      if (existing) {
        return prev.map(bet => 
          bet.type === type && bet.value === value 
            ? { ...bet, amount: bet.amount + betAmount }
            : bet
        );
      }
      return [...prev, { type, value, amount: betAmount }];
    });
  };

  const clearBets = () => {
    setSelectedBets([]);
  };

  const getTotalBetAmount = () => {
    return selectedBets.reduce((total, bet) => total + bet.amount, 0);
  };

  const spin = () => {
    if (!user || selectedBets.length === 0 || getTotalBetAmount() > user.balance) return;
    
    setIsSpinning(true);
    
    // Deduz o valor total apostado
    updateBalance(-getTotalBetAmount());
    
    // Gera número aleatório
    const winningNumber = Math.floor(Math.random() * 37);
    const winningSlot = rouletteNumbers.find(slot => slot.number === winningNumber)!;
    
    // Calcula rotação
    const numberIndex = rouletteNumbers.findIndex(slot => slot.number === winningNumber);
    const anglePerSlot = 360 / rouletteNumbers.length;
    const targetAngle = numberIndex * anglePerSlot;
    const spins = 5; // Número de voltas completas
    const finalRotation = rotation + (spins * 360) + (360 - targetAngle);
    
    setRotation(finalRotation);
    setResult(winningNumber);
    
    setTimeout(() => {
      // Calcula ganhos
      let totalWinnings = 0;
      
      selectedBets.forEach(bet => {
        let won = false;
        let multiplier = 0;
        
        switch (bet.type) {
          case 'number':
            if (bet.value === winningNumber) {
              won = true;
              multiplier = 35;
            }
            break;
          case 'red':
            if (winningSlot.color === 'red' && winningNumber !== 0) {
              won = true;
              multiplier = 1;
            }
            break;
          case 'black':
            if (winningSlot.color === 'black' && winningNumber !== 0) {
              won = true;
              multiplier = 1;
            }
            break;
          case 'even':
            if (winningNumber > 0 && winningNumber % 2 === 0) {
              won = true;
              multiplier = 1;
            }
            break;
          case 'odd':
            if (winningNumber > 0 && winningNumber % 2 === 1) {
              won = true;
              multiplier = 1;
            }
            break;
          case '1-18':
            if (winningNumber >= 1 && winningNumber <= 18) {
              won = true;
              multiplier = 1;
            }
            break;
          case '19-36':
            if (winningNumber >= 19 && winningNumber <= 36) {
              won = true;
              multiplier = 1;
            }
            break;
        }
        
        if (won) {
          totalWinnings += bet.amount * (multiplier + 1);
        }
        
        addBet({
          game: 'Roleta',
          amount: bet.amount,
          result: won ? 'win' : 'loss',
          payout: won ? bet.amount * (multiplier + 1) : 0,
          details: { bet: bet.type, value: bet.value, winningNumber }
        });
      });
      
      if (totalWinnings > 0) {
        updateBalance(totalWinnings);
      }
      
      setIsSpinning(false);
      setSelectedBets([]);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
      {/* Header */}
      <header className="p-6 border-b border-red-500/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="p-2 text-red-400 hover:text-white transition-colors">
              <ArrowLeftIcon className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-bold text-white">🎯 Roleta</h1>
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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Roulette Wheel */}
          <div className="lg:col-span-2">
            <div className="bg-black/40 backdrop-blur-sm p-8 rounded-2xl border border-red-500/20 text-center">
              <div className="relative w-80 h-80 mx-auto mb-8">
                <div className="absolute inset-4 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-full flex items-center justify-center">
                  <motion.div
                    ref={rouletteRef}
                    className="w-72 h-72 rounded-full relative overflow-hidden border-4 border-yellow-400"
                    animate={{ rotate: rotation }}
                    transition={{ duration: 4, ease: "easeOut" }}
                    style={{
                      background: `conic-gradient(${rouletteNumbers.map((slot, index) => {
                        const angle1 = (index / rouletteNumbers.length) * 360;
                        const angle2 = ((index + 1) / rouletteNumbers.length) * 360;
                        const color = slot.color === 'red' ? '#ef4444' : 
                                    slot.color === 'black' ? '#1f2937' : '#10b981';
                        return `${color} ${angle1}deg ${angle2}deg`;
                      }).join(', ')})`
                    }}
                  >
                    {rouletteNumbers.map((slot, index) => {
                      const angle = (index / rouletteNumbers.length) * 360;
                      return (
                        <div
                          key={index}
                          className="absolute text-white font-bold text-sm"
                          style={{
                            transform: `rotate(${angle}deg) translateY(-130px)`,
                            transformOrigin: 'center 144px',
                          }}
                        >
                          <div style={{ transform: `rotate(${-angle}deg)` }}>
                            {slot.number}
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                  
                  {/* Pointer */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[15px] border-r-[15px] border-b-[30px] border-l-transparent border-r-transparent border-b-yellow-400 z-10"></div>
                </div>
              </div>

              {result !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6"
                >
                  <div className="text-4xl font-bold text-white mb-2">
                    Número vencedor: {result}
                  </div>
                  <div className={`text-2xl font-semibold ${
                    rouletteNumbers.find(n => n.number === result)?.color === 'red' ? 'text-red-400' :
                    rouletteNumbers.find(n => n.number === result)?.color === 'black' ? 'text-gray-300' :
                    'text-green-400'
                  }`}>
                    {rouletteNumbers.find(n => n.number === result)?.color.toUpperCase()}
                  </div>
                </motion.div>
              )}

              <div className="flex justify-center space-x-4">
                <button
                  onClick={clearBets}
                  disabled={selectedBets.length === 0}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Limpar Apostas
                </button>
                <motion.button
                  onClick={spin}
                  disabled={isSpinning || selectedBets.length === 0 || getTotalBetAmount() > (user?.balance || 0)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold rounded-lg hover:from-red-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <PlayIcon className="w-5 h-5 inline mr-2" />
                  {isSpinning ? 'Girando...' : `Girar (${getTotalBetAmount()} MZN)`}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Betting Area */}
          <div className="space-y-6">
            <div className="bg-black/40 backdrop-blur-sm p-6 rounded-2xl border border-red-500/20">
              <h3 className="text-xl font-bold text-white mb-4">Valor da Aposta (MZN)</h3>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                className="w-full p-3 bg-black/20 border border-red-500/30 rounded-lg text-white"
                min="1"
                max={user?.balance || 0}
              />
              <div className="flex space-x-2 mt-3">
                {[25, 50, 125, 250].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    className="px-3 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                  >
                    {amount} MZN
                  </button>
                ))}
              </div>
            </div>

            {/* Betting Options */}
            <div className="bg-black/40 backdrop-blur-sm p-6 rounded-2xl border border-red-500/20">
              <h3 className="text-xl font-bold text-white mb-4">Opções de Aposta</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-semibold mb-2">Cores</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => addToBet('red', 'red')}
                      className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Vermelho (2x)
                    </button>
                    <button
                      onClick={() => addToBet('black', 'black')}
                      className="p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Preto (2x)
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">Par/Ímpar</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => addToBet('even', 'even')}
                      className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Par (2x)
                    </button>
                    <button
                      onClick={() => addToBet('odd', 'odd')}
                      className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Ímpar (2x)
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">Faixas</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => addToBet('1-18', '1-18')}
                      className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      1-18 (2x)
                    </button>
                    <button
                      onClick={() => addToBet('19-36', '19-36')}
                      className="p-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      19-36 (2x)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Bets */}
            {selectedBets.length > 0 && (
              <div className="bg-black/40 backdrop-blur-sm p-6 rounded-2xl border border-red-500/20">
                <h3 className="text-xl font-bold text-white mb-4">Suas Apostas</h3>
                <div className="space-y-2">
                  {selectedBets.map((bet, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                      <span className="text-white">{bet.type}: {bet.value}</span>
                      <span className="text-green-400 font-bold">{bet.amount} MZN</span>
                    </div>
                  ))}
                  <div className="border-t border-red-500/30 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold">Total:</span>
                      <span className="text-green-400 font-bold text-xl">{getTotalBetAmount()} MZN</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouletteGame;