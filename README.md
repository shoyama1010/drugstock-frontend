# DrugStore 在庫管理アプリ

## アプリ概要（画面構成）

医薬品やドラッグストアなどの小売現場を想定した、商品・在庫・入出庫・スタッフ管理システムのフロントエンドです。

Laravel APIと連携したSPAとして構築し、入出庫処理に応じて在庫情報を更新・管理しています。

## 作成した目的

医薬品・ドラッグストアなどの小売現場を想定し、商品・在庫・入出庫・スタッフ情報を、一元管理できる在庫管理システムとして開発しました。

フロントエンドには React + TypeScript、バックエンドには Laravel API を採用し、SPAとしてフロントエンドとバックエンドを分離することで、

APIを介したデータ取得・更新、認証、ロール別の画面制御など、実際のWebアプリケーションに近い構成を意識して実装しました。

## アプリケーションURL
### ローカルURL
http://localhost:5173

## 公開デモ
https://drugstock-frontend-9pp2.vercel.app/

＊ 以前は下記URLでしたが、再デプロイの関係上、古いURLとなってます。

（https://drugstock-frontend-dh9jracrs-shoyama1010s-projects.vercel.app ）

### 管理ログイン
- メールアドレス：admin@example.com
- パスワード：password

管理者ログイン後、商品管理・在庫管理・入出庫処理・スタッフ管理などの機能をお試しいただけます。

### スタッフログイン

スタッフアカウントは、管理者画面の「スタッフ管理」から新規登録できます。

①管理者アカウントでログイン

②「スタッフ管理」→「新規スタッフ登録」を選択

③氏名・メールアドレスを入力してスタッフを登録

④登録完了時に「社員番号」と「4桁の仮PIN」が自動発行されます

⑤発行された社員番号・仮PINを使用してスタッフログインできます

※ 社員番号は `EMP1001` などの形式で自動採番されます。

※ 仮PINはランダムな4桁の数字で自動生成されます。

## 関連リポジトリ

バックエンドAPI： https://github.com/shoyama1010/drugs-stock-app

## 技術構成　

### フロントエンド
- React 
- TypeScript  
- Vite
- React Router
- Axios
- MUI（Material UI）* Tailwind CSSは、一部(login.tsx)しか使ってません。
- Vercel

## 認証とAPI連携

- ログイン成功時に取得したBearerトークンを保存し、
- Axiosのリクエスト時にAuthorizationヘッダーへ設定しています。

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

### ■ スタッフ登録＆管理
- スタッフ一覧表示
- スタッフ登録
- スタッフ詳細表示
- スタッフ情報編集
- スタッフ削除
- 有効・無効状態の表示
- 登録結果モーダル
- 発行された社員番号・仮PINの表示

<img width="1207" height="670" alt="Image" src="https://github.com/user-attachments/assets/eec7bb2b-5fc8-4123-b538-dd39db18ea1d" />

<img width="1270" height="658" alt="Image" src="https://github.com/user-attachments/assets/dc849e94-d550-4250-87ba-c250fb0e0b32" />

<img width="1278" height="673" alt="Image" src="https://github.com/user-attachments/assets/e120e37e-50e8-4d56-a054-f70f7a5e8005" />

<img width="1273" height="672" alt="Image" src="https://github.com/user-attachments/assets/805d2a95-ea04-4690-9cce-e5cf3346f171" />

<img width="1275" height="677" alt="Image" src="https://github.com/user-attachments/assets/f4e77b6e-b352-406b-af91-8061a3b29542" />

<img width="1275" height="684" alt="Image" src="https://github.com/user-attachments/assets/e8e240b1-2ab1-4488-8487-be0c0cca84d2" />

<img width="1271" height="660" alt="Image" src="https://github.com/user-attachments/assets/3947357e-c912-4290-bd35-5ad5f7ba22e4" />

<img width="1301" height="673" alt="スクリーンショット (6262)" src="https://github.com/user-attachments/assets/0387d0a7-0517-4546-b889-334d8dd3ba86" />

### スタッフの発行された社員番号・仮PINの表示について
ローカル開発では、通常MailHogによる「メール通知」のみで知らせてましたが、今回本番のRailway＋Vercelで公開するにあたっては、

RailwayがMailHogが使えないため、現行の機能を修正し、「スタッフ登録完了後、社員番号と仮PINを登録結果モーダルへ表示」を追加しました。

ローカルでは、メール通知とモーダル画面、本番ではモーダル画面のみで、「社員番号と仮PIN」が見られます。

＊登録フォームを閉じるだけでは重要な発行情報を見落とす可能性があるため、登録成功後の情報を独立したモーダルで確認できるようにしました。

# 環境構築

## 1. リポジトリをクローン

- git clone https://github.com/shoyama1010/drugstock-frontend.git
- cd drugstock-frontend

## 2.　パッケージをインストール

　npm install

## 3.開発構築

　npm run build

## 4. 開発サーバー起動

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
- 発生した課題：
- API通信に失敗した場合、エラーの原因が入力内容、認証、権限、接続先、サーバー内部のどこにあるのか分かりにくい状態でした。

- 対応：

ブラウザのNetworkタブで次の項目を確認しました。

Request URL」「Request Method」「Request Payload」「Status Code」「Response」「Authorizationヘッダー」「CORS関連ヘッダー」

そのうえで、401、403、422、500などのステータスごとに画面のメッセージを分けました。
  
■ ロットと棚を組み合わせた在庫表示
  ロット × 棚（location）という構造をフロントで扱う際に、データ構造の理解と表示ロジックの整理に時間がかかりました。

##  今後の改善予定
- スタッフ入出庫機能の改善によるバックエンド側と合わせて、画面構成もスタッフ用ルート及び権限制御（adminかstaffかの）を追加予定
- フォームバリデーションの統一（React Hook Form導入）
- UIのさらなる改善（入力補助・UX向上）
- レポート機能表示（在庫グラフ推移）
- モバイル対応

