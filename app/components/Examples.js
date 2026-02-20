'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const examples = [
  {
    id: 'autoservis',
    title: '🔧 Autoservis',
    subtitle: 'Martin, majitel servisu s 3 zaměstnanci',
    icon: '🔧',
    problem: 'Telefonáty ruší práci, zákazníci volají i po zavírací době',
    solution: 'AI asistent odpovídá na dotazy 24/7, rezervuje termíny, posílá připomínky servisu',
    aiFeatures: [
      '📅 Automatické online rezervace termínů',
      '💬 Odpovědi na časté dotazy (ceny, otevírací doba)',
      '📧 Emailové/SMS připomínky den před servisem',
      '🔔 Notifikace při dokončení opravy',
      '💰 Automatické odeslání nabídky/kalkulace',
      '📊 Evidence pravidelných zákazníků a jejich vozů',
      '🚗 Připomínky na pravidelný servis (STK, výměna oleje)',
      '📱 WhatsApp/Messenger integrace pro rychlou komunikaci'
    ],
    results: [
      '15 hodin týdně ušetřených na telefonátech',
      'Žádný zmešknutý zákazník díky 24/7 dostupnosti',
      '30% více rezervací díky okamžitým odpovědím',
      '50% méně no-show díky automatickým připomínkám',
      'Vyšší loajalita - AI pamatuje každého zákazníka'
    ],
    roi: '6 nových zákazníků měsíčně = +30 000 Kč navíc',
    example: 'Zákazník: "Dobrý den, můžu přijet zítra na výměnu oleje?" → AI: "Dobrý den! Ano, mám volno zítra ve 14:00. Jakou značku auta máte? Zarezervovat?"'
  },
  {
    id: 'kadernictvi',
    title: '💇 Kadeřnictví',
    subtitle: 'Jana, kadeřnice pracující sama',
    icon: '💇',
    problem: 'Během stříhání nemůže zvedat telefon, ztrácí klienty',
    solution: 'AI spravuje rezervace, posílá připomínky, odpovídá na časté dotazy o službách',
    aiFeatures: [
      '📅 Online rezervační systém 24/7',
      '📱 SMS/WhatsApp připomínky před návštěvou',
      '💇 Ceník služeb dostupný okamžitě',
      '📸 Automatické posílání portfolia (fotky účesů)',
      '💳 Možnost online platby zálohy',
      '🎁 Birthday pozdravy s nabídkou slevy',
      '💆 Upsell - nabídka doplňkových služeb (regenerace, masáž)',
      '⭐ Sběr review po návštěvě (Google, Facebook)'
    ],
    results: [
      'Kalendář vždy plný díky automatickým rezervacím',
      '95% klientů přijde díky SMS připomínkám',
      '0 zmeškaných hovorů = 0 ztracených zakázek',
      '+20% tržeb z prodeje produktů (šampony, masky)',
      'Více stálých klientů díky personalizované péči'
    ],
    roi: 'Naplněný kalendář = +25 000 Kč měsíčně navíc',
    example: 'Klientka: "Kolik stojí melír?" → AI: "Melír od 1200 Kč, záleží na délce vlasů. Máte zájem o termín? Nejbližší volno mám ve čtvrtek 15:00."'
  },
  {
    id: 'fitness',
    title: '💪 Fitness trenér',
    subtitle: 'Petr, osobní trenér',
    icon: '💪',
    problem: 'Klienti se ptají pořád na to samé, admin zabírá večery',
    solution: 'AI zodpovídá časté dotazy, posílá tréninkové plány, připomíná lekce',
    aiFeatures: [
      '🏋️ Automatické posílání tréninkových plánů',
      '🥗 Odpovědi na výživové dotazy (kalorie, makra, recepty)',
      '📊 Tracking pokroku klienta (váha, obvody, síla)',
      '🔔 Motivační zprávy a připomínky tréninků',
      '💪 Video návody na cviky (automatické posílání)',
      '📅 Flexibilní přeplánování lekcí',
      '💰 Automatická fakturace a platby',
      '🎯 Osobní cíle a milestones klientů'
    ],
    results: [
      '20 hodin měsíčně zpět pro trénování',
      'Více času na nové klienty',
      'Lepší dochaznost díky automatickým připomínkám',
      'Vyšší retence - klienti zůstávají déle',
      '+40% uspokojení klientů díky personalizaci'
    ],
    roi: '8 nových klientů = +48 000 Kč měsíčně',
    example: 'Klient: "Můžu jíst banán před tréninkem?" → AI: "Ano! Banán 30-60 minut před tréninkem je skvělý zdroj rychlé energie. Vidíme se zítra v 7:00?"'
  },
  {
    id: 'eshop',
    title: '🛍️ Malý e-shop',
    subtitle: 'Lenka, provozuje e-shop s ručním zbožím',
    icon: '🛍️',
    problem: 'Zákazníci se ptají na dostupnost, velikosti, dopravu - všechno ruční práce',
    solution: 'AI odpovídá na produktové dotazy, kontroluje objednávky, řeší reklamace',
    aiFeatures: [
      '📦 Okamžité odpovědi na dostupnost produktů',
      '📏 Rady s výběrem velikosti/barvy',
      '🚚 Info o dopravě, platbě, dodací době',
      '🔍 Personalizované doporučení produktů',
      '🎁 Cross-sell a up-sell nabídky',
      '📧 Automatické potvrzení objednávky + tracking',
      '😊 Řešení reklamací a vrácení zboží',
      '⭐ Sběr review po nákupu (s pobídkou slevou)'
    ],
    results: [
      'Zákazníci dostávají odpovědi okamžitě (ne za 6 hodin)',
      'Vyšší konverze díky rychlé komunikaci',
      'Čas na tvorbu produktů místo mailů',
      '+35% konverze díky personalizovaným doporučením',
      'Méně vrácení - AI pomůže vybrat správnou velikost'
    ],
    roi: '15% nárůst konverze = +40 000 Kč měsíčně',
    example: 'Zákazník: "Máte tento náramek skladem?" → AI: "Ano! Modrý náramek máme na skladě, odešleme do 24h. Přidat do košíku?"'
  },
  {
    id: 'restaurace',
    title: '🍕 Restaurace / Bistro',
    subtitle: 'Tomáš, majitel pizzerie',
    icon: '🍕',
    problem: 'Telefon zvoní celý večer, číšníci nestíhají přijímat rezervace',
    solution: 'AI přijímá rezervace, odpovídá na dotazy o menu, alergeny, otevírací dobu',
    aiFeatures: [
      '📅 Online rezervace stolů 24/7',
      '🍽️ Digitální menu s cenami a alergeny',
      '📞 Příjem objednávek jídla s sebou',
      '🚴 Integrace s rozvozem (Wolt, Bolt Food)',
      '💳 Online platba zálohy při rezervaci',
      '📧 Potvrzení + SMS připomínky hostům',
      '🎂 Speciální nabídky na oslavy/večírky',
      '⭐ Sběr review (TripAdvisor, Google, FB)'
    ],
    results: [
      'Přijímá rezervace i když máte zavřeno',
      'Personál se může věnovat hostům',
      'Méně konfliktů díky potvrzeným rezervacím',
      '+25% vytížení díky optimalizaci rezervací',
      'Více objednávek s sebou = vyšší tržby'
    ],
    roi: '40 více obsazených stolů měsíčně = +60 000 Kč',
    example: 'Host: "Máte dnes večer stůl pro 4 osoby?" → AI: "Ano, mám volno v 19:30. Rezervovat na jméno? Budete potřebovat dětskou židličku?"'
  },
  {
    id: 'reality',
    title: '🏠 Realitní kancelář',
    subtitle: 'Kateřina, realitní makléřka',
    icon: '🏠',
    problem: 'Desítky dotazů na nemovitosti, mnoho už prodaných',
    solution: 'AI filtruje dotazy, posílá info o dostupných bytech, domlouvá prohlídky',
    aiFeatures: [
      '🏘️ Automatické odpovědi na dotazy k nemovitostem',
      '📸 Posílání fotek, půdorysů, 3D prohlídek',
      '💰 Kalkulačka hypoték a financování',
      '📅 Domlouvání prohlídek bytů/domů',
      '🔔 Upozornění na nové nabídky dle preferencí',
      '📊 Lead scoring - AI vyhodnotí kvalitu zájemce',
      '📧 Follow-up kampane pro teplé leady',
      '⚖️ Info o lokalitě, dopravě, školách'
    ],
    results: [
      'Jen kvalitní leady v kalendáři',
      'Klienti dostanou info okamžitě (ne až za 2 dny)',
      'Více času na jednání a uzavírání obchodů',
      '+50% konverze leadů díky okamžité reakci',
      '3x více prohlídek bez navýšení pracovní zátěže'
    ],
    roi: '2 uzavřené obchody navíc měsíčně = +120 000 Kč provize',
    example: 'Zájemce: "Je byt 3+1 v Praze 5 ještě volný?" → AI: "Ano, byt je k dispozici! Cena 8.5 mil Kč, 78 m². Mohu zaslat podrobnosti a fotky?"'
  }
]

