import type { FAQWithVideo, FAQCategory } from './types'
import { useChatbotConfig } from '../config/context'

interface QuestionListProps {
  category: FAQCategory
  onSelectQuestion: (faq: FAQWithVideo) => void
  onBack: () => void
}

export default function QuestionList({
  category,
  onSelectQuestion,
  onBack,
}: QuestionListProps) {
  const { faqs } = useChatbotConfig()
  const categoryFaqs = faqs
    .filter(faq => faq.category === category.name)
    .sort((a, b) => a.order - b.order)

  return (
    <div className="p-4" style={{ background: '#111' }}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">{category.icon}</span>
        <span className="font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>{category.name}</span>
      </div>

      <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
        質問を選んでください
      </p>

      <div className="space-y-2">
        {categoryFaqs.map((faq) => (
          <button
            key={faq.id}
            onClick={() => onSelectQuestion(faq)}
            className="w-full text-left p-3 rounded-lg transition-all duration-200 group"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(26,115,232,0.2)'
              ;(e.currentTarget as HTMLElement).style.borderColor = '#1a73e8'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'
            }}
          >
            <div className="flex items-start gap-2">
              <span
                className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
                style={{ background: 'rgba(26,115,232,0.3)', color: '#74a9f5' }}
              >
                Q
              </span>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
                {faq.question}
              </span>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={onBack}
        className="mt-4 w-full py-2 text-sm transition-colors"
        style={{ color: 'rgba(255,255,255,0.4)' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#74a9f5' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)' }}
      >
        カテゴリ選択に戻る
      </button>
    </div>
  )
}
