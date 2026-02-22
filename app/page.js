'use client'

import HeaderSimple from './components/HeaderSimple'
import ModernHero from './components/ModernHero'
import WhatYouGet from './components/WhatYouGet'
import HowItWorksSimple from './components/HowItWorksSimple'
import PricingSimple from './components/PricingSimple'
import OpenClawSelfHosted from './components/OpenClawSelfHosted'
import FAQSimple from './components/FAQSimple'
import FooterSimple from './components/FooterSimple'
import SimpleThemeToggle from './components/SimpleThemeToggle'

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <SimpleThemeToggle />
      <HeaderSimple />
      <ModernHero />
      <WhatYouGet />
      <HowItWorksSimple />
      <PricingSimple />
      <OpenClawSelfHosted />
      <FAQSimple />
      <FooterSimple />
    </main>
  )
}
