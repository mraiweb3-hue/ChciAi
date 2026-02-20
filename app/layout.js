import './styles/globals.css'

export const metadata = {
  title: 'ChciAI.cz - OpenClaw AI Agent Hosting',
  description: 'Bezpečná instalace OpenClaw AI agenta na českém VPS. 24/7 podpora od Clawix AI. 499 Kč/měsíc.',
  keywords: 'OpenClaw, AI agent, AI asistent, český VPS, Wedos, OpenClaw hosting, open source AI',
  openGraph: {
    title: 'ChciAI.cz - OpenClaw AI Agent Hosting',
    description: 'OpenClaw na českém VPS za 499 Kč/měsíc. Instalace za 2 minuty.',
    type: 'website',
    locale: 'cs_CZ',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white antialiased transition-colors duration-300">
        {children}
      </body>
    </html>
  )
}
