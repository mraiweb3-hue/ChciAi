'use client'

import Link from 'next/link'

export default function FooterSimple() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              ChciAI.cz
            </h3>
            <p className="text-gray-600">
              OpenClaw hosting pro vaši firmu
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Kontakt</h4>
            <div className="space-y-2 text-gray-600">
              <div>Martin: +420 608 922 096</div>
              <div>info@chciai.cz</div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Odkazy</h4>
            <div className="space-y-2">
              <a href="https://github.com/clawdbot/clawdbot" target="_blank" rel="noopener noreferrer" className="block text-gray-600 hover:text-blue-600 transition-colors">
                GitHub
              </a>
              <a href="https://docs.openclaw.ai" target="_blank" rel="noopener noreferrer" className="block text-gray-600 hover:text-blue-600 transition-colors">
                OpenClaw Docs
              </a>
              <Link href="/login" className="block text-gray-600 hover:text-blue-600 transition-colors">
                Přihlásit se
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          © 2026 ChciAI.cz • Provozuje Martin
        </div>
      </div>
    </footer>
  )
}
