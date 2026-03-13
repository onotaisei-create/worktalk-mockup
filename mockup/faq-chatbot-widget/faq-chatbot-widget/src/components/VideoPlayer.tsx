import { useEffect, useState, useRef } from 'preact/hooks'
import { useChatbotConfig } from '../config/context'

interface VideoPlayerProps {
  videoId: string
  onEnded: () => void
  onSkip?: () => void
  autoPlay?: boolean
}

export default function VideoPlayer({
  videoId,
  onEnded,
  onSkip,
  autoPlay = true,
}: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const { videos, videoBasePath } = useChatbotConfig()
  const video = videos.find(v => v.id === videoId)

  const resolveVideoUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
      return url
    }
    return videoBasePath + url
  }

  useEffect(() => {
    setIsLoading(true)
    setProgress(0)
  }, [videoId])

  useEffect(() => {
    if (video?.isPlaceholder) {
      const duration = (video.duration || 5) * 1000
      const interval = 100
      let elapsed = 0

      setIsLoading(false)

      timerRef.current = setInterval(() => {
        elapsed += interval
        setProgress((elapsed / duration) * 100)

        if (elapsed >= duration) {
          if (timerRef.current) {
            clearInterval(timerRef.current)
          }
          onEnded()
        }
      }, interval)

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
      }
    }
  }, [video, onEnded])

  const handleVideoLoaded = () => {
    setIsLoading(false)
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const percent = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(percent)
    }
  }

  const handleSkip = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    if (onSkip) {
      onSkip()
    } else {
      onEnded()
    }
  }

  if (!video || video.isPlaceholder) {
    return (
      <div className="relative aspect-[9/16] bg-gradient-to-br from-primary-500/10 to-ocean/10 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-ocean flex items-center justify-center shadow-lg">
              <svg
                className="w-14 h-14 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
              </svg>
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>

          <div className="mt-4 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
            動画準備中...
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
          <div
            className="h-full bg-primary-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        <button
          onClick={handleSkip}
          className="absolute bottom-3 right-3 px-3 py-1 text-xs bg-white/90 hover:bg-white text-gray-700 rounded-full shadow transition-colors"
        >
          スキップ
        </button>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 bg-black overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary-500/10 to-ocean/10 z-10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-ocean flex items-center justify-center shadow-lg mb-4">
            <svg
              className="w-10 h-10 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          </div>
          <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-sm text-gray-600">読み込み中...</p>
        </div>
      )}

      <video
        ref={videoRef}
        src={resolveVideoUrl(video.videoUrl)}
        poster={video.thumbnailUrl ? resolveVideoUrl(video.thumbnailUrl) : undefined}
        autoPlay={autoPlay}
        playsInline
        onLoadedData={handleVideoLoaded}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onEnded}
        className="absolute inset-0 w-full h-full object-cover"
      />

      <button
        onClick={handleSkip}
        className="absolute top-3 right-3 px-3 py-1 text-xs bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-20"
      >
        スキップ →
      </button>
    </div>
  )
}
