# FAQ動画チャットボット 仕様書

## 概要

AIアバター動画を活用したルールベースのFAQチャットボットシステム。
ユーザーが質問を選択すると、対応する動画で回答を提供する。

---

## 主な機能

| 機能 | 説明 |
|------|------|
| 動画付き挨拶 | チャットボット起動時に挨拶動画を自動再生 |
| カテゴリ分類 | FAQをカテゴリ別に整理して表示 |
| 動画回答 | 質問選択で対応する回答動画を再生 |
| エンゲージメント機能 | 動画終了後に他の質問への誘導UI |
| レスポンシブ対応 | モバイル:フルスクリーン / デスクトップ:ウィジェット |
| アクセシビリティ | キーボード操作、フォーカストラップ対応 |

---

## ユーザーフロー

```
[トリガーボタンをクリック]
         ↓
[挨拶画面] 動画自動再生 + よくある質問3件表示
         ↓
    ┌────┴────┐
    ↓         ↓
[質問を選択]  [その他の質問→]
    ↓              ↓
[回答動画再生] ← [カテゴリ選択] → [質問リスト]
    ↓
[動画終了]
    ↓
[エンゲージメントUI]
  - 他の質問も見てみませんか？
  - 質問ボタン（パルスアニメーション）
  - カテゴリに戻る / 閉じる
```

---

## コンポーネント構成

```
src/components/FAQChatbot/
├── index.ts              # エクスポート
├── FAQChatbot.tsx        # メインコンポーネント（状態管理）
├── ChatbotTrigger.tsx    # 右下のトリガーボタン
├── ChatbotWindow.tsx     # チャットウィンドウ本体
├── ChatbotHeader.tsx     # ウィンドウヘッダー（タイトル、戻る、閉じる）
├── VideoPlayer.tsx       # 動画プレイヤー（ローディング、スキップ対応）
├── CategoryList.tsx      # カテゴリ選択画面
├── QuestionList.tsx      # 質問リスト画面
└── types.ts              # 型定義・静的データ
```

---

## データ構造

### FAQカテゴリ

```typescript
interface FAQCategory {
  id: string       // 一意のID（例: 'apply', 'work'）
  name: string     // 表示名（例: '応募について'）
  icon: string     // 絵文字アイコン（例: '📝'）
}
```

### 動画設定

```typescript
interface FAQVideo {
  id: string              // 動画ID（例: 'greeting', 'faq-apply-1'）
  videoUrl: string        // 動画ファイルパス
  thumbnailUrl?: string   // サムネイル画像パス
  duration?: number       // 動画の長さ（秒）
  isPlaceholder: boolean  // プレースホルダーモード（動画未準備時）
}
```

### FAQ項目

```typescript
interface FAQWithVideo {
  id: string        // FAQ ID（例: 'apply-1'）
  category: string  // カテゴリ名（例: '応募について'）
  question: string  // 質問文
  answer: string    // 回答テキスト（アクセシビリティ用）
  videoId?: string  // 対応する動画ID
  order: number     // 表示順序
}
```

### チャットボット設定

```typescript
interface ChatbotConfig {
  greetingVideoId: string   // 挨拶動画のID
  greetingMessage: string   // 挨拶メッセージ
  farewellMessage: string   // 終了メッセージ
  enableSound: boolean      // 音声ON/OFF
}
```

---

## 状態管理

### FAQChatbot（親コンポーネント）

| State | 型 | 説明 |
|-------|-----|------|
| isOpen | boolean | ウィンドウの開閉状態 |
| currentView | ViewState | 現在の画面（greeting/categories/questions/answer） |
| selectedCategory | FAQCategory \| null | 選択中のカテゴリ |
| selectedFAQ | FAQWithVideo \| null | 選択中のFAQ |
| hasShownGreeting | boolean | 挨拶を表示済みかどうか |

### ChatbotWindow（子コンポーネント）

| State | 型 | 説明 |
|-------|-----|------|
| isVideoLoading | boolean | 挨拶動画のローディング状態 |
| isVideoEnded | boolean | 回答動画の終了状態 |

### VideoPlayer

| State | 型 | 説明 |
|-------|-----|------|
| isLoading | boolean | 動画のローディング状態 |
| progress | number | 再生進捗（0-100） |

---

## 動画ファイル構成

```
public/videos/chatbot/
├── greeting.mp4      # 挨拶動画
├── apply-1.mp4       # 応募FAQ1の回答動画
├── apply-2.mp4       # 応募FAQ2の回答動画
├── work-1.mp4        # 勤務FAQ1の回答動画
└── work-2.mp4        # 勤務FAQ2の回答動画
```

### 動画仕様

| 項目 | 推奨値 |
|------|--------|
| アスペクト比 | 9:16（縦長）推奨、16:9も可 |
| 解像度 | 720p以上 |
| 形式 | MP4 (H.264) |
| 長さ | 10-30秒程度 |
| ファイルサイズ | 5MB以下推奨 |

---

## UI仕様

### トリガーボタン

