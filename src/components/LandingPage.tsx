import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  PlayIcon, 
  UserPlusIcon, 
  ArrowRightIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  FireIcon
} from '@heroicons/react/24/outline';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
              style={{
                width: Math.random() * 300 + 50,
                height: Math.random() * 300 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">SkyBet Pro</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-x-4"
          >
            <Link
              to="/login"
              className="px-6 py-2 text-white border border-purple-500 rounded-lg hover:bg-purple-500 transition-all duration-300"
            >
              Entrar
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              Registrar
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              A Melhor Casa de Apostas de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Moçambique
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              A plataforma de apostas mais confiável de Moçambique. Jogue Aviator, 
              cassino ao vivo, apostas no futebol moçambicano e muito mais!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <UserPlusIcon className="w-6 h-6" />
                <span>Começar Agora</span>
              </Link>
              <Link
                to="/aviator"
                className="px-8 py-4 border-2 border-purple-500 text-purple-400 rounded-xl font-semibold text-lg hover:bg-purple-500 hover:text-white transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <PlayIcon className="w-6 h-6" />
                <span>Jogar Demo</span>
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50K+</div>
                <div className="text-gray-400">Jogadores</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">500M+ MZN</div>
                <div className="text-gray-400">Pagos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-gray-400">Suporte</div>
              </div>
            </div>
          </motion.div>

          {/* Aviator Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            <div className="relative w-full h-96 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 rounded-2xl overflow-hidden border border-purple-500">
              <motion.div
                className="absolute bottom-4 left-4 text-6xl"
                animate={{
                  x: [0, 300, 350, 300, 0],
                  y: [0, -100, -150, -100, 0],
                  rotate: [0, -15, 0, 15, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                ✈️
              </motion.div>
              
              <motion.div
                className="absolute bottom-4 left-4 text-2xl font-bold text-green-400"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                2.47x
              </motion.div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent">
                <div className="absolute bottom-6 right-6 text-right">
                  <div className="text-white font-bold text-xl">6.175 MZN</div>
                  <div className="text-green-400 text-sm">+147% ganho</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Game Categories */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white text-center mb-12"
        >
          Jogos Populares em Moçambique
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Aviator', icon: '✈️', color: 'from-blue-500 to-cyan-500', path: '/aviator' },
            { name: 'Cassino', icon: '🎰', color: 'from-purple-500 to-pink-500', path: '/roulette' },
            { name: 'Esportes', icon: '⚽', color: 'from-green-500 to-emerald-500', path: '/sports' },
            { name: 'Instantâneos', icon: '⚡', color: 'from-yellow-500 to-orange-500', path: '/dice' }
          ].map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className="relative group"
            >
              <Link to={category.path}>
                <div className={`bg-gradient-to-br ${category.color} p-8 rounded-2xl text-white text-center transform transition-all duration-300 group-hover:shadow-2xl`}>
                  <div className="text-6xl mb-4">{category.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <div className="flex items-center justify-center text-sm opacity-90">
                    <span>Explorar</span>
                    <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {[
            {
              icon: <CurrencyDollarIcon className="w-12 h-12" />,
              title: 'Saques Instantâneos',
              description: 'Receba seus ganhos via M-Pesa e Mkesh'
            },
            {
              icon: <SparklesIcon className="w-12 h-12" />,
              title: 'Jogos Provably Fair',
              description: 'Todos os resultados são verificáveis'
            },
            {
              icon: <FireIcon className="w-12 h-12" />,
              title: 'Apostas no Futebol Local',
              description: 'Aposte nos jogos da Liga Moçal e Taça de Moçambique'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-black/20 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
            >
              <div className="text-purple-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 text-center py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto px-6"
        >
          <h2 className="text-5xl font-bold text-white mb-8">
            Pronto para{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Ganhar?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Junte-se a milhares de moçambicanos e comece a ganhar hoje mesmo!
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-110 transition-all duration-300 space-x-2"
          >
            <span>Criar Conta Grátis</span>
            <ArrowRightIcon className="w-6 h-6" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;