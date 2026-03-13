import { useRef, useEffect, useState } from 'preact/hooks'
import { useChatbotConfig } from '../config/context'

interface ChatbotWindowProps {
  isOpen: boolean
  onClose: () => void
}

const CHAPTERS = [
  { label: '法人営業', time: 0, video: 'houjin-eigyo.mp4' },
  { label: 'キャリアアドバイザー', time: 4 },
  { label: '社長メッセージ', time: 9 },
  { label: '入社お祝い金制度', time: 14 },
]

const SUBTITLE_CUES = [
  { start: 0, end: 4, text: 'こんにちは！マイキャリア株式会社の広報担当です！' },
  { start: 4, end: 8.5, text: 'このページでは弊社の求人をご紹介します！' },
]

const HOUJIN_SUBTITLE_CUES = [
  { start: 0, end: 3, text: '法人営業について\nご紹介します。' },
  { start: 3, end: 7, text: 'このポジションでは、\n企業のWebマーケティングの\n課題をヒアリングして、' },
  { start: 7, end: 11, text: 'SEOを中心とした\nコンサルティングの\nご提案をしていただきます。' },
  { start: 11, end: 15, text: '単なるサービスの\n売り込みではなく、\nお客様の売上を\n一緒に伸ばしていく' },
  { start: 15, end: 18, text: 'パートナーのような\n営業スタイルが特徴です。' },
  { start: 18, end: 22, text: 'マーケティングの知識は、\n入社後にしっかり\n学べる環境がありますので、' },
  { start: 22, end: 27, text: '「提案型の営業に\nチャレンジしたい」という方なら\n業界未経験でも大歓迎です。' },
  { start: 27, end: 32, text: '少しでも気になった方は、\nぜひ求人の詳細も\nチェックしてみてくださいね。' },
]

/* ============================================================
 * 字幕スタイル設定
 * 背景・位置・フォント・サイズなどを変更する場合はここを編集
 * ============================================================ */
const SUBTITLE_STYLE = {
  // --- 法人営業（カード型・上部表示） ---
  houjin: {
    top: '6px',               // 上からの位置
    left: '6px',              // 左からの位置
    right: '58px',            // 右からの位置（コントロール回避）
    background: 'rgba(255,255,255,0.85)',  // 背景色（白・半透明）
    borderRadius: '8px',      // 角丸
    padding: '8px 12px',      // 内側余白
    fontSize: '13px',         // フォントサイズ
    fontWeight: 600,          // フォントの太さ
    fontFamily: '"Hiragino Kaku Gothic ProN", "Noto Sans JP", "Yu Gothic", "Meiryo", sans-serif',
    color: '#1a1a1a',         // 文字色（黒）
    lineHeight: 1.7,          // 行間
  },
  // --- グリーティング（縁取り・下部表示） ---
  greeting: {
    bottom: '190px',          // 下からの位置
    paddingLeft: '14px',      // 左余白
    paddingRight: '60px',     // 右余白（コントロール回避）
    fontSize: '18px',         // フォントサイズ
    fontWeight: 700,          // フォントの太さ
    color: '#b3e5fc',         // 文字色（水色）
    textShadow: '-2px -2px 0 rgba(0,0,0,0.95), 2px -2px 0 rgba(0,0,0,0.95), -2px 2px 0 rgba(0,0,0,0.95), 2px 2px 0 rgba(0,0,0,0.95)',
    lineHeight: 1.6,          // 行間
  },
}

const SPEEDS = [1, 1.5, 2]

function pad(n: number) { return String(Math.floor(n)).padStart(2, '0') }
function fmt(s: number) { return pad(s / 60) + ':' + pad(s % 60) }

function SideBtn({ onClick, children, ariaLabel }: { onClick: () => void; children: any; ariaLabel?: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'rgba(60,60,60,0.75)',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  )
}