- **位置**: 画面右下固定（bottom: 6, right: 6）
- **サイズ**: 56x56px（モバイル）、60x60px（デスクトップ）
- **アニメーション**: パルスエフェクト（注目を引く）
- **z-index**: 50

### チャットウィンドウ

| 項目 | モバイル | デスクトップ |
|------|----------|-------------|
| サイズ | フルスクリーン | 380x580px |
| 位置 | inset-0 | bottom-24, right-6 |
| 角丸 | なし | 16px |
| z-index | 50 | 50 |

### 動画終了後エンゲージメント

1. **オーバーレイ拡大**: 下から上へスライドアップ（0.5秒）
2. **背景ブラー**: 動画に4pxのぼかし効果
3. **ボタンパルス**: 質問ボタンが青く脈打つアニメーション
4. **誘導メッセージ**: 「他の質問も見てみませんか？」

---

## CSSアニメーション

```css
/* トリガーボタンのパルス */
.chatbot-trigger-pulse::before {
  animation: chatbotPulse 2s ease-out infinite;
}

/* ウィンドウ表示アニメーション */
.chatbot-window-enter {
  animation: chatWindowSlideUp 0.3s ease-out;
}

/* 動画終了後のボタンパルス */
.video-ended-button {
  animation: buttonPulse 1.5s ease-in-out infinite;
}

/* オーバーレイのスライドアップ */
.overlay-slide-up {
  animation: overlaySlideUp 0.5s ease-out forwards;
}

/* 動画の背景ブラー */
.video-blur {
  filter: blur(4px);
  transition: filter 0.5s ease-out;
}
```

---

## アクセシビリティ

| 機能 | 実装 |
|------|------|
| キーボード操作 | Escapeキーで閉じる |
| フォーカストラップ | ウィンドウ内でフォーカスを循環 |
| ARIA属性 | role="dialog", aria-modal="true", aria-label |
| テキスト代替 | 動画内容をanswerテキストで提供 |

---

## カスタマイズポイント

### 1. FAQ項目の追加

`types.ts`の`FAQS_WITH_VIDEO`に項目を追加:

```typescript
{
  id: 'new-faq-1',
  category: '新カテゴリ',
  question: '質問文',
  answer: '回答テキスト',
  videoId: 'faq-new-1',
  order: 5,
}
```

### 2. カテゴリの追加

`types.ts`の`FAQ_CATEGORIES`に追加:

```typescript
{ id: 'benefits', name: '待遇について', icon: '🎁' }
```

### 3. 動画の追加

1. `public/videos/chatbot/`に動画ファイルを配置
2. `types.ts`の`FAQ_VIDEOS`に登録:

```typescript
{
  id: 'faq-new-1',
  videoUrl: '/videos/chatbot/new-1.mp4',
  duration: 15,
  isPlaceholder: false,
}
```

### 4. プレースホルダーモード

動画が準備できていない場合、`isPlaceholder: true`で代替表示:
- アバターアイコン + 「動画準備中...」表示
- 指定秒数後に自動で次の画面へ

---

## 独立サービス化への考慮事項

### 必要な変更

1. **データソースの外部化**
   - 現在: `types.ts`にハードコード
   - 変更: API/CMS/データベースから取得

2. **動画ホスティング**
   - 現在: `public/videos/`にローカル配置
   - 変更: CDN/S3/動画配信サービス

3. **設定の外部化**
   - カラーテーマ
   - ブランドロゴ
   - メッセージ文言

4. **埋め込みスクリプト化**
   - iframeまたはJSウィジェットとして提供

### 推奨アーキテクチャ

```
[管理画面]
    ↓ API
[バックエンド]
  - FAQ管理
  - 動画管理
  - 顧客設定
    ↓ REST/GraphQL
[フロントエンド（ウィジェット）]
  - 埋め込みスクリプト
  - 設定に基づいてレンダリング
    ↓
[顧客サイト]
  - <script>タグで読み込み
```

---

## 技術スタック

| 項目 | 技術 |
|------|------|
| フレームワーク | Next.js 14 (App Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS |
| 状態管理 | React useState/useCallback |
| アニメーション | CSS Keyframes |
| 動画再生 | HTML5 Video API |

---

## ファイル一覧

| ファイル | 行数（概算） | 役割 |
|----------|-------------|------|
| FAQChatbot.tsx | 90行 | 状態管理・メインロジック |
| ChatbotWindow.tsx | 320行 | UIレイアウト・画面切替 |
| ChatbotTrigger.tsx | 50行 | トリガーボタン |
| ChatbotHeader.tsx | 60行 | ヘッダーUI |
| VideoPlayer.tsx | 170行 | 動画再生・ローディング |
| CategoryList.tsx | 50行 | カテゴリ選択UI |
| QuestionList.tsx | 60行 | 質問リストUI |
| types.ts | 160行 | 型定義・静的データ |
| globals.css（追加分） | 100行 | アニメーション定義 |

---

## 今後の拡張案

- [ ] 音声ON/OFF切替
- [ ] 再生速度調整
- [ ] 字幕表示
- [ ] 分析・トラッキング連携
- [ ] AI連携（ルールベース→自然言語）
- [ ] 多言語対応
- [ ] A/Bテスト機能
