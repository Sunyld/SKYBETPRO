import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import {
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon,
  PlayIcon,
  FireIcon
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const games = [
    { name: 'Aviator', icon: '✈️', path: '/aviator', popular: true },
    { name: 'Roleta', icon: '🎯', path: '/roulette', popular: false },
    { name: 'Crash', icon: '📈', path: '/crash', popular: true },
    { name: 'Blackjack', icon: '🃏', path: '/blackjack', popular: false },
    { name: 'Slots', icon: '🎰', path: '/slots', popular: true },
    { name: 'Dados', icon: '🎲', path: '/dice', popular: false },
    { name: 'Coinflip', icon: '🪙', path: '/coinflip', popular: false },
    { name: 'Esportes', icon: '⚽', path: '/sports', popular: true }
  ];

  const menuItems = [
    { name: 'Carteira', icon: <CurrencyDollarIcon className="w-6 h-6" />, path: '/wallet' },
    { name: 'Histórico', icon: <ClockIcon className="w-6 h-6" />, path: '/history' },
    { name: 'Estatísticas', icon: <ChartBarIcon className="w-6 h-6" />, path: '#' },
    ...(user?.isAdmin ? [{ name: 'Admin', icon: <CogIcon className="w-6 h-6" />, path: '/admin' }] : [])
  ];

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="p-6 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">SkyBet Pro</h1>
              <p className="text-gray-400">Salama, {user.name}!</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="bg-black/20 backdrop-blur-sm px-6 py-3 rounded-lg border border-green-500/30">
              <div className="text-center">
                <div className="text-green-400 font-bold text-xl">{user.balance.toLocaleString()} MZN</div>
                <div className="text-gray-400 text-sm">Saldo</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-3 text-gray-400 hover:text-white transition-colors"
              title="Sair"
            >
              <ArrowRightOnRectangleIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/20 sticky top-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">Menu</h2>
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="flex items-center space-x-3 p-3 text-gray-300 hover:text-white hover:bg-purple-500/20 rounded-lg transition-all"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Aviator Destacado */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8"
            >
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-2">🚀 Aviator</h2>
                  <p className="text-blue-100 text-lg mb-6">O jogo mais popular em Moçambique!</p>
                  <Link
                    to="/aviator"
                    className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition-all space-x-2"
                  >
                    <PlayIcon className="w-6 h-6" />
                    <span>Jogar Agora</span>
                  </Link>
                </div>
                <div className="text-right">
                  <div className="text-white/80 text-sm">Último multiplicador</div>
                  <div className="text-4xl font-bold text-white">2.47x</div>
                  <div className="text-green-400 font-semibold">+6.175 MZN</div>
                </div>
              </div>
              
              <motion.div
                className="absolute top-4 right-4 text-6xl"
                animate={{
                  rotate: [0, 10, -10, 0],
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                ✈️
              </motion.div>
            </motion.div>

            {/* Grid de Jogos */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Todos os Jogos</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {games.map((game, index) => (
                  <motion.div
                    key={game.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="relative group"
                  >
                    {game.popular && (
                      <div className="absolute -top-2 -right-2 z-20 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                        <FireIcon className="w-3 h-3" />
                        <span>Popular</span>
                      </div>
                    )}
                    
                    <Link to={game.path}>
                      <div className="bg-black/40 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all text-center group-hover:bg-black/60">
                        <div className="text-6xl mb-4">{game.icon}</div>
                        <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
                        <div className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          Clique para jogar →
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/20"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <ChartBarIcon className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">R$ 2.847</div>
                   <div className="text-2xl font-bold text-white">71.175 MZN</div>
                   <div className="text-gray-400">Total ganho hoje</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/20"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <PlayIcon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">147</div>
                    <div className="text-gray-400">Jogos hoje</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/20"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <FireIcon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">2.47x</div>
                    <div className="text-gray-400">Melhor multiplicador</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;