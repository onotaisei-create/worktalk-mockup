# FAQ動画チャットボット 設置手順書（WordPress向け）

## 納品物

```
faq-chatbot.js      ← チャットボット本体
faq-chatbot.css     ← スタイル
videos/
  ├── greeting.mp4  ← 挨拶動画
  ├── apply-1.mp4   ← FAQ回答動画
  └── ...
```

---

## 設置手順

### 方法A: プラグインを使う方法（推奨）

WordPress管理画面から操作するだけで設置できます。

#### 1. 「WPCode」プラグインをインストール

1. WordPress管理画面 → プラグイン → 新規追加
2. 「WPCode」で検索
3. 「WPCode – Insert Headers and Footers」をインストール → 有効化

#### 2. ファイルをアップロード

**動画ファイル:**
1. WordPress管理画面 → メディア → 新しいメディアファイルを追加
2. 動画ファイル（greeting.mp4, apply-1.mp4 等）をアップロード
3. 各動画のURLをメモしておく（例: `https://example.com/wp-content/uploads/2026/02/greeting.mp4`）

**JS/CSSファイル:**
1. FTPクライアント（FileZilla等）またはサーバーのファイルマネージャーで接続
2. `wp-content/themes/あなたのテーマ/assets/` フォルダを作成
3. `faq-chatbot.js` と `faq-chatbot.css` をアップロード

#### 3. コードを追加

1. WordPress管理画面 → WPCode → ヘッダー＆フッター
2. **「Head」セクション**に以下を追加:

```html
<link rel="stylesheet" href="/wp-content/themes/あなたのテーマ/assets/faq-chatbot.css">
```

3. **「Footer」セクション**に以下を追加:

```html
<script>
  window.FAQChatbotConfig = {
    videoBasePath: 'https://example.com/wp-content/uploads/2026/02/',
  };
</script>
<script src="/wp-content/themes/あなたのテーマ/assets/faq-chatbot.js"></script>
```

4. 「変更を保存」をクリック

#### 4. 特定のページだけに表示したい場合

WPCodeの「スニペット」機能を使うと、特定のページだけにチャットボットを表示できます。

1. WPCode → スニペット → 新規追加
2. 上記のコードを入力
3. 「挿入」タブで「特定のページ」を選択
4. 対象ページを指定

---

### 方法B: テーマファイルを直接編集する方法

テーマのカスタマイズに慣れている場合はこちらの方法も使えます。

#### 1. ファイルを配置

FTP経由で以下のように配置:

```
wp-content/themes/あなたのテーマ/
├── assets/
│   ├── faq-chatbot.js
│   └── faq-chatbot.css
└── footer.php  ← ここに追記
```

#### 2. footer.phpに追記

`</body>` タグの直前に以下を追加:

```php
<!-- FAQ動画チャットボット -->
<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/assets/faq-chatbot.css">
<script>
  window.FAQChatbotConfig = {
    videoBasePath: '<?php echo wp_upload_dir()["baseurl"]; ?>/videos/',
  };
</script>
<script src="<?php echo get_template_directory_uri(); ?>/assets/faq-chatbot.js"></script>
```

---

## 動画のアップロード上限について

WordPressのデフォルトではアップロードサイズに上限があります（通常2MB〜50MB）。

動画ファイルが大きい場合:
1. サーバーの `php.ini` で `upload_max_filesize` と `post_max_size` を変更
2. または、FTP経由で直接アップロード

---

## トラブルシューティング

**Q: プラグインからコードを追加したが反映されない**
→ ブラウザのキャッシュをクリアしてください。WordPressのキャッシュプラグイン（WP Super Cache等）を使用している場合は、そちらのキャッシュもクリアしてください。

**Q: 動画のURLがわからない**
→ メディアライブラリで動画をクリック → 右側に表示される「ファイルのURL」をコピーしてください。

**Q: テーマを変更した後にチャットボットが消えた**
→ 方法Aのプラグイン方式であればテーマ変更の影響を受けません。方法Bの場合は、新しいテーマにも同様の設定を行ってください。
