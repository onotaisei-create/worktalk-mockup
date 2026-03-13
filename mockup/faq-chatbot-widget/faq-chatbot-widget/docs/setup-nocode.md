# FAQ動画チャットボット 設置手順書（Wix / ペライチ等ノーコードサイト向け）

## 概要

Wixやペライチなどのノーコードプラットフォームでは、JSファイルを直接アップロードできないため、
**外部ホスティング（GitHub Pages）にファイルを配置し、そのURLを参照する方式**で設置します。

このセットアップは弊社で実施しますので、お客様の作業は最小限です。

---

## 弊社での準備作業

### 1. GitHub Pagesにファイルをデプロイ

弊社で以下の作業を行います:

1. 顧客専用のGitHubリポジトリを作成
2. `faq-chatbot.js` と `faq-chatbot.css` をデプロイ
3. 公開URLを発行（例: `https://your-org.github.io/client-name/`）

### 2. 動画ファイルの配置

動画ファイルは以下のいずれかに配置:

- **A**: 顧客サイト内にアップロード（Wixのメディアマネージャー等）
- **B**: 外部ストレージ（S3等）にアップロードしURLを提供

---

## Wixでの設置手順

### 1. カスタムコードの追加

1. Wixダッシュボード → **設定** → **カスタムコード**
2. 「+ カスタムコードを追加」をクリック
3. 以下のコードを入力:

```html
<link rel="stylesheet" href="https://your-org.github.io/client-name/faq-chatbot.css">
<script>
  window.FAQChatbotConfig = {
    videoBasePath: 'https://video.wixstatic.com/video/xxxxxxx/',
  };
</script>
<script src="https://your-org.github.io/client-name/faq-chatbot.js"></script>
```

4. 配置場所: **Body - 終了タグ**
5. ページ: **全ページに追加** または **特定のページを選択**
6. 「適用」をクリック

### 2. 動画のアップロード（Wixの場合）

1. Wixダッシュボード → **メディアマネージャー**
2. 動画ファイルをアップロード
3. 各動画のURLを取得（動画をクリック → 共有 → URLをコピー）
4. 上記コードの `videoBasePath` を適宜変更

---

## ペライチでの設置手順

### 1. HTML埋め込みブロックの追加

1. ペライチの編集画面を開く
2. ページの最下部に「HTML埋め込み」ブロックを追加
3. 以下のコードを入力:

```html
<link rel="stylesheet" href="https://your-org.github.io/client-name/faq-chatbot.css">
<script>
  window.FAQChatbotConfig = {
    videoBasePath: 'https://your-storage.com/videos/',
  };
</script>
<script src="https://your-org.github.io/client-name/faq-chatbot.js"></script>
```

4. 保存して公開

### 注意事項（ペライチ）

ペライチのHTML埋め込みはiframe内で動作するため、チャットボットの表示位置が
ブロック内に限定される場合があります。その場合は弊社にご連絡ください。

---

## Jimdo / STUDIO / その他のノーコードツール

基本的な手順は同じです:

1. 各プラットフォームの「カスタムHTML」「カスタムコード」機能を探す
2. 上記のコードを貼り付ける
3. 動画URLを設定する

プラットフォームごとの詳細な手順が必要な場合は弊社までお問い合わせください。

---

## 動画ファイルのホスティングについて

| 方法 | メリット | デメリット |
|------|---------|-----------|
| 顧客サイト内 | 管理が簡単 | プラットフォームの容量制限あり |
| S3 + CloudFront | 高速・安定 | 設定が必要（弊社で実施） |
| GitHub Pages | 無料・簡単 | 大容量ファイルには不向き |

動画ファイルは1本5MB以下に最適化して納品しますので、
多くの場合は顧客サイト内に配置可能です。

---

## FAQ更新時の対応

FAQ項目や動画を追加・変更する場合:

1. 弊社にご連絡ください
2. 新しい動画を制作（該当プランの場合）
3. `FAQChatbotConfig` を更新
4. GitHub Pagesを更新（弊社で実施）

お客様側で変更が必要になることはありません。

---

## トラブルシューティング

**Q: チャットボタンが表示されない**
→ カスタムコードの配置場所が「Body - 終了タグ」になっているか確認してください。

**Q: 動画が再生されない**
→ 動画URLが正しいか確認してください。Wixの場合、メディアマネージャーのURLは特殊な形式のため、正確にコピーしてください。

**Q: 表示位置がおかしい**
→ プラットフォームの制約により表示が異なる場合があります。弊社にスクリーンショットをお送りください。
