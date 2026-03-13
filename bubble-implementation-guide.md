# Bubble実装手順書 - 求人一覧ページ ブラッシュアップ

> **対象ページ:** hp_top
> **対象範囲:** 求人一覧タブのみ
> **参考サイト:** https://hrmos.co/pages/twostone-s/jobs
> **モックアップ:** `mockup/index.html` をブラウザで開いてデザイン参照

---

## 前提情報

### 既存エレメント構成
```
Group 求人一覧
  └ Group 求人情報
      └ Group KZ
          └ Group 会社情報
              └ RepeatingGroup 求人票
                  └ Group（カード: 職種・募集ポジション + 給与のみ）
```

### 使用するデータフィールド（求人票タイプ）
| フィールド | 型 | 用途 |
|---|---|---|
| 職種・募集ポジション | text | カードタイトル |
| 給与 | text | カード説明文 |
| 想定年収 | text | カード説明文 |
| 勤務地 | text | フィルター + タグ |
| 雇用形態 | text | フィルター + タグ + バッジ |
| 該当職種 | 大職種 | フィルター + タグ |
| 勤務体制・働き方 | text | タグ |
| 会社名 | 会社情報 | 企業ロゴ取得 |
| job_open | yes/no | 公開制御 |

---

## Step 1: Group 求人一覧の内部にヒーロー画像を追加

### 1-1. Group「ヒーロー画像」を新規作成

1. `Group 求人一覧` の中の**一番上**に新しい Group を追加
2. 設定:

| プロパティ | 値 |
|---|---|
| Element name | `Group ヒーロー画像` |
| Layout > Container layout | Column |
| Layout > Width | 100% |
| Layout > Min height | 340px |
| Appearance > Background style | Flat color |
| Appearance > Background color | `#1a237e`（紺色） |
| 中央揃え | Vertical: center, Horizontal: center |

3. 中に Text エレメントを2つ配置:

**Text 1（メインテキスト）:**
| プロパティ | 値 |
|---|---|
| テキスト | `MAKE YOUR WILL COME TRUE`（またはお好みのキャッチコピー） |
| Font size | 36px |
| Font weight | Bold (800) |
| Font color | `#FFFFFF` |
| Letter spacing | 6 |
| Alignment | Center |

**Text 2（サブテキスト）:**
| プロパティ | 値 |
|---|---|
| テキスト | `一人ひとりの「will」を実現する` |
| Font size | 16px |
| Font color | `#FFFFFF` |
| Letter spacing | 2 |
| Alignment | Center |

> **ヒント:** 会社情報にバナー画像フィールドがあれば、Groupの Background style を Image にして `Current Page's 会社情報's バナー画像` を設定するとより良い。

---

## Step 2: 検索バー＋件数表示を追加

### 2-1. Group「検索・件数バー」を新規作成

`Group ヒーロー画像` の直下に配置:

| プロパティ | 値 |
|---|---|
| Element name | `Group 検索・件数バー` |
| Layout > Container layout | Row |
| Layout > Width | 100% |
| Layout > Padding top/bottom | 24px |
| Appearance > Background style | None |
| Column gap | 20px |
| Vertical alignment | center |

### 2-2. SearchBox（検索入力）

Group「検索・件数バー」の**左側**に配置:

| プロパティ | 値 |
|---|---|
| Element name | `SearchBox 求人検索` |
| Placeholder | `この会社の求人を探す` |
| Width | 320px |
| Appearance > Font size | 14px |
| Appearance > Border radius | 4px |
| Appearance > Border color | `#CCCCCC` |
| Appearance > Padding left | 40px（アイコン分） |

> **ヒント:** SearchBoxの左側にIcon エレメント（虫眼鏡 🔍）を重ねて配置するとよりリッチに。

### 2-3. Text（件数表示）

Group「検索・件数バー」の**右側**に配置:

