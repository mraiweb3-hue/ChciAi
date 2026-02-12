import { motion } from 'framer-motion';

const SimpleAvatarSelector = ({ selectedGender, onSelect }) => {
  const avatars = [
    {
      gender: 'female',
      emoji: '👩‍💼',
      name: 'AJI - Ženský hlas',
      description: 'Přátelský, teplý, energický',
      gradient: 'from-cyan-500 to-purple-500'
    },
    {
      gender: 'male',
      emoji: '👨‍💼',
      name: 'MARTIN - Mužský hlas',
      description: 'Profesionální, jasný, důvěryhodný',
      gradient: 'from-cyan-500 to-blue-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {avatars.map((avatar) => (
        <motion.div
          key={avatar.gender}
          onClick={() => onSelect(avatar.gender)}
          className={`relative bg-black/50 rounded-2xl border-2 p-8 cursor-pointer transition-all ${
            selectedGender === avatar.gender
              ? 'border-[#00D9FF] shadow-lg shadow-cyan-500/50'
              : 'border-white/10 hover:border-[#00D9FF]/50'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Selection indicator */}
          {selectedGender === avatar.gender && (
            <motion.div
              className="absolute top-4 right-4 w-6 h-6 bg-[#00D9FF] rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </motion.div>
          )}

          {/* Avatar */}
          <div className="flex flex-col items-center">
            <motion.div
              className={`w-32 h-32 rounded-full bg-gradient-to-br ${avatar.gradient} flex items-center justify-center mb-6 shadow-xl`}
              animate={{
                boxShadow: selectedGender === avatar.gender
                  ? ['0 20px 60px rgba(0, 217, 255, 0.4)', '0 25px 80px rgba(0, 217, 255, 0.6)', '0 20px 60px rgba(0, 217, 255, 0.4)']
                  : '0 20px 40px rgba(0, 0, 0, 0.3)'
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.span
                className="text-6xl"
                animate={{
                  scale: selectedGender === avatar.gender ? [1, 1.1, 1] : 1
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {avatar.emoji}
              </motion.span>
            </motion.div>

            <h3 className="text-white font-semibold text-xl mb-2 text-center">
              {avatar.name}
            </h3>
            <p className="text-neutral-400 text-sm text-center">
              {avatar.description}
            </p>
          </div>

          {/* Glow effect on selected */}
          {selectedGender === avatar.gender && (
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-transparent pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default SimpleAvatarSelector;
