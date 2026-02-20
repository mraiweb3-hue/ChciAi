'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function VoiceChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Ahoj! 👋 Jsem Aji, AI partner ChciAI. Můžeš mi psát nebo **mluvit** - stiskni mikrofon! 🎤',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [language, setLanguage] = useState('cs')
  
  const messagesEndRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Text chat
  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')
    
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: userMessage,
      timestamp: new Date()
    }])
    
    setIsTyping(true)
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          language,
          sessionId: typeof window !== 'undefined' ? localStorage.getItem('chatSessionId') : null
        })
      })
      
      const data = await response.json()
      
      if (data.sessionId && typeof window !== 'undefined') {
        localStorage.setItem('chatSessionId', data.sessionId)
      }
      
      const aiMessage = {
        role: 'assistant', 
        content: data.response || 'Omlouvám se, něco se pokazilo.',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiMessage])
      
      // Auto-play voice response
      if (data.audioUrl) {
        playAudio(data.audioUrl)
      }
      
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Omlouvám se, mám technický problém. Zkus to prosím za chvíli. 📧',
        timestamp: new Date()
      }])
    } finally {
      setIsTyping(false)
    }
  }

  // Voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        await sendVoiceMessage(audioBlob)
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      
    } catch (error) {
      console.error('Microphone error:', error)
      alert('Nemůžu přistoupit k mikrofonu. Zkontroluj oprávnění v prohlížeči.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const sendVoiceMessage = async (audioBlob) => {
    setIsTyping(true)
    
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'voice.webm')
      formData.append('language', language)
      formData.append('sessionId', localStorage.getItem('chatSessionId') || '')

      const response = await fetch('/api/voice', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      // User's transcribed message
      if (data.transcript) {
        setMessages(prev => [...prev, {
          role: 'user',
          content: data.transcript,
          isVoice: true,
          timestamp: new Date()
        }])
      }

      // AI response
      if (data.response) {
        const aiMessage = {
          role: 'assistant',
          content: data.response,
          hasVoice: data.hasVoice,
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, aiMessage])

        // Auto-play voice response
        if (data.audioUrl) {
          playAudio(data.audioUrl)
        } else if (!data.hasVoice && data.response) {
          // Fallback: use browser TTS if no ElevenLabs
          speakText(data.response, language)
        }
      }

    } catch (error) {
      console.error('Voice error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Omlouvám se, nerozuměl jsem. Zkus to prosím znovu nebo napiš. 🎤',
        timestamp: new Date()
      }])
    } finally {
      setIsTyping(false)
    }
  }

  const playAudio = (audioUrl) => {
    setIsSpeaking(true)
    const audio = new Audio(audioUrl)
    audio.onended = () => setIsSpeaking(false)
    audio.play().catch(err => {
      console.error('Audio playback error:', err)
      setIsSpeaking(false)
    })
  }

  // Browser TTS fallback (when no ElevenLabs)
  const speakText = (text, lang) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(text)
      
      // Set language
      const langMap = {
        'cs': 'cs-CZ',
        'en': 'en-US',
        'de': 'de-DE',
        'ru': 'ru-RU',
        'uk': 'uk-UA',
        'vi': 'vi-VN'
      }
      utterance.lang = langMap[lang] || 'cs-CZ'
      
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const languages = [
    { code: 'cs', name: '🇨🇿 Čeština', flag: '🇨🇿' },
    { code: 'en', name: '🇬🇧 English', flag: '🇬🇧' },
    { code: 'de', name: '🇩🇪 Deutsch', flag: '🇩🇪' },
    { code: 'ru', name: '🇷🇺 Русский', flag: '🇷🇺' },
    { code: 'uk', name: '🇺🇦 Українська', flag: '🇺🇦' },
    { code: 'vi', name: '🇻🇳 Tiếng Việt', flag: '🇻🇳' }
  ]

  return (
    <>
      {/* Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300"
        >
          {isOpen ? (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <div className="relative">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          )}
        </motion.button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-24 right-6 w-96 h-[650px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
                      🤖
                    </div>
                    {isSpeaking && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-white"
                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <div className="font-bold">Aji - Voice AI</div>
                    <div className="text-xs text-cyan-100 flex items-center gap-1">
                      {isSpeaking ? (
                        <>🔊 Mluvím...</>
                      ) : isRecording ? (
                        <>🔴 Nahrávám...</>
                      ) : (
                        <>🎤 Mluv se mnou</>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Language selector */}
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="text-xs bg-white/20 text-white border border-white/30 rounded px-2 py-1 cursor-pointer hover:bg-white/30"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code} className="text-gray-900">
                      {lang.flag} {lang.name.split(' ')[1]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.role === 'user' 
                      ? 'bg-cyan-500 text-white rounded-br-sm' 
                      : 'bg-white text-gray-800 shadow-sm rounded-bl-sm border border-gray-100'
                  }`}>
                    {msg.isVoice && (
                      <div className="text-xs opacity-70 mb-1">🎤 Voice</div>
                    )}
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
                    <div className="flex gap-1">
                      <motion.div className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                      <motion.div className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                      <motion.div className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Napiš nebo mluv..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  disabled={isRecording}
                />
                
                {/* Voice button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseDown={startRecording}
                  onMouseUp={stopRecording}
                  onTouchStart={startRecording}
                  onTouchEnd={stopRecording}
                  className={`px-4 py-3 rounded-full transition-all ${
                    isRecording 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title="Stiskni a drž pro nahrávání"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                </motion.button>

                {/* Send button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!input.trim() || isRecording}
                  className="px-6 py-3 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </motion.button>
              </div>
              
              {isRecording && (
                <div className="text-xs text-red-600 text-center animate-pulse">
                  🔴 Nahrávám... (Pusť pro odeslání)
                </div>
              )}
              
              <div className="mt-2 text-xs text-gray-500 text-center">
                🎤 Stiskni a mluv | 🤖 AI by Clawdbot
                {process.env.NEXT_PUBLIC_HAS_VOICE && (
                  <div className="text-[10px] text-gray-400 mt-1">
                    Whisper STT • ElevenLabs TTS
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