| プロパティ | 値 |
|---|---|
| Element name | `Text 件数表示` |
| テキスト（Dynamic） | `全 RepeatingGroup 求人票's List of 求人票s:count 件中 RepeatingGroup 求人票's List of 求人票s:count 件を表示しています` |
| Font size | 14px |
| Font color | `#666666` |
| Alignment | Right |
| Layout > Right align | ✅ |

---

## Step 3: メインコンテンツを2カラム化

### 3-1. Group「メインコンテンツ」を新規作成

`Group 検索・件数バー` の直下に配置:

| プロパティ | 値 |
|---|---|
| Element name | `Group メインコンテンツ` |
| Layout > Container layout | **Row** |
| Layout > Width | 100% |
| Column gap | 24px |
| Layout > Align items | flex-start (Top) |

---

## Step 4: サイドバーフィルターを構築

### 4-1. Group「サイドバーフィルター」

`Group メインコンテンツ` の**左側**に配置:

| プロパティ | 値 |
|---|---|
| Element name | `Group サイドバーフィルター` |
| Layout > Container layout | Column |
| Layout > Width | 260px (Fixed) |
| Appearance > Background color | `#FFFFFF` |
| Appearance > Border | all sides, 1px, `#E0E0E0` |
| Appearance > Border radius | 4px |
| Make this element fixed-width | ✅ |

### 4-2. 雇用形態フィルター

`Group サイドバーフィルター` の中に追加:

**Group「フィルター雇用形態」:**
| プロパティ | 値 |
|---|---|
| Layout > Container layout | Column |
| Padding | 16px 20px |
| Border bottom | 1px `#EEEEEE` |

