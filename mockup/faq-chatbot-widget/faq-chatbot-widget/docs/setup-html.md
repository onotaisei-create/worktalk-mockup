# FAQ動画チャットボット 設置手順書（静的HTMLサイト向け）

## 納品物

```
faq-chatbot.js      ← チャットボット本体
faq-chatbot.css     ← スタイル
videos/
  └── greeting.mp4  ← 挨拶動画
```

---

## 設置手順

### 1. ファイルのアップロード

納品ファイルをサーバーにアップロードしてください。
配置例:

```
your-site/
├── index.html
├── faq-chatbot.js
├── faq-chatbot.css
└── videos/
    └── greeting.mp4
```

### 2. HTMLへの追加

チャットボットを表示したいページの `</body>` の直前に、以下の2行を追加してください。

```html
<link rel="stylesheet" href="/faq-chatbot.css">
<script src="/faq-chatbot.js"></script>
```

これだけで、ページ右下にチャットボタンが表示されます。

### 3. 動画ファイルの場所を指定（必要な場合のみ）

動画ファイルを別のフォルダに置いた場合は、scriptタグの前に設定を追加してください。

```html
<link rel="stylesheet" href="/faq-chatbot.css">
<script>
  window.FAQChatbotConfig = {
    videoBasePath: '/assets/videos/',
  };
</script>
<script src="/faq-chatbot.js"></script>
```

---

## カスタマイズ（オプション）

FAQ内容や動画をカスタマイズする場合は、`window.FAQChatbotConfig` で設定できます。

```html
<script>
  window.FAQChatbotConfig = {
    // 動画ファイルの配置場所
    videoBasePath: '/videos/',

    // FAQカテゴリ
    categories: [
      { id: 'apply', name: '応募について', icon: '📝' },
      { id: 'work', name: '勤務について', icon: '🏢' },
    ],

    // FAQ項目
    faqs: [
      {
        id: 'apply-1',
        category: '応募について',
        question: '未経験でも応募できますか？',
        answer: 'はい、大歓迎です！',
        videoId: 'faq-apply-1',
        order: 1,
      },
      // ... 他のFAQ項目
    ],

    // 動画ファイルの定義
    videos: [
      {
        id: 'greeting',
        videoUrl: 'greeting.mp4',
        duration: 10,
        isPlaceholder: false,
      },
      {
        id: 'faq-apply-1',
        videoUrl: 'apply-1.mp4',
        duration: 15,
        isPlaceholder: false,
      },
      // ... 他の動画
    ],

    // チャットボットの設定
    config: {
      greetingMessage: 'こんにちは！ご質問があればお気軽にどうぞ！',
    },
  };
</script>
<script src="/faq-chatbot.js"></script>
```

---

## 対応ブラウザ

- Chrome（最新版）
- Firefox（最新版）
- Safari（最新版）
- Edge（最新版）
- iOS Safari
- Android Chrome

---

## トラブルシューティング

**Q: チャットボタンが表示されない**
→ ブラウザの開発者ツール（F12）でエラーが出ていないか確認してください。ファイルパスが正しいか確認してください。

**Q: 動画が再生されない**
→ 動画ファイルのパスが正しいか確認してください。`videoBasePath` の設定が実際のファイル配置と一致しているか確認してください。

**Q: 他のCSSと競合する**
→ チャットボットのスタイルはスコープ化されていますが、万が一競合する場合はお知らせください。
