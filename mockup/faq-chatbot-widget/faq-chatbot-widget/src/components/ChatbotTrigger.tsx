import { useChatbotConfig } from '../config/context'

interface ChatbotTriggerProps {
  isOpen: boolean
  onClick: () => void
}

export default function ChatbotTrigger({ isOpen, onClick }: ChatbotTriggerProps) {
  const { videos, videoBasePath, config: chatbotConfig } = useChatbotConfig()

  const greetingVideo = videos.find(v => v.id === chatbotConfig.greetingVideoId)
  const rawUrl = greetingVideo?.videoUrl || ''
  const greetingVideoUrl = rawUrl.startsWith('http') || rawUrl.startsWith('/')
    ? rawUrl
    : videoBasePath + rawUrl

  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? 'チャットを閉じる' : '採用についてのご質問はこちら'}
      aria-expanded={isOpen}
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        zIndex: 1000,
        padding: 0,
        outline: 'none',
        opacity: isOpen ? 0 : 1,
        pointerEvents: isOpen ? 'none' : 'auto',
        transform: isOpen ? 'scale(0.5)' : 'scale(1)',
        transition: 'opacity 0.25s ease, transform 0.25s ease',
      }}
    >
      {/* バッジ */}
      <span style={{
        background: '#1a73e8',
        color: '#fff',
        fontSize: '12px',
        fontWeight: 700,
        padding: '5px 14px',
        borderRadius: '999px',
        whiteSpace: 'nowrap',
        boxShadow: '0 2px 10px rgba(26,115,232,0.45)',
        letterSpacing: '0.3px',
        fontFamily: 'inherit',
      }}>
        動画でご説明
      </span>

      {/* 動画サムネイル円 */}
      <div style={{
        width: '88px',
        height: '88px',
        borderRadius: '50%',
        border: '3px solid #1a73e8',
        padding: '3px',
        background: '#fff',
        boxShadow: '0 4px 18px rgba(26,115,232,0.35)',
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1.06)'
          ;(e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(26,115,232,0.5)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1)'
          ;(e.currentTarget as HTMLElement).style.boxShadow = '0 4px 18px rgba(26,115,232,0.35)'
        }}
      >
        <video
          src={greetingVideoUrl}
          muted
          autoPlay
          loop
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 15%',
            borderRadius: '50%',
            display: 'block',
            pointerEvents: 'none',
          }}
        />
      </div>
    </button>
  )
}
