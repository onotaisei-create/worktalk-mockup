import type { FAQCategory, FAQWithVideo, FAQVideo, ChatbotConfig } from '../components/types'

export const DEFAULT_CATEGORIES: FAQCategory[] = [
  { id: 'apply', name: '応募について', icon: '📝' },
  { id: 'work', name: '勤務について', icon: '🏢' },
]

export const DEFAULT_VIDEOS: FAQVideo[] = [
  {
    id: 'greeting',
    videoUrl: 'greeting.mp4',
    duration: 10,
    isPlaceholder: false,
  },
  {
    id: 'faq-apply-1',
    videoUrl: '',
    duration: 5,
    isPlaceholder: true,
  },
  {
    id: 'faq-apply-2',
    videoUrl: '',
    duration: 5,
    isPlaceholder: true,
  },
  {
    id: 'faq-work-1',
    videoUrl: '',
    duration: 5,
    isPlaceholder: true,
  },
  {
    id: 'faq-work-2',
    videoUrl: '',
    duration: 5,
    isPlaceholder: true,
  },
]

export const DEFAULT_FAQS: FAQWithVideo[] = [
  {
    id: 'apply-1',
    category: '応募について',
    question: '未経験でも応募できますか？',
    answer: 'はい、大歓迎です！充実した研修制度があるので、海が好きな方なら誰でも活躍できます。現在活躍しているスタッフの約70%が未経験からスタートしています。',
    videoId: 'faq-apply-1',
    order: 1,
  },
  {
    id: 'apply-2',
    category: '応募について',
    question: '年齢制限はありますか？',
    answer: '18歳以上であれば、年齢の上限はありません。20代から50代まで幅広い年齢のスタッフが活躍しています。',
    videoId: 'faq-apply-2',
    order: 2,
  },
  {
    id: 'work-1',
    category: '勤務について',
    question: 'シフトはどのように決まりますか？',
    answer: '基本的に前月にシフト希望を提出していただき、調整の上決定します。週2日〜勤務可能で、扶養内で働くことも可能です。',
    videoId: 'faq-work-1',
    order: 3,
  },
  {
    id: 'work-2',
    category: '勤務について',
    question: '住む場所はありますか？',
    answer: 'はい、会社寮を完備しています。1人部屋3.6万円/月、2人部屋1.8万円/月、3人部屋1.2万円/月で、水道光熱費込みです。',
    videoId: 'faq-work-2',
    order: 4,
  },
]

export const DEFAULT_CONFIG: ChatbotConfig = {
  greetingVideoId: 'greeting',
  greetingMessage: 'こんにちは！サンライズトラベル採用担当です。ご質問があればお気軽にどうぞ！',
  farewellMessage: 'ご質問ありがとうございました。またいつでもお声がけください！',
  enableSound: false,
}
