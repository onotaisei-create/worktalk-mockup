import { render } from 'preact'
import FAQChatbotApp from './FAQChatbotApp'
import './styles/widget.css'

declare global {
  interface Window {
    FAQChatbotConfig?: Record<string, unknown>
  }
}

// script タグの data 属性から設定を読み取る
function getScriptDataset(): DOMStringMap | null {
  const tag = document.querySelector('script[data-faq-chatbot]') as HTMLScriptElement | null
  return tag ? tag.dataset : null
}

// ドメイン・パス制御
function isAllowed(dataset: DOMStringMap): boolean {
  // ドメインチェック（data-domains が未設定なら全許可）
  const rawDomains = dataset.domains || ''
  if (rawDomains) {
    const domains = rawDomains.split(',').map(d => d.trim().toLowerCase()).filter(Boolean)
    if (domains.length > 0 && !domains.includes(window.location.hostname.toLowerCase())) {
      return false
    }
  }

  // パスチェック（data-paths="*" または未設定なら全許可）
  const rawPaths = dataset.paths || '*'
  if (rawPaths === '*') return true

  const currentPath = window.location.pathname
  return rawPaths.split(',').some(p => {
    p = p.trim()
    if (!p) return false
    // 末尾が / → 前方一致（/jobs/ → /jobs/tokyo も許可）
    if (p.endsWith('/')) return currentPath.startsWith(p) || currentPath === p.slice(0, -1)
    // それ以外 → 完全一致
    return currentPath === p
  })
}

function mount() {
  if (document.getElementById('faq-chatbot-root')) return

  const dataset = getScriptDataset()

  // data 属性で制御されている場合はフィルタを適用
  if (dataset && !isAllowed(dataset)) return

  // config 組み立て（data-video-base があれば優先）
  const config: Record<string, unknown> = { ...(window.FAQChatbotConfig || {}) }
  if (dataset?.videoBase) config.videoBasePath = dataset.videoBase

  const container = document.createElement('div')
  container.id = 'faq-chatbot-root'
  document.body.appendChild(container)

  render(<FAQChatbotApp config={config} />, container)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount)
} else {
  mount()
}
