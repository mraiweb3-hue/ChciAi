import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// 7-krokový proces spolupráce
const STEPS = [
  {
    num: 1,
    phase: 'PŘITAŽENÍ',
    title: 'První kontakt s Clawixem',
    description: 'Náš AI asistent Clawix zjistí váš obor, hlavní problém a nabídne správnou variantu spolupráce.',
    icon: '💬',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    num: 2,
    phase: 'DIAGNOSTIKA',
    title: 'AI Audit',
    description: 'Osobní 15-30 min analýza. Identifikujeme procesy vhodné k automatizaci pomocí OpenClaw.',
    icon: '🔍',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    num: 3,
    phase: 'NASAZENÍ',
    title: 'Instalace OpenClaw',
    description: 'Vytvoření vaší instance OpenClaw, nastavení bezpečnosti a přístupů.',
    icon: '🛡️',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    num: 4,
    phase: 'PERSONALIZACE',
    title: 'Pojmenování vašeho AI',
    description: 'Zvolíte jméno pro svého OpenClaw asistenta, nastavíte osobnost a role.',
    icon: '🎨',
    color: 'from-purple-500 to-pink-500'
  },
  {
    num: 5,
    phase: 'VZDĚLÁVÁNÍ',
    title: 'Vibe Coding školení',
    description: 'Naučíte se komunikovat s AI - zadávat cíle, generovat workflow, iterovat.',
    icon: '🎓',
    color: 'from-pink-500 to-red-500'
  },
  {
    num: 6,
    phase: 'SPUŠTĚNÍ',
    title: 'První automatizace',
    description: 'Vybereme jeden konkrétní problém, vytvoříme řešení s vaším OpenClaw asistentem a nasadíme.',
    icon: '🚀',
    color: 'from-red-500 to-orange-500'
  },
  {
    num: 7,
    phase: 'RŮST',
    title: 'Samostatný růst',
    description: 'Váš OpenClaw se učí a roste. My zůstáváme jako konzultanti pro složitější úkoly.',
    icon: '📈',
    color: 'from-orange-500 to-yellow-500'
  }
];

function StepCard({ step, index, theme }) {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative"
    >
      {/* Connector line */}
      {index < STEPS.length - 1 && (
        <div className={`absolute top-24 left-1/2 w-0.5 h-16 -translate-x-1/2 hidden md:block ${
          theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'
        }`}>
          <motion.div
            className={`w-full bg-gradient-to-b ${step.color}`}
            initial={{ height: 0 }}
            animate={inView ? { height: '100%' } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
          />
        </div>
      )}

      <motion.div
        className={`relative p-6 rounded-2xl backdrop-blur-xl ${
          theme === 'dark'
            ? 'bg-slate-800/70 border border-slate-700/50'
            : 'bg-white/70 border border-slate-200/50'
        } hover:border-cyan-500/50 transition-all duration-300`}
        whileHover={{ y: -5, scale: 1.02 }}
      >
        {/* Phase badge */}
        <div className={`absolute -top-3 left-6 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${step.color}`}>
          {step.phase}
        </div>

        {/* Icon */}
        <motion.div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-3xl mb-4 shadow-lg`}
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
        >
          {step.icon}
        </motion.div>

        {/* Number */}
        <div className={`absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
          theme === 'dark'
            ? 'bg-slate-700 text-slate-300'
            : 'bg-slate-100 text-slate-600'
        }`}>
          {step.num}
        </div>

        {/* Content */}
        <h3 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
          {step.title}
        </h3>
        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
          {step.description}
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function ProcessSteps({ theme = 'light' }) {
  const [headerRef, headerInView] = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6" data-testid="process-section">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-500 text-white mb-4"
            initial={{ scale: 0 }}
            animate={headerInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            7-KROKOVÝ MODEL
          </motion.span>
          
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Jak spolupráce probíhá
          </h2>
          
          <p className={`text-base md:text-lg max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Od prvního kontaktu až po samostatný růst. Transparentní proces bez překvapení.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {STEPS.slice(0, 4).map((step, i) => (
            <StepCard key={step.num} step={step} index={i} theme={theme} />
          ))}
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-6 md:mt-8 max-w-4xl mx-auto">
          {STEPS.slice(4).map((step, i) => (
            <StepCard key={step.num} step={step} index={i + 4} theme={theme} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 md:mt-16"
        >
          <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Připraveni začít?
          </p>
          <motion.button
            className="px-8 py-4 rounded-full text-white font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/25"
            whileHover={{ scale: 1.05, boxShadow: '0 25px 50px -12px rgba(6,182,212,0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.querySelector('[data-testid="chatbot-toggle"]')?.click()}
          >
            Začít s Clawixem →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
