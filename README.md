# DrugStore 在庫管理SPA（フロントエンド）

## アプリ概要（画面構成）

- 医薬品卸倉庫の業務を想定した在庫管理システムのフロントエンドです。
- 商品管理・入出庫・在庫状況・履歴確認をブラウザ上で操作できます。

・バックエンド（Laravel API）と連携し、リアルタイムに在庫を管理します。

## アプリケーションURL

http://localhost:5173

## 作成した目的

医薬品卸倉庫を想定した在庫管理システム（SPA仕様）で、「実際にどのようにシステム的に動くのか」の理解を含めた目的もありました。

## 技術構成　

### フロントエンド
- React 
- TypeScript  
- Vite
- React Router
- Tailwind css / MUI（Material UI）

### API連携
- Axios（APIクライアント）
- Laravel API（Sanctum認証）


## 機能一覧

### ■ 認証
- 管理者ログイン（メール + パスワード）
- スタッフログイン（社員番号 + PIN）
- 初回ログイン時のPIN変更機能

### ■ ダッシュボード
- 総商品数
- 総在庫数
- 本日入庫数
- 本日出庫数

### ■ 商品管理
- 商品一覧表示
- 商品登録
- 商品編集
- 商品削除

### ■ 在庫管理
- 在庫一覧表示（棚ごと）
- ロット単位の在庫管理

### ■ 入出庫処理
- 入庫登録
- 出庫登録

### ■ 履歴管理
- 入出庫履歴一覧表示
- CSV出力

<img width="1207" height="670" alt="Image" src="https://github.com/user-attachments/assets/eec7bb2b-5fc8-4123-b538-dd39db18ea1d" />

<img width="1270" height="658" alt="Image" src="https://github.com/user-attachments/assets/dc849e94-d550-4250-87ba-c250fb0e0b32" />

<img width="1278" height="673" alt="Image" src="https://github.com/user-attachments/assets/e120e37e-50e8-4d56-a054-f70f7a5e8005" />

<img width="1273" height="672" alt="Image" src="https://github.com/user-attachments/assets/805d2a95-ea04-4690-9cce-e5cf3346f171" />

<img width="1275" height="677" alt="Image" src="https://github.com/user-attachments/assets/f4e77b6e-b352-406b-af91-8061a3b29542" />

<img width="1275" height="684" alt="Image" src="https://github.com/user-attachments/assets/e8e240b1-2ab1-4488-8487-be0c0cca84d2" />

<img width="1271" height="660" alt="Image" src="https://github.com/user-attachments/assets/3947357e-c912-4290-bd35-5ad5f7ba22e4" />

# 環境構築

## 1. リポジトリをクローン

- git clone https://github.com/shoyama1010/drugstock-frontend.git
- cd drugstock-frontend

## 2.　パッケージをインストール

　npm install

## 3. 開発サーバー起動

　npm run dev

## 工夫した点
- ロール別認証（admin / staff）をフロント側で制御する理解
- (app/router.tsxではなく) PrivateRoute による認証ガードの設定方法
- ダッシュボードを実データと連動の仕方
- エラー時のUI表示（Alert）の方法
- 再利用可能なコンポーネント設計の考え方

## 苦労した点
■ 認証フローの分岐

 管理者（email）とスタッフ（employee_code + PIN）のログイン方式が異なるため、APIとフロントの分岐設計に苦労しました。

■ PIN変更フロー
- 初回ログイン時のみ PIN変更画面へ遷移する制御（requires_pin_change）を実装し、
- 状態管理とルーティング制御の整合性を取るのが難しかったです。

■ APIエラー処理
  422（バリデーション）・403（権限）など、ステータスごとの分岐処理とUI表示の実装に苦労しました。

■ 在庫データの整合性
  ロット × 棚（location）という構造をフロントで扱う際に、データ構造の理解と表示ロジックの整理に時間がかかりました。

##  今後の改善予定
- フォームバリデーションの統一（React Hook Form導入）
- UIのさらなる改善（入力補助・UX向上）
- グラフ表示（在庫推移）
- モバイル対応
- コンポーネントの再利用性向上
  

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