**中身:**
1. **Text** `雇用形態` (font-weight: 700, font-size: 14px, color: #333, margin-bottom: 12px)
2. **Checkbox**（各選択肢ごと）:
   - 正社員
   - 契約社員
   - 業務委託

   各チェックボックスの設定:
   | プロパティ | 値 |
   |---|---|
   | Font size | 14px |
   | Font color | `#555555` |

> **重要:** チェックボックスの代わりに RepeatingGroup + Checkbox を使う場合、Data source には求人票データから雇用形態のユニーク値リストを取得（後述のStep 6参照）。

### 4-3. エリアフィルター

同様の構造で `Group フィルターエリア` を追加:
- タイトル: `エリア`
- チェックボックス: 東京, 大阪, 福岡 など（勤務地フィールドのユニーク値）

### 4-4. 職種フィルター

同様の構造で `Group フィルター職種` を追加:
- タイトル: `職種`
- チェックボックス: 該当職種（大職種型）のリストを表示

### 4-5. フィルターボタン

**Button「検索結果を表示する」:**
| プロパティ | 値 |
|---|---|
| Width | 100% |
| Padding | 10px |
| Background color | `#1A73E8` |
| Font color | `#FFFFFF` |
| Font size | 14px |
| Font weight | 600 |
| Border radius | 4px |

**Button「すべての条件をリセット」:**
| プロパティ | 値 |
|---|---|
| Width | 100% |
| Padding | 10px |
| Background color | `#F5F5F5` |
| Font color | `#666666` |
| Border | 1px `#DDDDDD` |
| Border radius | 4px |

---

## Step 5: 求人カードを改修

### 5-1. Group「求人リスト」

`Group メインコンテンツ` の**右側**に配置:

| プロパティ | 値 |
|---|---|
| Element name | `Group 求人リスト` |
| Layout > Container layout | Column |
| Layout > Width | 残りスペース（flex: 1 的な設定） |

### 5-2. RepeatingGroup 求人票（既存を改修）

既存の RepeatingGroup を `Group 求人リスト` の中に移動し、設定を確認:

| プロパティ | 値 |
|---|---|
| Type of content | 求人票 |
| Data source | Search for 求人票s（Step 6で詳細設定） |
| Columns | 1 |
| Layout > Row gap | 16px |

### 5-3. カード内レイアウトの改修

RepeatingGroup内のセル（Group）を以下のように改修:

| プロパティ | 値 |
|---|---|
| Layout > Container layout | **Row** |
| Appearance > Background color | `#FFFFFF` |
| Appearance > Border | all sides, 1px, `#E0E0E0` |
| Appearance > Border radius | 4px |
| Padding | 20px 24px |
| Column gap | 20px |
| Hover > Box shadow | `0 2px 12px rgba(0,0,0,0.08)` |

### 5-4. 企業ロゴ画像

カード内の**左側**に Image を配置:

| プロパティ | 値 |
|---|---|
| Element name | `Image 企業ロゴ` |
| Dynamic image | `Current cell's 求人票's 会社名's 企業ロゴ` |
| Width | 200px (Fixed) |
| Height | 130px |
| Appearance > Border radius | 4px |
| Appearance > Border | 1px `#EEEEEE` |
| Background | `#F8F8F8` |
| Image fit | Contain |

### 5-5. カード情報部分

カード内の**右側**に Group を配置:

| プロパティ | 値 |
|---|---|
| Element name | `Group カード情報` |
| Layout > Container layout | Column |
| Row gap | 8px |
| Width | 残りスペース |

**中身（上から順に）:**

#### Text: 職種・募集ポジション（タイトル）
| プロパティ | 値 |
|---|---|
| Dynamic text | `Current cell's 求人票's 職種・募集ポジション` |
| Font size | 17px |
| Font weight | 600 |
| Font color | `#1A73E8` |
| Line height | 1.4 |
| This element is clickable | ✅ |

#### Text: 説明文
| プロパティ | 値 |
|---|---|
| Dynamic text | `Current cell's 求人票's 給与` |
| Font size | 13px |
| Font color | `#666666` |
| Line height | 1.6 |
| Cut off content if text is too long | ✅（2行で切る） |

#### Group: タグ一覧
| プロパティ | 値 |
|---|---|
| Layout > Container layout | Row |
| Wrap | ✅ |
| Column gap | 6px |
| Row gap | 6px |

**タグ（それぞれ Text エレメント）:**

各タグの共通設定:
| プロパティ | 値 |
|---|---|
| Padding | 3px 10px |
| Font size | 12px |
| Font color | `#555555` |
| Border | 1px `#D0D0D0` |
| Border radius | 3px |
| Background color | `#FAFAFA` |

| タグ | Dynamic text | 表示条件 |
|---|---|---|
| 勤務地 | `Current cell's 求人票's 勤務地` | is not empty |
| 職種 | `Current cell's 求人票's 該当職種's 名前`（※） | is not empty |
| 雇用形態 | `Current cell's 求人票's 雇用形態` | is not empty |
| 働き方 | `Current cell's 求人票's 勤務体制・働き方` | is not empty |

> ※ 大職種タイプの表示名フィールドを確認して適宜調整

#### Group: フッター（バッジ + 住所）
| プロパティ | 値 |
|---|---|
| Layout > Container layout | Row |
| Column gap | 12px |
| Vertical alignment | Center |

**Badge（雇用形態）:**
| プロパティ | 値 |
|---|---|
| Dynamic text | `Current cell's 求人票's 雇用形態` |
| Padding | 3px 10px |
| Font size | 12px |
| Font color | `#1A73E8` |
| Border | 1px `#1A73E8` |
| Border radius | 3px |
| Background color | `#FFFFFF` |

**Text（勤務地住所）:**
| プロパティ | 値 |
|---|---|
| Dynamic text | `Current cell's 求人票's 勤務地` |
| Font size | 13px |
| Font color | `#888888` |

---

## Step 6: フィルターロジックの実装

### 6-1. Custom State の設定

`Group 求人一覧` に以下の Custom State を追加:

| State name | Type |
|---|---|
| `selected_雇用形態` | text (List) |
| `selected_勤務地` | text (List) |
| `selected_職種` | text (List) |
| `search_text` | text |

### 6-2. チェックボックスのワークフロー

各チェックボックスの `When Checkbox is checked` / `unchecked` ワークフロー:

**例: 雇用形態「正社員」チェックボックス**

`When Checkbox 正社員 is checked:`
1. Action: Set state of `Group 求人一覧`
   - State: `selected_雇用形態`
   - Value: `Group 求人一覧's selected_雇用形態:plus item "正社員"`

`When Checkbox 正社員 is unchecked:`
1. Action: Set state of `Group 求人一覧`
   - State: `selected_雇用形態`
   - Value: `Group 求人一覧's selected_雇用形態:minus item "正社員"`

> 同様のパターンを他のチェックボックスにも適用。

### 6-3. 検索ボックスのワークフロー

`When SearchBox 求人検索's value is changed:`
1. Action: Set state of `Group 求人一覧`
   - State: `search_text`
   - Value: `SearchBox 求人検索's value`

### 6-4. RepeatingGroup の Data source を変更

RepeatingGroup 求人票の Data source を以下に変更:

```
Search for 求人票s:
  会社名 = Current Page's 会社情報
  job_open = yes
```

**追加の制約（Conditional）:**

条件1: `Group 求人一覧's selected_雇用形態:count > 0`
→ Data source に追加制約: `雇用形態 is in Group 求人一覧's selected_雇用形態`

条件2: `Group 求人一覧's selected_勤務地:count > 0`
→ Data source に追加制約: `勤務地 is in Group 求人一覧's selected_勤務地`

条件3: `Group 求人一覧's selected_職種:count > 0`
→ Data source に追加制約: `該当職種 is in Group 求人一覧's selected_職種`

条件4: `Group 求人一覧's search_text is not empty`
→ Data source に追加制約: `職種・募集ポジション contains Group 求人一覧's search_text`

> **Bubble Tips:**
> - 複数条件はRepeatingGroupのConditionalタブで設定するか、:filtered を使って実装
> - 「is in」制約はリスト内のいずれかに一致する場合にマッチ

### 6-5. リセットボタンのワークフロー

`When Button リセット is clicked:`
1. Set state `selected_雇用形態` → empty list
2. Set state `selected_勤務地` → empty list
3. Set state `selected_職種` → empty list
4. Set state `search_text` → empty
5. Reset relevant inputs (Reset group action)

---

## Step 7: スタイリングのポイント

### カラーパレット
| 用途 | カラーコード |
|---|---|
| プライマリ（青） | `#1A73E8` |
| プライマリホバー | `#1565C0` |
| テキスト主要 | `#333333` |
| テキスト副 | `#666666` |
| テキスト薄 | `#888888` |
| ボーダー | `#E0E0E0` |
| 背景（ページ） | `#F5F5F5` |
| 背景（カード） | `#FFFFFF` |
| タグ背景 | `#FAFAFA` |
| ヒーロー背景 | `#1A237E` |

### フォントサイズ
| 用途 | サイズ |
|---|---|
| カードタイトル | 17px |
| 本文・フィルタータイトル | 14px |
| 説明文・タグ・バッジ | 12-13px |
| ヒーローメイン | 36px |
| ヒーローサブ | 16px |

---

## Step 8: 動作確認チェックリスト

- [ ] ヒーロー画像が求人一覧タブに表示される
- [ ] 検索バーにテキストを入力すると求人が絞り込まれる
- [ ] 「全 X 件中 Y 件を表示しています」が正しく動的に変わる
- [ ] サイドバーの各チェックボックスで求人が絞り込まれる
- [ ] リセットボタンでフィルターがすべて解除される
- [ ] 求人カードに企業ロゴが表示される
- [ ] 求人カードにタイトル・説明・タグ・バッジが表示される
- [ ] カードホバー時にシャドウが付く
- [ ] カジュアル面談・選考応募タブは従来通り動作する
- [ ] レスポンシブ表示（モバイル）でサイドバーが上部に回り込む
