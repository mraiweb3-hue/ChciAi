import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const SECURITY_FEATURES = [
  {
    icon: '🔐',
    title: 'End-to-end šifrování',
    description: 'Veškerá komunikace je šifrovaná. Data jsou chráněna při přenosu i ukládání.',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    icon: '🏠',
    title: 'Vlastnictví dat',
    description: 'Data zůstávají vaše. Nikdy je nesdílíme s třetími stranami. Máte plnou kontrolu.',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    icon: '🔒',
    title: 'Oddělené instance',
    description: 'Každý klient má vlastní izolovanou instanci. Vaše data nikdy nepřijdou do styku s daty jiných klientů.',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    icon: '📋',
    title: 'Kompletní audit log',
    description: 'Všechny aktivity jsou zaznamenány. Víte přesně, co se děje s vašimi daty.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: '✅',
    title: 'GDPR Compliance',
    description: 'Plná shoda s evropskou legislativou o ochraně osobních údajů.',
    color: 'from-pink-500 to-red-500'
  },
  {
    icon: '🛡️',
    title: 'Open Source základ',
    description: 'Postaveno na OpenClaw - open source řešení, které můžete auditovat.',
    color: 'from-red-500 to-orange-500'
  }
];

export default function SecuritySection({ theme = 'light' }) {
  const [headerRef, headerInView] = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section className={`py-16 md:py-24 px-4 sm:px-6 ${
      theme === 'dark' ? 'bg-slate-900/50' : 'bg-slate-50/50'
    }`} data-testid="security-section">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-4xl shadow-lg"
            initial={{ scale: 0, rotate: -180 }}
            animate={headerInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            🔒
          </motion.div>
          
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
            Bezpečnost na prvním místě
          </h2>
          
          <p className={`text-base md:text-lg max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Vaše data jsou v bezpečí. Transparentně vám ukážeme, jak je chráníme.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SECURITY_FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-2xl backdrop-blur-xl ${
                theme === 'dark'
                  ? 'bg-slate-800/70 border border-slate-700/50'
                  : 'bg-white/70 border border-slate-200/50'
              } hover:border-green-500/50 transition-all duration-300`}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <motion.div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl mb-4 shadow-md`}
                whileHover={{ rotate: [0, -10, 10, 0] }}
              >
                {feature.icon}
              </motion.div>
              
              <h3 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                {feature.title}
              </h3>
              
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 md:mt-16 text-center"
        >
          <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
            Důvěřují nám
          </p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {['GDPR', 'ISO 27001', 'SOC 2', 'SSL'].map((badge, i) => (
              <motion.div
                key={badge}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`px-4 py-2 rounded-lg font-mono text-sm font-bold ${
                  theme === 'dark'
                    ? 'bg-slate-800 text-green-400 border border-green-500/30'
                    : 'bg-white text-green-600 border border-green-200'
                }`}
              >
                {badge}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