export default function ChatbotWindow({ isOpen, onClose }: ChatbotWindowProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [progress, setProgress] = useState(0)
  const [timeText, setTimeText] = useState('00:00 / 00:00')
  const [isMuted, setIsMuted] = useState(false)
  const [speedIdx, setSpeedIdx] = useState(0)
  const [subtitle, setSubtitle] = useState('')
  const [showSubtitle, setShowSubtitle] = useState(false)
  const [activeVideo, setActiveVideo] = useState<string>('greeting')

  const { videos, videoBasePath, config: chatbotConfig } = useChatbotConfig()
  const greetingVideo = videos.find(v => v.id === chatbotConfig.greetingVideoId)
  const rawUrl = greetingVideo?.videoUrl || ''
  const videoUrl = rawUrl.startsWith('http') || rawUrl.startsWith('/') ? rawUrl : videoBasePath + rawUrl

  // Play/pause when isOpen changes
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (isOpen) {
      video.play().catch(() => {})
    } else {
      video.pause()
      video.currentTime = 0
      setProgress(0)
      setTimeText('00:00 / 00:00')
      setShowSubtitle(false)
      setSpeedIdx(0)
      setActiveVideo('greeting')
    }
  }, [isOpen])

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (!video || !video.duration) return
    setProgress((video.currentTime / video.duration) * 100)
    setTimeText(fmt(video.currentTime) + ' / ' + fmt(video.duration))
    const cues = activeVideo === 'houjin-eigyo' ? HOUJIN_SUBTITLE_CUES : SUBTITLE_CUES
    const cue = cues.find(c => video.currentTime >= c.start && video.currentTime < c.end)
    if (cue) { setSubtitle(cue.text); setShowSubtitle(true) }
    else { setShowSubtitle(false) }
  }

  const handleProgressClick = (e: MouseEvent) => {
    const video = videoRef.current
    if (!video || !video.duration) return
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    video.currentTime = ((e.clientX - rect.left) / rect.width) * video.duration
  }

  const handleRewind = () => {
    const video = videoRef.current
    if (video) video.currentTime = Math.max(0, video.currentTime - 10)
  }

  const handleMute = () => {
    const video = videoRef.current
    if (video) { video.muted = !video.muted; setIsMuted(video.muted) }
  }

  const handleSpeed = () => {
    const video = videoRef.current
    const next = (speedIdx + 1) % SPEEDS.length
    setSpeedIdx(next)
    if (video) video.playbackRate = SPEEDS[next]
  }

  const handleChapter = (ch: typeof CHAPTERS[number]) => {
    const video = videoRef.current
    if (!video) return
    if (ch.video) {
      const newUrl = ch.video.startsWith('http') || ch.video.startsWith('/') ? ch.video : videoBasePath + ch.video
      video.src = newUrl
      video.currentTime = 0
      setActiveVideo('houjin-eigyo')
      video.play().catch(() => {})
    } else {
      video.src = videoUrl
      video.currentTime = ch.time
      setActiveVideo('greeting')
      if (video.paused) video.play()
    }
  }

  if (!isOpen) return null

  const btnBase: any = {
    width: '100%',
    padding: '9px 16px',
    border: 'none',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    color: '#fff',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    textAlign: 'center' as const,
    backdropFilter: 'blur(2px)',
    WebkitBackdropFilter: 'blur(2px)',
    fontFamily: 'inherit',
  }

  return (
    <div
      id="faq-video-panel"
      className="chatbot-window-enter"
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        zIndex: 999,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Desktop override: 300px fixed widget */}
      <style>{`
        @media (min-width: 769px) {
          #faq-video-panel {
            inset: auto !important;
            bottom: 148px !important;
            right: 28px !important;
            width: 300px !important;
            border-radius: 20px !important;
            box-shadow: 0 12px 48px rgba(0,0,0,0.35) !important;
            display: block !important;
          }
          #faq-video-panel video {
            aspect-ratio: 9 / 16 !important;
            height: auto !important;
          }
        }
      `}</style>

      {/* Video */}
      <video
        ref={videoRef}
        src={videoUrl}
        playsInline
        onTimeUpdate={handleTimeUpdate}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 15%',
          background: '#000',
          flexShrink: 0,
        }}
      />

      {/* Overlay */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>

        {/* Progress bar */}
        <div
          onClick={handleProgressClick}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'rgba(255,255,255,0.25)',
            cursor: 'pointer',
            pointerEvents: 'auto',
          }}
        >
          <div style={{
            height: '100%',
            background: '#1a73e8',
            width: progress + '%',
            transition: 'width 0.1s linear',
          }} />
        </div>

        {/* Time display */}
        <div style={{ position: 'absolute', top: '10px', left: '14px', pointerEvents: 'none' }}>
          <span style={{
            fontSize: '13px',
            color: '#fff',
            fontWeight: 600,
            textShadow: '0 1px 4px rgba(0,0,0,0.5)',
            fontVariantNumeric: 'tabular-nums',
          }}>{timeText}</span>
        </div>

        {/* Side controls */}
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          alignItems: 'center',
          pointerEvents: 'auto',
        }}>
          <SideBtn onClick={onClose} ariaLabel="閉じる">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff" style={{ pointerEvents: 'none' }}>
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </SideBtn>
          <SideBtn onClick={handleRewind} ariaLabel="10秒戻す">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff" style={{ pointerEvents: 'none' }}>
              <path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
            </svg>
          </SideBtn>
          <SideBtn onClick={handleMute} ariaLabel="ミュート">
            {isMuted ? (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff" style={{ pointerEvents: 'none' }}>
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff" style={{ pointerEvents: 'none' }}>
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
            )}
          </SideBtn>
          <button
            onClick={handleSpeed}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(60,60,60,0.75)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              fontSize: '13px',
              fontWeight: 700,
              fontFamily: 'inherit',
            }}
          >
            {SPEEDS[speedIdx]}x
          </button>
        </div>

        {/* Subtitle */}
        {showSubtitle && activeVideo === 'houjin-eigyo' && (
          <div style={{
            position: 'absolute',
            top: SUBTITLE_STYLE.houjin.top,
            left: SUBTITLE_STYLE.houjin.left,
            right: SUBTITLE_STYLE.houjin.right,
            background: SUBTITLE_STYLE.houjin.background,
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            borderRadius: SUBTITLE_STYLE.houjin.borderRadius,
            padding: SUBTITLE_STYLE.houjin.padding,
            textAlign: 'center',
            fontSize: SUBTITLE_STYLE.houjin.fontSize,
            fontWeight: SUBTITLE_STYLE.houjin.fontWeight,
            fontFamily: SUBTITLE_STYLE.houjin.fontFamily,
            color: SUBTITLE_STYLE.houjin.color,
            lineHeight: SUBTITLE_STYLE.houjin.lineHeight,
            whiteSpace: 'pre-line',
            pointerEvents: 'none',
          }}>
            {subtitle}
          </div>
        )}
        {showSubtitle && activeVideo !== 'houjin-eigyo' && (
          <div style={{
            position: 'absolute',
            bottom: SUBTITLE_STYLE.greeting.bottom,
            left: 0,
            right: 0,
            padding: `0 ${SUBTITLE_STYLE.greeting.paddingRight} 0 ${SUBTITLE_STYLE.greeting.paddingLeft}`,
            textAlign: 'center',
            fontSize: SUBTITLE_STYLE.greeting.fontSize,
            fontWeight: SUBTITLE_STYLE.greeting.fontWeight,
            color: SUBTITLE_STYLE.greeting.color,
            textShadow: SUBTITLE_STYLE.greeting.textShadow,
            lineHeight: SUBTITLE_STYLE.greeting.lineHeight,
            whiteSpace: 'pre-line',
            pointerEvents: 'none',
          }}>
            {subtitle}
          </div>
        )}

        {/* Chapter buttons */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          pointerEvents: 'auto',
        }}>
          {CHAPTERS.map(ch => (
            <button
              key={ch.label}
              onClick={() => handleChapter(ch)}
              style={{ ...btnBase, background: 'rgba(50,40,40,0.65)' }}
            >
              {ch.label}
            </button>
          ))}
          <button
            onClick={onClose}
            style={{ ...btnBase, background: 'rgba(56,142,60,0.85)' }}
          >
            カジュアル面談を希望
          </button>
        </div>

      </div>
    </div>
  )
}
