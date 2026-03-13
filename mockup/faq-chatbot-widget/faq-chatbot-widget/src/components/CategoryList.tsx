import type { FAQCategory } from './types'
import { useChatbotConfig } from '../config/context'

interface CategoryListProps {
  onSelectCategory: (category: FAQCategory) => void
}

export default function CategoryList({ onSelectCategory }: CategoryListProps) {
  const { categories } = useChatbotConfig()

  return (
    <div className="p-4" style={{ background: '#111' }}>
      <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
        どのカテゴリについてお聞きになりますか？
      </p>

      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category)}
            className="flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 group"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(26,115,232,0.25)'
              ;(e.currentTarget as HTMLElement).style.borderColor = '#1a73e8'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'
            }}
          >
            <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">
              {category.icon}
            </span>
            <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
