import { useState } from 'preact/hooks'
import ChatbotTrigger from './ChatbotTrigger'
import ChatbotWindow from './ChatbotWindow'

export default function FAQChatbot() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <ChatbotTrigger isOpen={isOpen} onClick={() => setIsOpen(v => !v)} />
      <ChatbotWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