export default function Examples() {
  const [activeExample, setActiveExample] = useState('autoservis')
  const active = examples.find(e => e.id === activeExample)

  return (
    <section id="priklady" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Pro koho je to?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Reálné příklady podnikatelů, kterým AI asistent šetří čas a vydělává peníze
          </p>
        </motion.div>

        {/* Industry tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {examples.map((example) => (
            <motion.button
              key={example.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveExample(example.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeExample === example.id
                  ? 'bg-cyan-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {example.title}
            </motion.button>
          ))}
        </div>

        {/* Active example detail */}
        <motion.div
          key={activeExample}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left: Problem & Solution */}
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                {active.title}
              </h3>
              <p className="text-lg text-cyan-600 mb-6">{active.subtitle}</p>

              <div className="mb-8">
                <h4 className="text-sm font-semibold text-red-600 uppercase mb-2">❌ Problém</h4>
                <p className="text-gray-700 text-lg">{active.problem}</p>
              </div>

              <div className="mb-8">
                <h4 className="text-sm font-semibold text-green-600 uppercase mb-2">✅ Řešení</h4>
                <p className="text-gray-700 text-lg mb-4">{active.solution}</p>
                
                {/* AI Features */}
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-4 mt-4">
                  <h5 className="text-sm font-bold text-cyan-900 mb-3">🤖 Co konkrétně AI udělá:</h5>
                  <div className="grid grid-cols-1 gap-2">
                    {active.aiFeatures.slice(0, 6).map((feature, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-cyan-600 text-sm">•</span>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  {active.aiFeatures.length > 6 && (
                    <details className="mt-2">
                      <summary className="text-sm text-cyan-600 cursor-pointer hover:text-cyan-700 font-medium">
                        + {active.aiFeatures.length - 6} dalších funkcí
                      </summary>
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        {active.aiFeatures.slice(6).map((feature, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-cyan-600 text-sm">•</span>
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 uppercase mb-3">📊 Výsledky</h4>
                <ul className="space-y-2">
                  {active.results.map((result, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-cyan-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{result}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ROI Highlight */}
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                <p className="text-sm font-semibold text-green-900 mb-1">💰 ROI</p>
                <p className="text-green-800 font-bold text-lg">{active.roi}</p>
              </div>
            </div>

            {/* Right: Example conversation */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase mb-4">💬 Ukázka konverzace</h4>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="space-y-4 font-mono text-sm">
                  {active.example.split(' → ').map((msg, i) => (
                    <div key={i} className={i === 0 ? 'text-gray-700' : 'text-cyan-700 font-semibold'}>
                      {msg}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 bg-cyan-50 border-l-4 border-cyan-500 p-6 rounded-r-lg">
                <p className="text-sm font-semibold text-cyan-900 mb-2">💡 Proč to funguje?</p>
                <p className="text-gray-700">
                  AI odpovídá <strong>okamžitě</strong>, <strong>24/7</strong>, a <strong>nikdy nezapomene</strong>. 
                  Zákazníci dostanou odpověď hned, ne za hodiny. To znamená více spokojených klientů a více objednávek.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">Podobný byznys jako vy?</p>
          <motion.a
            href="#kontakt"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-4 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors duration-200 shadow-lg"
          >
            Chci AI asistenta pro můj byznys
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
