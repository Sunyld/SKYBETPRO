import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Bet {
  id: string;
  game: string;
  amount: number;
  result: 'win' | 'loss' | 'pending';
  payout?: number;
  timestamp: Date;
  details?: any;
}

interface GameContextType {
  bets: Bet[];
  addBet: (bet: Omit<Bet, 'id' | 'timestamp'>) => void;
  updateBet: (id: string, updates: Partial<Bet>) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bets, setBets] = useState<Bet[]>([]);

  const addBet = (betData: Omit<Bet, 'id' | 'timestamp'>) => {
    const newBet: Bet = {
      ...betData,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setBets(prev => [newBet, ...prev]);
  };

  const updateBet = (id: string, updates: Partial<Bet>) => {
    setBets(prev => prev.map(bet => 
      bet.id === id ? { ...bet, ...updates } : bet
    ));
  };

  return (
    <GameContext.Provider value={{ bets, addBet, updateBet }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};